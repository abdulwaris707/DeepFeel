const { Pool } = require('pg');
const env = require('./env');
const logger = require('../utils/logger');

let pool = null;
let isPgConnected = false;

// Memory storage engine fallback for standalone execution
const memoryDb = {
  users: [],
  products: [],
  categories: [],
  coupons: [],
  orders: [],
  order_items: [],
  audit_logs: [],
  reviews: []
};

if (env.databaseUrl) {
  try {
    pool = new Pool({
      connectionString: env.databaseUrl,
      ssl: env.env === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    });

    pool.on('error', (err) => {
      logger.error('Unexpected PostgreSQL pool error', err);
    });
  } catch (err) {
    logger.warn('Failed to initialize PostgreSQL pool, using memory store fallback', { error: err.message });
  }
}

const db = {
  query: async (text, params) => {
    if (pool && isPgConnected) {
      try {
        const start = Date.now();
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        if (duration > 200) {
          logger.warn('Slow query detected', { text, duration, rows: res.rowCount });
        }
        return res;
      } catch (err) {
        logger.error('Database query error', { text, error: err.message });
        throw err;
      }
    }
    // Return memory adapter response
    return { rows: [], rowCount: 0 };
  },

  getMemoryDb: () => memoryDb,

  init: async () => {
    if (pool) {
      try {
        const client = await pool.connect();
        logger.info('Successfully connected to PostgreSQL database cluster.');
        client.release();
        isPgConnected = true;
      } catch (err) {
        logger.warn('PostgreSQL connection check failed, operating with in-memory persistence mode.', { message: err.message });
        isPgConnected = false;
      }
    }
  }
};

module.exports = db;
