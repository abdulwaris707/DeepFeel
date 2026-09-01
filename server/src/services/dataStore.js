const db = require('../config/db');
const security = require('../utils/security');
const logger = require('../utils/logger');
const env = require('../config/env');

const initialCategories = [
  { id: "cat_signature", name: "Signature Collection", slug: "signature-collection", description: "Our most distinctive extrait de parfum creations.", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80" },
  { id: "cat_oud", name: "The Oud Collection", slug: "oud-collection", description: "Deep resinous agarwood elixirs.", image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=80" },
  { id: "cat_men", name: "For Him", slug: "men", description: "Sophisticated woody and spicy fragrances.", image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80" },
  { id: "cat_women", name: "For Her", slug: "women", description: "Luminous florals and velvety ambers.", image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=80" },
  { id: "cat_unisex", name: "Unisex Elixirs", slug: "unisex", description: "Gender-neutral olfactory masterpieces.", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80" },
  { id: "cat_gifts", name: "Gift & Discovery Sets", slug: "gift-sets", description: "Curated miniature coffrets and discovery sets.", image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=900&q=80" }
];

const initialProducts = [
  {
    id: "df_noir",
    sku: "DF-NOIR-01",
    name: "Velvet Amber & Noir",
    slug: "velvet-amber-noir",
    category: "signature-collection",
    fragranceFamily: "Amber Woody",
    concentration: "Extrait de Parfum (32% Oil)",
    description: "An enigmatic fusion of rare dark amber, Venezuelan tonka bean, smoky cade wood, and Bulgarian damask rose.",
    shortDescription: "Dark Venezuelan amber and smoky wood elixir.",
    price: 8800,
    originalPrice: 10500,
    rating: 4.95,
    reviewCount: 48,
    stock: 24,
    lowStockThreshold: 5,
    featured: true,
    bestseller: true,
    images: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80"],
    sizes: ["30ml", "50ml", "100ml"],
    sizePricing: { "30ml": 5800, "50ml": 8800, "100ml": 14500 },
    topNotes: ["Bergamot", "Pink Pepper", "Smoky Cardamom"],
    heartNotes: ["Bulgarian Rose", "Orris Butter", "Nutmeg"],
    baseNotes: ["Dark Amber", "Oud Wood", "Venezuelan Tonka"]
  },
  {
    id: "df_oud_royal",
    sku: "DF-OUD-02",
    name: "Oud Royale Assamese",
    slug: "oud-royale-assamese",
    category: "oud-collection",
    fragranceFamily: "Rich Oud Woody",
    concentration: "Pure Extrait (35% Oil)",
    description: "A majestic formulation starring 25-year aged wild Assamese agarwood oil, steeped with leather, saffron, and Madagascar vanilla.",
    shortDescription: "Aged Assamese agarwood steeped with saffron & dark vanilla.",
    price: 16500,
    originalPrice: 18500,
    rating: 5.0,
    reviewCount: 62,
    stock: 12,
    lowStockThreshold: 4,
    featured: true,
    bestseller: true,
    images: ["https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80"],
    sizes: ["50ml", "100ml"],
    sizePricing: { "50ml": 16500, "100ml": 24000 },
    topNotes: ["Kashmiri Saffron", "Incense Smoke"],
    heartNotes: ["Assam Oud", "Tuscan Leather"],
    baseNotes: ["Madagascar Vanilla", "Sandalwood"]
  },
  {
    id: "df_rose_santal",
    sku: "DF-ROSE-03",
    name: "Santal & Rose Imperiale",
    slug: "santal-rose-imperiale",
    category: "women",
    fragranceFamily: "Floral Woody",
    concentration: "Extrait de Parfum",
    description: "Velvety Grasse roses entwined with creamy Mysore sandalwood and crystalline white musk.",
    shortDescription: "Grasse rose petals cradled in creamy Mysore sandalwood.",
    price: 7800,
    originalPrice: 9200,
    rating: 4.9,
    reviewCount: 36,
    stock: 18,
    lowStockThreshold: 5,
    featured: true,
    bestseller: false,
    images: ["https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=80"],
    sizes: ["30ml", "50ml", "100ml"],
    sizePricing: { "30ml": 4900, "50ml": 7800, "100ml": 12800 },
    topNotes: ["Bergamot", "Lychee"],
    heartNotes: ["Grasse Rose", "Peony"],
    baseNotes: ["Mysore Sandalwood", "White Musk"]
  },
  {
    id: "df_smokey_vetiver",
    sku: "DF-VET-04",
    name: "Smoked Vetiver & Birch",
    slug: "smoked-vetiver-birch",
    category: "men",
    fragranceFamily: "Smoky Earthy Woody",
    concentration: "Extrait de Parfum",
    description: "Haitian vetiver root scorched with birch tar, green cardamom, and dark Indonesian patchouli.",
    shortDescription: "Scorched Haitian vetiver and birch tar with spicy cardamom.",
    price: 8200,
    originalPrice: 9500,
    rating: 4.85,
    reviewCount: 29,
    stock: 15,
    lowStockThreshold: 5,
    featured: false,
    bestseller: true,
    images: ["https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=80"],
    sizes: ["50ml", "100ml"],
    sizePricing: { "50ml": 8200, "100ml": 13500 },
    topNotes: ["Green Cardamom", "Grapefruit"],
    heartNotes: ["Haitian Vetiver", "Cedarwood"],
    baseNotes: ["Birch Tar", "Patchouli"]
  }
];

const initialCoupons = [
  { id: "cp_w10", code: "WELCOME10", discountType: "percentage", discountValue: 10, minOrder: 4000, usageLimit: 1000, usedCount: 142, expiryDate: "2027-12-31", active: true, description: "10% off on your first Maison DeepFeel order" },
  { id: "cp_m1500", code: "MAISON1500", discountType: "fixed", discountValue: 1500, minOrder: 10000, usageLimit: 500, usedCount: 89, expiryDate: "2027-12-31", active: true, description: "Rs. 1,500 off on orders over Rs. 10,000" },
  { id: "cp_freeship", code: "FREESHIP", discountType: "fixed", discountValue: 250, minOrder: 3000, usageLimit: 2000, usedCount: 520, expiryDate: "2027-12-31", active: true, description: "Complimentary TCS express courier delivery credit" },
  { id: "cp_eid20", code: "EID20", discountType: "percentage", discountValue: 20, minOrder: 8000, usageLimit: 500, usedCount: 64, expiryDate: "2027-12-31", active: true, description: "20% Festive Luxury Discount" }
];

class DataStore {
  static async init() {
    await db.init();
    const memory = db.getMemoryDb();

    // Populate memory fallback records
    if (memory.categories.length === 0) memory.categories = [...initialCategories];
    if (memory.products.length === 0) memory.products = [...initialProducts];
    if (memory.coupons.length === 0) memory.coupons = [...initialCoupons];

    // Ensure Initial Admin Account Exists
    const adminEmail = env.initialAdminEmail.toLowerCase();
    const existingAdmin = memory.users.find(u => u.email.toLowerCase() === adminEmail);
    if (!existingAdmin) {
      const passwordHash = await security.hashPassword(env.initialAdminPassword);
      const adminUser = {
        id: "usr_admin_root",
        name: "Maison Admin Director",
        email: adminEmail,
        passwordHash,
        role: "SUPER_ADMIN",
        phone: "+92 300 1234567",
        city: "Lahore",
        country: "Pakistan",
        createdAt: new Date().toISOString()
      };
      memory.users.push(adminUser);
      logger.info('Initial Super Admin account provisioned', { email: adminEmail, role: 'SUPER_ADMIN' });
    }
  }

  // USERS
  static async findUserByEmail(email) {
    if (!email) return null;
    const lower = email.toLowerCase().trim();
    const memory = db.getMemoryDb();
    return memory.users.find(u => u.email.toLowerCase() === lower) || null;
  }

  static async findUserById(id) {
    const memory = db.getMemoryDb();
    return memory.users.find(u => u.id === id) || null;
  }

  static async createUser(userData) {
    const memory = db.getMemoryDb();
    const passwordHash = await security.hashPassword(userData.password);
    const newUser = {
      id: "usr_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      name: security.sanitizeString(userData.name),
      email: userData.email.toLowerCase().trim(),
      passwordHash,
      role: userData.role || "CUSTOMER",
      phone: userData.phone || "",
      city: userData.city || "",
      address: userData.address || "",
      ordersCount: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString()
    };
    memory.users.push(newUser);
    return newUser;
  }

  static async getUsers() {
    const memory = db.getMemoryDb();
    return memory.users.map(({ passwordHash, ...user }) => user);
  }

  static async updateUserEmail(userId, newEmail) {
    const memory = db.getMemoryDb();
    const user = memory.users.find(u => u.id === userId);
    if (user) {
      user.email = newEmail.toLowerCase().trim();
      user.updatedAt = new Date().toISOString();
      return user;
    }
    return null;
  }

  static async updateUserPassword(userId, newPasswordHash) {
    const memory = db.getMemoryDb();
    const user = memory.users.find(u => u.id === userId);
    if (user) {
      user.passwordHash = newPasswordHash;
      user.updatedAt = new Date().toISOString();
      return user;
    }
    return null;
  }

  static async getDashboardStats() {
    const memory = db.getMemoryDb();
    const orders = memory.orders || [];
    const products = memory.products || [];
    const users = memory.users || [];
    const categories = memory.categories || [];

    const validOrders = orders.filter(o => o.status && o.status.toLowerCase() !== 'cancelled');
    const totalRevenue = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const completedOrders = validOrders.length;
    const customerCount = users.filter(u => !u.role || u.role.toUpperCase() === 'CUSTOMER').length;
    const lowStockProducts = products.filter(p => (p.stock || 0) <= (p.lowStockThreshold || 5));

    const categoryDistribution = categories.map(cat => {
      const count = products.filter(p => p.category === cat.slug || p.category === cat.id || p.category === cat.name).length;
      return { category: cat.name, count };
    });

    return {
      totalRevenue,
      totalOrders: orders.length,
      completedOrders,
      customerCount,
      activeProducts: products.length,
      lowStockCount: lowStockProducts.length,
      categoryDistribution,
      recentOrders: orders.slice(0, 5),
      recentLowStock: lowStockProducts.slice(0, 5)
    };
  }

  static async saveCategory(categoryData) {
    const memory = db.getMemoryDb();
    let category = memory.categories.find(c => c.id === categoryData.id || c.slug === categoryData.slug);
    if (category) {
      Object.assign(category, categoryData);
    } else {
      category = {
        id: categoryData.id || "cat_" + Date.now().toString(36),
        name: security.sanitizeString(categoryData.name),
        slug: categoryData.slug || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: categoryData.description || "",
        image: categoryData.image || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80"
      };
      memory.categories.push(category);
    }
    return category;
  }

  static async deleteCategory(id) {
    const memory = db.getMemoryDb();
    const idx = memory.categories.findIndex(c => c.id === id || c.slug === id);
    if (idx !== -1) {
      return memory.categories.splice(idx, 1)[0];
    }
    return null;
  }

  // PRODUCTS
  static async getProducts(filters = {}) {
    const memory = db.getMemoryDb();
    let result = [...memory.products];

    if (filters.category && filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
    }
    if (filters.featured) {
      result = result.filter(p => p.featured === true);
    }
    return result;
  }

  static async getProductById(id) {
    const memory = db.getMemoryDb();
    return memory.products.find(p => p.id === id || p.slug === id) || null;
  }

  static async saveProduct(productData) {
    const memory = db.getMemoryDb();
    let product = memory.products.find(p => p.id === productData.id);

    if (product) {
      Object.assign(product, productData, { updatedAt: new Date().toISOString() });
    } else {
      product = {
        id: productData.id || "prod_" + Date.now().toString(36),
        sku: productData.sku || "DF-SKU-" + Math.floor(Math.random() * 9000 + 1000),
        name: security.sanitizeString(productData.name),
        slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: productData.category || "signature-collection",
        price: parseFloat(productData.price) || 0,
        originalPrice: parseFloat(productData.originalPrice) || 0,
        stock: parseInt(productData.stock, 10) || 0,
        lowStockThreshold: parseInt(productData.lowStockThreshold, 10) || 5,
        featured: Boolean(productData.featured),
        bestseller: Boolean(productData.bestseller),
        description: productData.description || "",
        shortDescription: productData.shortDescription || "",
        images: productData.images || ["https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80"],
        sizes: productData.sizes || ["50ml", "100ml"],
        sizePricing: productData.sizePricing || {},
        createdAt: new Date().toISOString()
      };
      memory.products.push(product);
    }
    return product;
  }

  static async deleteProduct(id) {
    const memory = db.getMemoryDb();
    const idx = memory.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      const removed = memory.products.splice(idx, 1)[0];
      return removed;
    }
    return null;
  }

  // ORDERS
  static async getOrders(filters = {}) {
    const memory = db.getMemoryDb();
    let orders = [...memory.orders];
    if (filters.userId) {
      orders = orders.filter(o => o.userId === filters.userId);
    }
    if (filters.status && filters.status !== 'all') {
      orders = orders.filter(o => o.status.toLowerCase() === filters.status.toLowerCase());
    }
    return orders;
  }

  static async getOrderById(id) {
    const memory = db.getMemoryDb();
    return memory.orders.find(o => o.id === id) || null;
  }

  static async createOrder(orderPayload) {
    const memory = db.getMemoryDb();

    // Server-Side Price Verification & Recalculation
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of orderPayload.items) {
      const dbProduct = memory.products.find(p => p.id === item.productId);
      if (!dbProduct) {
        throw new Error(`Invalid product in cart: ${item.productId}`);
      }

      const size = item.size || "50ml";
      const unitPrice = (dbProduct.sizePricing && dbProduct.sizePricing[size]) ? dbProduct.sizePricing[size] : dbProduct.price;
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      const lineTotal = unitPrice * quantity;

      subtotal += lineTotal;
      verifiedItems.push({
        productId: dbProduct.id,
        name: dbProduct.name,
        size,
        quantity,
        price: unitPrice,
        lineTotal,
        image: dbProduct.images[0]
      });

      // Deduct inventory stock
      dbProduct.stock = Math.max(0, dbProduct.stock - quantity);
    }

    // Server-Side Coupon Discount Calculation
    let discount = 0;
    if (orderPayload.couponCode) {
      const coupon = memory.coupons.find(c => c.code.toUpperCase() === orderPayload.couponCode.toUpperCase() && c.active);
      if (coupon && subtotal >= coupon.minOrder) {
        discount = coupon.discountType === 'percentage' ? Math.round((subtotal * coupon.discountValue) / 100) : coupon.discountValue;
        coupon.usedCount = (coupon.usedCount || 0) + 1;
      }
    }

    // Shipping threshold calculation (Rs. 5000 free threshold)
    const isFreeShipping = subtotal >= 5000;
    const shipping = isFreeShipping ? 0 : 250;
    const total = Math.max(0, subtotal - discount + shipping);

    const orderId = "DF-PK-" + Math.floor(Math.random() * 90000 + 10000);
    const newOrder = {
      id: orderId,
      userId: orderPayload.userId || null,
      customer: {
        name: security.sanitizeString(orderPayload.customer.name),
        email: orderPayload.customer.email.toLowerCase().trim(),
        phone: security.sanitizeString(orderPayload.customer.phone || ''),
        city: security.sanitizeString(orderPayload.customer.city || ''),
        address: security.sanitizeString(orderPayload.customer.address || '')
      },
      paymentMethod: orderPayload.paymentMethod || 'Cash on Delivery (COD)',
      paymentStatus: orderPayload.paymentMethod.includes('COD') ? 'Pending Collection on Delivery' : 'Paid (Verified)',
      status: 'Pending',
      items: verifiedItems,
      subtotal,
      discount,
      shipping,
      total,
      timeline: [
        { status: 'Order Placed & Invoiced', date: new Date().toLocaleString("en-PK") }
      ],
      createdAt: new Date().toISOString()
    };

    memory.orders.unshift(newOrder);

    // Update user stats if registered
    if (orderPayload.userId) {
      const user = memory.users.find(u => u.id === orderPayload.userId);
      if (user) {
        user.ordersCount = (user.ordersCount || 0) + 1;
        user.totalSpent = (user.totalSpent || 0) + total;
      }
    }

    return newOrder;
  }

  static async updateOrderStatus(orderId, status) {
    const memory = db.getMemoryDb();
    const order = memory.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      order.timeline = order.timeline || [];
      order.timeline.push({
        status: `Status updated to ${status}`,
        date: new Date().toLocaleString("en-PK")
      });
      return order;
    }
    return null;
  }

  // COUPONS
  static async getCoupons() {
    const memory = db.getMemoryDb();
    return memory.coupons;
  }

  static async validateCoupon(code, subtotal) {
    const memory = db.getMemoryDb();
    const coupon = memory.coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
    if (!coupon) return { valid: false, message: 'Invalid voucher code.' };
    if (subtotal < coupon.minOrder) return { valid: false, message: `Minimum order of Rs. ${coupon.minOrder.toLocaleString('en-PK')} required.` };
    
    const discount = coupon.discountType === 'percentage' ? Math.round((subtotal * coupon.discountValue) / 100) : coupon.discountValue;
    return { valid: true, discount, coupon };
  }

  // AUDIT LOGS
  static async recordAuditLog(adminId, adminEmail, action, resource, resourceId, details = {}, ip = '') {
    const memory = db.getMemoryDb();
    const log = {
      id: "log_" + Date.now().toString(36),
      adminId,
      adminEmail,
      action,
      resource,
      resourceId,
      details,
      ipAddress: ip,
      createdAt: new Date().toISOString()
    };
    memory.audit_logs.unshift(log);
    logger.audit(action, adminEmail, resource, { resourceId, ...details });
    return log;
  }

  static async getAuditLogs() {
    const memory = db.getMemoryDb();
    return memory.audit_logs.slice(0, 50);
  }
}

module.exports = DataStore;
