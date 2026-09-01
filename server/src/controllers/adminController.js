const DataStore = require('../services/dataStore');
const logger = require('../utils/logger');

// PRODUCT CRUD & INVENTORY
const saveProduct = async (req, res, next) => {
  try {
    const { name, price, stock, category } = req.body;

    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ success: false, error: 'Product name, valid price, and stock quantity are required.' });
    }

    if (parseFloat(price) < 0 || parseInt(stock, 10) < 0) {
      return res.status(400).json({ success: false, error: 'Price and stock cannot be negative values.' });
    }

    const isEdit = Boolean(req.body.id);
    const product = await DataStore.saveProduct(req.body);

    await DataStore.recordAuditLog(
      req.user.id,
      req.user.email,
      isEdit ? 'UPDATE_PRODUCT' : 'CREATE_PRODUCT',
      'product',
      product.id,
      { name: product.name, price: product.price, stock: product.stock },
      req.ip
    );

    res.status(isEdit ? 200 : 210).json({
      success: true,
      message: `Fragrance creation "${product.name}" ${isEdit ? 'updated' : 'created'} successfully.`,
      product
    });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const removed = await DataStore.deleteProduct(productId);

    if (!removed) {
      return res.status(404).json({ success: false, error: 'Fragrance creation not found.' });
    }

    await DataStore.recordAuditLog(
      req.user.id,
      req.user.email,
      'DELETE_PRODUCT',
      'product',
      productId,
      { name: removed.name },
      req.ip
    );

    res.json({ success: true, message: `Fragrance "${removed.name}" deleted from catalog.` });
  } catch (err) {
    next(err);
  }
};

const updateStock = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { stock } = req.body;

    if (stock === undefined || parseInt(stock, 10) < 0) {
      return res.status(400).json({ success: false, error: 'Valid non-negative stock number required.' });
    }

    const product = await DataStore.getProductById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    const oldStock = product.stock;
    product.stock = parseInt(stock, 10);
    await DataStore.saveProduct(product);

    await DataStore.recordAuditLog(
      req.user.id,
      req.user.email,
      'UPDATE_STOCK',
      'inventory',
      productId,
      { product: product.name, oldStock, newStock: product.stock },
      req.ip
    );

    res.json({ success: true, message: `Stock for "${product.name}" updated to ${product.stock}.`, product });
  } catch (err) {
    next(err);
  }
};

// ORDER WORKFLOWS
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    if (!status) {
      return res.status(400).json({ success: false, error: 'Order status is required.' });
    }

    const order = await DataStore.updateOrderStatus(orderId, status);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order reference not found.' });
    }

    await DataStore.recordAuditLog(
      req.user.id,
      req.user.email,
      'UPDATE_ORDER_STATUS',
      'order',
      orderId,
      { newStatus: status },
      req.ip
    );

    res.json({ success: true, message: `Order ${orderId} status changed to "${status}".`, order });
  } catch (err) {
    next(err);
  }
};

// DASHBOARD STATS
const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await DataStore.getDashboardStats();
    res.json({ success: true, stats });
  } catch (err) {
    next(err);
  }
};

// CUSTOMERS DIRECTORY
const getCustomers = async (req, res, next) => {
  try {
    const users = await DataStore.getUsers();
    res.json({ success: true, count: users.length, customers: users });
  } catch (err) {
    next(err);
  }
};

// CATEGORIES
const getCategories = async (req, res, next) => {
  try {
    const categories = await DataStore.getCategories();
    res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
};

const saveCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Category name is required.' });
    }
    const category = await DataStore.saveCategory(req.body);
    res.json({ success: true, message: `Category "${category.name}" saved.`, category });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const removed = await DataStore.deleteCategory(categoryId);
    if (!removed) {
      return res.status(404).json({ success: false, error: 'Category not found.' });
    }
    res.json({ success: true, message: `Category "${removed.name}" removed.` });
  } catch (err) {
    next(err);
  }
};

// CREDENTIAL MANAGEMENT
const changeAdminEmail = async (req, res, next) => {
  try {
    const { currentPassword, newEmail, confirmEmail } = req.body;
    const adminId = req.user.id;

    if (!currentPassword || !newEmail || !confirmEmail) {
      return res.status(400).json({ success: false, error: 'Current password, new email, and confirmation email are required.' });
    }

    if (newEmail.toLowerCase().trim() !== confirmEmail.toLowerCase().trim()) {
      return res.status(400).json({ success: false, error: 'New email address and confirmation do not match.' });
    }

    const admin = await DataStore.findUserById(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin account not found.' });
    }

    const isMatch = await security.comparePassword(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Current password verified incorrect.' });
    }

    const existingUser = await DataStore.findUserByEmail(newEmail);
    if (existingUser && existingUser.id !== adminId) {
      return res.status(409).json({ success: false, error: 'This email address is already in use by another account.' });
    }

    const updatedUser = await DataStore.updateUserEmail(adminId, newEmail);
    const token = security.generateToken(updatedUser);

    res.cookie('deepfeel_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    await DataStore.recordAuditLog(
      adminId,
      updatedUser.email,
      'CHANGE_ADMIN_EMAIL',
      'user',
      adminId,
      { oldEmail: admin.email, newEmail: updatedUser.email },
      req.ip
    );

    res.json({
      success: true,
      message: 'Admin email address updated successfully.',
      token,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (err) {
    next(err);
  }
};

const changeAdminPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const adminId = req.user.id;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, error: 'Current password, new password, and confirmation are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'New password and confirmation password do not match.' });
    }

    const passCheck = security.validatePasswordPolicy(newPassword);
    if (!passCheck.valid) {
      return res.status(400).json({ success: false, error: passCheck.message });
    }

    const admin = await DataStore.findUserById(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin account not found.' });
    }

    const isMatch = await security.comparePassword(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Current password verified incorrect.' });
    }

    const newPasswordHash = await security.hashPassword(newPassword);
    await DataStore.updateUserPassword(adminId, newPasswordHash);

    await DataStore.recordAuditLog(
      adminId,
      admin.email,
      'CHANGE_ADMIN_PASSWORD',
      'user',
      adminId,
      {},
      req.ip
    );

    res.json({
      success: true,
      message: 'Admin password updated successfully. Please use your new password on next login.'
    });
  } catch (err) {
    next(err);
  }
};

// AUDIT LOGS
const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await DataStore.getAuditLogs();
    res.json({ success: true, count: logs.length, logs });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  saveProduct,
  deleteProduct,
  updateStock,
  updateOrderStatus,
  getDashboardStats,
  getCustomers,
  getCategories,
  saveCategory,
  deleteCategory,
  changeAdminEmail,
  changeAdminPassword,
  getAuditLogs
};
