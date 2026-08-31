/**
 * DeepFeel - Admin Management Suite Controller
 * Powers executive dashboard charts, product CRUD, inventory manager, order workflows,
 * coupon manager, category manager, customer directory, and store settings.
 */

document.addEventListener("DOMContentLoaded", () => {
  AdminApp.init();
});

const AdminApp = {
  init() {
    // Check if on admin login page or protected admin pages
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
    // Mobile sidebar toggle
    const toggle = document.querySelector(".admin-mobile-toggle");
    const sidebar = document.querySelector(".admin-sidebar");
    if (toggle && sidebar) {
      toggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
      });
    }

    // Admin Logout
    const logoutBtn = document.getElementById("admin-logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        Auth.logout("../login.html");
      });
    }

    // Low stock badge in sidebar
    const lowStockCount = Store.getProducts().filter(p => p.stock <= p.lowStockThreshold).length;
    const invBadge = document.getElementById("sidebar-low-stock-badge");
    if (invBadge && lowStockCount > 0) {
      invBadge.textContent = lowStockCount;
      invBadge.style.display = "inline-block";
    }
  },

  // ----------------------------------------------------
  // ADMIN LOGIN PAGE
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
          UI.showToast("Admin credentials verified. Welcome to DeepFeel Command.", "success");
          setTimeout(() => {
            window.location.href = "index.html";
          }, 450);
        } else {
          UI.showToast("Invalid admin credentials. Use demo button above.", "error");
        }
      });
    }
  },

  // ----------------------------------------------------
  // ADMIN DASHBOARD
  // ----------------------------------------------------
  initDashboard() {
    const orders = Store.getOrders();
    const products = Store.getProducts();
    const customers = Store.getCustomers();

    // 1. Calculate Metrics
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);

    const revEl = document.getElementById("metric-revenue");
    const ordEl = document.getElementById("metric-orders");
    const prodEl = document.getElementById("metric-products");
    const custEl = document.getElementById("metric-customers");
    const lowStockEl = document.getElementById("metric-low-stock");

    if (revEl) revEl.textContent = Store.formatCurrency(totalRevenue);
    if (ordEl) ordEl.textContent = orders.length;
    if (prodEl) prodEl.textContent = products.length;
    if (custEl) custEl.textContent = customers.length;
    if (lowStockEl) lowStockEl.textContent = lowStockProducts.length;

    // 2. Render Charts (Native HTML5 Canvas)
    this.renderRevenueChart();
    this.renderSalesByCategoryChart();

    // 3. Recent Orders Feed
    const recentOrdersTable = document.getElementById("dashboard-recent-orders-body");
    if (recentOrdersTable) {
      recentOrdersTable.innerHTML = orders.slice(0, 5).map(o => `
        <tr>
          <td><strong>${o.id}</strong></td>
          <td>${o.customer.name}</td>
          <td>${Store.formatDate(o.createdAt)}</td>
          <td><strong>${Store.formatCurrency(o.total)}</strong></td>
          <td><span class="status-pill status-${o.status.toLowerCase()}">${o.status}</span></td>
          <td><a href="order-details.html?id=${o.id}" class="btn btn-outline btn-sm">Manage</a></td>
        </tr>
      `).join("");
    }

    // 4. Low Stock Alert Table
    const lowStockTable = document.getElementById("dashboard-low-stock-body");
    if (lowStockTable) {
      if (lowStockProducts.length === 0) {
        lowStockTable.innerHTML = `<tr><td colspan="4" class="text-muted text-center" style="padding: 1.5rem;">All inventory levels are healthy!</td></tr>`;
      } else {
        lowStockTable.innerHTML = lowStockProducts.slice(0, 5).map(p => `
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
            <td><strong style="color: ${p.stock === 0 ? 'var(--color-error)' : 'var(--color-warning)'}">${p.stock} units</strong></td>
            <td>${p.lowStockThreshold} units</td>
            <td>
              <button type="button" class="btn btn-primary btn-sm" onclick="AdminApp.quickRestock('${p.id}', 10)">+10 Restock</button>
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
    canvas.height = 240 * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = 240;
    const padding = { top: 30, right: 20, bottom: 40, left: 50 };

    const data = [
      { day: "Mon", rev: 1420 },
      { day: "Tue", rev: 2180 },
      { day: "Wed", rev: 1890 },
      { day: "Thu", rev: 2950 },
      { day: "Fri", rev: 3420 },
      { day: "Sat", rev: 4100 },
      { day: "Sun", rev: 3850 }
    ];

    const maxVal = 5000;
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Draw Grid Lines & Y-Axis Labels
    ctx.strokeStyle = "#E4DFD5";
    ctx.fillStyle = "#8E8E93";
    ctx.font = "11px Inter, sans-serif";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
      const yVal = (maxVal / 4) * i;
      const y = height - padding.bottom - (yVal / maxVal) * chartH;

      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillText(`$${yVal}`, 8, y + 4);
    }

    // Draw Smooth Area Gradient & Line
    const points = data.map((d, index) => ({
      x: padding.left + (index / (data.length - 1)) * chartW,
      y: height - padding.bottom - (d.rev / maxVal) * chartH,
      label: d.day,
      val: d.rev
    }));

    // Area Fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, "rgba(140, 109, 83, 0.35)");
    gradient.addColorStop(1, "rgba(140, 109, 83, 0.0)");

    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding.bottom);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line Stroke
    ctx.beginPath();
    ctx.strokeStyle = "#8C6D53";
    ctx.lineWidth = 3;
    points.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Points & X Labels
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.strokeStyle = "#8C6D53";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#52525B";
      ctx.textAlign = "center";
      ctx.fillText(p.label, p.x, height - 12);
    });
  },

  renderSalesByCategoryChart() {
    const canvas = document.getElementById("category-chart-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = 240 * dpr;
    ctx.scale(dpr, dpr);

    const categories = Store.getCategories();
    const width = rect.width;
    const height = 240;
    const padding = { top: 20, right: 20, bottom: 30, left: 100 };

    const chartW = width - padding.left - padding.right;
    const barHeight = 22;
    const gap = 16;
    const maxCount = Math.max(...categories.map(c => c.productCount), 8);

    categories.slice(0, 5).forEach((cat, i) => {
      const y = padding.top + i * (barHeight + gap);
      const barW = (cat.productCount / maxCount) * chartW;

      // Label
      ctx.fillStyle = "#18181B";
      ctx.font = "500 11px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(cat.name.slice(0, 14), padding.left - 12, y + 15);

      // Background Track
      ctx.fillStyle = "#E4DFD5";
      ctx.beginPath();
      ctx.roundRect(padding.left, y, chartW, barHeight, 4);
      ctx.fill();

      // Active Bar
      ctx.fillStyle = i === 0 ? "#8C6D53" : "#A47E5B";
      ctx.beginPath();
      ctx.roundRect(padding.left, y, Math.max(10, barW), barHeight, 4);
      ctx.fill();

      // Value text
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "600 10px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`${cat.productCount}`, padding.left + 8, y + 15);
    });
  },

  quickRestock(productId, amount = 10) {
    const product = Store.getProductById(productId);
    if (product) {
      Store.updateStock(productId, product.stock + amount);
      UI.showToast(`Added ${amount} units to "${product.name}"`, "success");
      this.initDashboard();
    }
  },

  // ----------------------------------------------------
  // ADMIN PRODUCTS MANAGEMENT (CRUD)
  // ----------------------------------------------------
  initProductsList() {
    const tableBody = document.getElementById("admin-products-table-body");
    const searchInput = document.getElementById("admin-product-search");
    const categorySelect = document.getElementById("admin-product-category-filter");
    const stockSelect = document.getElementById("admin-product-stock-filter");

    // Populate category dropdown
    if (categorySelect) {
      const categories = Store.getCategories();
      categorySelect.innerHTML = `
        <option value="all">All Categories</option>
        ${categories.map(c => `<option value="${c.slug}">${c.name}</option>`).join("")}
      `;
    }

    let filters = {
      search: "",
      category: "all",
      stockStatus: "all"
    };

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

      if (products.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding: 2.5rem;">No matching products found in inventory.</td></tr>`;
        return;
      }

      tableBody.innerHTML = products.map(p => `
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
          <td>${p.category}</td>
          <td>
            <strong>${Store.formatCurrency(p.price)}</strong>
            ${p.originalPrice > p.price ? `<span class="price-original" style="font-size: 0.8rem; margin-left: 4px;">${Store.formatCurrency(p.originalPrice)}</span>` : ''}
          </td>
          <td>
            <span class="stock-status-pill ${p.stock <= 0 ? 'out-stock' : (p.stock <= p.lowStockThreshold ? 'low-stock' : 'in-stock')}">
              ${p.stock} units
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
            <div style="display: flex; gap: 0.4rem;">
              <a href="product-form.html?id=${p.id}" class="btn btn-outline btn-sm">Edit</a>
              <button type="button" class="btn btn-outline btn-sm" style="color: var(--color-error);" onclick="AdminApp.deleteProductPrompt('${p.id}')">Delete</button>
            </div>
          </td>
        </tr>
      `).join("");
    };

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        filters.search = e.target.value;
        render();
      });
    }

    if (categorySelect) {
      categorySelect.addEventListener("change", (e) => {
        filters.category = e.target.value;
        render();
      });
    }

    if (stockSelect) {
      stockSelect.addEventListener("change", (e) => {
        filters.stockStatus = e.target.value;
        render();
      });
    }

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
      UI.showToast("Product deleted from catalog", "info");
      this.initProductsList();
    }
  },

  // ----------------------------------------------------
  // ADD / EDIT PRODUCT FORM
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

    // Populate categories
    if (categorySelect) {
      const categories = Store.getCategories();
      categorySelect.innerHTML = categories.map(c => `
        <option value="${c.name}" data-slug="${c.slug}">${c.name}</option>
      `).join("");
    }

    if (pageTitle) pageTitle.textContent = isEdit ? "Edit Product" : "Add New Product";

    // If edit mode, load product data
    if (isEdit) {
      const product = Store.getProductById(productId);
      if (product) {
        document.getElementById("prod-name").value = product.name;
        document.getElementById("prod-sku").value = product.sku;
        document.getElementById("prod-price").value = product.price;
        document.getElementById("prod-orig-price").value = product.originalPrice || product.price;
        document.getElementById("prod-stock").value = product.stock;
        document.getElementById("prod-threshold").value = product.lowStockThreshold || 10;
        document.getElementById("prod-short-desc").value = product.shortDescription || "";
        document.getElementById("prod-full-desc").value = product.description || "";
        document.getElementById("prod-featured").checked = Boolean(product.featured);
        document.getElementById("prod-bestseller").checked = Boolean(product.bestseller);
        document.getElementById("prod-new").checked = Boolean(product.isNew);
        if (categorySelect) categorySelect.value = product.category;

        if (product.images && product.images.length > 0) {
          imageInput.value = product.images[0];
          imagePreview.innerHTML = `<img src="${product.images[0]}" alt="Preview" />`;
        }
      }
    }

    if (imageInput && imagePreview) {
      imageInput.addEventListener("input", (e) => {
        const url = e.target.value.trim();
        if (url) {
          imagePreview.innerHTML = `<img src="${url}" alt="Preview" onerror="this.src='https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80'" />`;
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

        const imageUrl = imageInput.value.trim() || "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80";

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
          status: stock > 0 ? "active" : "draft",
          images: [imageUrl]
        };

        if (isEdit) {
          productData.id = productId;
        }

        Store.saveProduct(productData);
        UI.showToast(`Product "${name}" saved successfully!`, "success");

        setTimeout(() => {
          window.location.href = "products.html";
        }, 500);
      });
    }
  },

  // ----------------------------------------------------
  // DEDICATED INVENTORY MANAGEMENT
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
            statusHtml = '<span class="status-pill status-pending">Low Stock Alert</span>';
          }

          return `
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
              <td>${p.category}</td>
              <td><strong>${p.stock}</strong></td>
              <td>${p.lowStockThreshold}</td>
              <td>${Store.formatCurrency(p.stock * p.price)}</td>
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

    const val = prompt(`Enter exact stock count for "${product.name}":`, product.stock);
    if (val !== null && !isNaN(parseInt(val, 10))) {
      const newStock = Math.max(0, parseInt(val, 10));
      Store.updateStock(productId, newStock);
      UI.showToast(`Stock updated to ${newStock}`, "success");
      this.initInventoryPage();
    }
  },

  // ----------------------------------------------------
  // ADMIN ORDERS & STATUS WORKFLOW
  // ----------------------------------------------------
  initOrdersPage() {
    const tableBody = document.getElementById("admin-orders-table-body");
    const searchInput = document.getElementById("admin-orders-search");
    const statusSelect = document.getElementById("admin-orders-status-filter");

    let filterStatus = "all";
    let searchQ = "";

    const render = () => {
      const orders = Store.getOrders({
        status: filterStatus,
        search: searchQ
      });

      if (orders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding: 2rem;">No orders match the selected filter.</td></tr>`;
        return;
      }

      tableBody.innerHTML = orders.map(o => `
        <tr>
          <td><strong>${o.id}</strong></td>
          <td>
            <div style="font-weight: 600;">${o.customer.name}</div>
            <div class="text-muted" style="font-size: 0.78rem;">${o.customer.email}</div>
          </td>
          <td>${Store.formatDate(o.createdAt)}</td>
          <td>${o.items.length} items</td>
          <td><strong>${Store.formatCurrency(o.total)}</strong></td>
          <td>
            <select class="admin-select" style="padding: 0.25rem 0.6rem; font-size: 0.8rem;" onchange="AdminApp.changeOrderStatus('${o.id}', this.value)">
              <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
              <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
              <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
              <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td>
            <a href="order-details.html?id=${o.id}" class="btn btn-outline btn-sm">View Details</a>
          </td>
        </tr>
      `).join("");
    };

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQ = e.target.value;
        render();
      });
    }

    if (statusSelect) {
      statusSelect.addEventListener("change", (e) => {
        filterStatus = e.target.value;
        render();
      });
    }

    render();
  },

  changeOrderStatus(orderId, newStatus) {
    Store.updateOrderStatus(orderId, newStatus);
    UI.showToast(`Order ${orderId} status changed to ${newStatus}`, "success");
  },

  initOrderDetailsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("id");
    const order = orderId ? Store.getOrderById(orderId) : Store.getOrders()[0];

    if (!order) {
      window.location.href = "orders.html";
      return;
    }

    document.getElementById("detail-order-id").textContent = order.id;
    document.getElementById("detail-order-date").textContent = Store.formatDate(order.createdAt);
    document.getElementById("detail-cust-name").textContent = order.customer.name;
    document.getElementById("detail-cust-email").textContent = order.customer.email;
    document.getElementById("detail-cust-phone").textContent = order.customer.phone || "N/A";
    document.getElementById("detail-shipping-address").textContent = order.customer.address;
    document.getElementById("detail-payment-method").textContent = order.paymentMethod;
    document.getElementById("detail-payment-status").textContent = order.paymentStatus;

    // Subtotals breakdown
    document.getElementById("detail-subtotal").textContent = Store.formatCurrency(order.subtotal);
    document.getElementById("detail-discount").textContent = `-${Store.formatCurrency(order.discount || 0)}`;
    document.getElementById("detail-shipping").textContent = Store.formatCurrency(order.shipping || 0);
    document.getElementById("detail-tax").textContent = Store.formatCurrency(order.tax || 0);
    document.getElementById("detail-total").textContent = Store.formatCurrency(order.total);

    // Items list
    const itemsTable = document.getElementById("detail-items-table-body");
    if (itemsTable) {
      itemsTable.innerHTML = order.items.map(item => `
        <tr>
          <td>
            <div class="table-product-cell">
              <img src="${item.image}" alt="${item.name}" class="table-product-thumb" />
              <div>
                <div class="table-product-name">${item.name}</div>
                ${item.variant ? `<div class="text-muted" style="font-size: 0.78rem;">${item.variant}</div>` : ''}
              </div>
            </div>
          </td>
          <td>${Store.formatCurrency(item.price)}</td>
          <td>${item.quantity}</td>
          <td><strong>${Store.formatCurrency(item.price * item.quantity)}</strong></td>
        </tr>
      `).join("");
    }

    // Status Selector
    const statusSelect = document.getElementById("detail-status-select");
    if (statusSelect) {
      statusSelect.value = order.status;
      statusSelect.addEventListener("change", (e) => {
        Store.updateOrderStatus(order.id, e.target.value);
        UI.showToast(`Order status updated to ${e.target.value}`, "success");
        this.initOrderDetailsPage();
      });
    }

    // Timeline Log
    const timelineList = document.getElementById("detail-timeline-list");
    if (timelineList && order.timeline) {
      timelineList.innerHTML = order.timeline.map(t => `
        <li style="margin-bottom: 0.8rem; font-size: 0.88rem;">
          <strong>${t.status}</strong> — <span class="text-muted">${t.date}</span>
        </li>
      `).join("");
    }
  },

  // ----------------------------------------------------
  // CUSTOMERS DIRECTORY
  // ----------------------------------------------------
  initCustomersPage() {
    const tableBody = document.getElementById("admin-customers-table-body");
    const customers = Store.getCustomers();

    if (tableBody) {
      tableBody.innerHTML = customers.map(c => `
        <tr>
          <td>
            <div style="font-weight: 600;">${c.name}</div>
            <div class="text-muted" style="font-size: 0.8rem;">Registered: ${Store.formatDate(c.createdAt)}</div>
          </td>
          <td>${c.email}</td>
          <td>${c.phone || '+1 (555) 000-0000'}</td>
          <td><strong>${c.ordersCount}</strong></td>
          <td><strong>${Store.formatCurrency(c.totalSpent)}</strong></td>
          <td><span class="status-pill status-delivered">Active</span></td>
        </tr>
      `).join("");
    }
  },

  // ----------------------------------------------------
  // CATEGORIES MANAGEMENT
  // ----------------------------------------------------
  initCategoriesPage() {
    const tableBody = document.getElementById("admin-categories-table-body");
    const form = document.getElementById("add-category-form");

    const render = () => {
      const categories = Store.getCategories();
      if (tableBody) {
        tableBody.innerHTML = categories.map(cat => `
          <tr>
            <td>
              <div class="table-product-cell">
                <img src="${cat.image}" alt="${cat.name}" class="table-product-thumb" />
                <strong>${cat.name}</strong>
              </div>
            </td>
            <td><code>${cat.slug}</code></td>
            <td>${cat.description || "N/A"}</td>
            <td><strong>${cat.productCount}</strong></td>
            <td>
              <button type="button" class="btn btn-outline btn-sm" style="color: var(--color-error);" onclick="AdminApp.deleteCategoryPrompt('${cat.id}')">Delete</button>
            </td>
          </tr>
        `).join("");
      }
    };

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("cat-name").value.trim();
        const slug = document.getElementById("cat-slug").value.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const desc = document.getElementById("cat-desc").value.trim();
        const image = document.getElementById("cat-image").value.trim() || "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80";

        Store.saveCategory({
          name,
          slug,
          description: desc,
          image,
          featured: true
        });

        UI.showToast(`Category "${name}" created successfully!`, "success");
        form.reset();
        render();
      });
    }

    render();
  },

  deleteCategoryPrompt(catId) {
    if (confirm("Delete this category? Products in this category will remain.")) {
      Store.deleteCategory(catId);
      UI.showToast("Category removed.", "info");
      this.initCategoriesPage();
    }
  },

  // ----------------------------------------------------
  // COUPONS ENGINE
  // ----------------------------------------------------
  initCouponsPage() {
    const tableBody = document.getElementById("admin-coupons-table-body");
    const form = document.getElementById("add-coupon-form");

    const render = () => {
      const coupons = Store.getCoupons();
      if (tableBody) {
        tableBody.innerHTML = coupons.map(cp => `
          <tr>
            <td><strong><code>${cp.code}</code></strong></td>
            <td>${cp.discountType === 'percentage' ? `${cp.discountValue}% Off` : `$${cp.discountValue} Off`}</td>
            <td>${Store.formatCurrency(cp.minOrder || 0)}</td>
            <td>${cp.usedCount || 0} / ${cp.usageLimit || '∞'}</td>
            <td>${cp.expiryDate || 'Never'}</td>
            <td>
              <label class="switch-toggle">
                <input type="checkbox" ${cp.active ? 'checked' : ''} onchange="AdminApp.toggleCouponActive('${cp.id}', this.checked)">
                <span class="switch-slider"></span>
              </label>
            </td>
            <td>
              <button type="button" class="btn btn-outline btn-sm" style="color: var(--color-error);" onclick="AdminApp.deleteCouponPrompt('${cp.id}')">Delete</button>
            </td>
          </tr>
        `).join("");
      }
    };

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const code = document.getElementById("cp-code").value.trim().toUpperCase();
        const type = document.getElementById("cp-type").value;
        const val = parseFloat(document.getElementById("cp-val").value);
        const minOrder = parseFloat(document.getElementById("cp-min-order").value) || 0;
        const limit = parseInt(document.getElementById("cp-limit").value, 10) || 500;
        const expiry = document.getElementById("cp-expiry").value || "2027-12-31";

        Store.saveCoupon({
          code,
          discountType: type,
          discountValue: val,
          minOrder,
          usageLimit: limit,
          expiryDate: expiry,
          active: true
        });

        UI.showToast(`Coupon "${code}" created successfully!`, "success");
        form.reset();
        render();
      });
    }

    render();
  },

  toggleCouponActive(couponId, active) {
    const coupons = Store.getCoupons();
    const cp = coupons.find(c => c.id === couponId);
    if (cp) {
      cp.active = active;
      Store.saveCoupon(cp);
      UI.showToast(`Coupon ${cp.code} is now ${active ? 'Active' : 'Deactivated'}`, "info");
    }
  },

  deleteCouponPrompt(couponId) {
    if (confirm("Delete this coupon?")) {
      Store.deleteCoupon(couponId);
      UI.showToast("Coupon deleted.", "info");
      this.initCouponsPage();
    }
  },

  // ----------------------------------------------------
  // STORE SETTINGS & DEMO RESET
  // ----------------------------------------------------
  initSettingsPage() {
    const form = document.getElementById("admin-settings-form");
    const resetBtn = document.getElementById("reset-demo-data-btn");

    const settings = Store.getSettings();

    if (form) {
      document.getElementById("set-store-name").value = settings.storeName || "DeepFeel";
      document.getElementById("set-currency").value = settings.currencySymbol || "$";
      document.getElementById("set-tax-rate").value = settings.taxRate || 8.0;
      document.getElementById("set-free-ship").value = settings.freeShippingThreshold || 100;
      document.getElementById("set-flat-ship").value = settings.flatShippingRate || 10;
      document.getElementById("set-announcement").value = settings.announcementText || "";

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        Store.saveSettings({
          storeName: document.getElementById("set-store-name").value.trim(),
          currencySymbol: document.getElementById("set-currency").value.trim(),
          taxRate: parseFloat(document.getElementById("set-tax-rate").value),
          freeShippingThreshold: parseFloat(document.getElementById("set-free-ship").value),
          flatShippingRate: parseFloat(document.getElementById("set-flat-ship").value),
          announcementText: document.getElementById("set-announcement").value.trim()
        });
        UI.showToast("Store settings saved successfully!", "success");
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Reset all store data, orders, products, and inventory back to factory seed demo values? This will erase custom additions.")) {
          Store.resetDemoData();
          UI.showToast("Demo data reloaded to initial factory state.", "success");
          setTimeout(() => window.location.reload(), 600);
        }
      });
    }
  }
};
