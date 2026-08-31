const security = require('../utils/security');
const logger = require('../utils/logger');

const authenticateUser = (req, res, next) => {
  let token = null;

  if (req.cookies && req.cookies.deepfeel_token) {
    token = req.cookies.deepfeel_token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please sign in to continue.'
    });
  }

  const decoded = security.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired session token. Please sign in again.'
    });
  }

  req.user = decoded;
  next();
};

const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.'
      });
    }

    const userRole = (req.user.role || 'CUSTOMER').toUpperCase();
    const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());

    if (!normalizedAllowed.includes(userRole)) {
      logger.warn('Unauthorized access attempt blocked', {
        userId: req.user.id,
        email: req.user.email,
        role: userRole,
        path: req.originalUrl,
        ip: req.ip
      });
      return res.status(403).json({
        success: false,
        error: 'Forbidden. You do not have sufficient administrative privileges to access this resource.'
      });
    }

    next();
  };
};

const requireAdmin = requireRole(['ADMIN', 'SUPER_ADMIN']);

module.exports = {
  authenticateUser,
  requireRole,
  requireAdmin
};
