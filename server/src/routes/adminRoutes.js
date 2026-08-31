const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateUser, requireAdmin } = require('../middleware/authMiddleware');

// ENFORCE SERVER-SIDE AUTHENTICATION & ADMIN ROLE ON ALL ADMIN ROUTES
router.use(authenticateUser);
router.use(requireAdmin);

// PRODUCTS & INVENTORY
router.post('/products', adminController.saveProduct);
router.delete('/products/:id', adminController.deleteProduct);
router.patch('/products/:id/stock', adminController.updateStock);

// ORDERS
router.patch('/orders/:id/status', adminController.updateOrderStatus);

// CUSTOMERS & AUDIT LOGS
router.get('/customers', adminController.getCustomers);
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
