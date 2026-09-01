const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateUser, requireAdmin } = require('../middleware/authMiddleware');

// ENFORCE SERVER-SIDE AUTHENTICATION & ADMIN ROLE ON ALL ADMIN ROUTES
router.use(authenticateUser);
router.use(requireAdmin);

// DASHBOARD STATS
router.get('/dashboard-stats', adminController.getDashboardStats);

// PRODUCTS & INVENTORY
router.post('/products', adminController.saveProduct);
router.delete('/products/:id', adminController.deleteProduct);
router.patch('/products/:id/stock', adminController.updateStock);

// CATEGORIES
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.saveCategory);
router.delete('/categories/:id', adminController.deleteCategory);

// ORDERS
router.patch('/orders/:id/status', adminController.updateOrderStatus);

// CUSTOMERS & AUDIT LOGS
router.get('/customers', adminController.getCustomers);
router.get('/audit-logs', adminController.getAuditLogs);

// CREDENTIAL MANAGEMENT
router.post('/change-email', adminController.changeAdminEmail);
router.post('/change-password', adminController.changeAdminPassword);

module.exports = router;
