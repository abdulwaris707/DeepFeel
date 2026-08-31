const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const SALT_ROUNDS = 12;

const security = {
  hashPassword: async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
  },

  comparePassword: async (password, hash) => {
    return await bcrypt.compare(password, hash);
  },

  generateToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      env.jwtSecret,
      { expiresIn: '7d' }
    );
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, env.jwtSecret);
    } catch (err) {
      return null;
    }
  },

  sanitizeString: (str) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  validatePasswordPolicy: (password) => {
    if (!password || typeof password !== 'string') {
      return { valid: false, message: 'Password is required' };
    }
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    return { valid: true };
  }
};

module.exports = security;
