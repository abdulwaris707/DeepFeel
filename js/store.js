/**
 * DeepFeel - LocalStorage Data Access Layer (Store)
 * Handles state persistence, CRUD operations, relationships, and demo data reset.
 */

const STORAGE_KEYS = {
  PRODUCTS: "deepfeel_products",
  CATEGORIES: "deepfeel_categories",
  COUPONS: "deepfeel_coupons",
  ORDERS: "deepfeel_orders",
  USERS: "deepfeel_users",
  SETTINGS: "deepfeel_settings",
  REVIEWS: "deepfeel_reviews",
  CART: "deepfeel_cart",
  WISHLIST: "deepfeel_wishlist",
  CURRENT_USER: "deepfeel_current_user",
  RECENTLY_VIEWED: "deepfeel_recently_viewed"
};

const Store = {
  // Initialize storage if missing
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      this.resetDemoData();
    }
  },

  // Reset to original seed dataset
  resetDemoData() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(SEED_COUPONS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(SEED_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(SEED_REVIEWS));
    
    // Set default demo customer as logged in if no user
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_USERS[1])); // Elena Vance
    }
  },

  // ----------------------------------------------------
  // PRODUCTS CRUD
  // ----------------------------------------------------
  getProducts(filters = {}) {
    let products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || "[]");
    
    // Filter by Category
    if (filters.category && filters.category !== "all") {
      products = products.filter(p => p.categorySlug === filters.category || p.category === filters.category);
    }

    // Filter by Status
    if (filters.status) {
      products = products.filter(p => p.status === filters.status);
    }

    // Filter by Min / Max Price
    if (filters.minPrice !== undefined && filters.minPrice !== null && filters.minPrice !== "") {
      products = products.filter(p => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice !== "") {
      products = products.filter(p => p.price <= Number(filters.maxPrice));
    }

    // Filter by Rating
    if (filters.minRating) {
      products = products.filter(p => p.rating >= Number(filters.minRating));
    }

    // Filter by In-Stock
    if (filters.inStockOnly) {
      products = products.filter(p => p.stock > 0);
    }

    // Search query
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(q))) ||
        (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    // Featured / Bestseller / New
    if (filters.featured) {
      products = products.filter(p => p.featured);
    }
    if (filters.bestseller) {
      products = products.filter(p => p.bestseller);
    }
    if (filters.isNew) {
      products = products.filter(p => p.isNew);
    }

    // Sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-asc":
          products.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          products.sort((a, b) => b.price - a.price);
          break;
        case "rating-desc":
          products.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        case "bestselling":
          products.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
          break;
        case "name-asc":
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          // Featured default
          products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
      }
    }

    return products;
  },

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id) || null;
  },

  saveProduct(productData) {
    let products = this.getProducts();
    if (productData.id) {
      const idx = products.findIndex(p => p.id === productData.id);
      if (idx !== -1) {
        products[idx] = { ...products[idx], ...productData };
      } else {
        products.unshift(productData);
      }
    } else {
      productData.id = "df_" + Math.random().toString(36).substr(2, 6);
      productData.createdAt = new Date().toISOString();
      products.unshift(productData);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return productData;
  },

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return true;
  },

  updateStock(productId, newStock) {
    const product = this.getProductById(productId);
    if (product) {
      product.stock = Math.max(0, parseInt(newStock, 10));
      this.saveProduct(product);
      return product;
    }
    return null;
  },

  // ----------------------------------------------------
  // CATEGORIES CRUD
  // ----------------------------------------------------
  getCategories() {
    const cats = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || "[]");
    const products = this.getProducts();
    // Dynamically calculate product count
    return cats.map(c => ({
      ...c,
      productCount: products.filter(p => p.categorySlug === c.slug || p.category === c.name).length
    }));
  },

  getCategoryById(id) {
    const cats = this.getCategories();
    return cats.find(c => c.id === id || c.slug === id) || null;
  },

  saveCategory(catData) {
    let cats = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || "[]");
    if (catData.id) {
      const idx = cats.findIndex(c => c.id === catData.id);
      if (idx !== -1) {
        cats[idx] = { ...cats[idx], ...catData };
      } else {
        cats.push(catData);
      }
    } else {
      catData.id = "cat_" + Math.random().toString(36).substr(2, 6);
      if (!catData.slug) {
        catData.slug = catData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      }
      cats.push(catData);
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
    return catData;
  },

  deleteCategory(id) {
    let cats = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || "[]");
    cats = cats.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
    return true;
  },

  // ----------------------------------------------------
  // COUPONS CRUD & VALIDATION
  // ----------------------------------------------------
  getCoupons() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COUPONS) || "[]");
  },

  getCouponByCode(code) {
    if (!code) return null;
    const coupons = this.getCoupons();
    return coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase()) || null;
  },

  validateCoupon(code, subtotal) {
    const coupon = this.getCouponByCode(code);
    if (!coupon) {
      return { valid: false, message: "Coupon code is invalid." };
    }
    if (!coupon.active) {
      return { valid: false, message: "This coupon is no longer active." };
    }
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, message: "This coupon has expired." };
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, message: "Coupon usage limit has been reached." };
    }
    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return { 
        valid: false, 
        message: `Minimum order amount of $${coupon.minOrder.toFixed(2)} required for this coupon.` 
      };
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (subtotal * coupon.discountValue) / 100;
    } else {
      discount = Math.min(coupon.discountValue, subtotal);
    }

    return {
      valid: true,
      coupon,
      discount: Math.round(discount * 100) / 100,
      message: `Coupon "${coupon.code}" applied successfully!`
    };
  },

  saveCoupon(couponData) {
    let coupons = this.getCoupons();
    if (couponData.id) {
      const idx = coupons.findIndex(c => c.id === couponData.id);
      if (idx !== -1) {
        coupons[idx] = { ...coupons[idx], ...couponData };
      } else {
        coupons.push(couponData);
      }
    } else {
      couponData.id = "cp_" + Math.random().toString(36).substr(2, 6);
      couponData.usedCount = 0;
      coupons.push(couponData);
    }
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    return couponData;
  },

  deleteCoupon(id) {
    let coupons = this.getCoupons();
    coupons = coupons.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    return true;
  },

  // ----------------------------------------------------
  // ORDERS CRUD
  // ----------------------------------------------------
  getOrders(filters = {}) {
    let orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]");
    
    if (filters.userId) {
      orders = orders.filter(o => o.userId === filters.userId);
    }
    if (filters.status && filters.status !== "all") {
      orders = orders.filter(o => o.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      orders = orders.filter(o => 
        o.id.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q)
      );
    }

    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return orders;
  },

  getOrderById(id) {
    const orders = this.getOrders();
    return orders.find(o => o.id === id) || null;
  },

  createOrder(orderData) {
    let orders = this.getOrders();
    const orderNumber = "DF-" + Math.floor(10000 + Math.random() * 90000);
    
    const newOrder = {
      id: orderNumber,
      userId: orderData.userId || "usr_guest",
      customer: orderData.customer,
      items: orderData.items,
      subtotal: orderData.subtotal,
      discount: orderData.discount || 0,
      couponCode: orderData.couponCode || "",
      shipping: orderData.shipping || 0,
      tax: orderData.tax || 0,
      total: orderData.total,
      status: "Pending",
      paymentMethod: orderData.paymentMethod || "Credit Card",
      paymentStatus: orderData.paymentMethod === "Cash on Delivery" ? "Pending on Delivery" : "Paid",
      createdAt: new Date().toISOString(),
      timeline: [
        { status: "Order Placed", date: new Date().toLocaleString(), completed: true },
        { status: "Payment Confirmed", date: orderData.paymentMethod === "Cash on Delivery" ? "Awaiting Delivery" : new Date().toLocaleString(), completed: orderData.paymentMethod !== "Cash on Delivery" },
        { status: "Processing in Portland Studio", date: "Pending", completed: false },
        { status: "Dispatched with Tracking", date: "Pending", completed: false },
        { status: "Delivered", date: "Pending", completed: false }
      ]
    };

    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Deduct stock from products
    orderData.items.forEach(item => {
      const product = this.getProductById(item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        this.saveProduct(product);
      }
    });

    // Increment coupon usage count if applied
    if (orderData.couponCode) {
      const coupon = this.getCouponByCode(orderData.couponCode);
      if (coupon) {
        coupon.usedCount = (coupon.usedCount || 0) + 1;
        this.saveCoupon(coupon);
      }
    }

    return newOrder;
  },

  updateOrderStatus(orderId, newStatus, note = "") {
    let orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      if (newStatus === "Delivered") {
        order.paymentStatus = "Paid";
      }
      
      const nowStr = new Date().toLocaleString();
      // Add or update timeline step
      order.timeline.push({
        status: `Status changed to ${newStatus}${note ? ` (${note})` : ''}`,
        date: nowStr,
        completed: true
      });

      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      return order;
    }
    return null;
  },

  // ----------------------------------------------------
  // CUSTOMERS / USERS
  // ----------------------------------------------------
  getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
  },

  getUserById(id) {
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  },

  getUserByEmail(email) {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
  },

  saveUser(userData) {
    let users = this.getUsers();
    if (userData.id) {
      const idx = users.findIndex(u => u.id === userData.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...userData };
      } else {
        users.push(userData);
      }
    } else {
      userData.id = "usr_" + Math.random().toString(36).substr(2, 8);
      userData.createdAt = new Date().toISOString();
      userData.ordersCount = 0;
      userData.totalSpent = 0;
      users.push(userData);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return userData;
  },

  getCustomers() {
    const users = this.getUsers().filter(u => u.role !== "admin");
    const orders = this.getOrders();

    return users.map(user => {
      const userOrders = orders.filter(o => o.userId === user.id || (o.customer && o.customer.email === user.email));
      const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      return {
        ...user,
        ordersCount: userOrders.length,
        totalSpent: Math.round(totalSpent * 100) / 100,
        recentOrders: userOrders.slice(0, 3)
      };
    });
  },

  // ----------------------------------------------------
  // REVIEWS
  // ----------------------------------------------------
  getReviews(productId) {
    const reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || "[]");
    return reviews.filter(r => r.productId === productId);
  },

  addReview(reviewData) {
    let reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || "[]");
    reviewData.id = "rev_" + Math.random().toString(36).substr(2, 6);
    reviewData.date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    reviews.unshift(reviewData);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));

    // Update product average rating & review count
    const product = this.getProductById(reviewData.productId);
    if (product) {
      const prodReviews = reviews.filter(r => r.productId === product.id);
      const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
      product.rating = Math.round(avg * 10) / 10;
      product.reviewCount = prodReviews.length;
      this.saveProduct(product);
    }

    return reviewData;
  },

  // ----------------------------------------------------
  // STORE SETTINGS
  // ----------------------------------------------------
  getSettings() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || JSON.stringify(SEED_SETTINGS));
  },

  saveSettings(newSettings) {
    const merged = { ...this.getSettings(), ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
    return merged;
  },

  // ----------------------------------------------------
  // RECENTLY VIEWED
  // ----------------------------------------------------
  getRecentlyViewed() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED) || "[]");
  },

  addRecentlyViewed(productId) {
    let list = this.getRecentlyViewed();
    list = list.filter(id => id !== productId);
    list.unshift(productId);
    if (list.length > 8) list.pop();
    localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(list));
  },

  // ----------------------------------------------------
  // FORMATTING HELPERS
  // ----------------------------------------------------
  formatCurrency(amount) {
    const settings = this.getSettings();
    const symbol = settings.currencySymbol || "$";
    return `${symbol}${Number(amount || 0).toFixed(2)}`;
  },

  formatDate(isoString) {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch (e) {
      return isoString;
    }
  }
};

// Auto-initialize on script load
Store.init();
