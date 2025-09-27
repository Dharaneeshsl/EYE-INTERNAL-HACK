import session from 'express-session';
import MongoStore from 'connect-mongo';

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'your_secure_session_secret_here',
  name: 'sid',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || 'mongodb+srv://ask17500:shalaboo@abookhan.ksl6xqm.mongodb.net/?retryWrites=true&w=majority&appName=abookhan',
    collectionName: 'sessions',
    ttl: 24 * 60 * 60, // 1 day
    autoRemove: 'native',
    touchAfter: 24 * 3600 // time period in seconds
  }),
  cookie: {
    secure: false, // Always false for local dev, true only in production with HTTPS
    httpOnly: true,
    sameSite: 'lax', // Lax for local dev, 'none' only if using HTTPS and cross-origin
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
});