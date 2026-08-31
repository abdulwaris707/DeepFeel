/**
 * DeepFeel - REST API Client Module
 * Provides unified, secure API communication with the Node.js/Express backend server.
 */

const API_BASE_URL = window.location.origin.includes('http') ? '/api' : 'http://localhost:5000/api';

const API = {
  async request(endpoint, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'same-origin', // Send cookies securely
      ...options
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP Error ${response.status}`);
      }

      return data;
    } catch (err) {
      console.warn(`[API] ${endpoint} request notice:`, err.message);
      return { success: false, error: err.message };
    }
  },

  // HEALTH CHECK
  async checkHealth() {
    return this.request('/health');
  },

  // AUTHENTICATION
  async login(email, password) {
    return this.request('/auth/login', { method: 'POST', body: { email, password } });
  },

  async register(userData) {
    return this.request('/auth/register', { method: 'POST', body: userData });
  },

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  },

  async getProfile() {
    return this.request('/auth/me');
  },

  // PRODUCTS
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/products${query ? '?' + query : ''}`);
  },

  async getProductById(id) {
    return this.request(`/products/${id}`);
  },

  // ORDERS
  async createOrder(orderPayload) {
    return this.request('/orders', { method: 'POST', body: orderPayload });
  },

  async getOrders() {
    return this.request('/orders');
  },

  async getOrderById(id) {
    return this.request(`/orders/${id}`);
  },

  // VOUCHERS & COUPONS
  async validateCoupon(code, subtotal) {
    return this.request('/coupons/validate', { method: 'POST', body: { code, subtotal } });
  },

  // ADMIN OPERATIONS
  async adminSaveProduct(productData) {
    return this.request('/admin/products', { method: 'POST', body: productData });
  },

  async adminDeleteProduct(id) {
    return this.request(`/admin/products/${id}`, { method: 'DELETE' });
  },

  async adminUpdateStock(id, stock) {
    return this.request(`/admin/products/${id}/stock`, { method: 'PATCH', body: { stock } });
  },

  async adminUpdateOrderStatus(id, status) {
    return this.request(`/admin/orders/${id}/status`, { method: 'PATCH', body: { status } });
  },

  async adminGetCustomers() {
    return this.request('/admin/customers');
  },

  async adminGetAuditLogs() {
    return this.request('/admin/audit-logs');
  }
};

window.API = API;
