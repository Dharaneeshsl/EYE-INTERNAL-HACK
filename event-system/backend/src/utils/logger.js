import fs from 'fs';
import path from 'path';
import winston from 'winston';
import config from '../config/index.js';

const logDirectory = path.resolve(process.cwd(), config.logging.dir || 'logs');

try {
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
  }
} catch (err) {
  // If log directory cannot be created, fallback to console-only
}

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    return Object.assign({}, info, {
      message: info.message,
      stack: info.stack
    });
  }
  return info;
});

const logger = winston.createLogger({
  level: config.logging.level || 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
          const base = `${timestamp} ${level}: ${message}`;
          const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
          return stack ? `${base}\n${stack}${extra}` : `${base}${extra}`;
        })
      )
    }),
    ...(logDirectory ? [new winston.transports.File({ filename: path.join(logDirectory, 'app.log') })] : [])
  ]
});

export default logger;


