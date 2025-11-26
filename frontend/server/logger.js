const fs = require('fs');
const path = require('path');
const winston = require('winston');

const logDir = process.env.LOG_DIR || '/var/log/ndlela';
try {
  fs.mkdirSync(logDir, { recursive: true });
} catch (_) {}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error', maxsize: 5 * 1024 * 1024, maxFiles: 5 }),
    new winston.transports.File({ filename: path.join(logDir, 'app.log'), maxsize: 10 * 1024 * 1024, maxFiles: 5 })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
