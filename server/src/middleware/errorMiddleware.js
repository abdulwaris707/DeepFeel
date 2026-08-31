const env = require('../config/env');
const logger = require('../utils/logger');

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Resource not found: ${req.originalUrl}`
  });
};

const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled application exception', err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : (err.statusCode || 500);

  res.status(statusCode).json({
    success: false,
    error: err.message || 'An unexpected error occurred on the server.',
    ...(env.env === 'development' ? { stack: err.stack } : {})
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
