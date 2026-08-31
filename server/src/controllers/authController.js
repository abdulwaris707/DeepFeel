const DataStore = require('../services/dataStore');
const security = require('../utils/security');
const logger = require('../utils/logger');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, city, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
    }

    const passCheck = security.validatePasswordPolicy(password);
    if (!passCheck.valid) {
      return res.status(400).json({ success: false, error: passCheck.message });
    }

    const existing = await DataStore.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, error: 'An account with this email address already exists.' });
    }

    const user = await DataStore.createUser({ name, email, password, phone, city, address, role: 'CUSTOMER' });
    const token = security.generateToken(user);

    res.cookie('deepfeel_token', token, COOKIE_OPTIONS);
    logger.info('New customer registered successfully', { userId: user.id, email: user.email });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please enter both email and password.' });
    }

    const user = await DataStore.findUserByEmail(email);
    // Generic error message to prevent account enumeration
    if (!user) {
      logger.warn('Failed login attempt (user not found)', { email, ip: req.ip });
      return res.status(401).json({ success: false, error: 'Invalid email address or password.' });
    }

    const isMatch = await security.comparePassword(password, user.passwordHash);
    if (!isMatch) {
      logger.warn('Failed login attempt (password mismatch)', { email, ip: req.ip });
      return res.status(401).json({ success: false, error: 'Invalid email address or password.' });
    }

    const token = security.generateToken(user);
    res.cookie('deepfeel_token', token, COOKIE_OPTIONS);

    logger.info('User authenticated successfully', { userId: user.id, email: user.email, role: user.role });

    res.json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  res.clearCookie('deepfeel_token');
  res.json({ success: true, message: 'Logged out successfully.' });
};

const me = async (req, res, next) => {
  try {
    const user = await DataStore.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found.' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
        address: user.address,
        ordersCount: user.ordersCount || 0,
        totalSpent: user.totalSpent || 0
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  me
};
