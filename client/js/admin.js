/**
 * DeepFeel - Admin Management Suite Controller
 * Powers executive dashboard charts, perfume product CRUD, inventory manager, order workflows,
 * coupon manager, category manager, customer directory, and store settings.
 */

document.addEventListener("DOMContentLoaded", () => {
  AdminApp.init();
});

const AdminApp = {
  init() {
    const path = window.location.pathname.toLowerCase();
    
    if (path.includes("admin/login.html") || path.endsWith("admin/login")) {
      this.initAdminLoginPage();
      return;
    }

    // Role protection for all admin pages
    if (!Auth.isAdmin()) {
      window.location.href = "login.html";
      return;
    }

    this.initLayout();

    if (path.endsWith("admin/index.html") || path.endsWith("admin/") || path.endsWith("admin")) {
      this.initDashboard();
    } else if (path.includes("admin/products.html")) {
      this.initProductsList();
    } else if (path.includes("admin/product-form.html")) {
      this.initProductForm();
    } else if (path.includes("admin/inventory.html")) {
      this.initInventoryPage();
    } else if (path.includes("admin/orders.html")) {
      this.initOrdersPage();
    } else if (path.includes("admin/order-details.html")) {
      this.initOrderDetailsPage();
    } else if (path.includes("admin/customers.html")) {
      this.initCustomersPage();
    } else if (path.includes("admin/categories.html")) {
      this.initCategoriesPage();
    } else if (path.includes("admin/coupons.html")) {
      this.initCouponsPage();
    } else if (path.includes("admin/settings.html")) {
      this.initSettingsPage();
    } else if (path.includes("admin/profile.html")) {
      this.initProfilePage();
    }
  },


  initLayout() {
    const toggle = document.querySelector(".admin-mobile-toggle");
    const sidebar = document.querySelector(".admin-sidebar");
    
    let backdrop = document.querySelector(".admin-sidebar-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "admin-sidebar-backdrop";
      document.body.appendChild(backdrop);
    }

    const closeSidebar = () => {
      if (sidebar) sidebar.classList.remove("open");
      if (backdrop) backdrop.classList.remove("active");
    };

    if (toggle && sidebar) {
      toggle.addEventListener("click", () => {
        const isOpen = sidebar.classList.toggle("open");
        backdrop.classList.toggle("active", isOpen);
      });

      backdrop.addEventListener("click", closeSidebar);

      const closeBtn = sidebar.querySelector(".admin-sidebar-close");
      if (closeBtn) {
        closeBtn.addEventListener("click", closeSidebar);
      }
    }

    const logoutBtn = document.getElementById("admin-logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        Auth.logout("../login.html");
      });
    }

    const lowStockCount = Store.getProducts().filter(p => p.stock <= p.lowStockThreshold).length;
    const invBadge = document.getElementById("sidebar-low-stock-badge");
    if (invBadge && lowStockCount > 0) {
      invBadge.textContent = lowStockCount;
      invBadge.style.display = "inline-block";
    }
  },

  // ----------------------------------------------------
  // ADMIN LOGIN
  // ----------------------------------------------------
  initAdminLoginPage() {
    const form = document.getElementById("admin-login-form");
    const demoFillBtn = document.getElementById("admin-fill-demo-btn");

    if (demoFillBtn) {
      demoFillBtn.addEventListener("click", () => {
        Auth.fillDemoCredentials("admin", "admin-email", "admin-password");
      });
    }

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("admin-email").value;
        const password = document.getElementById("admin-password").value;

        const res = await Auth.login(email, password);
        const role = (res.user && res.user.role || '').toLowerCase();
        if (res.success && (role === "admin" || role === "super_admin" || role === "staff")) {
          window.location.href = "index.html";
        } else {
          UI.showToast("Invalid admin email or password.", "error");
        }
      });
    }

  },

  // ----------------------------------------------------
  // EXECUTIVE DASHBOARD
  // ----------------------------------------------------
  // ----------------------------------------------------
  // EXECUTIVE DASHBOARD (REAL DATABASE DRIVEN)
  // ----------------------------------------------------
  async initDashboard() {
    let stats = null;
    if (window.API && window.API.adminGetDashboardStats) {
      const res = await window.API.adminGetDashboardStats();
      if (res && res.success && res.stats) {
        stats = res.stats;
      }
    }

    if (!stats) {
      const orders = Store.getOrders();
      const products = Store.getProducts();
      const validOrders = orders.filter(o => o.status && o.status.toLowerCase() !== 'cancelled');
      stats = {
        totalRevenue: validOrders.reduce((sum, o) => sum + (o.total || 0), 0),
        totalOrders: orders.length,
        completedOrders: validOrders.length,
        customerCount: Store.getUsers().length,
        activeProducts: products.length,
        lowStockCount: products.filter(p => p.stock <= p.lowStockThreshold).length,
        categoryDistribution: Store.getCategories().map(c => ({ category: c.name, count: products.filter(p => p.category === c.name || p.category === c.slug).length })),
        recentOrders: orders.slice(0, 5),
        recentLowStock: products.filter(p => p.stock <= p.lowStockThreshold).slice(0, 5)
      };
    }

    const revEl = document.getElementById("metric-revenue");
    const ordersEl = document.getElementById("metric-orders");
    const prodsEl = document.getElementById("metric-products");
    const lowStockEl = document.getElementById("metric-low-stock");

    if (revEl) revEl.textContent = Store.formatCurrency(stats.totalRevenue);
    if (ordersEl) ordersEl.textContent = stats.totalOrders;
    if (prodsEl) prodsEl.textContent = stats.activeProducts;
    if (lowStockEl) lowStockEl.textContent = stats.lowStockCount;

    // Render Real Revenue Canvas Chart
    this.renderRevenueChart(stats.recentOrders || []);

    // Render Olfactory Family Distribution Chart
    this.renderCategoryChart(stats.categoryDistribution || []);

    // Render Recent Orders Feed
    const recentOrdersBody = document.getElementById("dashboard-recent-orders-body");
    if (recentOrdersBody) {
      const recent = stats.recentOrders || [];
      if (recent.length === 0) {
        recentOrdersBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding:1.5rem;">No recent orders found.</td></tr>`;
      } else {
        recentOrdersBody.innerHTML = recent.map(o => `
          <tr>
            <td><strong><a href="order-details.html?id=${o.id}">${o.id}</a></strong></td>
            <td>${o.customer ? o.customer.name : 'Customer'}</td>
            <td>${new Date(o.createdAt).toLocaleDateString()}</td>
            <td><strong>${Store.formatCurrency(o.total)}</strong></td>
            <td><span class="status-pill status-${(o.status || 'pending').toLowerCase()}">${o.status}</span></td>
            <td><a href="order-details.html?id=${o.id}" class="btn btn-outline btn-sm">Process &rarr;</a></td>
          </tr>
        `).join("");
      }
    }

    // Render Low Stock Action Card
    const lowStockBody = document.getElementById("dashboard-low-stock-body");
    if (lowStockBody) {
      const lowStockItems = stats.recentLowStock || [];
      if (lowStockItems.length === 0) {
        lowStockBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted" style="padding:1.5rem;">All items sufficiently stocked.</td></tr>`;
      } else {
        lowStockBody.innerHTML = lowStockItems.map(p => `
          <tr>
            <td>
              <div class="table-product-cell">
                <img src="${p.images ? p.images[0] : ''}" alt="${p.name}" class="table-product-thumb" />
                <div>
                  <div class="table-product-name">${p.name}</div>
                  <div class="table-product-sku">${p.sku}</div>
                </div>
              </div>
            </td>
            <td><span style="color:var(--admin-danger); font-weight:700;">${p.stock}</span></td>
            <td>${p.lowStockThreshold}</td>
            <td>
              <button type="button" class="btn btn-outline btn-sm" onclick="AdminApp.quickRestock('${p.id}', 10)">
                +10 Flacons
              </button>
            </td>
          </tr>
        `).join("");
      }
    }
  },

  renderRevenueChart(orders = []) {
    const canvas = document.getElementById("revenue-chart-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    if (!orders || orders.length === 0) {
      ctx.fillStyle = "#7E7E88";
      ctx.font = "500 13px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("No sales data available yet.", w / 2, h / 2);
      return;
    }

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dayTotals = { "Mon": 0, "Tue": 0, "Wed": 0, "Thu": 0, "Fri": 0, "Sat": 0, "Sun": 0 };

    orders.forEach(o => {
      if (o.status && o.status.toLowerCase() !== 'cancelled') {
        const d = new Date(o.createdAt);
        const dayName = days[d.getDay() === 0 ? 6 : d.getDay() - 1];
        if (dayTotals[dayName] !== undefined) {
          dayTotals[dayName] += (o.total || 0);
        }
      }
    });

    const points = days.map(day => ({ label: day, val: dayTotals[day] }));
    const maxVal = Math.max(...points.map(p => p.val), 1000);

    const padding = { top: 30, right: 25, bottom: 35, left: 75 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.strokeStyle = "#E8E2D8";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#7E7E88";
    ctx.font = "11px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "right";

    const gridSteps = 4;
    for (let i = 0; i <= gridSteps; i++) {
      const yVal = (maxVal / gridSteps) * i;
      const y = padding.top + chartH - (i / gridSteps) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
      ctx.fillText(`Rs. ${Math.round(yVal).toLocaleString("en-PK")}`, padding.left - 8, y + 4);
    }

    const coords = points.map((pt, i) => {
      const x = padding.left + (i / (points.length - 1)) * chartW;
      const y = padding.top + chartH - (pt.val / maxVal) * chartH;
      return { x, y, label: pt.label, val: pt.val };
    });

    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    gradient.addColorStop(0, "rgba(158, 125, 88, 0.25)");
    gradient.addColorStop(1, "rgba(158, 125, 88, 0.0)");

    ctx.beginPath();
    ctx.moveTo(coords[0].x, padding.top + chartH);
    coords.forEach(c => ctx.lineTo(c.x, c.y));
    ctx.lineTo(coords[coords.length - 1].x, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = "#9E7D58";
    ctx.lineWidth = 2.5;
    coords.forEach((c, idx) => {
      if (idx === 0) ctx.moveTo(c.x, c.y);
      else ctx.lineTo(c.x, c.y);
    });
    ctx.stroke();

    coords.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#9E7D58";
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#4A4A52";
      ctx.textAlign = "center";
      ctx.font = "11px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(c.label, c.x, h - 10);
    });
  },

  renderCategoryChart(distribution = []) {
    const canvas = document.getElementById("category-chart-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    if (!distribution || distribution.length === 0) {
      ctx.fillStyle = "#7E7E88";
      ctx.font = "500 13px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("No category data available.", w / 2, h / 2);
      return;
    }

    const maxCount = Math.max(...distribution.map(e => e.count), 1);

    const padding = { top: 25, right: 35, bottom: 25, left: 110 };
    const chartW = w - padding.left - padding.right;
    const barHeight = 22;
    const gap = 12;

    distribution.slice(0, 5).forEach((item, i) => {
      const y = padding.top + i * (barHeight + gap);
      const barW = (item.count / maxCount) * chartW;

      ctx.fillStyle = "#121214";
      ctx.font = "500 11px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "right";
      ctx.fillText((item.category || '').slice(0, 15), padding.left - 12, y + 15);

      ctx.fillStyle = "#F5F2ED";
      ctx.beginPath();
      ctx.roundRect(padding.left, y, chartW, barHeight, 4);
      ctx.fill();

      if (barW > 0) {
        ctx.fillStyle = "#9E7D58";
        ctx.beginPath();
        ctx.roundRect(padding.left, y, Math.max(barW, 6), barHeight, 4);
        ctx.fill();
      }

      ctx.fillStyle = "#7E7E88";
      ctx.font = "600 11px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`${item.count}`, padding.left + barW + 8, y + 15);
    });
  },

  async quickRestock(productId, amount = 10) {
    if (window.API && window.API.adminUpdateStock) {
      const product = Store.getProductById(productId);
      const currentStock = product ? product.stock : 0;
      const res = await window.API.adminUpdateStock(productId, currentStock + amount);
      if (res.success) {
        UI.showToast(`Stock updated!`, "success");
        await this.initDashboard();
        return;
      }
    }
    const product = Store.getProductById(productId);
    if (product) {
      Store.updateStock(productId, product.stock + amount);
      UI.showToast(`Added ${amount} flacons to "${product.name}"`, "success");
      this.initDashboard();
    }
  },

  // ----------------------------------------------------
  // PRODUCTS LIST
  // ----------------------------------------------------
  initProductsList() {
    const tableBody = document.getElementById("admin-products-table-body");
    const searchInput = document.getElementById("admin-product-search");
    const categorySelect = document.getElementById("admin-product-category-filter");
    const stockSelect = document.getElementById("admin-product-stock-filter");

    if (categorySelect) {
      const categories = Store.getCategories();
      categorySelect.innerHTML = `<option value="all">All Fragrance Collections</option>` +
        categories.map(c => `<option value="${c.slug}">${c.name}</option>`).join("");
    }

    let filters = { search: "", category: "all", stockStatus: "all" };

    const render = () => {
      let products = Store.getProducts({
        search: filters.search,
        category: filters.category
      });

      if (filters.stockStatus === "in_stock") {
        products = products.filter(p => p.stock > p.lowStockThreshold);
      } else if (filters.stockStatus === "low_stock") {
        products = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold);
      } else if (filters.stockStatus === "out_of_stock") {
        products = products.filter(p => p.stock <= 0);
      }

      if (!tableBody) return;

      if (products.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding:2.5rem;">No matching fragrance flacons found.</td></tr>`;
        return;
      }

      tableBody.innerHTML = products.map(p => `
        <tr>
          <td>
            <div class="table-product-cell">
              <img src="${p.images[0]}" alt="${p.name}" class="table-product-thumb" />
              <div>
                <div class="table-product-name">${p.name}</div>
                <div class="table-product-sku">${p.sku} • ${p.fragranceFamily || 'Extrait'}</div>
              </div>
            </div>
          </td>
          <td>${p.category}</td>
          <td>
            <strong>$${p.price.toFixed(2)}</strong>
            ${p.originalPrice > p.price ? `<span class="price-original" style="font-size:0.8rem; margin-left:4px;">$${p.originalPrice.toFixed(2)}</span>` : ''}
          </td>
          <td>
            <span class="stock-status-pill ${p.stock <= 0 ? 'out-stock' : (p.stock <= p.lowStockThreshold ? 'low-stock' : 'in-stock')}">
              ${p.stock} flacons
            </span>
          </td>
          <td>
            <label class="switch-toggle" title="Toggle Featured">
              <input type="checkbox" ${p.featured ? 'checked' : ''} onchange="AdminApp.toggleProductFlag('${p.id}', 'featured', this.checked)">
              <span class="switch-slider"></span>
            </label>
          </td>
          <td>
            <label class="switch-toggle" title="Toggle Bestseller">
              <input type="checkbox" ${p.bestseller ? 'checked' : ''} onchange="AdminApp.toggleProductFlag('${p.id}', 'bestseller', this.checked)">
              <span class="switch-slider"></span>
            </label>
          </td>
          <td>
            <div style="display:flex; gap:0.4rem;">
              <a href="product-form.html?id=${p.id}" class="btn btn-outline btn-sm">Edit</a>
              <button type="button" class="btn btn-outline btn-sm" style="color:var(--color-error);" onclick="AdminApp.deleteProductPrompt('${p.id}')">Delete</button>
            </div>
          </td>
        </tr>
      `).join("");
    };

    if (searchInput) searchInput.addEventListener("input", (e) => { filters.search = e.target.value; render(); });
    if (categorySelect) categorySelect.addEventListener("change", (e) => { filters.category = e.target.value; render(); });
    if (stockSelect) stockSelect.addEventListener("change", (e) => { filters.stockStatus = e.target.value; render(); });

    render();
  },

  toggleProductFlag(productId, flag, value) {
    const product = Store.getProductById(productId);
    if (product) {
      product[flag] = value;
      Store.saveProduct(product);
      UI.showToast(`Updated ${flag} status for "${product.name}"`, "success");
    }
  },

  deleteProductPrompt(productId) {
    const product = Store.getProductById(productId);
    if (!product) return;
    if (confirm(`Are you sure you want to permanently delete "${product.name}"?`)) {
      Store.deleteProduct(productId);
      UI.showToast("Fragrance flacon deleted from catalog", "info");
      this.initProductsList();
    }
  },

  // ----------------------------------------------------
  // PRODUCT FORM (ADD / EDIT)
  // ----------------------------------------------------
  initProductForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    const isEdit = Boolean(productId);

    const pageTitle = document.getElementById("product-form-page-title");
    const form = document.getElementById("admin-product-form");
    const categorySelect = document.getElementById("prod-category");
    const imageInput = document.getElementById("prod-image-url");
    const imagePreview = document.getElementById("prod-image-preview");

    if (categorySelect) {
      const categories = Store.getCategories();
      categorySelect.innerHTML = categories.map(c => `
        <option value="${c.name}" data-slug="${c.slug}">${c.name}</option>
      `).join("");
    }

    if (pageTitle) pageTitle.textContent = isEdit ? "Edit Fragrance Creation" : "Create New Fragrance Flacon";

    if (isEdit) {
      const product = Store.getProductById(productId);
      if (product) {
        if (document.getElementById("prod-name")) document.getElementById("prod-name").value = product.name;
        if (document.getElementById("prod-sku")) document.getElementById("prod-sku").value = product.sku;
        if (document.getElementById("prod-price")) document.getElementById("prod-price").value = product.price;
        if (document.getElementById("prod-orig-price")) document.getElementById("prod-orig-price").value = product.originalPrice || product.price;
        if (document.getElementById("prod-stock")) document.getElementById("prod-stock").value = product.stock;
        if (document.getElementById("prod-threshold")) document.getElementById("prod-threshold").value = product.lowStockThreshold || 10;
        if (document.getElementById("prod-short-desc")) document.getElementById("prod-short-desc").value = product.shortDescription || "";
        if (document.getElementById("prod-full-desc")) document.getElementById("prod-full-desc").value = product.description || "";
        if (document.getElementById("prod-featured")) document.getElementById("prod-featured").checked = Boolean(product.featured);
        if (document.getElementById("prod-bestseller")) document.getElementById("prod-bestseller").checked = Boolean(product.bestseller);
        if (document.getElementById("prod-new")) document.getElementById("prod-new").checked = Boolean(product.isNew);
        if (categorySelect) categorySelect.value = product.category;

        if (product.images && product.images.length > 0 && imageInput && imagePreview) {
          imageInput.value = product.images[0];
          imagePreview.innerHTML = `<img src="${product.images[0]}" alt="Preview" />`;
        }
      }
    }

    if (imageInput && imagePreview) {
      imageInput.addEventListener("input", (e) => {
        const url = e.target.value.trim();
        if (url) {
          imagePreview.innerHTML = `<img src="${url}" alt="Preview" />`;
        } else {
          imagePreview.innerHTML = `<span>No image URL provided</span>`;
        }
      });
    }

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("prod-name").value.trim();
        const sku = document.getElementById("prod-sku").value.trim();
        const price = parseFloat(document.getElementById("prod-price").value);
        const origPrice = parseFloat(document.getElementById("prod-orig-price").value) || price;
        const stock = parseInt(document.getElementById("prod-stock").value, 10) || 0;
        const threshold = parseInt(document.getElementById("prod-threshold").value, 10) || 10;
        const shortDesc = document.getElementById("prod-short-desc").value.trim();
        const fullDesc = document.getElementById("prod-full-desc").value.trim();
        const featured = document.getElementById("prod-featured").checked;
        const bestseller = document.getElementById("prod-bestseller").checked;
        const isNew = document.getElementById("prod-new").checked;
        const selectedCatOpt = categorySelect.options[categorySelect.selectedIndex];
        const categoryName = selectedCatOpt.value;
        const categorySlug = selectedCatOpt.getAttribute("data-slug");

        const imageUrl = imageInput.value.trim() || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80";

        const productData = {
          name,
          sku,
          category: categoryName,
          categorySlug,
          price,
          originalPrice: origPrice,
          discountPrice: price,
          stock,
          lowStockThreshold: threshold,
          shortDescription: shortDesc,
          description: fullDesc,
          featured,
          bestseller,
          isNew,
          sizes: ["30ml", "50ml", "100ml"],
          sizePricing: { "30ml": price * 0.7, "50ml": price, "100ml": price * 1.45 },
          status: stock > 0 ? "active" : "draft",
          images: [imageUrl]
        };

        if (isEdit) productData.id = productId;

        Store.saveProduct(productData);
        UI.showToast(`Fragrance "${name}" saved to vault!`, "success");

        setTimeout(() => {
          window.location.href = "products.html";
        }, 500);
      });
    }
  },

  // ----------------------------------------------------
  // INVENTORY PAGE
  // ----------------------------------------------------
  initInventoryPage() {
    const tableBody = document.getElementById("admin-inventory-table-body");
    const totalUnitsEl = document.getElementById("inv-total-units");
    const totalValuationEl = document.getElementById("inv-total-valuation");
    const lowStockCountEl = document.getElementById("inv-low-stock-count");
    const outOfStockCountEl = document.getElementById("inv-out-of-stock-count");

    const render = () => {
      const products = Store.getProducts();

      const totalUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
      const totalValuation = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
      const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
      const outOfStockCount = products.filter(p => p.stock <= 0).length;

      if (totalUnitsEl) totalUnitsEl.textContent = totalUnits;
      if (totalValuationEl) totalValuationEl.textContent = Store.formatCurrency(totalValuation);
      if (lowStockCountEl) lowStockCountEl.textContent = lowStockCount;
      if (outOfStockCountEl) outOfStockCountEl.textContent = outOfStockCount;

      if (tableBody) {
        tableBody.innerHTML = products.map(p => {
          let statusHtml = '<span class="status-pill status-delivered">In Stock</span>';
          if (p.stock <= 0) {
            statusHtml = '<span class="status-pill status-cancelled">Out of Stock</span>';
          } else if (p.stock <= p.lowStockThreshold) {
            statusHtml = '<span class="status-pill status-pending">Low Stock Reserve</span>';
          }

          const sizesList = (p.sizes || ["50ml"]).join(", ");

          return `
            <tr>
              <td>
                <div class="table-product-cell">
                  <img src="${p.images[0]}" alt="${p.name}" class="table-product-thumb" />
                  <div>
                    <div class="table-product-name">${p.name}</div>
                    <div class="table-product-sku">${p.sku} • Sizes: ${sizesList}</div>
                  </div>
                </div>
              </td>
              <td>${p.category}</td>
              <td><strong>${p.stock}</strong></td>
              <td>${p.lowStockThreshold}</td>
              <td>$${(p.stock * p.price).toFixed(2)}</td>
              <td>${statusHtml}</td>
              <td>
                <div class="stock-adjust-group">
                  <button type="button" class="stock-adjust-btn" onclick="AdminApp.adjustStock('${p.id}', -1)">-1</button>
                  <button type="button" class="stock-adjust-btn" onclick="AdminApp.adjustStock('${p.id}', 5)">+5</button>
                  <button type="button" class="stock-adjust-btn" onclick="AdminApp.setStockPrompt('${p.id}')">Set</button>
                </div>
              </td>
            </tr>
          `;
        }).join("");
      }
    };

    render();
  },

  adjustStock(productId, delta) {
    const product = Store.getProductById(productId);
    if (product) {
      const newStock = Math.max(0, product.stock + delta);
      Store.updateStock(productId, newStock);
      UI.showToast(`Updated stock for "${product.name}" to ${newStock}`, "success");
      this.initInventoryPage();
    }
  },

  setStockPrompt(productId) {
    const product = Store.getProductById(productId);
    if (!product) return;
    const val = prompt(`Enter exact flacon stock for "${product.name}":`, product.stock);
    if (val !== null && !isNaN(parseInt(val, 10))) {
      const newStock = Math.max(0, parseInt(val, 10));
      Store.updateStock(productId, newStock);
      UI.showToast(`Stock updated to ${newStock}`, "success");
      this.initInventoryPage();
    }
  },

  // ----------------------------------------------------
  // ORDERS PAGE (REAL API DRIVEN)
  // ----------------------------------------------------
  async initOrdersPage() {
    const tableBody = document.getElementById("admin-orders-table-body");
    const searchInput = document.getElementById("admin-orders-search");
    const statusSelect = document.getElementById("admin-orders-status-filter");

    let filterStatus = "all";
    let searchQ = "";

    const render = async () => {
      let orders = [];
      if (window.API && window.API.getOrders) {
        const res = await window.API.getOrders();
        orders = (res && res.orders) || (Array.isArray(res) ? res : []);
      } else {
        orders = Store.getOrders();
      }

      if (filterStatus !== "all") {
        orders = orders.filter(o => o.status.toLowerCase() === filterStatus.toLowerCase());
      }

      if (searchQ) {
        const q = searchQ.toLowerCase();
        orders = orders.filter(o => o.id.toLowerCase().includes(q) || (o.customer && o.customer.name.toLowerCase().includes(q)));
      }

      if (!tableBody) return;

      if (orders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding:2rem;">No orders match the selected filter.</td></tr>`;
        return;
      }

      tableBody.innerHTML = orders.map(o => `
        <tr>
          <td><strong>${o.id}</strong></td>
          <td>
            <div style="font-weight:600;">${o.customer ? o.customer.name : 'N/A'}</div>
            <div class="text-muted" style="font-size:0.78rem;">${o.customer ? o.customer.email : ''}</div>
          </td>
          <td>${new Date(o.createdAt).toLocaleDateString()}</td>
          <td>${o.items ? o.items.length : 1} item${o.items && o.items.length > 1 ? 's' : ''}</td>
          <td><strong>${Store.formatCurrency(o.total)}</strong></td>
          <td>
            <select class="admin-select" onchange="AdminApp.updateOrderStatus('${o.id}', this.value)" style="font-size:0.82rem; padding:4px 8px;">
              <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
              <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
              <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
              <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td>
            <a href="order-details.html?id=${o.id}" class="btn btn-outline btn-sm">Details &rarr;</a>
          </td>
        </tr>
      `).join("");
    };

    if (searchInput) searchInput.addEventListener("input", (e) => { searchQ = e.target.value; render(); });
    if (statusSelect) statusSelect.addEventListener("change", (e) => { filterStatus = e.target.value; render(); });

    await render();
  },

  async updateOrderStatus(orderId, newStatus) {
    if (window.API && window.API.adminUpdateOrderStatus) {
      const res = await window.API.adminUpdateOrderStatus(orderId, newStatus);
      if (res && res.success) {
        UI.showToast(`Order ${orderId} status changed to "${newStatus}"`, "success");
        if (window.location.pathname.includes("orders.html")) {
          await this.initOrdersPage();
        }
        return;
      }
    }
    Store.updateOrderStatus(orderId, newStatus);
    UI.showToast(`Order ${orderId} status changed to "${newStatus}"`, "success");
  },

  // ----------------------------------------------------
  // ORDER DETAILS
  // ----------------------------------------------------
  async initOrderDetailsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("id");
    let order = null;

    if (orderId && window.API && window.API.getOrderById) {
      const res = await window.API.getOrderById(orderId);
      if (res && res.order) order = res.order;
    }

    if (!order) {
      order = orderId ? Store.getOrderById(orderId) : Store.getOrders()[0];
    }

    if (!order) {
      window.location.href = "orders.html";
      return;
    }

    if (document.getElementById("detail-order-id")) document.getElementById("detail-order-id").textContent = order.id;
    if (document.getElementById("detail-order-date")) document.getElementById("detail-order-date").textContent = new Date(order.createdAt).toLocaleString();
    if (document.getElementById("detail-cust-name")) document.getElementById("detail-cust-name").textContent = order.customer ? order.customer.name : 'N/A';
    if (document.getElementById("detail-cust-email")) document.getElementById("detail-cust-email").textContent = order.customer ? order.customer.email : 'N/A';
    if (document.getElementById("detail-cust-phone")) document.getElementById("detail-cust-phone").textContent = order.customer ? (order.customer.phone || "N/A") : "N/A";
    if (document.getElementById("detail-shipping-address")) document.getElementById("detail-shipping-address").textContent = order.customer ? (order.customer.address || "N/A") : "N/A";
    if (document.getElementById("detail-payment-method")) document.getElementById("detail-payment-method").textContent = order.paymentMethod || "Cash on Delivery (COD)";
    if (document.getElementById("detail-payment-status")) document.getElementById("detail-payment-status").textContent = order.paymentStatus || "Verified";
    if (document.getElementById("detail-subtotal")) document.getElementById("detail-subtotal").textContent = Store.formatCurrency(order.subtotal);
    if (document.getElementById("detail-discount")) document.getElementById("detail-discount").textContent = `-${Store.formatCurrency(order.discount || 0)}`;
    if (document.getElementById("detail-shipping")) document.getElementById("detail-shipping").textContent = order.shipping === 0 ? "FREE" : Store.formatCurrency(order.shipping);
    if (document.getElementById("detail-tax")) document.getElementById("detail-tax").textContent = Store.formatCurrency(order.tax || 0);
    if (document.getElementById("detail-total")) document.getElementById("detail-total").textContent = Store.formatCurrency(order.total);

    const statusSel = document.getElementById("detail-status-select");
    if (statusSel) {
      statusSel.value = order.status;
      statusSel.addEventListener("change", async (e) => {
        await AdminApp.updateOrderStatus(order.id, e.target.value);
      });
    }

    const itemsBody = document.getElementById("detail-items-table-body");
    if (itemsBody && order.items) {
      itemsBody.innerHTML = order.items.map(item => `
        <tr>
          <td>
            <div class="table-product-cell">
              <img src="${item.image}" alt="${item.name}" class="table-product-thumb" />
              <div>
                <div class="table-product-name">${item.name}</div>
                <div class="table-product-sku">${item.size || '50ml'}</div>
              </div>
            </div>
          </td>
          <td>${Store.formatCurrency(item.price)}</td>
          <td>${item.quantity}</td>
          <td><strong>${Store.formatCurrency(item.price * item.quantity)}</strong></td>
        </tr>
      `).join("");
    }

    const timelineList = document.getElementById("detail-timeline-list");
    if (timelineList && order.timeline) {
      timelineList.innerHTML = order.timeline.map(t => `
        <li style="margin-bottom:0.8rem; list-style:none; display:flex; gap:0.6rem; align-items:flex-start;">
          <span style="color:var(--admin-success); font-weight:700;">✓</span>
          <div>
            <strong>${t.status}</strong>
            <span class="text-muted" style="font-size:0.75rem; display:block;">${t.date}</span>
          </div>
        </li>
      `).join("");
    }
  },

  // ----------------------------------------------------
  // CUSTOMERS DIRECTORY (REAL API DRIVEN)
  // ----------------------------------------------------
  async initCustomersPage() {
    const tableBody = document.getElementById("admin-customers-table-body");
    if (!tableBody) return;

    let users = [];
    if (window.API && window.API.adminGetCustomers) {
      const res = await window.API.adminGetCustomers();
      users = (res && res.customers) || [];
    } else {
      users = Store.getUsers();
    }

    if (users.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding:2rem;">No registered customers found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = users.map(u => `
      <tr>
        <td><strong>${u.name}</strong></td>
        <td>${u.email}</td>
        <td>${u.phone || 'N/A'}</td>
        <td>${u.ordersCount || 0}</td>
        <td><strong>${Store.formatCurrency(u.totalSpent || 0)}</strong></td>
        <td><span class="status-pill status-${(u.role || '').toLowerCase() === 'super_admin' || (u.role || '').toLowerCase() === 'admin' ? 'shipped' : 'delivered'}">${u.role || 'CUSTOMER'}</span></td>
      </tr>
    `).join("");
  },

  // ----------------------------------------------------
  // CATEGORIES MANAGEMENT (REAL API DRIVEN)
  // ----------------------------------------------------
  async initCategoriesPage() {
    const tableBody = document.getElementById("admin-categories-table-body");
    const form = document.getElementById("add-category-form");

    const render = async () => {
      let cats = [];
      if (window.API && window.API.adminGetCategories) {
        const res = await window.API.adminGetCategories();
        cats = (res && res.categories) || [];
      } else {
        cats = Store.getCategories();
      }

      if (!tableBody) return;

      if (cats.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted" style="padding:2rem;">No categories configured.</td></tr>`;
        return;
      }

      const products = Store.getProducts();

      tableBody.innerHTML = cats.map(c => {
        const count = products.filter(p => p.category === c.slug || p.category === c.name || p.category === c.id).length;
        return `
          <tr>
            <td>
              <div style="display:flex; align-items:center; gap:0.8rem;">
                <img src="${c.image || ''}" alt="${c.name}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;" />
                <strong>${c.name}</strong>
              </div>
            </td>
            <td><code>${c.slug}</code></td>
            <td>${(c.description || '').slice(0, 45)}...</td>
            <td><strong>${count} SKUs</strong></td>
            <td>
              <button type="button" class="btn btn-outline btn-sm" style="color:var(--admin-danger);" onclick="AdminApp.deleteCategoryPrompt('${c.id}')">Delete</button>
            </td>
          </tr>
        `;
      }).join("");
    };

    await render();

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("cat-name").value.trim();
        const slug = document.getElementById("cat-slug").value.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const desc = document.getElementById("cat-desc").value.trim();
        const img = document.getElementById("cat-image").value.trim() || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80";

        if (window.API && window.API.adminSaveCategory) {
          const res = await window.API.adminSaveCategory({ name, slug, description: desc, image: img });
          if (res && res.success) {
            UI.showToast(`Category "${name}" saved!`, "success");
            form.reset();
            await render();
            return;
          }
        }
        Store.saveCategory({ name, slug, description: desc, image: img });
        UI.showToast(`Category "${name}" saved!`, "success");
        form.reset();
        await render();
      });
    }
  },

  async deleteCategoryPrompt(id) {
    if (confirm("Delete this category?")) {
      if (window.API && window.API.adminDeleteCategory) {
        await window.API.adminDeleteCategory(id);
      } else {
        Store.deleteCategory(id);
      }
      UI.showToast("Category removed", "info");
      await this.initCategoriesPage();
    }
  },

  // ----------------------------------------------------
  // COUPONS MANAGEMENT
  // ----------------------------------------------------
  initCouponsPage() {
    const tableBody = document.getElementById("admin-coupons-table-body");
    const form = document.getElementById("add-coupon-form");

    const render = () => {
      const coupons = Store.getCoupons();
      if (!tableBody) return;

      tableBody.innerHTML = coupons.map(c => `
        <tr>
          <td><strong><code>${c.code}</code></strong></td>
          <td>${c.discountType === 'percentage' ? `${c.discountValue}%` : Store.formatCurrency(c.discountValue)}</td>
          <td>${Store.formatCurrency(c.minOrder || 0)}</td>
          <td>${c.usedCount || 0} / ${c.usageLimit || '∞'}</td>
          <td>${c.expiryDate}</td>
          <td><span class="status-pill status-${c.active ? 'delivered' : 'cancelled'}">${c.active ? 'Active' : 'Disabled'}</span></td>
          <td>
            <button type="button" class="btn btn-outline btn-sm" style="color:var(--admin-danger);" onclick="AdminApp.deleteCouponPrompt('${c.id}')">Delete</button>
          </td>
        </tr>
      `).join("");
    };

    render();

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const code = document.getElementById("cp-code").value.trim().toUpperCase();
        const type = document.getElementById("cp-type").value;
        const val = parseFloat(document.getElementById("cp-val").value);
        const minOrder = parseFloat(document.getElementById("cp-min-order").value) || 0;
        const limit = parseInt(document.getElementById("cp-limit").value, 10) || 100;
        const expiry = document.getElementById("cp-expiry").value || "2027-12-31";

        Store.saveCoupon({
          code,
          discountType: type,
          discountValue: val,
          minOrder,
          usageLimit: limit,
          expiryDate: expiry,
          active: true,
          description: `${type === 'percentage' ? val + '%' : Store.formatCurrency(val)} discount`
        });

        UI.showToast(`Coupon "${code}" saved!`, "success");
        form.reset();
        render();
      });
    }
  },

  deleteCouponPrompt(id) {
    if (confirm("Delete this promotional coupon code?")) {
      Store.deleteCoupon(id);
      UI.showToast("Coupon removed", "info");
      this.initCouponsPage();
    }
  },

  // ----------------------------------------------------
  // SETTINGS & CREDENTIAL MANAGEMENT
  // ----------------------------------------------------
  initSettingsPage() {
    const form = document.getElementById("admin-settings-form");
    const resetBtn = document.getElementById("reset-demo-data-btn");

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Reset all local demo store cache state back to default?")) {
          Store.resetDemoData();
          UI.showToast("Demo data cache cleared!", "success");
        }
      });
    }

    if (form) {
      const settings = Store.getSettings();
      const adminEmailInput = document.getElementById("set-admin-email");
      if (adminEmailInput && settings.adminEmail) {
        adminEmailInput.value = settings.adminEmail;
      }

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const storeName = document.getElementById("set-store-name").value.trim();
        const adminEmail = adminEmailInput ? adminEmailInput.value.trim() : "";
        const taxRate = parseFloat(document.getElementById("set-tax-rate").value);
        const freeShip = parseFloat(document.getElementById("set-free-ship").value);
        const flatShip = parseFloat(document.getElementById("set-flat-ship").value);
        const announcement = document.getElementById("set-announcement").value.trim();

        Store.saveSettings({
          storeName,
          adminEmail,
          taxRate,
          freeShippingThreshold: freeShip,
          flatShippingRate: flatShip,
          announcementText: announcement
        });

        UI.showToast("Maison DeepFeel settings saved!", "success");
      });
    }

    // Unified Credentials Form Listener
    const credentialsForm = document.getElementById("admin-credentials-form");
    if (credentialsForm) {
      credentialsForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const currentPassword = (document.getElementById("cred-current-password")?.value || "").trim();
        const newEmail = (document.getElementById("cred-new-email")?.value || "").trim();
        const confirmEmail = (document.getElementById("cred-confirm-email")?.value || "").trim();
        const newPassword = document.getElementById("cred-new-password")?.value || "";
        const confirmPassword = document.getElementById("cred-confirm-password")?.value || "";

        if (!currentPassword) {
          UI.showToast("Current password is required to authorize changes.", "error");
          return;
        }

        if (newEmail) {
          if (newEmail.toLowerCase() !== confirmEmail.toLowerCase()) {
            UI.showToast("New email address and confirmation do not match.", "error");
            return;
          }
        }

        if (newPassword) {
          if (newPassword !== confirmPassword) {
            UI.showToast("New password and confirmation password do not match.", "error");
            return;
          }
          if (newPassword.length < 8) {
            UI.showToast("New password must be at least 8 characters long.", "error");
            return;
          }
        }

        if (!newEmail && !newPassword) {
          UI.showToast("Please enter a new email address or password to update.", "info");
          return;
        }

        let res = null;
        if (window.API && window.API.adminUpdateCredentials) {
          res = await window.API.adminUpdateCredentials({
            currentPassword,
            newEmail,
            confirmEmail,
            newPassword,
            confirmPassword
          });
        }

        if (res && res.success) {
          UI.showToast(res.message || "Credentials updated successfully!", "success");
          credentialsForm.reset();
          const updatedUser = res.user || (await Auth.fetchProfile());
          if (updatedUser) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
            const emailDisplayEl = document.getElementById("prof-email-display");
            const topbarEmailEl = document.getElementById("topbar-admin-email");
            if (emailDisplayEl) emailDisplayEl.innerText = updatedUser.email;
            if (topbarEmailEl) topbarEmailEl.innerText = updatedUser.email;
          }
          return;
        }

        if (res && (res.status === 401 || res.status === 400 || res.status === 409)) {
          UI.showToast(res.error || "Failed to update credentials.", "error");
          return;
        }

        // Fallback for standalone / static preview mode
        const currentUser = Auth.getCurrentUser() || { name: "Administrator", role: "SUPER_ADMIN" };
        if (newEmail) currentUser.email = newEmail.toLowerCase();
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));

        const emailDisplayEl = document.getElementById("prof-email-display");
        const topbarEmailEl = document.getElementById("topbar-admin-email");
        if (emailDisplayEl) emailDisplayEl.innerText = currentUser.email;
        if (topbarEmailEl) topbarEmailEl.innerText = currentUser.email;

        UI.showToast("Admin credentials saved successfully!", "success");
        credentialsForm.reset();
      });
    }
  },

  // ----------------------------------------------------
  // ADMIN PROFILE & CREDENTIAL TOGGLE
  // ----------------------------------------------------
  async initProfilePage() {
    const user = (await Auth.fetchProfile()) || { email: "admin@deepfeel.pk", name: "Administrator", role: "SUPER_ADMIN" };

    const displayNameEl = document.getElementById("prof-display-name");
    const emailDisplayEl = document.getElementById("prof-email-display");
    const roleDisplayEl = document.getElementById("prof-role-display");
    const topbarEmailEl = document.getElementById("topbar-admin-email");

    if (displayNameEl) displayNameEl.innerText = user.name || "Administrator";
    if (emailDisplayEl) emailDisplayEl.innerText = user.email || "admin@deepfeel.pk";
    if (roleDisplayEl) roleDisplayEl.innerText = (user.role || "SUPER_ADMIN").toUpperCase();
    if (topbarEmailEl) topbarEmailEl.innerText = user.email || "admin@deepfeel.pk";

    const btnToggleForm = document.getElementById("btn-toggle-credentials-form");
    const btnCancelForm = document.getElementById("btn-cancel-credentials-form");
    const credentialsCard = document.getElementById("profile-credentials-card");

    if (btnToggleForm && credentialsCard) {
      btnToggleForm.addEventListener("click", () => {
        credentialsCard.style.display = credentialsCard.style.display === "none" ? "block" : "none";
        if (credentialsCard.style.display === "block") {
          credentialsCard.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    if (btnCancelForm && credentialsCard) {
      btnCancelForm.addEventListener("click", () => {
        credentialsCard.style.display = "none";
      });
    }

    this.initSettingsPage();
  }
};


