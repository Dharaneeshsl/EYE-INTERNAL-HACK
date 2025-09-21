import { Server } from 'socket.io';
import { ApiError } from '../utils/errors.js';
import { sessionMiddleware } from '../config/session.js';
import { parse as parseCookie } from 'cookie';
import MongoStore from 'connect-mongo';

/**
 * Initialize Socket.io server and setup event handlers
 * @param {Server} io - Socket.io server instance
 */
export const initializeSocket = (io) => {
  // Create session store
  const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 24 * 60 * 60
  });

  // Middleware to handle session
  io.use(async (socket, next) => {
    try {
      const cookie = socket.handshake.headers.cookie;
      if (!cookie) {
        return next(new ApiError('No session cookie', 401));
      }

      const parsed = parseCookie(cookie);
      const sessionID = parsed['connect.sid']?.split('.')[0].slice(2);
      
      if (!sessionID) {
        return next(new ApiError('No session ID', 401));
      }

      const session = await new Promise((resolve, reject) => {
        sessionStore.get(sessionID, (err, session) => {
          if (err) reject(err);
          else resolve(session);
        });
      });

      if (!session?.user) {
        return next(new ApiError('Not authenticated', 401));
      }

      socket.user = session.user;
      next();
    } catch (error) {
      next(new ApiError('Session verification failed', 401));
    }
  });

  // Middleware for authentication
  io.use((socket, next) => {
    if (!socket.handshake.session.user) {
      return next(new ApiError('Authentication required', 401));
    }
    socket.user = socket.handshake.session.user;
    next();
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join form room for real-time updates
    socket.on('join:form', (formId) => {
      socket.join(`form:${formId}`);
      console.log(`Socket ${socket.id} joined form room: ${formId}`);
    });

    // Join analytics room for global updates
    socket.on('join:analytics', () => {
      if (socket.user.role === 'admin') {
        socket.join('analytics:global');
        console.log(`Admin ${socket.id} joined global analytics room`);
      }
    });

    // Handle form response submissions
    socket.on('response:submit', async (data) => {
      try {
        // Broadcast to form room
        io.to(`form:${data.formId}`).emit('response:new', {
          formId: data.formId,
          timestamp: new Date(),
          responseId: data.responseId
        });

        // Update analytics if admin is listening
        if (io.sockets.adapter.rooms.get('analytics:global')?.size > 0) {
          // You would typically call your analytics service here
          // const stats = await AnalyticsService.getFormStatistics(data.formId);
          io.to('analytics:global').emit('analytics:update', {
            formId: data.formId,
            type: 'new_response',
            timestamp: new Date()
          });
        }
      } catch (error) {
        console.error('Socket error:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Handle server errors
  io.on('error', (error) => {
    console.error('Socket.io server error:', error);
  });
};

export default initializeSocket;