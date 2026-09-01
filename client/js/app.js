/**
 * DEEPFEEL — Master Storefront Page Controller
 * Powers the luxury fragrance campaign, interactive mood discovery,
 * shop filters, PDP zoom & size selection, journal articles, and checkout.
 */

const App = {
  init() {
    const path = window.location.pathname.toLowerCase();

    if (path.endsWith("index.html") || path === "/" || path.endsWith("/deepfeel/") || path.endsWith("/deepfeel")) {
      this.initHomePage();
    } else if (path.endsWith("shop.html")) {
      this.initShopPage();
    } else if (path.endsWith("product.html")) {
      this.initProductDetailPage();
    } else if (path.endsWith("journal.html")) {
      this.initJournalPage();
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

    Wishlist.updateBadges();
    Cart.updateBadges();
  },

  // ----------------------------------------------------
  // 1. HOMEPAGE
  // ----------------------------------------------------
  initHomePage() {
    // 1. The Most Wanted (Bestsellers)
    const bestsellersGrid = document.getElementById("bestsellers-grid");
    if (bestsellersGrid) {
      const bestsellers = Store.getProducts({ bestseller: true, status: "active" }).slice(0, 4);
      bestsellersGrid.innerHTML = bestsellers.map(p => UI.renderProductCard(p)).join("");
    }

    // 2. The Oud Collection Showcase
    const oudGrid = document.getElementById("oud-showcase-grid");
    if (oudGrid) {
      const oudProducts = Store.getProducts({ category: "oud-collection", status: "active" }).slice(0, 4);
      oudGrid.innerHTML = oudProducts.map(p => UI.renderProductCard(p)).join("");
    }

    // 3. Interactive Fragrance Discovery Mood Matchmaker
    this.initMoodDiscovery();

    // 4. Journal Preview Cards
    const journalGrid = document.getElementById("journal-preview-grid");
    if (journalGrid) {
      const articles = Store.getJournalArticles().slice(0, 3);
      journalGrid.innerHTML = articles.map(art => `
        <article class="journal-card">
          <a href="journal.html#${art.slug}" class="journal-card-media">
            <img src="${art.image}" alt="${art.title}" loading="lazy" />
          </a>
          <span class="journal-card-date">${art.category} • ${art.date}</span>
          <h3 class="journal-card-title">
            <a href="journal.html#${art.slug}">${art.title}</a>
          </h3>
          <p class="journal-card-excerpt">${art.excerpt}</p>
          <div>
            <a href="journal.html#${art.slug}" class="link-editorial">Read Article &rarr;</a>
          </div>
        </article>
      `).join("");
    }
  },

  initMoodDiscovery() {
    const moodBtns = document.querySelectorAll(".mood-btn");
    const resultsContainer = document.getElementById("mood-results-grid");
    if (!moodBtns.length || !resultsContainer) return;

    const loadMood = (mood) => {
      const matching = Store.recommendByMood(mood);
      if (!matching.length) {
        resultsContainer.innerHTML = `<p style="text-align:center; grid-column:1/-1; color:var(--text-muted);">Select a mood above to explore matching extraits.</p>`;
        return;
      }
      resultsContainer.innerHTML = matching.map(p => UI.renderProductCard(p)).join("");
    };

    // Default load: Woody
    loadMood("Woody");

    moodBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        moodBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        loadMood(btn.dataset.mood || btn.textContent.trim());
      });
    });
  },

  // ----------------------------------------------------
  // 2. SHOP CATALOG
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

    const genderFilters = document.querySelectorAll("input[name='gender-filter']");
    const familyFilters = document.querySelectorAll("input[name='family-filter']");
    const concentrationFilters = document.querySelectorAll("input[name='concentration-filter']");
    const seasonFilters = document.querySelectorAll("input[name='season-filter']");
    const priceSlider = document.getElementById("price-range-slider");
    const priceDisplay = document.getElementById("price-range-val");
    const inStockCheckbox = document.getElementById("in-stock-only");
    const sortSelect = document.getElementById("shop-sort-select");
    const resetFiltersBtn = document.getElementById("reset-filters-btn");
    const categorySelect = document.getElementById("shop-category-filter");

    if (categorySelect) {
      const cats = Store.getCategories();
      categorySelect.innerHTML = `<option value="all">All Fragrance Collections</option>` +
        cats.map(c => `<option value="${c.slug}" ${c.slug === initialCategory ? 'selected' : ''}>${c.name}</option>`).join("");
    }

    if (priceSlider && priceDisplay) {
      priceDisplay.textContent = `Rs. ${Number(priceSlider.value).toLocaleString()}`;
      priceSlider.addEventListener("input", (e) => {
        priceDisplay.textContent = `Rs. ${Number(e.target.value).toLocaleString()}`;
        renderFilteredShop();
      });
    }

    const renderFilteredShop = () => {
      let selectedGender = "all";
      genderFilters.forEach(r => { if (r.checked) selectedGender = r.value; });

      let selectedFamily = "all";
      familyFilters.forEach(r => { if (r.checked) selectedFamily = r.value; });

      let selectedConcentration = "all";
      concentrationFilters.forEach(r => { if (r.checked) selectedConcentration = r.value; });

      let selectedSeason = "all";
      seasonFilters.forEach(r => { if (r.checked) selectedSeason = r.value; });

      const maxPrice = priceSlider ? Number(priceSlider.value) : 50000;

      const inStockOnly = inStockCheckbox ? inStockCheckbox.checked : false;
      const sortBy = sortSelect ? sortSelect.value : "featured";
      const cat = categorySelect ? categorySelect.value : initialCategory;

      const products = Store.getProducts({
        category: cat,
        gender: selectedGender !== "all" ? selectedGender : undefined,
        fragranceFamily: selectedFamily !== "all" ? selectedFamily : undefined,
        concentration: selectedConcentration !== "all" ? selectedConcentration : undefined,
        season: selectedSeason !== "all" ? selectedSeason : undefined,
        maxPrice,
        inStockOnly,
        sortBy,
        search: initialSearch,
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
      renderFilteredShop();
    };

    [...genderFilters, ...familyFilters, ...concentrationFilters, ...seasonFilters].forEach(el => {
      el.addEventListener("change", renderFilteredShop);
    });
    if (categorySelect) categorySelect.addEventListener("change", renderFilteredShop);
    if (inStockCheckbox) inStockCheckbox.addEventListener("change", renderFilteredShop);
    if (sortSelect) sortSelect.addEventListener("change", renderFilteredShop);
    if (resetFiltersBtn) resetFiltersBtn.addEventListener("click", resetAllFilters);

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

    Store.addRecentlyViewed(product.id);
    document.title = `${product.name} — Maison DeepFeel`;

    // Populate Product Information
    const titleEl = document.getElementById("pdp-product-title");
    const categoryEl = document.getElementById("pdp-product-category");
    const concentrationEl = document.getElementById("pdp-product-concentration");
    const familyEl = document.getElementById("pdp-product-family");
    const priceEl = document.getElementById("pdp-product-price");
    const descEl = document.getElementById("pdp-product-desc");
    const ratingEl = document.getElementById("pdp-rating-stars");
    const reviewCountEl = document.getElementById("pdp-review-count");

    if (titleEl) titleEl.textContent = product.name;
    if (categoryEl) categoryEl.textContent = product.category;
    if (concentrationEl) concentrationEl.textContent = product.concentration || "Extrait de Parfum";
    if (familyEl) familyEl.textContent = product.fragranceFamily || "Woody Amber";
    if (descEl) descEl.textContent = product.description || product.shortDescription;
    if (ratingEl) ratingEl.innerHTML = UI.renderStars(product.rating || 5);
    if (reviewCountEl) reviewCountEl.textContent = `(${product.reviewCount || 0} reviews)`;

    // Image Gallery & Zoom
    const mainImage = document.getElementById("pdp-main-image");
    const thumbsContainer = document.getElementById("pdp-thumbs-container");
    if (mainImage && product.images && product.images.length) {
      mainImage.src = product.images[0];
      mainImage.alt = product.name;

      if (thumbsContainer) {
        thumbsContainer.innerHTML = product.images.map((img, i) => `
          <button type="button" class="pdp-thumb-btn ${i === 0 ? 'active' : ''}" data-img-src="${img}" style="width:64px; height:80px; overflow:hidden; border-radius:var(--radius-xs); border:1px solid var(--border-medium); opacity:${i === 0 ? 1 : 0.6};">
            <img src="${img}" alt="${product.name} view ${i + 1}" style="width:100%; height:100%; object-fit:cover;" />
          </button>
        `).join("");

        const thumbBtns = thumbsContainer.querySelectorAll(".pdp-thumb-btn");
        thumbBtns.forEach(btn => {
          btn.addEventListener("click", () => {
            thumbBtns.forEach(b => { b.classList.remove("active"); b.style.opacity = "0.6"; });
            btn.classList.add("active");
            btn.style.opacity = "1";
            mainImage.src = btn.dataset.imgSrc;
          });
        });
      }

      // Smooth Vanilla JS Image Zoom on hover
      const zoomContainer = document.getElementById("pdp-zoom-container");
      if (zoomContainer) {
        zoomContainer.addEventListener("mousemove", (e) => {
          const rect = zoomContainer.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          mainImage.style.transformOrigin = `${x}% ${y}%`;
          mainImage.style.transform = "scale(1.7)";
        });

        zoomContainer.addEventListener("mouseleave", () => {
          mainImage.style.transform = "scale(1)";
          mainImage.style.transformOrigin = "center center";
        });
      }
    }

    // Size Selection & Dynamic Price Calculation
    let selectedSize = (product.sizes && product.sizes.length) ? product.sizes[0] : "50ml";
    let activePrice = (product.sizePricing && product.sizePricing[selectedSize]) ? product.sizePricing[selectedSize] : product.price;

    const updatePriceDisplay = () => {
      if (priceEl) priceEl.textContent = Store.formatCurrency(activePrice);
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
            ${s} — ${Store.formatCurrency(pVal)}
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

    // Scent Specs Grid
    const specsContainer = document.getElementById("pdp-scent-specs-wrap");
    if (specsContainer) {
      specsContainer.innerHTML = UI.renderScentSpecs(product);
    }

    // Story Behind The Scent Editorial Section
    const storyContainer = document.getElementById("pdp-scent-story-wrap");
    if (storyContainer) {
      storyContainer.innerHTML = `
        <div style="background:var(--bg-secondary); border-radius:var(--radius-xs); padding:3.5rem 2.5rem; margin:3rem 0;">
          <span class="editorial-tagline">Atelier Story</span>
          <h2 class="editorial-heading-md" style="margin-bottom:1rem;">The Story Behind ${product.name}</h2>
          <p class="editorial-quote" style="margin-bottom:1.5rem;">"${product.story || product.description}"</p>
          <p class="editorial-lead" style="font-size:1rem;">
            Formulated in small numbered batches and aged for 90 days in temperature-regulated cold cellars in Grasse and Portland.
          </p>
        </div>
      `;
    }

    // Add to Bag & Instant Checkout
    const addBtn = document.getElementById("pdp-add-to-bag-btn");
    const buyNowBtn = document.getElementById("pdp-buy-now-btn");

    if (addBtn && product.stock > 0) {
      addBtn.addEventListener("click", () => {
        Cart.addItem(product.id, 1, { size: selectedSize, price: activePrice });
        UI.openCartDrawer();
      });
    }

    if (buyNowBtn && product.stock > 0) {
      buyNowBtn.addEventListener("click", () => {
        Cart.addItem(product.id, 1, { size: selectedSize, price: activePrice });
        window.location.href = "checkout.html";
      });
    }

    // Wishlist Toggle
    const pdpWishBtn = document.getElementById("pdp-wishlist-toggle");
    if (pdpWishBtn) {
      const isWish = Wishlist.hasItem(product.id);
      pdpWishBtn.classList.toggle("active", isWish);
      pdpWishBtn.addEventListener("click", () => {
        Wishlist.toggleItem(product.id);
        pdpWishBtn.classList.toggle("active", Wishlist.hasItem(product.id));
      });
    }

    // Reviews List & Submission
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
        reviewsList.innerHTML = `<p class="text-muted" style="padding:1rem 0;">Be the first fragrance connoisseur to leave an olfactory review.</p>`;
        return;
      }

      reviewsList.innerHTML = reviews.map(r => `
        <div style="border-bottom:1px solid var(--border-light); padding:1.4rem 0;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <strong>${r.author}</strong>
            <span class="text-muted" style="font-size:0.8rem;">${r.date}</span>
          </div>
          <div style="margin-bottom:0.4rem;">${UI.renderStars(r.rating)}</div>
          <p style="font-size:0.92rem; color:var(--text-secondary); line-height:1.6;">${r.content}</p>
        </div>
      `).join("");
    };

    renderReviews();

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const author = document.getElementById("review-author").value.trim();
        const rating = parseInt(document.getElementById("review-rating").value, 10) || 5;
        const content = document.getElementById("review-content").value.trim();

        if (!author || !content) {
          UI.showToast("Please fill in your name and review", "error");
          return;
        }

        Store.addReview({ productId, author, rating, content });
        form.reset();
        UI.showToast("Thank you. Your review has been published.", "success");
        renderReviews();
      });
    }
  },

  // ----------------------------------------------------
  // 4. JOURNAL PAGE
  // ----------------------------------------------------
  initJournalPage() {
    const grid = document.getElementById("journal-articles-grid");
    if (!grid) return;

    const articles = Store.getJournalArticles();
    grid.innerHTML = articles.map(art => `
      <article class="journal-card" id="${art.slug}">
        <div class="journal-card-media">
          <img src="${art.image}" alt="${art.title}" loading="lazy" />
        </div>
        <span class="journal-card-date">${art.category} • ${art.date} (${art.readTime})</span>
        <h2 class="journal-card-title">${art.title}</h2>
        <p class="journal-card-excerpt">${art.excerpt}</p>
        <div style="font-size:0.95rem; line-height:1.8; color:var(--text-secondary); margin-top:0.8rem; border-top:1px solid var(--border-light); padding-top:1rem;">
          ${art.content.replace(/\n\n/g, '<br><br>')}
        </div>
      </article>
    `).join("");
  },

  // ----------------------------------------------------
  // 5. CART PAGE
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
          <td style="display:flex; align-items:center; gap:1rem; padding:1rem 0;">
            <img src="${item.image}" alt="${item.name}" style="width:64px; height:80px; object-fit:cover; border-radius:var(--radius-xs);" />
            <div>
              <h3 style="font-family:var(--font-display); font-size:1.15rem;"><a href="product.html?id=${item.productId}">${item.name}</a></h3>
              <span style="font-size:0.78rem; color:var(--text-muted); text-transform:uppercase;">${item.size || '50ml'} • ${item.concentration || 'Extrait'}</span>
            </div>
          </td>
          <td>${Store.formatCurrency(item.price)}</td>
          <td>
            <div style="display:inline-flex; border:1px solid var(--border-medium); border-radius:var(--radius-xs);">
              <button type="button" class="cart-minus" data-id="${item.productId}" data-vkey="${item.variantKey}" style="padding:4px 10px;">-</button>
              <span style="padding:4px 10px; font-weight:600;">${item.quantity}</span>
              <button type="button" class="cart-plus" data-id="${item.productId}" data-vkey="${item.variantKey}" style="padding:4px 10px;">+</button>
            </div>
          </td>
          <td><strong>${Store.formatCurrency(item.price * item.quantity)}</strong></td>
          <td>
            <button type="button" class="cart-remove-btn" data-id="${item.productId}" data-vkey="${item.variantKey}" style="font-size:1.2rem; color:var(--text-muted);">&times;</button>
          </td>
        </tr>
      `).join("");

      const totals = Cart.getTotals(appliedCoupon, "standard", includeGiftPackaging);
      
      const subtotalEl = document.getElementById("cart-subtotal");
      const discountRow = document.getElementById("cart-discount-row");
      const discountEl = document.getElementById("cart-discount");
      const shippingEl = document.getElementById("cart-shipping");
      const giftRow = document.getElementById("cart-gift-row");
      const giftEl = document.getElementById("cart-gift-fee");
      const totalEl = document.getElementById("cart-total");

      if (subtotalEl) subtotalEl.textContent = Store.formatCurrency(totals.subtotal);
      if (shippingEl) shippingEl.textContent = totals.isFreeShipping ? "FREE" : Store.formatCurrency(totals.shipping);
      if (totalEl) totalEl.textContent = Store.formatCurrency(totals.total);

      if (giftRow && giftEl) {
        giftRow.style.display = includeGiftPackaging ? "flex" : "none";
        giftEl.textContent = Store.formatCurrency(totals.giftFee);
      }

      if (discountRow && discountEl) {
        if (totals.discount > 0) {
          discountRow.style.display = "flex";
          discountEl.textContent = `-${Store.formatCurrency(totals.discount)}`;
        } else {
          discountRow.style.display = "none";
        }
      }
    };

    renderCart();

    tableBody.addEventListener("click", (e) => {
      const minus = e.target.closest(".cart-minus");
      if (minus) {
        const item = Cart.getCart().find(i => i.productId === minus.dataset.id && i.variantKey === minus.dataset.vkey);
        if (item) Cart.updateQuantity(minus.dataset.id, minus.dataset.vkey, item.quantity - 1);
        renderCart();
        return;
      }

      const plus = e.target.closest(".cart-plus");
      if (plus) {
        const item = Cart.getCart().find(i => i.productId === plus.dataset.id && i.variantKey === plus.dataset.vkey);
        if (item) Cart.updateQuantity(plus.dataset.id, plus.dataset.vkey, item.quantity + 1);
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
  },

  // ----------------------------------------------------
  // 6. CHECKOUT PAGE (PAKISTANI METHODS: COD, EASYPAISA, JAZZCASH, CARDS)
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

    // Toggle Pakistani payment method instruction fields
    const paymentRadios = document.querySelectorAll("input[name='payment-method']");
    const epFields = document.getElementById("easypaisa-fields");
    const jcFields = document.getElementById("jazzcash-fields");
    const cardFields = document.getElementById("card-fields");
    const bankFields = document.getElementById("bank-fields");

    const updatePaymentFields = () => {
      const selected = document.querySelector("input[name='payment-method']:checked")?.value;
      if (epFields) epFields.style.display = selected === "Easypaisa Mobile Account" ? "block" : "none";
      if (jcFields) jcFields.style.display = selected === "JazzCash Mobile Account" ? "block" : "none";
      if (cardFields) cardFields.style.display = selected === "Credit / Debit Card" ? "block" : "none";
      if (bankFields) bankFields.style.display = selected === "Direct Bank Transfer (IBFT / Raast)" ? "block" : "none";
    };

    paymentRadios.forEach(radio => {
      radio.addEventListener("change", updatePaymentFields);
    });
    updatePaymentFields();

    // Promo Code Application Handler
    const applyCouponBtn = document.getElementById("chk-apply-coupon");
    const couponInput = document.getElementById("checkout-coupon");
    const couponMsg = document.getElementById("chk-coupon-msg");

    if (applyCouponBtn && couponInput) {
      applyCouponBtn.addEventListener("click", () => {
        const code = couponInput.value.trim().toUpperCase();
        if (!code) return;
        const subtotal = Cart.getSubtotal();
        const validation = Store.validateCoupon(code, subtotal);
        if (validation.valid) {
          appliedCoupon = code;
          localStorage.setItem("deepfeel_active_coupon", code);
          if (couponMsg) {
            couponMsg.innerHTML = `<span style="color:#166534; font-weight:600;">✓ ${validation.message}</span>`;
          }
          renderSummary();
        } else {
          if (couponMsg) {
            couponMsg.innerHTML = `<span style="color:#DC2626; font-weight:600;">✕ ${validation.message}</span>`;
          }
        }
      });
    }

    const renderSummary = () => {
      if (itemsSummary) {
        itemsSummary.innerHTML = cart.map(item => `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.9rem; border-bottom:1px solid var(--border-light); padding-bottom:0.75rem;">
            <div style="display:flex; align-items:center; gap:0.8rem;">
              <img src="${item.image}" alt="${item.name}" style="width:48px; height:60px; object-fit:cover; border-radius:var(--radius-xs);" />
              <div>
                <strong style="font-family:var(--font-display); font-size:1rem; display:block;">${item.name}</strong>
                <span style="font-size:0.75rem; color:var(--text-muted); display:block;">${item.size || '50ml'} • Qty: ${item.quantity}</span>
              </div>
            </div>
            <strong>${Store.formatCurrency(item.price * item.quantity)}</strong>
          </div>
        `).join("");
      }

      const totals = Cart.getTotals(appliedCoupon, selectedShipping);
      
      const subtotalEl = document.getElementById("chk-subtotal");
      const discountRow = document.getElementById("chk-discount-row");
      const discountEl = document.getElementById("chk-discount");
      const shipEl = document.getElementById("chk-shipping");
      const totalEl = document.getElementById("chk-total");

      if (subtotalEl) subtotalEl.textContent = Store.formatCurrency(totals.subtotal);
      if (shipEl) shipEl.textContent = totals.isFreeShipping ? "FREE" : Store.formatCurrency(totals.shipping);
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

    renderSummary();

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const firstName = document.getElementById("first-name")?.value.trim();
        const lastName = document.getElementById("last-name")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const phone = document.getElementById("phone")?.value.trim();
        const city = document.getElementById("city")?.value.trim();
        const address = document.getElementById("address")?.value.trim();
        const landmark = document.getElementById("landmark")?.value.trim();
        const paymentMethodVal = document.querySelector("input[name='payment-method']:checked")?.value || "Cash on Delivery (COD)";

        if (!firstName || !email || !phone || !city || !address) {
          UI.showToast("Please complete all required delivery details (Name, Email, WhatsApp & Address)", "error");
          return;
        }

        // Build specific payment detail string
        let fullPaymentMethod = paymentMethodVal;
        if (paymentMethodVal === "Easypaisa Mobile Account") {
          const epSender = document.getElementById("ep-sender")?.value.trim();
          const epTid = document.getElementById("ep-tid")?.value.trim();
          fullPaymentMethod = `Easypaisa (Sender: ${epSender || phone}${epTid ? ', TID: ' + epTid : ''})`;
        } else if (paymentMethodVal === "JazzCash Mobile Account") {
          const jcSender = document.getElementById("jc-sender")?.value.trim();
          const jcTid = document.getElementById("jc-tid")?.value.trim();
          fullPaymentMethod = `JazzCash (Sender: ${jcSender || phone}${jcTid ? ', TID: ' + jcTid : ''})`;
        }

        const totals = Cart.getTotals(appliedCoupon, selectedShipping);
        const orderItems = cart.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          size: item.size || "50ml"
        }));

        const storeSettings = Store.getSettings();
        const activeAdminEmail = storeSettings.adminEmail || "2003abdulwaris@gmail.com";

        const orderPayload = {
          userId: "patron_" + Date.now().toString(36),
          adminEmail: activeAdminEmail,
          customer: {
            name: `${firstName} ${lastName}`,
            email,
            phone,
            city,
            address: `${address}${landmark ? ' (Landmark: ' + landmark + ')' : ''}`,
            country: "Pakistan"
          },
          paymentMethod: fullPaymentMethod,
          items: orderItems,
          subtotal: totals.subtotal,
          discount: totals.discount,
          couponCode: appliedCoupon,
          shipping: totals.shipping,
          tax: totals.tax,
          total: totals.total
        };

        const submitOrder = async () => {
          let confirmedOrder = null;

          if (window.API && window.API.createOrder) {
            const apiRes = await window.API.createOrder(orderPayload);
            if (apiRes.success && apiRes.order) {
              confirmedOrder = apiRes.order;
            }
          }

          if (!confirmedOrder) {
            confirmedOrder = Store.createOrder(orderPayload);
          }

          // Track email dispatch in client record
          const dispatches = JSON.parse(localStorage.getItem("deepfeel_email_dispatches") || "[]");
          dispatches.push({
            orderId: confirmedOrder.id,
            clientEmail: email,
            senderEmail: activeAdminEmail,
            total: confirmedOrder.total,
            dispatchedAt: new Date().toISOString()
          });
          localStorage.setItem("deepfeel_email_dispatches", JSON.stringify(dispatches));

          localStorage.removeItem("deepfeel_active_coupon");
          Cart.clearCart();
          UI.showToast(`Acquisition confirmed! Order summary sent from ${activeAdminEmail} to ${email}`, "success");

          setTimeout(() => {
            window.location.href = `order-confirmation.html?id=${confirmedOrder.id}`;
          }, 400);
        };


        submitOrder();
      });
    }
  },


  // ----------------------------------------------------
  // 7. ORDER CONFIRMATION & TAX INVOICE
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
    const idBadge = document.getElementById("confirm-order-id-badge");
    const dateEl = document.getElementById("confirm-order-date");
    const emailNotice = document.getElementById("confirm-customer-email-notice");
    const custName = document.getElementById("confirm-customer-name");
    const custPhone = document.getElementById("confirm-customer-phone");
    const custEmail = document.getElementById("confirm-customer-email");
    const custAddr = document.getElementById("confirm-shipping-address");
    const payMethod = document.getElementById("confirm-payment-method");
    const payStatus = document.getElementById("confirm-payment-status");

    const subtotalEl = document.getElementById("confirm-subtotal");
    const discountRow = document.getElementById("confirm-discount-row");
    const discountEl = document.getElementById("confirm-discount");
    const shippingEl = document.getElementById("confirm-shipping");
    const totalEl = document.getElementById("confirm-order-total");
    const itemsTable = document.getElementById("confirm-items-table");

    if (refEl) refEl.textContent = order.id;
    if (idBadge) idBadge.textContent = `#${order.id}`;
    if (dateEl) dateEl.textContent = `Date: ${new Date(order.createdAt).toLocaleDateString("en-PK", { dateStyle: "long", timeStyle: "short" })}`;
    if (emailNotice && order.customer) emailNotice.textContent = order.customer.email;
    const adminSenderEl = document.getElementById("confirm-admin-sender-email");
    const activeAdminEmail = order.adminEmail || Store.getSettings().adminEmail || "2003abdulwaris@gmail.com";
    if (adminSenderEl) adminSenderEl.textContent = activeAdminEmail;


    if (custName && order.customer) custName.textContent = order.customer.name;
    if (custPhone && order.customer) custPhone.textContent = order.customer.phone || "+92 300 1234567";
    if (custEmail && order.customer) custEmail.textContent = order.customer.email;
    if (custAddr && order.customer) custAddr.textContent = `${order.customer.address}${order.customer.city ? ', ' + order.customer.city : ''}, Pakistan`;

    if (payMethod) payMethod.textContent = order.paymentMethod || "Cash on Delivery (COD)";
    if (payStatus) {
      const isPaid = order.paymentStatus === "Paid" || (order.paymentStatus && order.paymentStatus.includes("Paid"));
      payStatus.innerHTML = `
        <span style="font-size:0.75rem; font-weight:700; color:${isPaid ? '#166534' : '#854D0E'}; background:${isPaid ? '#DCFCE7' : '#FEF9C3'}; padding:0.18rem 0.6rem; border-radius:3px;">
          ${order.paymentStatus || 'Pending Collection on Delivery'}
        </span>
      `;
    }

    if (subtotalEl) subtotalEl.textContent = Store.formatCurrency(order.subtotal);
    if (shippingEl) shippingEl.textContent = order.shipping === 0 ? "FREE" : Store.formatCurrency(order.shipping);
    if (totalEl) totalEl.textContent = Store.formatCurrency(order.total);

    if (discountRow && discountEl) {
      if (order.discount && order.discount > 0) {
        discountRow.style.display = "flex";
        discountEl.textContent = `-${Store.formatCurrency(order.discount)}`;
      } else {
        discountRow.style.display = "none";
      }
    }

    if (itemsTable && order.items) {
      itemsTable.innerHTML = order.items.map(item => `
        <tr style="border-bottom: 1px solid var(--border-light);">
          <td style="display:flex; align-items:center; gap:0.8rem; padding:0.8rem 0.5rem 0.8rem 0;">
            <img src="${item.image}" alt="${item.name}" style="width:48px; height:60px; object-fit:cover; border-radius:var(--radius-xs);" />
            <div>
              <strong style="font-family:var(--font-display); font-size:1.05rem; display:block;">${item.name}</strong>
              <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Extrait de Parfum</span>
            </div>
          </td>
          <td style="text-align:center; padding:0.8rem 0.5rem; font-size:0.88rem;">${item.size || '50ml'}</td>
          <td style="text-align:center; padding:0.8rem 0.5rem; font-weight:600;">${item.quantity}</td>
          <td style="text-align:right; padding:0.8rem 0.5rem; font-size:0.92rem;">${Store.formatCurrency(item.price)}</td>
          <td style="text-align:right; padding:0.8rem 0 0.8rem 0.5rem; font-weight:700; font-size:0.95rem;">${Store.formatCurrency(item.price * item.quantity)}</td>
        </tr>
      `).join("");
    }
  },


  // ----------------------------------------------------
  // 8. WISHLIST & CATEGORIES & STATIC PAGES
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

  initCategoriesPage() {
    const grid = document.getElementById("categories-hub-grid");
    if (!grid) return;

    const cats = Store.getCategories();
    grid.innerHTML = cats.map(cat => `
      <article class="category-card" style="position:relative; aspect-ratio:3/4; overflow:hidden; border-radius:var(--radius-xs); background:var(--bg-dark);">
        <a href="shop.html?category=${cat.slug}" style="display:block; width:100%; height:100%;">
          <img src="${cat.image}" alt="${cat.name}" style="width:100%; height:100%; object-fit:cover; opacity:0.8; transition:transform 0.6s ease;" />
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(14,14,16,0.9) 0%, transparent 60%); display:flex; flex-direction:column; justify-content:flex-end; padding:2rem; color:#FFFFFF;">
            <h3 style="font-family:var(--font-display); font-size:1.8rem; color:#FFFFFF; margin-bottom:0.4rem;">${cat.name}</h3>
            <p style="font-size:0.88rem; color:var(--text-light-muted); margin-bottom:0.8rem;">${cat.description}</p>
            <span class="link-editorial" style="color:var(--accent-gold); border-color:var(--accent-gold);">Explore Collection &rarr;</span>
          </div>
        </a>
      </article>
    `).join("");
  },

  initFaqPage() {
    const headers = document.querySelectorAll(".faq-header");
    headers.forEach(h => {
      h.addEventListener("click", () => h.parentElement.classList.toggle("open"));
    });
  },

  initContactPage() {
    const form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        UI.showToast("Thank you. Our fragrance concierge will reply within 24 hours.", "success");
        form.reset();
      });
    }
  },

  initAboutPage() {},
  initAccountPage() { Auth.requireAuth(); },
  initOrdersPage() { Auth.requireAuth(); },
  initAuthPages() {}
};

document.addEventListener("DOMContentLoaded", () => App.init());
