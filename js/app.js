/**
 * DeepFeel - Storefront Application Controller
 * Handles page initialization, shop filtering/sorting, product detail view & zoom,
 * cart & checkout workflows, account dashboard, and reviews.
 */

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

const App = {
  init() {
    this.initHeader();
    this.initAnnouncement();

    // Determine current page and initialize specific controllers
    const path = window.location.pathname.toLowerCase();
    
    if (path.endsWith("index.html") || path.endsWith("/") || path.endsWith("deepfeel") || path.endsWith("deepfeel/")) {
      this.initHomePage();
    } else if (path.includes("shop.html")) {
      this.initShopPage();
    } else if (path.includes("product.html")) {
      this.initProductDetailPage();
    } else if (path.includes("categories.html")) {
      this.initCategoriesPage();
    } else if (path.includes("cart.html")) {
      this.initCartPage();
    } else if (path.includes("checkout.html")) {
      this.initCheckoutPage();
    } else if (path.includes("order-confirmation.html")) {
      this.initOrderConfirmationPage();
    } else if (path.includes("wishlist.html")) {
      this.initWishlistPage();
    } else if (path.includes("account.html")) {
      this.initAccountPage();
    } else if (path.includes("orders.html")) {
      this.initCustomerOrdersPage();
    } else if (path.includes("faq.html")) {
      this.initFAQPage();
    } else if (path.includes("contact.html")) {
      this.initContactPage();
    } else if (path.includes("login.html")) {
      this.initLoginPage();
    } else if (path.includes("register.html")) {
      this.initRegisterPage();
    }
  },

  // ----------------------------------------------------
  // HEADER & ANNOUNCEMENT
  // ----------------------------------------------------
  initAnnouncement() {
    const bar = document.querySelector(".announcement-bar-text");
    if (bar) {
      const settings = Store.getSettings();
      if (settings.announcementText) {
        bar.textContent = settings.announcementText;
      }
    }
  },

  initHeader() {
    const header = document.querySelector(".site-header");
    if (header) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      });
    }

    // Render user profile link or login in header
    const user = Auth.getCurrentUser();
    const accountLinks = document.querySelectorAll(".header-account-link");
    accountLinks.forEach(link => {
      if (user) {
        link.setAttribute("href", user.role === "admin" ? "admin/index.html" : "account.html");
        link.setAttribute("title", `Signed in as ${user.name}`);
      } else {
        link.setAttribute("href", "login.html");
        link.setAttribute("title", "Sign In");
      }
    });
  },

  // ----------------------------------------------------
  // HOME PAGE CONTROLLER
  // ----------------------------------------------------
  initHomePage() {
    // 1. Featured Categories
    const catContainer = document.getElementById("featured-categories-grid");
    if (catContainer) {
      const categories = Store.getCategories();
      catContainer.innerHTML = categories.map(cat => `
        <a href="shop.html?category=${cat.slug}" class="category-card">
          <img src="${cat.image}" alt="${cat.name}" class="category-card-image" loading="lazy" />
          <div class="category-card-overlay">
            <h3 class="category-card-title">${cat.name}</h3>
            <span class="category-card-count">${cat.productCount} Items</span>
          </div>
        </a>
      `).join("");
    }

    // 2. Featured Products (Curated selection)
    const featuredContainer = document.getElementById("featured-products-grid");
    if (featuredContainer) {
      const featuredProducts = Store.getProducts({ featured: true }).slice(0, 4);
      featuredContainer.innerHTML = featuredProducts.map(p => UI.renderProductCard(p)).join("");
    }

    // 3. New Arrivals Grid
    const newArrivalsContainer = document.getElementById("new-arrivals-grid");
    if (newArrivalsContainer) {
      const newProducts = Store.getProducts({ isNew: true }).slice(0, 4);
      newArrivalsContainer.innerHTML = newProducts.map(p => UI.renderProductCard(p)).join("");
    }

    // 4. Best Sellers Grid
    const bestSellersContainer = document.getElementById("bestsellers-grid");
    if (bestSellersContainer) {
      const bestSellers = Store.getProducts({ bestseller: true }).slice(0, 4);
      bestSellersContainer.innerHTML = bestSellers.map(p => UI.renderProductCard(p)).join("");
    }

    // 5. Newsletter Form
    const newsletterForm = document.getElementById("newsletter-form");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector("input[type='email']").value;
        if (email) {
          UI.showToast("Thank you for subscribing to DeepFeel Chronicles.", "success");
          newsletterForm.reset();
        }
      });
    }
  },

  // ----------------------------------------------------
  // SHOP PAGE CONTROLLER
  // ----------------------------------------------------
  initShopPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get("category") || "all";
    const initialSearch = urlParams.get("search") || "";
    const initialSort = urlParams.get("sort") || "featured";

    let state = {
      category: initialCategory,
      search: initialSearch,
      sortBy: initialSort,
      minPrice: null,
      maxPrice: 300,
      minRating: null,
      inStockOnly: false,
      currentPage: 1,
      itemsPerPage: 9
    };

    const productGrid = document.getElementById("shop-products-grid");
    const countDisplay = document.getElementById("shop-product-count");
    const sortSelect = document.getElementById("shop-sort-select");
    const searchInput = document.getElementById("shop-search-input");
    const priceSlider = document.getElementById("price-range-slider");
    const priceDisplay = document.getElementById("price-max-display");
    const paginationContainer = document.getElementById("shop-pagination");

    // Populate category filter options in sidebar
    const categoryFilterList = document.getElementById("category-filter-list");
    if (categoryFilterList) {
      const categories = Store.getCategories();
      const allCount = Store.getProducts().length;

      categoryFilterList.innerHTML = `
        <li>
          <label class="filter-checkbox-label">
            <input type="radio" name="shop-category" value="all" ${state.category === "all" ? "checked" : ""}>
            <span>All Collections</span>
            <span class="filter-count">(${allCount})</span>
          </label>
        </li>
        ${categories.map(c => `
          <li>
            <label class="filter-checkbox-label">
              <input type="radio" name="shop-category" value="${c.slug}" ${state.category === c.slug ? "checked" : ""}>
              <span>${c.name}</span>
              <span class="filter-count">(${c.productCount})</span>
            </label>
          </li>
        `).join("")}
      `;

      categoryFilterList.addEventListener("change", (e) => {
        state.category = e.target.value;
        state.currentPage = 1;
        render();
      });
    }

    // Rating filters
    document.querySelectorAll("input[name='shop-rating']").forEach(radio => {
      radio.addEventListener("change", (e) => {
        state.minRating = e.target.value ? Number(e.target.value) : null;
        state.currentPage = 1;
        render();
      });
    });

    // In stock filter
    const inStockCheckbox = document.getElementById("in-stock-filter");
    if (inStockCheckbox) {
      inStockCheckbox.addEventListener("change", (e) => {
        state.inStockOnly = e.target.checked;
        state.currentPage = 1;
        render();
      });
    }

    // Sort select
    if (sortSelect) {
      sortSelect.value = state.sortBy;
      sortSelect.addEventListener("change", (e) => {
        state.sortBy = e.target.value;
        render();
      });
    }

    // Search input
    if (searchInput) {
      searchInput.value = state.search;
      let debounce;
      searchInput.addEventListener("input", (e) => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          state.search = e.target.value;
          state.currentPage = 1;
          render();
        }, 250);
      });
    }

    // Price slider
    if (priceSlider) {
      priceSlider.addEventListener("input", (e) => {
        state.maxPrice = Number(e.target.value);
        if (priceDisplay) priceDisplay.textContent = `$${state.maxPrice}`;
        state.currentPage = 1;
        render();
      });
    }

    // Mobile filter drawer toggle
    const mobileFilterBtn = document.getElementById("mobile-filter-trigger");
    const mobileFilterClose = document.getElementById("mobile-filter-close");
    const sidebar = document.querySelector(".shop-sidebar");
    
    if (mobileFilterBtn && sidebar) {
      mobileFilterBtn.addEventListener("click", () => {
        sidebar.classList.toggle("mobile-open");
      });
    }
    if (mobileFilterClose && sidebar) {
      mobileFilterClose.addEventListener("click", () => {
        sidebar.classList.remove("mobile-open");
      });
    }

    // Master render function
    const render = () => {
      const allFiltered = Store.getProducts({
        category: state.category,
        search: state.search,
        sortBy: state.sortBy,
        maxPrice: state.maxPrice,
        minRating: state.minRating,
        inStockOnly: state.inStockOnly
      });

      if (countDisplay) {
        countDisplay.textContent = `Showing ${allFiltered.length} products`;
      }

      if (allFiltered.length === 0) {
        productGrid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3 class="empty-state-title">No products match your criteria</h3>
            <p class="empty-state-desc">Try resetting your price slider, adjusting rating filters, or searching for broader terms.</p>
            <button type="button" class="btn btn-outline" id="reset-filters-btn">Clear All Filters</button>
          </div>
        `;
        const resetBtn = document.getElementById("reset-filters-btn");
        if (resetBtn) {
          resetBtn.addEventListener("click", () => {
            state.category = "all";
            state.search = "";
            state.minRating = null;
            state.maxPrice = 300;
            state.inStockOnly = false;
            if (searchInput) searchInput.value = "";
            if (priceSlider) priceSlider.value = 300;
            if (priceDisplay) priceDisplay.textContent = "$300";
            document.querySelectorAll("input[name='shop-category']")[0].checked = true;
            document.querySelectorAll("input[name='shop-rating']")[0].checked = true;
            if (inStockCheckbox) inStockCheckbox.checked = false;
            render();
          });
        }
        if (paginationContainer) paginationContainer.innerHTML = "";
        return;
      }

      // Pagination slice
      const totalPages = Math.ceil(allFiltered.length / state.itemsPerPage);
      const startIndex = (state.currentPage - 1) * state.itemsPerPage;
      const paginated = allFiltered.slice(startIndex, startIndex + state.itemsPerPage);

      productGrid.innerHTML = paginated.map(p => UI.renderProductCard(p)).join("");

      // Render Pagination Buttons
      if (paginationContainer) {
        if (totalPages <= 1) {
          paginationContainer.innerHTML = "";
        } else {
          let pagesHtml = "";
          for (let i = 1; i <= totalPages; i++) {
            pagesHtml += `
              <button type="button" class="page-btn ${i === state.currentPage ? 'active' : ''}" data-page="${i}">
                ${i}
              </button>
            `;
          }
          paginationContainer.innerHTML = pagesHtml;

          paginationContainer.querySelectorAll(".page-btn").forEach(btn => {
            btn.addEventListener("click", () => {
              state.currentPage = Number(btn.getAttribute("data-page"));
              render();
              window.scrollTo({ top: 180, behavior: "smooth" });
            });
          });
        }
      }
    };

    render();
  },

  // ----------------------------------------------------
  // PRODUCT DETAIL PAGE CONTROLLER
  // ----------------------------------------------------
  initProductDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id") || "df_001";
    const product = Store.getProductById(productId);

    if (!product) {
      const container = document.getElementById("pdp-container");
      if (container) {
        container.innerHTML = `
          <div class="empty-state">
            <h2 class="empty-state-title">Product Not Found</h2>
            <p class="empty-state-desc">The product you are looking for does not exist or has been retired.</p>
            <a href="shop.html" class="btn btn-primary">Return to Catalog</a>
          </div>
        `;
      }
      return;
    }

    // Save to recently viewed
    Store.addRecentlyViewed(product.id);

    // Update document title
    document.title = `${product.name} — DeepFeel`;

    // Populate Breadcrumbs
    const bcCat = document.getElementById("breadcrumb-category");
    const bcProd = document.getElementById("breadcrumb-product");
    if (bcCat) {
      bcCat.textContent = product.category;
      bcCat.href = `shop.html?category=${product.categorySlug}`;
    }
    if (bcProd) {
      bcProd.textContent = product.name;
    }

    // Main Gallery & Thumbnails
    const mainImg = document.getElementById("pdp-main-img");
    const mainImgContainer = document.getElementById("pdp-gallery-main");
    const thumbsContainer = document.getElementById("pdp-thumbs-container");

    if (mainImg && product.images && product.images.length > 0) {
      mainImg.src = product.images[0];
      mainImg.alt = product.name;

      if (thumbsContainer) {
        thumbsContainer.innerHTML = product.images.map((img, i) => `
          <button type="button" class="pdp-thumb-btn ${i === 0 ? 'active' : ''}" data-img-src="${img}">
            <img src="${img}" alt="${product.name} view ${i+1}" />
          </button>
        `).join("");

        thumbsContainer.querySelectorAll(".pdp-thumb-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            thumbsContainer.querySelectorAll(".pdp-thumb-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            mainImg.src = btn.getAttribute("data-img-src");
          });
        });
      }

      // Vanilla JS Image Zoom on hover
      if (mainImgContainer) {
        mainImgContainer.addEventListener("mousemove", (e) => {
          const rect = mainImgContainer.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          mainImg.style.transformOrigin = `${x}% ${y}%`;
          mainImg.style.transform = "scale(1.75)";
        });

        mainImgContainer.addEventListener("mouseleave", () => {
          mainImg.style.transformOrigin = "center center";
          mainImg.style.transform = "scale(1)";
        });
      }
    }

    // Populate Details
    const titleEl = document.getElementById("pdp-title");
    const categoryEl = document.getElementById("pdp-category");
    const ratingEl = document.getElementById("pdp-rating");
    const priceEl = document.getElementById("pdp-price");
    const originalPriceEl = document.getElementById("pdp-original-price");
    const descEl = document.getElementById("pdp-short-desc");
    const fullDescEl = document.getElementById("pdp-full-desc");
    const stockPill = document.getElementById("pdp-stock-status");
    const skuEl = document.getElementById("pdp-sku");

    if (titleEl) titleEl.textContent = product.name;
    if (categoryEl) categoryEl.textContent = product.category;
    if (descEl) descEl.textContent = product.shortDescription || product.description;
    if (fullDescEl) fullDescEl.textContent = product.description;
    if (skuEl) skuEl.textContent = `SKU: ${product.sku || 'DF-EST-01'}`;

    if (ratingEl) {
      ratingEl.innerHTML = `
        ${UI.renderStars(product.rating || 5)}
        <span class="review-count">(${product.reviewCount || 0} reviews)</span>
      `;
    }

    if (priceEl) priceEl.textContent = Store.formatCurrency(product.price);
    if (originalPriceEl) {
      if (product.originalPrice && product.originalPrice > product.price) {
        originalPriceEl.textContent = Store.formatCurrency(product.originalPrice);
        originalPriceEl.style.display = "inline";
      } else {
        originalPriceEl.style.display = "none";
      }
    }

    if (stockPill) {
      if (product.stock <= 0) {
        stockPill.className = "stock-status-pill out-stock";
        stockPill.textContent = "Out of Stock";
      } else if (product.stock <= 10) {
        stockPill.className = "stock-status-pill low-stock";
        stockPill.textContent = `Low Stock: Only ${product.stock} left`;
      } else {
        stockPill.className = "stock-status-pill in-stock";
        stockPill.textContent = "In Stock & Ready to Ship";
      }
    }

    // Populate Variant Options
    const variantsContainer = document.getElementById("pdp-variants-container");
    if (variantsContainer && product.variants) {
      let variantsHtml = "";
      if (product.variants.colors) {
        variantsHtml += `
          <div class="variant-group">
            <label class="variant-label">Color / Finish:</label>
            <div class="variant-options">
              ${product.variants.colors.map((c, i) => `
                <button type="button" class="variant-chip ${i === 0 ? 'selected' : ''}" data-variant-type="color" data-variant-val="${c}">
                  ${c}
                </button>
              `).join("")}
            </div>
          </div>
        `;
      }
      if (product.variants.sizes) {
        variantsHtml += `
          <div class="variant-group">
            <label class="variant-label">Size / Configuration:</label>
            <div class="variant-options">
              ${product.variants.sizes.map((s, i) => `
                <button type="button" class="variant-chip ${i === 0 ? 'selected' : ''}" data-variant-type="size" data-variant-val="${s}">
                  ${s}
                </button>
              `).join("")}
            </div>
          </div>
        `;
      }
      variantsContainer.innerHTML = variantsHtml;

      variantsContainer.querySelectorAll(".variant-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          const parent = chip.parentElement;
          parent.querySelectorAll(".variant-chip").forEach(c => c.classList.remove("selected"));
          chip.classList.add("selected");
        });
      });
    }

    // Quantity selector
    const qtyInput = document.getElementById("pdp-qty-input");
    const qtyMinus = document.getElementById("pdp-qty-minus");
    const qtyPlus = document.getElementById("pdp-qty-plus");

    if (qtyMinus && qtyPlus && qtyInput) {
      qtyMinus.addEventListener("click", () => {
        let val = parseInt(qtyInput.value, 10);
        if (val > 1) qtyInput.value = val - 1;
      });
      qtyPlus.addEventListener("click", () => {
        let val = parseInt(qtyInput.value, 10);
        if (val < product.stock) qtyInput.value = val + 1;
        else UI.showToast(`Only ${product.stock} units available in stock`, "warning");
      });
    }

    // Add to Cart / Buy Now
    const addCartBtn = document.getElementById("pdp-add-to-cart");
    const buyNowBtn = document.getElementById("pdp-buy-now");

    const getSelectedVariants = () => {
      const vars = {};
      document.querySelectorAll(".variant-group").forEach(group => {
        const sel = group.querySelector(".variant-chip.selected");
        if (sel) {
          vars[sel.getAttribute("data-variant-type")] = sel.getAttribute("data-variant-val");
        }
      });
      return Object.keys(vars).length > 0 ? vars : null;
    };

    if (addCartBtn) {
      if (product.stock <= 0) {
        addCartBtn.disabled = true;
        addCartBtn.textContent = "Out of Stock";
      } else {
        addCartBtn.addEventListener("click", () => {
          const qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
          Cart.addItem(product.id, qty, getSelectedVariants());
        });
      }
    }

    if (buyNowBtn) {
      if (product.stock <= 0) {
        buyNowBtn.disabled = true;
      } else {
        buyNowBtn.addEventListener("click", () => {
          const qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
          Cart.addItem(product.id, qty, getSelectedVariants());
          window.location.href = "checkout.html";
        });
      }
    }

    // Wishlist toggle on PDP
    const pdpWishlistBtn = document.getElementById("pdp-wishlist-toggle");
    if (pdpWishlistBtn) {
      pdpWishlistBtn.classList.toggle("active", Wishlist.hasItem(product.id));
      pdpWishlistBtn.addEventListener("click", () => {
        const active = Wishlist.toggle(product.id);
        pdpWishlistBtn.classList.toggle("active", active);
      });
    }

    // Specifications Tab
    const specsTable = document.getElementById("pdp-specs-table");
    if (specsTable && product.specs) {
      specsTable.innerHTML = Object.entries(product.specs).map(([key, val]) => `
        <tr>
          <th>${key}</th>
          <td>${val}</td>
        </tr>
      `).join("");
    }

    // Tabs Switcher
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-tab-target");
        tabBtns.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));
        btn.classList.add("active");
        const panel = document.getElementById(target);
        if (panel) panel.classList.add("active");
      });
    });

    // Reviews Renderer & Form Submission
    this.renderPDPReviews(product);

    // Related Products
    const relatedContainer = document.getElementById("pdp-related-grid");
    if (relatedContainer) {
      const related = Store.getProducts({ category: product.categorySlug })
        .filter(p => p.id !== product.id)
        .slice(0, 4);
      relatedContainer.innerHTML = related.map(p => UI.renderProductCard(p)).join("");
    }
  },

  renderPDPReviews(product) {
    const reviewsList = document.getElementById("pdp-reviews-list");
    const avgScore = document.getElementById("pdp-reviews-avg-score");
    const totalCount = document.getElementById("pdp-reviews-total-count");

    const reviews = Store.getReviews(product.id);

    if (avgScore) avgScore.textContent = product.rating ? product.rating.toFixed(1) : "5.0";
    if (totalCount) totalCount.textContent = `Based on ${reviews.length} reviews`;

    if (reviewsList) {
      if (reviews.length === 0) {
        reviewsList.innerHTML = `
          <p class="text-muted" style="padding: 1.5rem 0;">No reviews yet for this product. Be the first to share your thoughts!</p>
        `;
      } else {
        reviewsList.innerHTML = reviews.map(r => `
          <div class="review-item">
            <div class="review-meta">
              <span class="review-author">${r.author} ${r.verified ? '<span class="author-badge">✓ Verified Buyer</span>' : ''}</span>
              <span class="review-date">${r.date}</span>
            </div>
            <div class="testimonial-stars" style="margin-bottom: 0.5rem;">
              ${UI.renderStars(r.rating)}
            </div>
            <h4 class="review-title">${r.title}</h4>
            <p class="review-text">${r.content}</p>
          </div>
        `).join("");
      }
    }

    // Handle Write a Review Form
    const reviewForm = document.getElementById("write-review-form");
    if (reviewForm) {
      reviewForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const author = reviewForm.querySelector("#review-author").value;
        const title = reviewForm.querySelector("#review-title").value;
        const content = reviewForm.querySelector("#review-content").value;
        const rating = parseInt(reviewForm.querySelector("#review-rating").value, 10) || 5;

        Store.addReview({
          productId: product.id,
          author,
          title,
          content,
          rating,
          verified: true
        });

        UI.showToast("Your review has been submitted. Thank you for your feedback!", "success");
        reviewForm.reset();
        this.renderPDPReviews(Store.getProductById(product.id));
      });
    }
  },

  // ----------------------------------------------------
  // CATEGORIES HUB PAGE
  // ----------------------------------------------------
  initCategoriesPage() {
    const container = document.getElementById("categories-hub-grid");
    if (container) {
      const categories = Store.getCategories();
      container.innerHTML = categories.map(cat => `
        <div class="category-showcase-card" style="background-color: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius-md); overflow: hidden; margin-bottom: 3rem;">
          <div style="display: grid; grid-template-columns: 1fr 1.2fr; align-items: center;">
            <img src="${cat.image}" alt="${cat.name}" style="height: 320px; width: 100%; object-fit: cover;" />
            <div style="padding: 3rem;">
              <span class="section-subtitle">${cat.productCount} Curated Goods</span>
              <h2 style="font-size: 1.8rem; margin-bottom: 0.8rem;">${cat.name}</h2>
              <p style="margin-bottom: 1.8rem; font-size: 1.05rem;">${cat.description}</p>
              <a href="shop.html?category=${cat.slug}" class="btn btn-primary">Explore Collection &rarr;</a>
            </div>
          </div>
        </div>
      `).join("");
    }
  },

  // ----------------------------------------------------
  // CART PAGE CONTROLLER
  // ----------------------------------------------------
  initCartPage() {
    const tableBody = document.getElementById("cart-table-body");
    const subtotalEl = document.getElementById("cart-subtotal");
    const shippingEl = document.getElementById("cart-shipping");
    const discountEl = document.getElementById("cart-discount");
    const discountRow = document.getElementById("cart-discount-row");
    const taxEl = document.getElementById("cart-tax");
    const totalEl = document.getElementById("cart-total");
    const emptyState = document.getElementById("cart-empty-state");
    const cartWrapper = document.getElementById("cart-content-wrapper");
    const progressFill = document.getElementById("shipping-progress-fill");
    const progressText = document.getElementById("shipping-progress-text");

    let appliedCoupon = localStorage.getItem("deepfeel_applied_coupon") || "";

    const renderCart = () => {
      const cart = Cart.getCart();

      if (cart.length === 0) {
        if (cartWrapper) cartWrapper.style.display = "none";
        if (emptyState) emptyState.style.display = "block";
        return;
      }

      if (cartWrapper) cartWrapper.style.display = "grid";
      if (emptyState) emptyState.style.display = "none";

      const totals = Cart.getTotals(appliedCoupon);

      // Render table rows
      if (tableBody) {
        tableBody.innerHTML = cart.map(item => `
          <tr data-item-id="${item.productId}" data-variant-key="${item.variantKey || ''}">
            <td>
              <div class="cart-product-cell">
                <img src="${item.image}" alt="${item.name}" class="cart-product-thumb" />
                <div>
                  <h4 class="cart-product-name"><a href="product.html?id=${item.productId}">${item.name}</a></h4>
                  ${item.variant ? `
                    <div class="cart-product-variant">
                      ${Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(" | ")}
                    </div>
                  ` : ''}
                  <button type="button" class="cart-remove-btn" data-action="remove">Remove</button>
                </div>
              </div>
            </td>
            <td>${Store.formatCurrency(item.price)}</td>
            <td>
              <div class="quantity-picker" style="height: 38px;">
                <button type="button" class="qty-btn" data-action="decrease">-</button>
                <input type="number" value="${item.quantity}" readonly style="width: 40px;" />
                <button type="button" class="qty-btn" data-action="increase">+</button>
              </div>
            </td>
            <td><strong>${Store.formatCurrency(item.price * item.quantity)}</strong></td>
          </tr>
        `).join("");

        // Attach event listeners to rows
        tableBody.querySelectorAll("tr").forEach(row => {
          const pId = row.getAttribute("data-item-id");
          const vKey = row.getAttribute("data-variant-key");
          const currentItem = cart.find(i => i.productId === pId && (i.variantKey || '') === vKey);
          if (!currentItem) return;

          row.querySelector("[data-action='remove']").addEventListener("click", () => {
            Cart.removeItem(pId, vKey);
            renderCart();
          });

          row.querySelector("[data-action='decrease']").addEventListener("click", () => {
            Cart.updateQuantity(pId, vKey, currentItem.quantity - 1);
            renderCart();
          });

          row.querySelector("[data-action='increase']").addEventListener("click", () => {
            Cart.updateQuantity(pId, vKey, currentItem.quantity + 1);
            renderCart();
          });
        });
      }

      // Update Summary Values
      if (subtotalEl) subtotalEl.textContent = Store.formatCurrency(totals.subtotal);
      if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? "Free" : Store.formatCurrency(totals.shipping);
      if (taxEl) taxEl.textContent = Store.formatCurrency(totals.tax);
      if (totalEl) totalEl.textContent = Store.formatCurrency(totals.total);

      if (discountRow && discountEl) {
        if (totals.discount > 0) {
          discountRow.style.display = "flex";
          discountEl.textContent = `-${Store.formatCurrency(totals.discount)}`;
        } else {
          discountRow.style.display = "none";
        }
      }

      // Free shipping progress bar
      if (progressFill && progressText) {
        const pct = Math.min(100, Math.round((totals.subtotal / totals.freeShippingThreshold) * 100));
        progressFill.style.width = `${pct}%`;
        if (totals.remainingForFreeShipping > 0) {
          progressText.innerHTML = `Add <strong>$${totals.remainingForFreeShipping.toFixed(2)}</strong> more to unlock <strong>Complimentary Worldwide Shipping</strong>`;
        } else {
          progressText.innerHTML = `🎉 You have unlocked <strong>Free Standard Shipping</strong>!`;
        }
      }
    };

    // Coupon form handler
    const couponForm = document.getElementById("cart-coupon-form");
    const couponInput = document.getElementById("coupon-code-input");
    if (couponForm && couponInput) {
      if (appliedCoupon) couponInput.value = appliedCoupon;

      couponForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const code = couponInput.value.trim();
        if (!code) return;

        const validation = Store.validateCoupon(code, Cart.getSubtotal());
        if (validation.valid) {
          appliedCoupon = code;
          localStorage.setItem("deepfeel_applied_coupon", code);
          UI.showToast(validation.message, "success");
          renderCart();
        } else {
          UI.showToast(validation.message, "error");
        }
      });
    }

    renderCart();
  },

  // ----------------------------------------------------
  // CHECKOUT PAGE CONTROLLER
  // ----------------------------------------------------
  initCheckoutPage() {
    const cart = Cart.getCart();
    if (cart.length === 0) {
      window.location.href = "cart.html";
      return;
    }

    const appliedCoupon = localStorage.getItem("deepfeel_applied_coupon") || "";
    let selectedShipping = "standard";
    let selectedPayment = "Credit / Debit Card";

    const user = Auth.getCurrentUser();

    // Prefill form if user logged in
    if (user) {
      const nameInput = document.getElementById("checkout-name");
      const emailInput = document.getElementById("checkout-email");
      const phoneInput = document.getElementById("checkout-phone");
      const streetInput = document.getElementById("checkout-street");
      const cityInput = document.getElementById("checkout-city");
      const stateInput = document.getElementById("checkout-state");
      const zipInput = document.getElementById("checkout-zip");

      if (nameInput && user.name) nameInput.value = user.name;
      if (emailInput && user.email) emailInput.value = user.email;
      if (phoneInput && user.phone) phoneInput.value = user.phone;
      if (user.address) {
        if (streetInput && user.address.street) streetInput.value = user.address.street;
        if (cityInput && user.address.city) cityInput.value = user.address.city;
        if (stateInput && user.address.state) stateInput.value = user.address.state;
        if (zipInput && user.address.zip) zipInput.value = user.address.zip;
      }
    }

    // Render Order Items in Checkout sidebar
    const itemsContainer = document.getElementById("checkout-items-list");
    if (itemsContainer) {
      itemsContainer.innerHTML = cart.map(item => `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.9rem; font-size: 0.9rem;">
          <div style="display: flex; align-items: center; gap: 0.8rem;">
            <img src="${item.image}" alt="${item.name}" style="width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover;" />
            <div>
              <strong style="display: block;">${item.name}</strong>
              <span class="text-muted">Qty: ${item.quantity}</span>
            </div>
          </div>
          <span>${Store.formatCurrency(item.price * item.quantity)}</span>
        </div>
      `).join("");
    }

    const updateTotalsDisplay = () => {
      const totals = Cart.getTotals(appliedCoupon, selectedShipping);
      const subtotalEl = document.getElementById("checkout-subtotal");
      const shippingEl = document.getElementById("checkout-shipping");
      const discountEl = document.getElementById("checkout-discount");
      const discountRow = document.getElementById("checkout-discount-row");
      const taxEl = document.getElementById("checkout-tax");
      const totalEl = document.getElementById("checkout-total");

      if (subtotalEl) subtotalEl.textContent = Store.formatCurrency(totals.subtotal);
      if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? "Free" : Store.formatCurrency(totals.shipping);
      if (taxEl) taxEl.textContent = Store.formatCurrency(totals.tax);
      if (totalEl) totalEl.textContent = Store.formatCurrency(totals.total);

      if (discountRow && discountEl) {
        if (totals.discount > 0) {
          discountRow.style.display = "flex";
          discountEl.textContent = `-${Store.formatCurrency(totals.discount)}`;
        } else {
          discountRow.style.display = "none";
        }
      }
    };

    // Shipping selection change
    document.querySelectorAll("input[name='shipping-method']").forEach(radio => {
      radio.addEventListener("change", (e) => {
        selectedShipping = e.target.value;
        updateTotalsDisplay();
      });
    });

    // Payment selection change
    const paymentOptions = document.querySelectorAll(".payment-option-card");
    paymentOptions.forEach(opt => {
      opt.addEventListener("click", () => {
        paymentOptions.forEach(o => o.classList.remove("selected"));
        opt.classList.add("selected");
        const radio = opt.querySelector("input[type='radio']");
        if (radio) {
          radio.checked = true;
          selectedPayment = radio.value;
        }

        // Show/hide card input fields
        const cardFields = document.getElementById("credit-card-inputs");
        if (cardFields) {
          cardFields.style.display = (selectedPayment === "credit_card") ? "block" : "none";
        }
      });
    });

    updateTotalsDisplay();

    // Place Order Form Submission
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("checkout-name").value.trim();
        const email = document.getElementById("checkout-email").value.trim();
        const phone = document.getElementById("checkout-phone").value.trim();
        const street = document.getElementById("checkout-street").value.trim();
        const city = document.getElementById("checkout-city").value.trim();
        const state = document.getElementById("checkout-state").value.trim();
        const zip = document.getElementById("checkout-zip").value.trim();
        const country = document.getElementById("checkout-country").value;

        if (!name || !email || !street || !city || !zip) {
          UI.showToast("Please fill in all required shipping fields.", "error");
          return;
        }

        const totals = Cart.getTotals(appliedCoupon, selectedShipping);

        const orderData = {
          userId: user ? user.id : "usr_guest",
          customer: {
            name,
            email,
            phone,
            address: `${street}, ${city}, ${state} ${zip}, ${country}`
          },
          items: cart.map(i => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
            variant: i.variant ? Object.values(i.variant).join(" / ") : ""
          })),
          subtotal: totals.subtotal,
          discount: totals.discount,
          couponCode: appliedCoupon,
          shipping: totals.shipping,
          tax: totals.tax,
          total: totals.total,
          paymentMethod: selectedPayment === "cod" ? "Cash on Delivery" : (selectedPayment === "wire" ? "Direct Bank Transfer" : "Credit / Debit Card")
        };

        const newOrder = Store.createOrder(orderData);

        // Clear cart & applied coupon
        Cart.clearCart();
        localStorage.removeItem("deepfeel_applied_coupon");

        UI.showToast("Order placed successfully! Redirecting to confirmation...", "success");

        setTimeout(() => {
          window.location.href = `order-confirmation.html?id=${newOrder.id}`;
        }, 600);
      });
    }
  },

  // ----------------------------------------------------
  // ORDER CONFIRMATION CONTROLLER
  // ----------------------------------------------------
  initOrderConfirmationPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("id");
    const order = orderId ? Store.getOrderById(orderId) : Store.getOrders()[0];

    if (!order) {
      window.location.href = "index.html";
      return;
    }

    const orderNumberEl = document.getElementById("conf-order-number");
    const dateEl = document.getElementById("conf-order-date");
    const totalEl = document.getElementById("conf-order-total");
    const paymentEl = document.getElementById("conf-order-payment");
    const addressEl = document.getElementById("conf-order-address");
    const itemsContainer = document.getElementById("conf-order-items");

    if (orderNumberEl) orderNumberEl.textContent = order.id;
    if (dateEl) dateEl.textContent = Store.formatDate(order.createdAt);
    if (totalEl) totalEl.textContent = Store.formatCurrency(order.total);
    if (paymentEl) paymentEl.textContent = order.paymentMethod;
    if (addressEl) addressEl.textContent = order.customer.address;

    if (itemsContainer) {
      itemsContainer.innerHTML = order.items.map(item => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.9rem 0; border-bottom: 1px solid var(--border-light);">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; border-radius: var(--radius-sm); object-fit: cover;" />
            <div>
              <strong>${item.name}</strong>
              <span class="text-muted" style="display: block; font-size: 0.85rem;">Qty: ${item.quantity} ${item.variant ? `(${item.variant})` : ''}</span>
            </div>
          </div>
          <span style="font-weight: 600;">${Store.formatCurrency(item.price * item.quantity)}</span>
        </div>
      `).join("");
    }

    // Print Receipt button
    const printBtn = document.getElementById("print-receipt-btn");
    if (printBtn) {
      printBtn.addEventListener("click", () => window.print());
    }
  },

  // ----------------------------------------------------
  // WISHLIST PAGE CONTROLLER
  // ----------------------------------------------------
  initWishlistPage() {
    const grid = document.getElementById("wishlist-products-grid");
    const emptyState = document.getElementById("wishlist-empty-state");
    const countDisplay = document.getElementById("wishlist-count-title");

    const render = () => {
      const items = Wishlist.getItems();

      if (countDisplay) {
        countDisplay.textContent = `Saved Goods (${items.length})`;
      }

      if (items.length === 0) {
        if (grid) grid.style.display = "none";
        if (emptyState) emptyState.style.display = "block";
        return;
      }

      if (grid) grid.style.display = "grid";
      if (emptyState) emptyState.style.display = "none";

      const products = items.map(id => Store.getProductById(id)).filter(Boolean);
      grid.innerHTML = products.map(p => UI.renderProductCard(p)).join("");
    };

    window.addEventListener("wishlist:updated", render);
    render();
  },

  // ----------------------------------------------------
  // CUSTOMER ACCOUNT & ORDERS CONTROLLERS
  // ----------------------------------------------------
  initAccountPage() {
    if (!Auth.requireAuth("login.html")) return;
    const user = Auth.getCurrentUser();

    const nameEl = document.getElementById("account-user-name");
    const emailEl = document.getElementById("account-user-email");
    const joinedEl = document.getElementById("account-joined-date");

    if (nameEl) nameEl.textContent = user.name;
    if (emailEl) emailEl.textContent = user.email;
    if (joinedEl) joinedEl.textContent = Store.formatDate(user.createdAt);

    // Profile form
    const profileForm = document.getElementById("account-profile-form");
    if (profileForm) {
      const nameInput = document.getElementById("profile-name");
      const phoneInput = document.getElementById("profile-phone");
      const streetInput = document.getElementById("profile-street");
      const cityInput = document.getElementById("profile-city");
      const stateInput = document.getElementById("profile-state");
      const zipInput = document.getElementById("profile-zip");

      if (nameInput) nameInput.value = user.name || "";
      if (phoneInput) phoneInput.value = user.phone || "";
      if (user.address) {
        if (streetInput) streetInput.value = user.address.street || "";
        if (cityInput) cityInput.value = user.address.city || "";
        if (stateInput) stateInput.value = user.address.state || "";
        if (zipInput) zipInput.value = user.address.zip || "";
      }

      profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        user.name = nameInput.value.trim();
        user.phone = phoneInput.value.trim();
        user.address = {
          street: streetInput.value.trim(),
          city: cityInput.value.trim(),
          state: stateInput.value.trim(),
          zip: zipInput.value.trim()
        };

        Store.saveUser(user);
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        UI.showToast("Account profile successfully updated.", "success");
      });
    }

    // Logout button
    const logoutBtn = document.getElementById("account-logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => Auth.logout("index.html"));
    }
  },

  initCustomerOrdersPage() {
    if (!Auth.requireAuth("login.html")) return;
    const user = Auth.getCurrentUser();
    const tableBody = document.getElementById("customer-orders-table-body");
    const emptyState = document.getElementById("customer-orders-empty");

    const orders = Store.getOrders().filter(o => o.userId === user.id || (o.customer && o.customer.email === user.email));

    if (orders.length === 0) {
      if (tableBody) tableBody.parentElement.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (tableBody) {
      tableBody.innerHTML = orders.map(order => `
        <tr>
          <td><strong>${order.id}</strong></td>
          <td>${Store.formatDate(order.createdAt)}</td>
          <td>${order.items.length} item${order.items.length === 1 ? '' : 's'}</td>
          <td><strong>${Store.formatCurrency(order.total)}</strong></td>
          <td><span class="status-pill status-${order.status.toLowerCase()}">${order.status}</span></td>
          <td>
            <a href="order-confirmation.html?id=${order.id}" class="btn btn-outline btn-sm">View Receipt</a>
          </td>
        </tr>
      `).join("");
    }
  },

  // ----------------------------------------------------
  // FAQ & CONTACT
  // ----------------------------------------------------
  initFAQPage() {
    const accordions = document.querySelectorAll(".faq-accordion-item");
    accordions.forEach(item => {
      const header = item.querySelector(".faq-header");
      header.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        accordions.forEach(i => i.classList.remove("open"));
        if (!isOpen) item.classList.add("open");
      });
    });
  },

  initContactPage() {
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        UI.showToast("Your message has been sent to our studio. We will respond within 24 hours.", "success");
        contactForm.reset();
      });
    }
  },

  // ----------------------------------------------------
  // AUTH (LOGIN & REGISTER)
  // ----------------------------------------------------
  initLoginPage() {
    const form = document.getElementById("login-form");
    const demoCustomerBtn = document.getElementById("fill-demo-customer-btn");
    const demoAdminBtn = document.getElementById("fill-demo-admin-btn");

    if (demoCustomerBtn) {
      demoCustomerBtn.addEventListener("click", () => Auth.fillDemoCredentials("customer"));
    }
    if (demoAdminBtn) {
      demoAdminBtn.addEventListener("click", () => Auth.fillDemoCredentials("admin"));
    }

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const res = Auth.login(email, password);
        if (res.success) {
          UI.showToast(`Welcome back, ${res.user.name}!`, "success");
          setTimeout(() => {
            if (res.user.role === "admin") {
              window.location.href = "admin/index.html";
            } else {
              window.location.href = "account.html";
            }
          }, 450);
        } else {
          UI.showToast(res.message, "error");
        }
      });
    }
  },

  initRegisterPage() {
    const form = document.getElementById("register-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const phone = document.getElementById("phone") ? document.getElementById("phone").value.trim() : "";

        if (!name || !email || !password) {
          UI.showToast("Please fill in all required fields.", "error");
          return;
        }

        const res = Auth.register({ name, email, password, phone });
        if (res.success) {
          UI.showToast("Account created successfully! Welcome to DeepFeel.", "success");
          setTimeout(() => {
            window.location.href = "account.html";
          }, 450);
        } else {
          UI.showToast(res.message, "error");
        }
      });
    }
  }
};
