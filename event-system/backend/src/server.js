import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import logger from './utils/logger.js';
import { errorSanitizer } from './middleware/errorSanitizer.js';
import { requestLogger } from './middleware/requestLogger.js';
import { sanitize } from './middleware/sanitize.js';
import { sessionMiddleware } from './config/session.js';
import { initializeSocket } from './services/socketService.js';
import { connectDB } from './config/db.js';
import formRoutes from './routes/formRoutes.js';
import authRoutes from './routes/authRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import docsRoutes from './routes/docsRoutes.js';
import config from './config/index.js';

const app = express();
const server = createServer(app);

// Set up WebSocket server with session handling
const io = new Server(server, {
  cors: {
    origin: config.cors.origin || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
  path: config.websocket?.path || '/socket.io',
  pingTimeout: config.websocket?.pingTimeout || 30000,
  pingInterval: config.websocket?.pingInterval || 25000
});

// Convert a middleware to Socket.IO middleware
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

// Apply session middleware to Socket.IO
io.use(wrap(sessionMiddleware));

// Add authentication middleware to Socket.IO
io.use((socket, next) => {
  if (socket.request.session && socket.request.session.user) {
    next();
  } else {
    next(new Error('Unauthorized'));
  }
});

global.io = io;

// Initialize Socket.IO
initializeSocket(global.io);

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'default-src': ["'self'"],
      'connect-src': [
        "'self'",
        config.cors.origin || 'http://localhost:5173',
        `ws://localhost:${config.app.port}`,
        `http://localhost:${config.app.port}`
      ],
      'style-src': ["'self'", "'unsafe-inline'", 'https:', 'data:'],
      'script-src': ["'self'", "'unsafe-inline'", 'https:'],
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'", 'data:', 'https:']
    }
  }
}));

// Compression
app.use(compression());

// CORS configuration
app.use(cors({
  origin: config.cors.origin || 'http://localhost:5173',
  methods: config.cors.methods?.split(',') || ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: config.cors.credentials
}));

// Global rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitize);
app.use(requestLogger);

// Sessions (required for auth middleware to work on HTTP routes)
app.use(sessionMiddleware);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/forms', formRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/docs', docsRoutes);

// Health check endpoint with simple dependency checks
app.get('/health', async (req, res) => {
  const checks = { db: false, email: false };
  try {
    // DB check
    const mongoose = (await import('mongoose')).default;
    checks.db = mongoose.connection.readyState === 1;
  } catch (_) {}

  try {
    // Email check
    const { default: emailService } = await import('./services/emailService.js');
    checks.email = await emailService.verifyConnection();
  } catch (_) {}

  res.status(200).json({
    status: checks.db ? 'ok' : 'degraded',
    checks,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
    path: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  errorSanitizer(err, req, res, next);
});

// Start server
const HOST = '0.0.0.0';
const PORT = config.app.port;
server.listen(PORT, HOST, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
  logger.info(`API URL: http://${HOST}:${PORT}`);
  logger.info(`WebSocket URL: ws://${HOST}:${PORT}/socket.io`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM for graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
