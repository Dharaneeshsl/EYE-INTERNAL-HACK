import dotenv from 'dotenv';
dotenv.config();

const config = {
  app: { port: +process.env.PORT || 5001 },
  db: {
    uri: process.env.MONGO_URI,
    options: { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      tls: true,
      tlsAllowInvalidCertificates: true
    }
  },
  session: {
    secret: process.env.SESSION_SECRET || 'your_secure_session_secret_here',
    name: process.env.SESSION_NAME || 'sid',
    maxAge: +process.env.SESSION_MAX_AGE || 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.SESSION_SAME_SITE || 'lax'
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: process.env.CORS_METHODS,
    credentials: true
  },

  // Email
  email: {
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT, 10) || 1025,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    },
    from: {
      name: process.env.EMAIL_FROM_NAME || 'Event System',
      email: process.env.EMAIL_FROM || 'no-reply@example.com'
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
    encryptionKey: process.env.ENCRYPTION_KEY || 'changemechangemechangemechangeme',
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
    enableHttps: process.env.ENABLE_HTTPS === 'true',
    cookieSecret: process.env.COOKIE_SECRET || 'your_cookie_secret_here'
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