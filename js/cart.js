/**
 * DeepFeel - Fragrance Cart Management Module
 * Manages shopping bag state, size variants, gift packaging, and calculations.
 */

const Cart = {
  getCart() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || "[]");
  },

  saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    this.updateBadges();
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: { cart } }));
  },

  addItem(productId, quantity = 1, options = {}) {
    const product = Store.getProductById(productId);
    if (!product) {
      if (window.UI) UI.showToast("Fragrance not found", "error");
      return false;
    }

    if (product.stock <= 0) {
      if (window.UI) UI.showToast("This flacon is currently out of stock", "error");
      return false;
    }

    const selectedSize = options.size || (product.sizes && product.sizes.length ? product.sizes[0] : "50ml");
    const itemPrice = options.price || (product.sizePricing && product.sizePricing[selectedSize] ? product.sizePricing[selectedSize] : product.price);

    let cart = this.getCart();
    const variantKey = `${productId}_${selectedSize}`;
    
    const existingIndex = cart.findIndex(item => 
      item.productId === productId && 
      (item.variantKey || "") === variantKey
    );

    const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);

    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      if (currentQty + qtyToAdd > product.stock) {
        if (window.UI) UI.showToast(`Only ${product.stock} flacons available in stock`, "warning");
        cart[existingIndex].quantity = product.stock;
      } else {
        cart[existingIndex].quantity += qtyToAdd;
        if (window.UI) UI.showToast(`Updated "${product.name} (${selectedSize})" quantity in bag`, "success");
      }
    } else {
      const finalQty = Math.min(qtyToAdd, product.stock);
      cart.push({
        productId: product.id,
        name: product.name,
        size: selectedSize,
        price: itemPrice,
        originalPrice: product.originalPrice,
        image: product.images && product.images.length ? product.images[0] : "",
        category: product.category,
        fragranceFamily: product.fragranceFamily || "Oriental",
        concentration: product.concentration || "Extrait de Parfum",
        sku: product.sku,
        quantity: finalQty,
        variantKey: variantKey
      });
      if (window.UI) UI.showToast(`Added "${product.name} (${selectedSize})" to your bag`, "success");
    }

    this.saveCart(cart);
    return true;
  },

  updateQuantity(productId, variantKey, newQty) {
    let cart = this.getCart();
    const product = Store.getProductById(productId);
    const parsedQty = parseInt(newQty, 10);

    const index = cart.findIndex(item => 
      item.productId === productId && 
      (item.variantKey || "") === (variantKey || "")
    );

    if (index === -1) return;

    if (parsedQty <= 0) {
      cart.splice(index, 1);
      if (window.UI) UI.showToast("Fragrance removed from bag", "info");
    } else {
      const maxStock = product ? product.stock : 99;
      if (parsedQty > maxStock) {
        cart[index].quantity = maxStock;
        if (window.UI) UI.showToast(`Maximum available flacons is ${maxStock}`, "warning");
      } else {
        cart[index].quantity = parsedQty;
      }
    }

    this.saveCart(cart);
  },

  removeItem(productId, variantKey) {
    let cart = this.getCart();
    cart = cart.filter(item => !(item.productId === productId && (item.variantKey || "") === (variantKey || "")));
    this.saveCart(cart);
    if (window.UI) UI.showToast("Fragrance removed from bag", "info");
  },

  clearCart() {
    this.saveCart([]);
  },

  getItemCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  },

  getSubtotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getTotals(couponCode = "", shippingMethod = "standard", giftPackaging = false) {
    const subtotal = this.getSubtotal();
    const settings = Store.getSettings();
    
    // Free shipping threshold check
    const freeShippingThreshold = settings.freeShippingThreshold || 5000;
    const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
    
    let shipping = 0;
    if (subtotal > 0) {
      if (shippingMethod === "express") {
        shipping = settings.expressShippingRate || 450;
      } else {
        shipping = subtotal >= freeShippingThreshold ? 0 : (settings.flatShippingRate || 250);
      }
    }

    // Gift packaging fee
    const giftFee = (giftPackaging && subtotal > 0) ? (settings.giftPackagingFee || 350.00) : 0;

    // Coupon discount calculation
    let discount = 0;
    let appliedCoupon = null;
    let couponMessage = "";

    if (couponCode && couponCode.trim()) {
      const validation = Store.validateCoupon(couponCode, subtotal);
      if (validation.valid) {
        discount = validation.discountAmount || 0;
        appliedCoupon = validation.coupon;
        couponMessage = validation.message;
      } else {
        couponMessage = validation.message;
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const taxRate = (settings.taxRate || 0.0) / 100;
    const tax = Math.round(discountedSubtotal * taxRate);
    const total = subtotal > 0 ? Math.round(discountedSubtotal + shipping + giftFee + tax) : 0;

    return {
      subtotal: Math.round(subtotal),
      discount: Math.round(discount),
      discountedSubtotal: Math.round(discountedSubtotal),
      shipping: Math.round(shipping),
      giftFee: Math.round(giftFee),
      tax: Math.round(tax),
      total: total,
      appliedCoupon,
      couponMessage,
      freeShippingThreshold,
      remainingForFreeShipping: Math.round(remainingForFreeShipping),
      isFreeShipping: shipping === 0 && subtotal > 0 && shippingMethod !== "express"
    };

  },

  updateBadges() {
    const count = this.getItemCount();
    const badges = document.querySelectorAll(".cart-count-badge");
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? "inline-flex" : "none";
    });
  }
};

// Initialize badges on load
document.addEventListener("DOMContentLoaded", () => {
  Cart.updateBadges();
});
