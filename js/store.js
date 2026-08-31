/**
 * DeepFeel - LocalStorage Data Access Layer (Store)
 * Handles perfume state persistence, fragrance CRUD, olfactory filtering, and demo data reset.
 */

const STORAGE_KEYS = {
  VERSION: "deepfeel_fragrance_v2",
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
  // Initialize storage if missing or if upgrading from previous version
  init() {
    const isPerfumeVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (!isPerfumeVersion || !localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      this.resetDemoData();
      localStorage.setItem(STORAGE_KEYS.VERSION, "2.0_perfume");
    }
  },

  // Reset to original luxury perfume dataset
  resetDemoData() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(SEED_COUPONS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(SEED_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(SEED_REVIEWS));
    localStorage.setItem(STORAGE_KEYS.VERSION, "2.0_perfume");
    
    // Set default demo customer as logged in if no user
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_USERS[1])); // Elena Vance
    }
  },

  // ----------------------------------------------------
  // PRODUCTS & FRAGRANCE CRUD
  // ----------------------------------------------------
  getProducts(filters = {}) {
    let products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || "[]");
    
    // Filter by Category
    if (filters.category && filters.category !== "all") {
      products = products.filter(p => p.categorySlug === filters.category || p.category === filters.category);
    }

    // Filter by Gender (Men, Women, Unisex)
    if (filters.gender && filters.gender !== "all") {
      products = products.filter(p => p.gender && p.gender.toLowerCase() === filters.gender.toLowerCase());
    }

    // Filter by Fragrance Family (Woody, Floral, Fresh, Oriental, Amber, Citrus, Musky, Gourmand)
    if (filters.fragranceFamily && filters.fragranceFamily !== "all") {
      products = products.filter(p => p.fragranceFamily && p.fragranceFamily.toLowerCase().includes(filters.fragranceFamily.toLowerCase()));
    }

    // Filter by Concentration (Extrait de Parfum, Eau de Parfum, Eau de Toilette)
    if (filters.concentration && filters.concentration !== "all") {
      products = products.filter(p => p.concentration && p.concentration.toLowerCase().includes(filters.concentration.toLowerCase()));
    }

    // Filter by Occasion (Everyday, Office, Evening, Special Occasion)
    if (filters.occasion && filters.occasion !== "all") {
      products = products.filter(p => p.occasion && p.occasion.toLowerCase().includes(filters.occasion.toLowerCase()));
    }

    // Filter by Season (Spring, Summer, Fall, Winter)
    if (filters.season && filters.season !== "all") {
      products = products.filter(p => p.season && p.season.toLowerCase().includes(filters.season.toLowerCase()));
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

    // Search query (names, notes, tags, descriptions, families)
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      products = products.filter(p => {
        const matchName = p.name && p.name.toLowerCase().includes(q);
        const matchCategory = p.category && p.category.toLowerCase().includes(q);
        const matchFamily = p.fragranceFamily && p.fragranceFamily.toLowerCase().includes(q);
        const matchDesc = p.shortDescription && p.shortDescription.toLowerCase().includes(q);
        const matchSku = p.sku && p.sku.toLowerCase().includes(q);
        const matchTags = p.tags && p.tags.some(tag => tag.toLowerCase().includes(q));
        
        let matchNotes = false;
        if (p.notes) {
          const allNotes = [...(p.notes.top || []), ...(p.notes.heart || []), ...(p.notes.base || [])];
          matchNotes = allNotes.some(n => n.toLowerCase().includes(q));
        }

        return matchName || matchCategory || matchFamily || matchDesc || matchSku || matchTags || matchNotes;
      });
    }

    // Featured / Bestseller / New / Exclusive
    if (filters.featured) {
      products = products.filter(p => p.featured);
    }
    if (filters.bestseller) {
      products = products.filter(p => p.bestseller);
    }
    if (filters.isNew) {
      products = products.filter(p => p.isNew);
    }
    if (filters.exclusive) {
      products = products.filter(p => p.exclusive);
    }

    // Sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price_asc":
          products.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          products.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          products.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        case "bestseller":
          products.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
          break;
        case "name_asc":
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
    }

    return products;
  },

  getProductById(id) {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || "[]");
    return products.find(p => p.id === id) || null;
  },

  getProductBySize(id, size) {
    const p = this.getProductById(id);
    if (!p) return null;
    const price = (p.sizePricing && p.sizePricing[size]) ? p.sizePricing[size] : p.price;
    return { ...p, selectedSize: size, price };
  },

  // Fragrance Discovery Recommender
  recommendPerfumesByPreference(profile) {
    const products = this.getProducts({ status: "active" });
    const p = (profile || "").toLowerCase();
    
    return products.filter(item => {
      if (p === "fresh") {
        return item.fragranceFamily === "Fresh" || item.fragranceFamily === "Citrus" || (item.tags && item.tags.includes("fresh"));
      }
      if (p === "sweet") {
        return item.fragranceFamily === "Gourmand" || (item.tags && item.tags.includes("sweet")) || (item.tags && item.tags.includes("vanilla"));
      }
      if (p === "woody") {
        return item.fragranceFamily === "Woody" || (item.tags && item.tags.includes("woody")) || (item.tags && item.tags.includes("sandalwood"));
      }
      if (p === "spicy") {
        return (item.tags && item.tags.includes("spicy")) || (item.tags && item.tags.includes("cardamom")) || (item.tags && item.tags.includes("saffron"));
      }
      if (p === "floral") {
        return item.fragranceFamily === "Floral" || (item.tags && item.tags.includes("rose")) || (item.tags && item.tags.includes("jasmine"));
      }
      if (p === "deep & smoky" || p === "smoky" || p === "oud") {
        return item.categorySlug === "oud-collection" || (item.tags && item.tags.includes("deep & smoky")) || (item.tags && item.tags.includes("incense"));
      }
      return item.featured;
    }).slice(0, 4);
  },

  saveProduct(productData) {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || "[]");
    const existingIndex = products.findIndex(p => p.id === productData.id);

    if (existingIndex >= 0) {
      products[existingIndex] = { ...products[existingIndex], ...productData };
    } else {
      const newProduct = {
        id: productData.id || "df_" + Date.now().toString(36),
        status: "active",
        rating: 5.0,
        reviewCount: 1,
        sizes: productData.sizes || ["50ml", "100ml"],
        selectedSize: productData.selectedSize || "50ml",
        sizePricing: productData.sizePricing || { "50ml": productData.price, "100ml": productData.price * 1.45 },
        ...productData
      };
      products.unshift(newProduct);
    }

    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return true;
  },

  deleteProduct(id) {
    let products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || "[]");
    products = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return true;
  },

  updateStock(id, newStock) {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || "[]");
    const p = products.find(prod => prod.id === id);
    if (p) {
      p.stock = Math.max(0, parseInt(newStock, 10) || 0);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      return true;
    }
    return false;
  },

  deductStockForOrder(orderItems) {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || "[]");
    orderItems.forEach(item => {
      const p = products.find(prod => prod.id === item.productId);
      if (p) {
        p.stock = Math.max(0, p.stock - (item.quantity || 1));
      }
    });
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  // ----------------------------------------------------
  // CATEGORIES
  // ----------------------------------------------------
  getCategories() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || "[]");
  },

  getCategoryBySlug(slug) {
    const cats = this.getCategories();
    return cats.find(c => c.slug === slug) || null;
  },

  saveCategory(catData) {
    const cats = this.getCategories();
    const idx = cats.findIndex(c => c.id === catData.id);
    if (idx >= 0) {
      cats[idx] = { ...cats[idx], ...catData };
    } else {
      cats.push({
        id: "cat_" + Date.now().toString(36),
        ...catData
      });
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
    return true;
  },

  deleteCategory(id) {
    let cats = this.getCategories();
    cats = cats.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
    return true;
  },

  // ----------------------------------------------------
  // COUPONS
  // ----------------------------------------------------
  getCoupons() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COUPONS) || "[]");
  },

  validateCoupon(code, subtotal) {
    if (!code) return { valid: false, message: "Please enter a promotion code." };
    const coupons = this.getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);

    if (!coupon) {
      return { valid: false, message: "Invalid or expired coupon code." };
    }

    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return { 
        valid: false, 
        message: `This coupon requires a minimum subtotal of $${coupon.minOrder.toFixed(2)}.` 
      };
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, message: "This promotional code has expired." };
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (subtotal * coupon.discountValue) / 100;
    } else {
      discountAmount = Math.min(subtotal, coupon.discountValue);
    }

    return {
      valid: true,
      coupon,
      discountAmount: Number(discountAmount.toFixed(2)),
      message: `Coupon applied: ${coupon.description || coupon.code}`
    };
  },

  saveCoupon(couponData) {
    const coupons = this.getCoupons();
    const idx = coupons.findIndex(c => c.id === couponData.id);
    if (idx >= 0) {
      coupons[idx] = { ...coupons[idx], ...couponData };
    } else {
      coupons.unshift({
        id: "cp_" + Date.now().toString(36),
        usedCount: 0,
        active: true,
        ...couponData
      });
    }
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    return true;
  },

  deleteCoupon(id) {
    let coupons = this.getCoupons();
    coupons = coupons.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    return true;
  },

  // ----------------------------------------------------
  // ORDERS
  // ----------------------------------------------------
  getOrders() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]");
  },

  getOrderById(id) {
    const orders = this.getOrders();
    return orders.find(o => o.id === id) || null;
  },

  getOrdersByUser(userId) {
    const orders = this.getOrders();
    return orders.filter(o => o.userId === userId);
  },

  createOrder(orderData) {
    const orders = this.getOrders();
    const newId = "DF-" + Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      id: newId,
      createdAt: new Date().toISOString(),
      status: "Pending",
      paymentStatus: "Paid",
      timeline: [
        { status: "Order Received & Perfume Maceration Verified", date: new Date().toLocaleString(), completed: true },
        { status: "Hand-wrapped in Silk Paper & Wax Seal", date: "Pending", completed: false },
        { status: "Dispatched via Priority Courier", date: "Pending", completed: false },
        { status: "Delivered to Doorstep", date: "Pending", completed: false }
      ],
      ...orderData
    };

    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Deduct stock
    if (newOrder.items && newOrder.items.length > 0) {
      this.deductStockForOrder(newOrder.items);
    }

    return newOrder;
  },

  updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      order.timeline.push({
        status: `Status updated to: ${newStatus}`,
        date: new Date().toLocaleString(),
        completed: true
      });
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      return true;
    }
    return false;
  },

  // ----------------------------------------------------
  // USERS & CUSTOMERS
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
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  saveUser(userData) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userData.id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...userData };
    } else {
      users.push({
        id: "usr_" + Date.now().toString(36),
        role: "customer",
        createdAt: new Date().toISOString(),
        ordersCount: 0,
        totalSpent: 0,
        ...userData
      });
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return true;
  },

  // ----------------------------------------------------
  // REVIEWS
  // ----------------------------------------------------
  getReviews(productId = null) {
    const reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || "[]");
    if (productId) {
      return reviews.filter(r => r.productId === productId);
    }
    return reviews;
  },

  addReview(reviewData) {
    const reviews = this.getReviews();
    const newRev = {
      id: "rev_" + Date.now().toString(36),
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      verified: true,
      ...reviewData
    };
    reviews.unshift(newRev);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));

    // Recalculate product rating
    const prodReviews = reviews.filter(r => r.productId === reviewData.productId);
    const avg = prodReviews.reduce((acc, r) => acc + Number(r.rating), 0) / prodReviews.length;
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || "[]");
    const prod = products.find(p => p.id === reviewData.productId);
    if (prod) {
      prod.rating = Number(avg.toFixed(1));
      prod.reviewCount = prodReviews.length;
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }

    return newRev;
  },

  // ----------------------------------------------------
  // SETTINGS
  // ----------------------------------------------------
  getSettings() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || JSON.stringify(SEED_SETTINGS));
  },

  saveSettings(newSettings) {
    const current = this.getSettings();
    const merged = { ...current, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
    return merged;
  },

  // ----------------------------------------------------
  // RECENTLY VIEWED
  // ----------------------------------------------------
  addRecentlyViewed(productId) {
    let recent = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED) || "[]");
    recent = recent.filter(id => id !== productId);
    recent.unshift(productId);
    if (recent.length > 8) recent.pop();
    localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(recent));
  },

  getRecentlyViewed() {
    const ids = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED) || "[]");
    const products = this.getProducts();
    return ids.map(id => products.find(p => p.id === id)).filter(Boolean);
  }
};

// Automatically initialize store on script load
Store.init();
