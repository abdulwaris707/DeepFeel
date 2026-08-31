const DataStore = require('../services/dataStore');
const logger = require('../utils/logger');

const createOrder = async (req, res, next) => {
  try {
    const { customer, items, paymentMethod, couponCode } = req.body;

    if (!customer || !customer.name || !customer.email || !customer.phone || !customer.address || !customer.city) {
      return res.status(400).json({ success: false, error: 'Please provide full delivery details (Name, Email, WhatsApp Phone, City & Address).' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Your acquisition cart is empty.' });
    }

    const userId = req.user ? req.user.id : null;

    // Server-Side Price Verification and Order Creation
    const order = await DataStore.createOrder({
      userId,
      customer,
      items,
      paymentMethod: paymentMethod || 'Cash on Delivery (COD)',
      couponCode
    });

    logger.info('Acquisition order placed successfully', { orderId: order.id, customerEmail: customer.email, total: order.total });

    res.status(201).json({
      success: true,
      message: 'Acquisition order confirmed successfully.',
      order
    });
  } catch (err) {
    next(err);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const isUserAdmin = req.user && ['ADMIN', 'SUPER_ADMIN', 'STAFF'].includes(req.user.role.toUpperCase());
    const filters = {};

    if (!isUserAdmin) {
      filters.userId = req.user.id;
    }

    const orders = await DataStore.getOrders(filters);
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await DataStore.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order reference not found.' });
    }

    // IDOR / BOLA Security check: Ensure non-admin users only access their own orders
    const isUserAdmin = req.user && ['ADMIN', 'SUPER_ADMIN', 'STAFF'].includes(req.user.role.toUpperCase());
    if (!isUserAdmin) {
      const isOwner = (req.user && req.user.id === order.userId) || (req.user && req.user.email.toLowerCase() === order.customer.email.toLowerCase());
      if (!isOwner) {
        logger.warn('IDOR unauthorized order access attempt blocked', { requesterId: req.user ? req.user.id : 'anonymous', orderId: order.id });
        return res.status(403).json({ success: false, error: 'Forbidden. You do not have permission to view this order chronicle.' });
      }
    }

    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById
};
