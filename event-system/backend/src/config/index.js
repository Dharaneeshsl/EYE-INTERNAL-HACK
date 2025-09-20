import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  // Application
  app: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    apiVersion: process.env.API_VERSION || 'v1',
    baseUrl: process.env.BASE_URL || 'http://localhost:5000',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
  },

  // MongoDB
  db: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/event_feedback',
    name: process.env.MONGO_DB_NAME || 'event_feedback',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: process.env.MONGO_AUTH_SOURCE || 'admin'
    }
  },

  // Session
  session: {
    secret: process.env.SESSION_SECRET,
    name: process.env.SESSION_NAME || 'event_system_sid',
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000', 10),
    secure: process.env.SESSION_SECURE === 'true',
    sameSite: process.env.SESSION_SAME_SITE || 'lax'
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: process.env.CORS_CREDENTIALS === 'true'
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    message: process.env.RATE_LIMIT_MESSAGE || 'Too many requests'
  },

  // Email
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    from: {
      name: process.env.EMAIL_FROM_NAME || 'Event System',
      email: process.env.EMAIL_FROM
    }
  },

  // Google Cloud Storage
  storage: {
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    credentials: process.env.GOOGLE_CLOUD_CREDENTIALS,
    bucketName: process.env.STORAGE_BUCKET_NAME
  },

  // File Upload
  upload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
    allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['application/pdf', 'image/jpeg', 'image/png'],
    uploadDir: process.env.UPLOAD_DIR || 'uploads'
  },

  // Security
  security: {
    encryptionKey: process.env.ENCRYPTION_KEY,
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
    enableHttps: process.env.ENABLE_HTTPS === 'true',
    cookieSecret: process.env.COOKIE_SECRET
  },

  // Certificate
  certificate: {
    storagePath: process.env.CERTIFICATE_STORAGE_PATH || 'certificates',
    compressionLevel: parseFloat(process.env.PDF_COMPRESSION_LEVEL || '0.7'),
    enableQueue: process.env.ENABLE_CERTIFICATE_QUEUE === 'true'
  },

  // Analytics
  analytics: {
    enableSentiment: process.env.ENABLE_SENTIMENT_ANALYSIS === 'true',
    enableRealTime: process.env.ENABLE_REAL_TIME_ANALYTICS === 'true',
    batchSize: parseInt(process.env.ANALYTICS_BATCH_SIZE || '100', 10)
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    format: process.env.LOG_FORMAT || 'combined',
    dir: process.env.LOG_DIR || 'logs'
  },

  // WebSocket
  websocket: {
    path: process.env.WS_PATH || '/socket.io',
    pingTimeout: parseInt(process.env.WS_PING_TIMEOUT || '30000', 10),
    pingInterval: parseInt(process.env.WS_PING_INTERVAL || '25000', 10)
  },

  // Feature Flags
  features: {
    qrCodes: process.env.ENABLE_QR_CODES === 'true',
    fileEncryption: process.env.ENABLE_FILE_ENCRYPTION === 'true',
    autoCertificate: process.env.ENABLE_AUTO_CERTIFICATE === 'true'
  },

  // Maintenance
  maintenance: {
    enabled: process.env.MAINTENANCE_MODE === 'true',
    message: process.env.MAINTENANCE_MESSAGE || 'System is under maintenance'
  }
};

// Validate required configuration
const validateConfig = () => {
  const required = [
    'session.secret',
    'jwt.secret',
    'email.auth.user',
    'email.auth.pass',
    'security.encryptionKey'
  ];

  required.forEach(path => {
    const value = path.split('.').reduce((obj, key) => obj?.[key], config);
    if (!value) {
      throw new Error(`Missing required configuration: ${path}`);
    }
  });
};

// Run validation in non-test environment
if (process.env.NODE_ENV !== 'test') {
  validateConfig();
}

export default config;