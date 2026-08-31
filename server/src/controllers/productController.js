const DataStore = require('../services/dataStore');

const getProducts = async (req, res, next) => {
  try {
    const { category, search, featured } = req.query;
    const products = await DataStore.getProducts({ category, search, featured: featured === 'true' });
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await DataStore.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Fragrance creation not found.' });
    }
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById
};
