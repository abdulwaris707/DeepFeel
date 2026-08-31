const DataStore = require('../services/dataStore');

const getCoupons = async (req, res, next) => {
  try {
    const coupons = await DataStore.getCoupons();
    res.json({ success: true, count: coupons.length, coupons });
  } catch (err) {
    next(err);
  }
};

const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    if (!code || subtotal === undefined) {
      return res.status(400).json({ success: false, error: 'Coupon code and cart subtotal are required.' });
    }

    const result = await DataStore.validateCoupon(code, parseFloat(subtotal));
    if (!result.valid) {
      return res.status(400).json({ success: false, error: result.message });
    }

    res.json({
      success: true,
      message: 'Voucher applied successfully!',
      discount: result.discount,
      coupon: {
        code: result.coupon.code,
        discountType: result.coupon.discountType,
        discountValue: result.coupon.discountValue
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCoupons,
  validateCoupon
};
