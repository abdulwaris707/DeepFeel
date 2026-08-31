const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { checkoutLimiter } = require('../middleware/rateLimitMiddleware');

// Order creation can be guest or logged-in
router.post('/', checkoutLimiter, orderController.createOrder);

// Order history & detail queries require auth or reference token
router.get('/', authenticateUser, orderController.getOrders);
router.get('/:id', orderController.getOrderById);

module.exports = router;
