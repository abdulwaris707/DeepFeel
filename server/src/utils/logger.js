const env = require('../config/env');

const sanitizeLogData = (data) => {
  if (!data || typeof data !== 'object') return data;
  const sanitized = { ...data };
  const sensitiveKeys = ['password', 'password_hash', 'token', 'jwt', 'secret', 'credit_card', 'cvv'];
  
  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeLogData(sanitized[key]);
    }
  }
  return sanitized;
};

const logger = {
  info: (msg, meta = {}) => {
    console.log(`[INFO] [${new Date().toISOString()}] ${msg}`, Object.keys(meta).length ? JSON.stringify(sanitizeLogData(meta)) : '');
  },
  warn: (msg, meta = {}) => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${msg}`, Object.keys(meta).length ? JSON.stringify(sanitizeLogData(meta)) : '');
  },
  error: (msg, error = {}) => {
    const errorDetails = error instanceof Error ? { message: error.message, stack: env.env === 'development' ? error.stack : undefined } : error;
    console.error(`[ERROR] [${new Date().toISOString()}] ${msg}`, JSON.stringify(sanitizeLogData(errorDetails)));
  },
  audit: (action, adminEmail, resource, meta = {}) => {
    console.log(`[AUDIT] [${new Date().toISOString()}] Admin: ${adminEmail} | Action: ${action} | Resource: ${resource}`, JSON.stringify(sanitizeLogData(meta)));
  }
};

module.exports = logger;
