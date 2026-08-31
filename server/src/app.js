const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const env = require('./config/env');
const logger = require('./utils/logger');
const DataStore = require('./services/dataStore');

const { apiLimiter } = require('./middleware/rateLimitMiddleware');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const couponRoutes = require('./routes/couponRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// Trust reverse proxy (e.g. Nginx, Cloudflare, Heroku, Render)
app.set('trust proxy', 1);

// HTTP Security Headers (Helmet)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
      connectSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests or allowed origins
    if (!origin || env.corsOrigins.includes(origin) || env.env === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS security policy.'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Body Parser & Request Size Limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser(env.sessionSecret));

// Global Rate Limiter
app.use('/api', apiLimiter);

// API Route Mounts
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/coupons', couponRoutes);

// Serve Frontend Static Files
const clientDir = path.join(__dirname, '../../client');
app.use(express.static(clientDir));

// Fallback to client pages
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDir, 'index.html'));
});

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Server Initialization
const startServer = async () => {
  try {
    await DataStore.init();
    
    const server = app.listen(env.port, () => {
      logger.info(`DeepFeel Haute Parfumerie production server listening on port ${env.port}`, {
        env: env.env,
        port: env.port
      });
    });

    // Graceful Shutdown Handling
    const shutdown = (signal) => {
      logger.info(`Received ${signal}. Initiating graceful shutdown...`);
      server.close(() => {
        logger.info('HTTP server closed cleanly.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (err) {
    logger.error('Failed to launch application server', err);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
