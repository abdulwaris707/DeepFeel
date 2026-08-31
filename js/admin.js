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

    if (toggle && sidebar) {
      toggle.addEventListener("click", () => {
        const isOpen = sidebar.classList.toggle("open");
        backdrop.classList.toggle("active", isOpen);
      });

      backdrop.addEventListener("click", () => {
        sidebar.classList.remove("open");
        backdrop.classList.remove("active");
      });
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
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("admin-email").value;
        const password = document.getElementById("admin-password").value;

        const res = Auth.login(email, password);
        if (res.success && res.user.role === "admin") {
          window.location.href = "index.html";
        } else {
          UI.showToast("Invalid admin credentials. Use admin@deepfeel.pk / admin123", "error");
        }
      });
    }
  },

  // ----------------------------------------------------
  // EXECUTIVE DASHBOARD
  // ----------------------------------------------------
  initDashboard() {
    const orders = Store.getOrders();
    const products = Store.getProducts();
    const categories = Store.getCategories();

    // 1. KPI Metrics Calculation
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;
    const activeProducts = products.length;
    const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;

    const revEl = document.getElementById("metric-revenue");
    const ordersEl = document.getElementById("metric-orders");
    const prodsEl = document.getElementById("metric-products");
    const lowStockEl = document.getElementById("metric-low-stock");

    if (revEl) revEl.textContent = Store.formatCurrency(totalRevenue);
    if (ordersEl) ordersEl.textContent = totalOrders;
    if (prodsEl) prodsEl.textContent = activeProducts;
    if (lowStockEl) lowStockEl.textContent = lowStockCount;

    // 2. Render Revenue Canvas Chart
    this.renderRevenueChart();

    // 3. Render Olfactory Family Distribution Chart
    this.renderCategoryChart();

    // 4. Render Recent Orders Feed
    const recentOrdersBody = document.getElementById("dashboard-recent-orders-body");
    if (recentOrdersBody) {
      const recent = orders.slice(0, 5);
      if (recent.length === 0) {
        recentOrdersBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding:1.5rem;">No orders placed yet.</td></tr>`;
      } else {
        recentOrdersBody.innerHTML = recent.map(o => `
          <tr>
            <td><strong><a href="order-details.html?id=${o.id}">${o.id}</a></strong></td>
            <td>${o.customer.name}</td>
            <td>${new Date(o.createdAt).toLocaleDateString()}</td>
            <td><strong>$${o.total.toFixed(2)}</strong></td>
            <td><span class="status-pill status-${o.status.toLowerCase()}">${o.status}</span></td>
            <td><a href="order-details.html?id=${o.id}" class="btn btn-outline btn-sm">Process &rarr;</a></td>
          </tr>
        `).join("");
      }
    }

    // 5. Render Low Stock Action Card
    const lowStockBody = document.getElementById("dashboard-low-stock-body");
    if (lowStockBody) {
      const lowStockItems = products.filter(p => p.stock <= p.lowStockThreshold).slice(0, 5);
      if (lowStockItems.length === 0) {
        lowStockBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted" style="padding:1.5rem;">All fragrance flacons sufficiently stocked.</td></tr>`;
      } else {
        lowStockBody.innerHTML = lowStockItems.map(p => `
          <tr>
            <td>
              <div class="table-product-cell">
                <img src="${p.images[0]}" alt="${p.name}" class="table-product-thumb" />
                <div>
                  <div class="table-product-name">${p.name}</div>
                  <div class="table-product-sku">${p.sku}</div>
                </div>
              </div>
            </td>
            <td><span style="color:var(--color-error); font-weight:700;">${p.stock}</span></td>
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

  renderRevenueChart() {
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

    const points = [
      { label: "Mon", val: 1420 },
      { label: "Tue", val: 2180 },
      { label: "Wed", val: 1890 },
      { label: "Thu", val: 2840 },
      { label: "Fri", val: 3450 },
      { label: "Sat", val: 4120 },
      { label: "Sun", val: 3890 }
    ];

    const padding = { top: 30, right: 25, bottom: 35, left: 55 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const maxVal = 5000;
    const minVal = 0;

    // Grid lines
    ctx.strokeStyle = "#E7E2DA";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#8E8E93";
    ctx.font = "11px Inter, sans-serif";
    ctx.textAlign = "right";

    const gridSteps = 4;
    for (let i = 0; i <= gridSteps; i++) {
      const yVal = minVal + ((maxVal - minVal) / gridSteps) * i;
      const y = padding.top + chartH - (i / gridSteps) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
      ctx.fillText(`$${(yVal / 1000).toFixed(1)}k`, padding.left - 8, y + 4);
    }

    // Coordinates
    const coords = points.map((pt, i) => {
      const x = padding.left + (i / (points.length - 1)) * chartW;
      const y = padding.top + chartH - ((pt.val - minVal) / (maxVal - minVal)) * chartH;
      return { x, y, label: pt.label, val: pt.val };
    });

    // Area fill gradient
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    gradient.addColorStop(0, "rgba(163, 128, 91, 0.35)");
    gradient.addColorStop(1, "rgba(163, 128, 91, 0.0)");

    ctx.beginPath();
    ctx.moveTo(coords[0].x, padding.top + chartH);
    coords.forEach(c => ctx.lineTo(c.x, c.y));
    ctx.lineTo(coords[coords.length - 1].x, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Trend Line
    ctx.beginPath();
    ctx.strokeStyle = "#A3805B";
    ctx.lineWidth = 2.5;
    coords.forEach((c, idx) => {
      if (idx === 0) ctx.moveTo(c.x, c.y);
      else ctx.lineTo(c.x, c.y);
    });
    ctx.stroke();

    // Data points & X labels
    coords.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#A3805B";
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#52525B";
      ctx.textAlign = "center";
      ctx.font = "11px Inter, sans-serif";
      ctx.fillText(c.label, c.x, h - 10);
    });
  },

  renderCategoryChart() {
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

    const products = Store.getProducts();
    const familyCounts = {};
    products.forEach(p => {
      const fam = p.fragranceFamily || "Oriental";
      familyCounts[fam] = (familyCounts[fam] || 0) + 1;
    });

    const entries = Object.entries(familyCounts).map(([name, count]) => ({ name, count }));
    const maxCount = Math.max(...entries.map(e => e.count), 1);

    const padding = { top: 25, right: 35, bottom: 25, left: 110 };
    const chartW = w - padding.left - padding.right;
    const barHeight = 22;
    const gap = 12;

    entries.slice(0, 5).forEach((item, i) => {
      const y = padding.top + i * (barHeight + gap);
      const barW = (item.count / maxCount) * chartW;

      // Label
      ctx.fillStyle = "#18181B";
      ctx.font = "500 11px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(item.name.slice(0, 15), padding.left - 12, y + 15);

      // Track
      ctx.fillStyle = "#EBE5DB";
      ctx.beginPath();
      ctx.roundRect(padding.left, y, chartW, barHeight, 4);
      ctx.fill();

      // Active Bar
      ctx.fillStyle = i === 0 ? "#A3805B" : "#BBA082";
      ctx.beginPath();
      ctx.roundRect(padding.left, y, Math.max(12, barW), barHeight, 4);
      ctx.fill();

      // Value
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "600 10px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`${item.count} SKUs`, padding.left + 8, y + 15);
    });
  },

  quickRestock(productId, amount = 10) {
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
  // ORDERS PAGE
  // ----------------------------------------------------
  initOrdersPage() {
    const tableBody = document.getElementById("admin-orders-table-body");
    const searchInput = document.getElementById("admin-orders-search");
    const statusSelect = document.getElementById("admin-orders-status-filter");

    let filterStatus = "all";
    let searchQ = "";

    const render = () => {
      let orders = Store.getOrders();

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
            <div style="font-weight:600;">${o.customer.name}</div>
            <div class="text-muted" style="font-size:0.78rem;">${o.customer.email}</div>
          </td>
          <td>${new Date(o.createdAt).toLocaleDateString()}</td>
          <td>${o.items ? o.items.length : 1} flacon${o.items && o.items.length > 1 ? 's' : ''}</td>
          <td><strong>$${o.total.toFixed(2)}</strong></td>
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

    render();
  },

  updateOrderStatus(orderId, newStatus) {
    Store.updateOrderStatus(orderId, newStatus);
    UI.showToast(`Order ${orderId} status changed to "${newStatus}"`, "success");
  },

  // ----------------------------------------------------
  // ORDER DETAILS
  // ----------------------------------------------------
  initOrderDetailsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("id");
    const order = orderId ? Store.getOrderById(orderId) : Store.getOrders()[0];

    if (!order) {
      window.location.href = "orders.html";
      return;
    }

    if (document.getElementById("detail-order-id")) document.getElementById("detail-order-id").textContent = order.id;
    if (document.getElementById("detail-order-date")) document.getElementById("detail-order-date").textContent = new Date(order.createdAt).toLocaleString();
    if (document.getElementById("detail-cust-name")) document.getElementById("detail-cust-name").textContent = order.customer.name;
    if (document.getElementById("detail-cust-email")) document.getElementById("detail-cust-email").textContent = order.customer.email;
    if (document.getElementById("detail-cust-phone")) document.getElementById("detail-cust-phone").textContent = order.customer.phone || "N/A";
    if (document.getElementById("detail-shipping-address")) document.getElementById("detail-shipping-address").textContent = order.customer.address;
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
      statusSel.addEventListener("change", (e) => {
        AdminApp.updateOrderStatus(order.id, e.target.value);
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
                <div class="table-product-sku">${item.size || '50ml'} • ${item.variant || 'Flacon'}</div>
              </div>
            </div>
          </td>
          <td>$${item.price.toFixed(2)}</td>
          <td>${item.quantity}</td>
          <td><strong>$${(item.price * item.quantity).toFixed(2)}</strong></td>
        </tr>
      `).join("");
    }

    const timelineList = document.getElementById("detail-timeline-list");
    if (timelineList && order.timeline) {
      timelineList.innerHTML = order.timeline.map(t => `
        <li style="margin-bottom:0.8rem; list-style:none; display:flex; gap:0.6rem; align-items:flex-start;">
          <span style="color:var(--color-success); font-weight:700;">✓</span>
          <div>
            <strong>${t.status}</strong>
            <span class="text-muted" style="font-size:0.75rem; display:block;">${t.date}</span>
          </div>
        </li>
      `).join("");
    }
  },

  // ----------------------------------------------------
  // CUSTOMERS DIRECTORY
  // ----------------------------------------------------
  initCustomersPage() {
    const tableBody = document.getElementById("admin-customers-table-body");
    if (!tableBody) return;

    const users = Store.getUsers();
    tableBody.innerHTML = users.map(u => `
      <tr>
        <td><strong>${u.name}</strong></td>
        <td>${u.email}</td>
        <td>${u.phone || 'N/A'}</td>
        <td>${u.ordersCount || 0}</td>
        <td><strong>$${(u.totalSpent || 0).toFixed(2)}</strong></td>
        <td><span class="status-pill status-${u.role === 'admin' ? 'shipped' : 'delivered'}">${u.role}</span></td>
      </tr>
    `).join("");
  },

  // ----------------------------------------------------
  // CATEGORIES MANAGEMENT
  // ----------------------------------------------------
  initCategoriesPage() {
    const tableBody = document.getElementById("admin-categories-table-body");
    const form = document.getElementById("add-category-form");

    const render = () => {
      const cats = Store.getCategories();
      if (!tableBody) return;

      tableBody.innerHTML = cats.map(c => {
        const count = Store.getProducts({ category: c.slug }).length;
        return `
          <tr>
            <td>
              <div style="display:flex; align-items:center; gap:0.8rem;">
                <img src="${c.image}" alt="${c.name}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;" />
                <strong>${c.name}</strong>
              </div>
            </td>
            <td><code>${c.slug}</code></td>
            <td>${c.description.slice(0, 45)}...</td>
            <td><strong>${count} SKUs</strong></td>
            <td>
              <button type="button" class="btn btn-outline btn-sm" style="color:var(--color-error);" onclick="AdminApp.deleteCategoryPrompt('${c.id}')">Delete</button>
            </td>
          </tr>
        `;
      }).join("");
    };

    render();

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("cat-name").value.trim();
        const slug = document.getElementById("cat-slug").value.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const desc = document.getElementById("cat-desc").value.trim();
        const img = document.getElementById("cat-image").value.trim() || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80";

        Store.saveCategory({ name, slug, description: desc, image: img });
        UI.showToast(`Category "${name}" created!`, "success");
        form.reset();
        render();
      });
    }
  },

  deleteCategoryPrompt(id) {
    if (confirm("Delete this fragrance category?")) {
      Store.deleteCategory(id);
      UI.showToast("Category removed", "info");
      this.initCategoriesPage();
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
          <td>$${c.minOrder || 0}</td>
          <td>${c.usedCount || 0} / ${c.usageLimit || '∞'}</td>
          <td>${c.expiryDate}</td>
          <td><span class="status-pill status-${c.active ? 'delivered' : 'cancelled'}">${c.active ? 'Active' : 'Disabled'}</span></td>
          <td>
            <button type="button" class="btn btn-outline btn-sm" style="color:var(--color-error);" onclick="AdminApp.deleteCouponPrompt('${c.id}')">Delete</button>
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
          description: `${type === 'percentage' ? val + '%' : '$' + val} luxury fragrance discount`
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
  // SETTINGS & FACTORY RESET
  // ----------------------------------------------------
  initSettingsPage() {
    const form = document.getElementById("admin-settings-form");
    const resetBtn = document.getElementById("reset-demo-data-btn");

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Reset all perfume stock, orders, and demo accounts back to original factory state?")) {
          Store.resetDemoData();
          UI.showToast("Maison DeepFeel dataset has been reset to factory state!", "success");
        }
      });
    }

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const storeName = document.getElementById("set-store-name").value.trim();
        const taxRate = parseFloat(document.getElementById("set-tax-rate").value);
        const freeShip = parseFloat(document.getElementById("set-free-ship").value);
        const flatShip = parseFloat(document.getElementById("set-flat-ship").value);
        const announcement = document.getElementById("set-announcement").value.trim();

        Store.saveSettings({
          storeName,
          taxRate,
          freeShippingThreshold: freeShip,
          flatShippingRate: flatShip,
          announcementText: announcement
        });

        UI.showToast("Maison DeepFeel settings saved!", "success");
      });
    }
  }
};
