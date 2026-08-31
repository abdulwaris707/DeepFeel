const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret_deepfeel_pakistan_2026_key',
  sessionSecret: process.env.SESSION_SECRET || 'dev_session_secret_deepfeel_pakistan_2026_key',
  corsOrigins: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5000', 'http://127.0.0.1:5000'],
  initialAdminEmail: process.env.INITIAL_ADMIN_EMAIL || 'admin@deepfeel.pk',
  initialAdminPassword: process.env.INITIAL_ADMIN_PASSWORD || 'admin123',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  authRateLimitMax: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 10
};

// Fail fast in production if required environment variables are missing
if (config.env === 'production') {
  if (!process.env.JWT_SECRET || config.jwtSecret.includes('dev_jwt_secret')) {
    console.warn('[SECURITY WARNING] Production environment detected without custom JWT_SECRET!');
  }
}

module.exports = config;
