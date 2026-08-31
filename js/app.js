/**
 * DeepFeel - Master Storefront Page Controller
 * Handles page initialization, fragrance filters, PDP pyramid & scent storytelling,
 * interactive fragrance discovery quiz, and cart/checkout workflows.
 */

const App = {
  // Determine current page and bootstrap
  init() {
    const path = window.location.pathname.toLowerCase();

    if (path.endsWith("index.html") || path === "/" || path.endsWith("/deepfeel/") || path.endsWith("/deepfeel")) {
      this.initHomePage();
    } else if (path.endsWith("shop.html")) {
      this.initShopPage();
    } else if (path.endsWith("product.html")) {
      this.initProductDetailPage();
    } else if (path.endsWith("cart.html")) {
      this.initCartPage();
    } else if (path.endsWith("checkout.html")) {
      this.initCheckoutPage();
    } else if (path.endsWith("order-confirmation.html")) {
      this.initOrderConfirmationPage();
    } else if (path.endsWith("wishlist.html")) {
      this.initWishlistPage();
    } else if (path.endsWith("categories.html")) {
      this.initCategoriesPage();
    } else if (path.endsWith("about.html")) {
      this.initAboutPage();
    } else if (path.endsWith("contact.html")) {
      this.initContactPage();
    } else if (path.endsWith("faq.html")) {
      this.initFaqPage();
    } else if (path.endsWith("account.html")) {
      this.initAccountPage();
    } else if (path.endsWith("orders.html")) {
      this.initOrdersPage();
    } else if (path.endsWith("login.html") || path.endsWith("register.html")) {
      this.initAuthPages();
    }

    this.initGlobalHeader();
  },

  // ----------------------------------------------------
  // GLOBAL HEADER & NAVIGATION
  // ----------------------------------------------------
  initGlobalHeader() {
    const user = Auth.getCurrentUser();
    const accountLinks = document.querySelectorAll(".header-account-link");
    accountLinks.forEach(link => {
      if (user) {
        link.href = user.role === "admin" ? "admin/index.html" : "account.html";
        link.title = `Signed in as ${user.name}`;
      } else {
        link.href = "login.html";
      }
    });

    // Wishlist and Cart live badges
    Wishlist.updateBadges();
    Cart.updateBadges();
  },

  // ----------------------------------------------------
  // 1. HOMEPAGE
  // ----------------------------------------------------
  initHomePage() {
    // 1. Featured Fragrances Grid
    const featuredGrid = document.getElementById("featured-products-grid");
    if (featuredGrid) {
      const featuredProducts = Store.getProducts({ featured: true, status: "active" }).slice(0, 4);
      featuredGrid.innerHTML = featuredProducts.map(p => UI.renderProductCard(p)).join("");
    }

    // 2. Bestsellers Grid
    const bestsellersGrid = document.getElementById("bestsellers-products-grid");
    if (bestsellersGrid) {
      const bestsellers = Store.getProducts({ bestseller: true, status: "active" }).slice(0, 4);
      bestsellersGrid.innerHTML = bestsellers.map(p => UI.renderProductCard(p)).join("");
    }

    // 3. The Oud Collection Showcase Grid
    const oudGrid = document.getElementById("oud-products-grid");
    if (oudGrid) {
      const oudProducts = Store.getProducts({ category: "The Oud Collection", status: "active" }).slice(0, 3);
      oudGrid.innerHTML = oudProducts.map(p => UI.renderProductCard(p)).join("");
    }

    // 4. Fragrance Discovery Interactive Quiz
    this.initFragranceDiscoveryTool();
  },

  initFragranceDiscoveryTool() {
    const quizButtons = document.querySelectorAll(".scent-quiz-btn");
    const resultsContainer = document.getElementById("discovery-results-grid");
    if (!quizButtons.length || !resultsContainer) return;

    const loadProfile = (profile) => {
      const recommended = Store.recommendPerfumesByPreference(profile);
      if (!recommended.length) {
        resultsContainer.innerHTML = `<p style="text-align:center; grid-column:1/-1; color:rgba(255,255,255,0.7);">Select a note profile above to discover your signature scent.</p>`;
        return;
      }
      resultsContainer.innerHTML = recommended.map(p => UI.renderProductCard(p)).join("");
    };

    // Default load: Woody
    loadProfile("Woody");

    quizButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        quizButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        loadProfile(btn.dataset.scentProfile || btn.textContent.trim());
      });
    });
  },

  // ----------------------------------------------------
  // 2. SHOP CATALOG WITH PERFUME FILTERS
  // ----------------------------------------------------
  initShopPage() {
    const grid = document.getElementById("shop-products-grid");
    const countDisplay = document.getElementById("shop-results-count");
    if (!grid) return;

    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get("category") || "all";
    const initialGender = urlParams.get("gender") || "all";
    const initialFamily = urlParams.get("family") || "all";
    const initialSearch = urlParams.get("q") || "";

    // Elements
    const genderFilters = document.querySelectorAll("input[name='gender-filter']");
    const familyFilters = document.querySelectorAll("input[name='family-filter']");
    const concentrationFilters = document.querySelectorAll("input[name='concentration-filter']");
    const seasonFilters = document.querySelectorAll("input[name='season-filter']");
    const priceSlider = document.getElementById("price-range-slider");
    const priceDisplay = document.getElementById("price-range-val");
    const inStockCheckbox = document.getElementById("in-stock-only");
    const sortSelect = document.getElementById("shop-sort-select");
    const resetFiltersBtn = document.getElementById("reset-filters-btn");
    const searchInput = document.getElementById("shop-search-input");

    // Populate category dropdown or radio filters if existing
    const categorySelect = document.getElementById("shop-category-filter");
    if (categorySelect) {
      const cats = Store.getCategories();
      categorySelect.innerHTML = `<option value="all">All Fragrance Collections</option>` +
        cats.map(c => `<option value="${c.slug}" ${c.slug === initialCategory ? 'selected' : ''}>${c.name}</option>`).join("");
    }

    if (priceSlider && priceDisplay) {
      priceSlider.addEventListener("input", (e) => {
        priceDisplay.textContent = `$${e.target.value}`;
        renderFilteredShop();
      });
    }

    const renderFilteredShop = () => {
      // Gather active filters
      let selectedGender = "all";
      genderFilters.forEach(r => { if (r.checked) selectedGender = r.value; });

      let selectedFamily = "all";
      familyFilters.forEach(r => { if (r.checked) selectedFamily = r.value; });

      let selectedConcentration = "all";
      concentrationFilters.forEach(r => { if (r.checked) selectedConcentration = r.value; });

      let selectedSeason = "all";
      seasonFilters.forEach(r => { if (r.checked) selectedSeason = r.value; });

      const maxPrice = priceSlider ? Number(priceSlider.value) : 500;
      const inStockOnly = inStockCheckbox ? inStockCheckbox.checked : false;
      const sortBy = sortSelect ? sortSelect.value : "featured";
      const cat = categorySelect ? categorySelect.value : initialCategory;
      const search = searchInput ? searchInput.value : initialSearch;

      const products = Store.getProducts({
        category: cat,
        gender: selectedGender !== "all" ? selectedGender : undefined,
        fragranceFamily: selectedFamily !== "all" ? selectedFamily : undefined,
        concentration: selectedConcentration !== "all" ? selectedConcentration : undefined,
        season: selectedSeason !== "all" ? selectedSeason : undefined,
        maxPrice,
        inStockOnly,
        sortBy,
        search,
        status: "active"
      });

      if (countDisplay) {
        countDisplay.textContent = `Showing ${products.length} refined fragrance${products.length === 1 ? '' : 's'}`;
      }

      if (products.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">🌸</div>
            <h2 class="empty-state-title">No fragrances matched your selection</h2>
            <p class="empty-state-desc">Try resetting your fragrance family or price filters to explore our full olfactive vault.</p>
            <button type="button" class="btn btn-primary" id="empty-reset-btn">Reset All Filters</button>
          </div>
        `;
        const emptyReset = document.getElementById("empty-reset-btn");
        if (emptyReset) emptyReset.addEventListener("click", resetAllFilters);
        return;
      }

      grid.innerHTML = products.map(p => UI.renderProductCard(p)).join("");
    };

    const resetAllFilters = () => {
      genderFilters.forEach(r => r.checked = r.value === "all");
      familyFilters.forEach(r => r.checked = r.value === "all");
      concentrationFilters.forEach(r => r.checked = r.value === "all");
      seasonFilters.forEach(r => r.checked = r.value === "all");
      if (priceSlider) {
        priceSlider.value = 400;
        if (priceDisplay) priceDisplay.textContent = "$400";
      }
      if (inStockCheckbox) inStockCheckbox.checked = false;
      if (categorySelect) categorySelect.value = "all";
      if (searchInput) searchInput.value = "";
      renderFilteredShop();
    };

    // Event listeners
    [...genderFilters, ...familyFilters, ...concentrationFilters, ...seasonFilters].forEach(el => {
      el.addEventListener("change", renderFilteredShop);
    });
    if (categorySelect) categorySelect.addEventListener("change", renderFilteredShop);
    if (inStockCheckbox) inStockCheckbox.addEventListener("change", renderFilteredShop);
    if (sortSelect) sortSelect.addEventListener("change", renderFilteredShop);
    if (resetFiltersBtn) resetFiltersBtn.addEventListener("click", resetAllFilters);
    if (searchInput) searchInput.addEventListener("input", renderFilteredShop);

    // Initial render
    renderFilteredShop();
  },

  // ----------------------------------------------------
  // 3. PRODUCT DETAILS PAGE (PDP)
  // ----------------------------------------------------
  initProductDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id") || "df_noir";
    const product = Store.getProductById(productId);

    if (!product) {
      window.location.href = "shop.html";
      return;
    }

    // Add to recently viewed
    Store.addRecentlyViewed(product.id);

    // Update document title & metadata
    document.title = `${product.name} — Maison DeepFeel`;

    // Populate Product Basic Information
    const titleEl = document.getElementById("pdp-product-title");
    const categoryEl = document.getElementById("pdp-product-category");
    const concentrationEl = document.getElementById("pdp-product-concentration");
    const familyEl = document.getElementById("pdp-product-family");
    const priceEl = document.getElementById("pdp-product-price");
    const origPriceEl = document.getElementById("pdp-product-orig-price");
    const descEl = document.getElementById("pdp-product-desc");
    const ratingEl = document.getElementById("pdp-rating-stars");
    const reviewCountEl = document.getElementById("pdp-review-count");
    const skuEl = document.getElementById("pdp-product-sku");
    const stockStatusEl = document.getElementById("pdp-stock-status");

    if (titleEl) titleEl.textContent = product.name;
    if (categoryEl) categoryEl.textContent = product.category;
    if (concentrationEl) concentrationEl.textContent = product.concentration || "Extrait de Parfum";
    if (familyEl) familyEl.textContent = product.fragranceFamily || "Oriental Woody";
    if (descEl) descEl.textContent = product.description || product.shortDescription;
    if (skuEl) skuEl.textContent = `SKU: ${product.sku}`;
    if (ratingEl) ratingEl.innerHTML = UI.renderStars(product.rating || 5);
    if (reviewCountEl) reviewCountEl.textContent = `(${product.reviewCount || 0} client reviews)`;

    if (stockStatusEl) {
      if (product.stock > 10) {
        stockStatusEl.innerHTML = `<span style="color:var(--color-success); font-weight:600;">● In Stock (Macerated & Ready for Dispatch)</span>`;
      } else if (product.stock > 0) {
        stockStatusEl.innerHTML = `<span style="color:var(--color-warning); font-weight:600;">⚠️ Rare Reserve (${product.stock} flacons remaining)</span>`;
      } else {
        stockStatusEl.innerHTML = `<span style="color:var(--color-error); font-weight:600;">⛔ Currently Out of Stock</span>`;
      }
    }

    // Image Gallery & Lens Zoom
    const mainImage = document.getElementById("pdp-main-image");
    const thumbsContainer = document.getElementById("pdp-thumbs-container");
    if (mainImage && product.images && product.images.length) {
      mainImage.src = product.images[0];
      mainImage.alt = product.name;

      if (thumbsContainer) {
        thumbsContainer.innerHTML = product.images.map((img, i) => `
          <button type="button" class="pdp-thumb-btn ${i === 0 ? 'active' : ''}" data-img-src="${img}">
            <img src="${img}" alt="${product.name} view ${i + 1}" />
          </button>
        `).join("");

        const thumbBtns = thumbsContainer.querySelectorAll(".pdp-thumb-btn");
        thumbBtns.forEach(btn => {
          btn.addEventListener("click", () => {
            thumbBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            mainImage.src = btn.dataset.imgSrc;
          });
        });
      }

      // Vanilla JS Image Zoom on hover
      const zoomContainer = document.getElementById("pdp-zoom-container");
      if (zoomContainer) {
        zoomContainer.addEventListener("mousemove", (e) => {
          const rect = zoomContainer.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          mainImage.style.transformOrigin = `${x}% ${y}%`;
          mainImage.style.transform = "scale(1.75)";
        });

        zoomContainer.addEventListener("mouseleave", () => {
          mainImage.style.transform = "scale(1)";
          mainImage.style.transformOrigin = "center center";
        });
      }
    }

    // Size Variant Selection & Dynamic Price Calculation
    let selectedSize = (product.sizes && product.sizes.length) ? product.sizes[0] : "50ml";
    let activePrice = (product.sizePricing && product.sizePricing[selectedSize]) ? product.sizePricing[selectedSize] : product.price;

    const updatePriceDisplay = () => {
      if (priceEl) priceEl.textContent = `$${activePrice.toFixed(2)}`;
      if (origPriceEl) {
        if (product.originalPrice && product.originalPrice > activePrice) {
          origPriceEl.textContent = `$${product.originalPrice.toFixed(2)}`;
          origPriceEl.style.display = "inline";
        } else {
          origPriceEl.style.display = "none";
        }
      }
    };
    updatePriceDisplay();

    const sizeContainer = document.getElementById("pdp-size-selector");
    if (sizeContainer && product.sizes) {
      sizeContainer.innerHTML = product.sizes.map((s, i) => {
        const pVal = (product.sizePricing && product.sizePricing[s]) ? product.sizePricing[s] : product.price;
        return `
          <button 
            type="button" 
            class="size-btn ${i === 0 ? 'active' : ''}" 
            data-size="${s}"
            data-price="${pVal}"
          >
            ${s} (${product.concentration || 'EDP'}) — $${pVal.toFixed(0)}
          </button>
        `;
      }).join("");

      const sizeBtns = sizeContainer.querySelectorAll(".size-btn");
      sizeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          sizeBtns.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          selectedSize = btn.dataset.size;
          activePrice = parseFloat(btn.dataset.price);
          updatePriceDisplay();
        });
      });
    }

    // Fragrance Pyramid Visualizer
    const pyramidContainer = document.getElementById("pdp-fragrance-pyramid-wrap");
    if (pyramidContainer) {
      pyramidContainer.innerHTML = UI.renderFragrancePyramid(product.notes);
    }

    // Performance Specs Grid (Longevity, Sillage, Season, Concentration)
    const specsContainer = document.getElementById("pdp-scent-specs-wrap");
    if (specsContainer) {
      specsContainer.innerHTML = UI.renderScentSpecs(product);
    }

    // Story Behind The Scent Editorial Section
    const storyContainer = document.getElementById("pdp-scent-story-wrap");
    if (storyContainer) {
      storyContainer.innerHTML = `
        <div class="scent-story-card">
          <span style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:var(--accent-primary); display:block; margin-bottom:0.6rem;">Editorial Olfactory Note</span>
          <h3 class="serif-headline" style="font-size:1.8rem; margin-bottom:1rem;">The Story Behind ${product.name}</h3>
          <p class="scent-story-quote">"${product.story || product.description}"</p>
          <div style="font-size:0.9rem; color:var(--text-secondary); line-height:1.7;">
            Formulated in small numbered batches using natural maceration cycles. Each bottle rests in dark temperature-regulated cellars for a minimum of 90 days to achieve maximum olfactive depth.
          </div>
        </div>
      `;
    }

    // Ingredients & Specs
    const ingredientsEl = document.getElementById("pdp-ingredients-text");
    if (ingredientsEl) {
      ingredientsEl.textContent = product.ingredients || "Alcohol Denat., Parfum (Fragrance), Aqua, Essential Oils.";
    }

    // Quantity Selector & Add to Bag
    const qtyInput = document.getElementById("pdp-qty-input");
    const minusBtn = document.getElementById("pdp-qty-minus");
    const plusBtn = document.getElementById("pdp-qty-plus");
    const addBtn = document.getElementById("pdp-add-to-bag-btn");
    const buyNowBtn = document.getElementById("pdp-buy-now-btn");

    if (qtyInput && minusBtn && plusBtn) {
      minusBtn.addEventListener("click", () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        if (val > 1) qtyInput.value = val - 1;
      });
      plusBtn.addEventListener("click", () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        if (val < product.stock) qtyInput.value = val + 1;
      });
    }

    if (addBtn && product.stock > 0) {
      addBtn.addEventListener("click", () => {
        const qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
        Cart.addItem(product.id, qty, { size: selectedSize, price: activePrice });
      });
    }

    if (buyNowBtn && product.stock > 0) {
      buyNowBtn.addEventListener("click", () => {
        const qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
        Cart.addItem(product.id, qty, { size: selectedSize, price: activePrice });
        window.location.href = "checkout.html";
      });
    }

    // Wishlist PDP button
    const pdpWishBtn = document.getElementById("pdp-wishlist-toggle");
    if (pdpWishBtn) {
      const isWish = Wishlist.hasItem(product.id);
      pdpWishBtn.classList.toggle("active", isWish);
      pdpWishBtn.addEventListener("click", () => {
        Wishlist.toggleItem(product.id);
        const nowWish = Wishlist.hasItem(product.id);
        pdpWishBtn.classList.toggle("active", nowWish);
      });
    }

    // Reviews List & Submission Form
    this.initPDPReviews(product.id);

    // Related Fragrances
    const relatedGrid = document.getElementById("pdp-related-products-grid");
    if (relatedGrid) {
      const related = Store.getProducts({ category: product.category, status: "active" })
        .filter(p => p.id !== product.id)
        .slice(0, 4);
      relatedGrid.innerHTML = related.map(p => UI.renderProductCard(p)).join("");
    }
  },

  initPDPReviews(productId) {
    const reviewsList = document.getElementById("pdp-reviews-list");
    const form = document.getElementById("pdp-review-form");
    if (!reviewsList) return;

    const renderReviews = () => {
      const reviews = Store.getReviews(productId);
      if (!reviews.length) {
        reviewsList.innerHTML = `<p class="text-muted" style="padding:1rem 0;">Be the first fragrance connoisseur to leave an olfactory review for this flacon.</p>`;
        return;
      }

      reviewsList.innerHTML = reviews.map(r => `
        <div class="review-item" style="border-bottom:1px solid var(--border-light); padding:1.4rem 0;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <div>
              <strong>${r.author}</strong>
              ${r.verified ? '<span style="font-size:0.75rem; background:var(--accent-subtle); color:var(--accent-primary); padding:2px 8px; border-radius:10px; margin-left:6px;">Verified Patron</span>' : ''}
            </div>
            <span style="font-size:0.8rem; color:var(--text-muted);">${r.date}</span>
          </div>
          <div style="margin-bottom:0.5rem;">${UI.renderStars(r.rating)}</div>
          <h4 style="font-size:0.98rem; margin-bottom:0.3rem;">${r.title || ''}</h4>
          <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.6;">${r.content}</p>
        </div>
      `).join("");
    };

    renderReviews();

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const author = document.getElementById("review-author").value.trim();
        const rating = parseInt(document.getElementById("review-rating").value, 10) || 5;
        const title = document.getElementById("review-title").value.trim();
        const content = document.getElementById("review-content").value.trim();

        if (!author || !content) {
          UI.showToast("Please fill in your name and olfactory review", "error");
          return;
        }

        Store.addReview({
          productId,
          author,
          rating,
          title,
          content
        });

        form.reset();
        UI.showToast("Thank you. Your fragrance review has been published.", "success");
        renderReviews();
      });
    }
  },

  // ----------------------------------------------------
  // 4. CART PAGE
  // ----------------------------------------------------
  initCartPage() {
    const tableBody = document.getElementById("cart-table-body");
    const emptyState = document.getElementById("cart-empty-state");
    const contentWrap = document.getElementById("cart-content-wrap");
    if (!tableBody) return;

    let appliedCoupon = localStorage.getItem("deepfeel_active_coupon") || "";
    let includeGiftPackaging = false;

    const giftBox = document.getElementById("cart-gift-packaging");
    if (giftBox) {
      giftBox.addEventListener("change", (e) => {
        includeGiftPackaging = e.target.checked;
        renderCart();
      });
    }

    const renderCart = () => {
      const cart = Cart.getCart();

      if (cart.length === 0) {
        if (emptyState) emptyState.style.display = "block";
        if (contentWrap) contentWrap.style.display = "none";
        return;
      }

      if (emptyState) emptyState.style.display = "none";
      if (contentWrap) contentWrap.style.display = "grid";

      tableBody.innerHTML = cart.map(item => `
        <tr class="cart-row">
          <td class="cart-item-col">
            <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" />
            <div>
              <h3 class="cart-item-title"><a href="product.html?id=${item.productId}">${item.name}</a></h3>
              <span class="cart-item-variant">${item.size || '50ml'} • ${item.concentration || 'Extrait de Parfum'}</span>
              <span class="cart-item-price-mobile">$${item.price.toFixed(2)}</span>
            </div>
          </td>
          <td>$${item.price.toFixed(2)}</td>
          <td>
            <div class="quantity-picker">
              <button type="button" class="qty-btn cart-minus" data-id="${item.productId}" data-vkey="${item.variantKey}">-</button>
              <input type="number" value="${item.quantity}" min="1" class="qty-input cart-qty-input" data-id="${item.productId}" data-vkey="${item.variantKey}" />
              <button type="button" class="qty-btn cart-plus" data-id="${item.productId}" data-vkey="${item.variantKey}">+</button>
            </div>
          </td>
          <td><strong>$${(item.price * item.quantity).toFixed(2)}</strong></td>
          <td>
            <button type="button" class="cart-remove-btn" data-id="${item.productId}" data-vkey="${item.variantKey}" title="Remove flacon">&times;</button>
          </td>
        </tr>
      `).join("");

      // Financials
      const totals = Cart.getTotals(appliedCoupon, "standard", includeGiftPackaging);
      
      const subtotalEl = document.getElementById("cart-subtotal");
      const discountRow = document.getElementById("cart-discount-row");
      const discountEl = document.getElementById("cart-discount");
      const shippingEl = document.getElementById("cart-shipping");
      const giftRow = document.getElementById("cart-gift-row");
      const giftEl = document.getElementById("cart-gift-fee");
      const taxEl = document.getElementById("cart-tax");
      const totalEl = document.getElementById("cart-total");
      const freeShipProg = document.getElementById("free-shipping-progress");
      const freeShipMsg = document.getElementById("free-shipping-msg");

      if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
      if (shippingEl) shippingEl.textContent = totals.isFreeShipping ? "FREE" : `$${totals.shipping.toFixed(2)}`;
      if (taxEl) taxEl.textContent = `$${totals.tax.toFixed(2)}`;
      if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`;

      if (giftRow && giftEl) {
        giftRow.style.display = includeGiftPackaging ? "flex" : "none";
        giftEl.textContent = `$${totals.giftFee.toFixed(2)}`;
      }

      if (discountRow && discountEl) {
        if (totals.discount > 0) {
          discountRow.style.display = "flex";
          discountEl.textContent = `-$${totals.discount.toFixed(2)}`;
        } else {
          discountRow.style.display = "none";
        }
      }

      // Free shipping progress bar
      if (freeShipProg && freeShipMsg) {
        if (totals.remainingForFreeShipping > 0) {
          const pct = Math.min(100, Math.round((totals.subtotal / totals.freeShippingThreshold) * 100));
          freeShipProg.style.width = `${pct}%`;
          freeShipMsg.textContent = `Add $${totals.remainingForFreeShipping.toFixed(2)} more of fragrances to unlock complimentary worldwide shipping.`;
        } else {
          freeShipProg.style.width = "100%";
          freeShipMsg.textContent = `🎉 You have unlocked complimentary worldwide priority courier shipping!`;
        }
      }
    };

    renderCart();

    // Table Event delegation (Quantity & Remove)
    tableBody.addEventListener("click", (e) => {
      const minus = e.target.closest(".cart-minus");
      if (minus) {
        const id = minus.dataset.id;
        const vkey = minus.dataset.vkey;
        const item = Cart.getCart().find(i => i.productId === id && i.variantKey === vkey);
        if (item) Cart.updateQuantity(id, vkey, item.quantity - 1);
        renderCart();
        return;
      }

      const plus = e.target.closest(".cart-plus");
      if (plus) {
        const id = plus.dataset.id;
        const vkey = plus.dataset.vkey;
        const item = Cart.getCart().find(i => i.productId === id && i.variantKey === vkey);
        if (item) Cart.updateQuantity(id, vkey, item.quantity + 1);
        renderCart();
        return;
      }

      const removeBtn = e.target.closest(".cart-remove-btn");
      if (removeBtn) {
        Cart.removeItem(removeBtn.dataset.id, removeBtn.dataset.vkey);
        renderCart();
        return;
      }
    });

    // Coupon code apply
    const couponInput = document.getElementById("cart-coupon-input");
    const couponBtn = document.getElementById("cart-coupon-btn");
    const couponMsg = document.getElementById("cart-coupon-msg");

    if (couponBtn && couponInput) {
      couponBtn.addEventListener("click", () => {
        const code = couponInput.value.trim();
        if (!code) return;
        const test = Store.validateCoupon(code, Cart.getSubtotal());
        if (test.valid) {
          appliedCoupon = code;
          localStorage.setItem("deepfeel_active_coupon", code);
          if (couponMsg) {
            couponMsg.textContent = test.message;
            couponMsg.style.color = "var(--color-success)";
          }
          UI.showToast(test.message, "success");
        } else {
          if (couponMsg) {
            couponMsg.textContent = test.message;
            couponMsg.style.color = "var(--color-error)";
          }
          UI.showToast(test.message, "error");
        }
        renderCart();
      });
    }
  },

  // ----------------------------------------------------
  // 5. CHECKOUT PAGE
  // ----------------------------------------------------
  initCheckoutPage() {
    const cart = Cart.getCart();
    if (cart.length === 0) {
      window.location.href = "cart.html";
      return;
    }

    const itemsSummary = document.getElementById("checkout-items-summary");
    const form = document.getElementById("checkout-form");
    let appliedCoupon = localStorage.getItem("deepfeel_active_coupon") || "";
    let selectedShipping = "standard";
    let includeGift = false;

    // Gift Checkbox
    const giftCheck = document.getElementById("checkout-gift-packaging");
    if (giftCheck) {
      giftCheck.addEventListener("change", (e) => {
        includeGift = e.target.checked;
        renderSummary();
      });
    }

    // Shipping Radios
    const shippingRadios = document.querySelectorAll("input[name='shipping-method']");
    shippingRadios.forEach(r => {
      r.addEventListener("change", (e) => {
        selectedShipping = e.target.value;
        renderSummary();
      });
    });

    const renderSummary = () => {
      if (itemsSummary) {
        itemsSummary.innerHTML = cart.map(item => `
          <div class="checkout-summary-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.9rem;">
            <div style="display:flex; align-items:center; gap:0.8rem;">
              <img src="${item.image}" alt="${item.name}" style="width:48px; height:48px; object-fit:cover; border-radius:4px;" />
              <div>
                <strong style="font-size:0.9rem;">${item.name}</strong>
                <span style="font-size:0.78rem; color:var(--text-muted); display:block;">Qty: ${item.quantity} • ${item.size || '50ml'}</span>
              </div>
            </div>
            <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
          </div>
        `).join("");
      }

      const totals = Cart.getTotals(appliedCoupon, selectedShipping, includeGift);
      
      const subtotalEl = document.getElementById("chk-subtotal");
      const discountRow = document.getElementById("chk-discount-row");
      const discountEl = document.getElementById("chk-discount");
      const shipEl = document.getElementById("chk-shipping");
      const giftRow = document.getElementById("chk-gift-row");
      const giftEl = document.getElementById("chk-gift");
      const taxEl = document.getElementById("chk-tax");
      const totalEl = document.getElementById("chk-total");

      if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
      if (shipEl) shipEl.textContent = totals.isFreeShipping ? "FREE" : `$${totals.shipping.toFixed(2)}`;
      if (taxEl) taxEl.textContent = `$${totals.tax.toFixed(2)}`;
      if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`;

      if (giftRow && giftEl) {
        giftRow.style.display = includeGift ? "flex" : "none";
        giftEl.textContent = `$${totals.giftFee.toFixed(2)}`;
      }

      if (discountRow && discountEl) {
        if (totals.discount > 0) {
          discountRow.style.display = "flex";
          discountEl.textContent = `-$${totals.discount.toFixed(2)}`;
        } else {
          discountRow.style.display = "none";
        }
      }
    };

    renderSummary();

    // Auto-fill logged in user info
    const currentUser = Auth.getCurrentUser();
    if (currentUser) {
      if (document.getElementById("first-name")) document.getElementById("first-name").value = currentUser.name.split(" ")[0] || "";
      if (document.getElementById("last-name")) document.getElementById("last-name").value = currentUser.name.split(" ")[1] || "";
      if (document.getElementById("email")) document.getElementById("email").value = currentUser.email || "";
      if (document.getElementById("phone") && currentUser.phone) document.getElementById("phone").value = currentUser.phone;
      if (currentUser.address) {
        if (document.getElementById("address")) document.getElementById("address").value = currentUser.address.street || "";
        if (document.getElementById("city")) document.getElementById("city").value = currentUser.address.city || "";
        if (document.getElementById("state")) document.getElementById("state").value = currentUser.address.state || "";
        if (document.getElementById("zip")) document.getElementById("zip").value = currentUser.address.zip || "";
      }
    }

    // Checkout Form Submission
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const firstName = document.getElementById("first-name").value.trim();
        const lastName = document.getElementById("last-name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();
        const city = document.getElementById("city").value.trim();
        const state = document.getElementById("state").value.trim();
        const zip = document.getElementById("zip").value.trim();

        if (!firstName || !email || !address || !city || !zip) {
          UI.showToast("Please fill in all required shipping fields", "error");
          return;
        }

        const totals = Cart.getTotals(appliedCoupon, selectedShipping, includeGift);
        const orderItems = cart.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          size: item.size || "50ml",
          variant: `${item.size || '50ml'} Flacon`
        }));

        const newOrder = Store.createOrder({
          userId: currentUser ? currentUser.id : "guest",
          customer: {
            name: `${firstName} ${lastName}`,
            email,
            phone,
            address: `${address}, ${city}, ${state} ${zip}, United States`
          },
          items: orderItems,
          giftPackaging: includeGift,
          giftPackagingFee: totals.giftFee,
          subtotal: totals.subtotal,
          discount: totals.discount,
          couponCode: appliedCoupon,
          shipping: totals.shipping,
          tax: totals.tax,
          total: totals.total,
          paymentMethod: document.querySelector("input[name='payment-method']:checked")?.value || "Credit Card"
        });

        // Clear cart & coupons
        Cart.clearCart();
        localStorage.removeItem("deepfeel_active_coupon");

        // Redirect to receipt
        window.location.href = `order-confirmation.html?id=${newOrder.id}`;
      });
    }
  },

  // ----------------------------------------------------
  // 6. ORDER CONFIRMATION
  // ----------------------------------------------------
  initOrderConfirmationPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("id");
    const order = orderId ? Store.getOrderById(orderId) : Store.getOrders()[0];

    if (!order) {
      window.location.href = "index.html";
      return;
    }

    const refEl = document.getElementById("confirm-order-ref");
    const dateEl = document.getElementById("confirm-order-date");
    const emailEl = document.getElementById("confirm-order-email");
    const addrEl = document.getElementById("confirm-shipping-address");
    const totalEl = document.getElementById("confirm-order-total");
    const itemsTable = document.getElementById("confirm-items-table");
    const timelineWrap = document.getElementById("confirm-timeline");

    if (refEl) refEl.textContent = order.id;
    if (dateEl) dateEl.textContent = new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    if (emailEl) emailEl.textContent = order.customer.email;
    if (addrEl) addrEl.textContent = order.customer.address;
    if (totalEl) totalEl.textContent = `$${order.total.toFixed(2)}`;

    if (itemsTable && order.items) {
      itemsTable.innerHTML = order.items.map(item => `
        <tr>
          <td style="display:flex; align-items:center; gap:0.8rem; padding:0.8rem 0;">
            <img src="${item.image}" alt="${item.name}" style="width:44px; height:44px; object-fit:cover; border-radius:4px;" />
            <div>
              <strong>${item.name}</strong>
              <span style="font-size:0.8rem; color:var(--text-muted); display:block;">${item.size || '50ml'} • Qty: ${item.quantity}</span>
            </div>
          </td>
          <td>$${item.price.toFixed(2)}</td>
          <td>$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `).join("");
    }

    if (timelineWrap && order.timeline) {
      timelineWrap.innerHTML = order.timeline.map((step, idx) => `
        <div class="timeline-step ${step.completed ? 'completed' : ''}">
          <div class="timeline-dot"></div>
          <div class="timeline-info">
            <strong>${step.status}</strong>
            <span class="text-muted" style="font-size:0.8rem; display:block;">${step.date}</span>
          </div>
        </div>
      `).join("");
    }
  },

  // ----------------------------------------------------
  // 7. WISHLIST PAGE
  // ----------------------------------------------------
  initWishlistPage() {
    const grid = document.getElementById("wishlist-grid");
    const emptyState = document.getElementById("wishlist-empty-state");
    if (!grid) return;

    const renderWishlist = () => {
      const items = Wishlist.getDetailedItems();
      if (items.length === 0) {
        grid.style.display = "none";
        if (emptyState) emptyState.style.display = "block";
        return;
      }

      if (emptyState) emptyState.style.display = "none";
      grid.style.display = "grid";
      grid.innerHTML = items.map(p => UI.renderProductCard(p)).join("");
    };

    renderWishlist();

    window.addEventListener("wishlist:updated", renderWishlist);
  },

  // ----------------------------------------------------
  // 8. CATEGORIES HUB PAGE
  // ----------------------------------------------------
  initCategoriesPage() {
    const grid = document.getElementById("categories-hub-grid");
    if (!grid) return;

    const cats = Store.getCategories();
    grid.innerHTML = cats.map(cat => {
      const count = Store.getProducts({ category: cat.slug, status: "active" }).length;
      return `
        <article class="category-card">
          <a href="shop.html?category=${cat.slug}" class="category-card-link">
            <img src="${cat.image}" alt="${cat.name}" class="category-card-image" loading="lazy" />
            <div class="category-card-overlay">
              <span class="category-card-subtitle">${count} Distinct Creations</span>
              <h3 class="category-card-title font-serif">${cat.name}</h3>
              <p class="category-card-desc">${cat.description}</p>
              <span class="category-card-cta">Explore Collection &rarr;</span>
            </div>
          </a>
        </article>
      `;
    }).join("");
  },

  // ----------------------------------------------------
  // 9. CUSTOMER ACCOUNT & ORDERS
  // ----------------------------------------------------
  initAccountPage() {
    Auth.requireAuth();
    const user = Auth.getCurrentUser();
    if (!user) return;

    const nameEl = document.getElementById("account-user-name");
    const emailEl = document.getElementById("account-user-email");
    if (nameEl) nameEl.textContent = user.name;
    if (emailEl) emailEl.textContent = user.email;

    const form = document.getElementById("account-profile-form");
    if (form) {
      if (document.getElementById("profile-name")) document.getElementById("profile-name").value = user.name || "";
      if (document.getElementById("profile-phone")) document.getElementById("profile-phone").value = user.phone || "";
      if (user.address) {
        if (document.getElementById("profile-street")) document.getElementById("profile-street").value = user.address.street || "";
        if (document.getElementById("profile-city")) document.getElementById("profile-city").value = user.address.city || "";
        if (document.getElementById("profile-state")) document.getElementById("profile-state").value = user.address.state || "";
        if (document.getElementById("profile-zip")) document.getElementById("profile-zip").value = user.address.zip || "";
      }

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const updated = {
          ...user,
          name: document.getElementById("profile-name").value.trim(),
          phone: document.getElementById("profile-phone").value.trim(),
          address: {
            street: document.getElementById("profile-street").value.trim(),
            city: document.getElementById("profile-city").value.trim(),
            state: document.getElementById("profile-state").value.trim(),
            zip: document.getElementById("profile-zip").value.trim(),
            country: "United States"
          }
        };
        Store.saveUser(updated);
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
        UI.showToast("Patron profile & address updated successfully", "success");
      });
    }

    const logoutBtn = document.getElementById("account-logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => Auth.logout());
    }
  },

  initOrdersPage() {
    Auth.requireAuth();
    const user = Auth.getCurrentUser();
    const ordersTableBody = document.getElementById("customer-orders-table-body");
    const emptyOrders = document.getElementById("customer-orders-empty");
    if (!ordersTableBody || !user) return;

    const orders = Store.getOrdersByUser(user.id);

    if (orders.length === 0) {
      ordersTableBody.parentElement.style.display = "none";
      if (emptyOrders) emptyOrders.style.display = "block";
      return;
    }

    if (emptyOrders) emptyOrders.style.display = "none";
    ordersTableBody.parentElement.style.display = "table";

    ordersTableBody.innerHTML = orders.map(ord => `
      <tr>
        <td><strong>${ord.id}</strong></td>
        <td>${new Date(ord.createdAt).toLocaleDateString()}</td>
        <td>${ord.items ? ord.items.length : 1} flacon${ord.items && ord.items.length > 1 ? 's' : ''}</td>
        <td><strong>$${ord.total.toFixed(2)}</strong></td>
        <td><span class="status-pill status-${ord.status.toLowerCase()}">${ord.status}</span></td>
        <td>
          <a href="order-confirmation.html?id=${ord.id}" class="btn btn-outline btn-sm">Receipt &rarr;</a>
        </td>
      </tr>
    `).join("");
  },

  // ----------------------------------------------------
  // 10. AUTH PAGES (LOGIN / REGISTER)
  // ----------------------------------------------------
  initAuthPages() {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const result = Auth.login(email, password);
        if (result.success) {
          window.location.href = result.user.role === "admin" ? "admin/index.html" : "account.html";
        }
      });

      // Quick Demo Fillers
      const demoCust = document.getElementById("fill-demo-customer-btn");
      const demoAdmin = document.getElementById("fill-demo-admin-btn");
      if (demoCust) {
        demoCust.addEventListener("click", () => {
          document.getElementById("email").value = "elena.vance@example.com";
          document.getElementById("password").value = "password123";
        });
      }
      if (demoAdmin) {
        demoAdmin.addEventListener("click", () => {
          document.getElementById("email").value = "admin@deepfeel.com";
          document.getElementById("password").value = "admin123";
        });
      }
    }

    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const phone = document.getElementById("phone") ? document.getElementById("phone").value.trim() : "";

        const result = Auth.register({ name, email, password, phone });
        if (result.success) {
          window.location.href = "account.html";
        }
      });
    }
  },

  // ----------------------------------------------------
  // 11. FAQ & CONTACT PAGES
  // ----------------------------------------------------
  initFaqPage() {
    const headers = document.querySelectorAll(".faq-header");
    headers.forEach(h => {
      h.addEventListener("click", () => {
        const item = h.parentElement;
        item.classList.toggle("open");
      });
    });
  },

  initContactPage() {
    const form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        UI.showToast("Thank you. Our fragrance concierge will respond within 24 hours.", "success");
        form.reset();
      });
    }
  },

  initAboutPage() {
    // Brand narrative is statically authored in about.html
  }
};

// Bootstrap application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
