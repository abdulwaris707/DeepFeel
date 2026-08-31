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

// CUSTOMERS DIRECTORY
const getCustomers = async (req, res, next) => {
  try {
    const users = await DataStore.getUsers();
    res.json({ success: true, count: users.length, customers: users });
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
  getCustomers,
  getAuditLogs
};
