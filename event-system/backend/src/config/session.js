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
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
});