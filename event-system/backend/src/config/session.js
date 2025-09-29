import session from 'express-session';
import MongoStore from 'connect-mongo';
import config from './index.js';

export const sessionMiddleware = session({
  secret: config.session.secret,
  name: config.session.name,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: config.db.uri,
    collectionName: 'sessions',
    ttl: config.session.maxAge / 1000, // Convert to seconds
    autoRemove: 'native',
    touchAfter: config.session.maxAge / 1000
  }),
  cookie: {
    secure: config.session.secure,
    httpOnly: true,
    sameSite: config.session.sameSite,
    maxAge: config.session.maxAge
  }
});