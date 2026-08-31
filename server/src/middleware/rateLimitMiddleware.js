const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.authRateLimitMax || 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts from this IP address. Please wait 15 minutes before trying again.'
  }
});

const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many checkout order attempts. Please wait a few minutes before submitting again.'
  }
});

const apiLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs || 15 * 60 * 1000,
  max: env.rateLimitMax || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Rate limit exceeded. Please try again shortly.'
  }
});

module.exports = {
  authLimiter,
  checkoutLimiter,
  apiLimiter
};
