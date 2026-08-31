/**
 * DEEPFEEL — Reusable Luxury UI Engine
 * Provides toast alerts, slide-over cart drawer, full-screen mobile menu,
 * live search overlay, fragrance pyramid visualizers, and minimal product cards.
 */

const UI = {
  // ----------------------------------------------------
  // TOAST NOTIFICATIONS
  // ----------------------------------------------------
  showToast(message, type = "info", duration = 3500) {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let icon = "✓";
    if (type === "error") icon = "✕";
    if (type === "warning") icon = "!";
    if (type === "info") icon = "ℹ";

    toast.innerHTML = `
      <span class="toast-icon" style="color:var(--accent-gold); font-weight:700;">${icon}</span>
      <div class="toast-content">${message}</div>
      <button class="toast-close" style="color:rgba(255,255,255,0.6); margin-left:auto;" aria-label="Dismiss">&times;</button>
    `;

    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", () => this.dismissToast(toast));

    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    const timeout = setTimeout(() => this.dismissToast(toast), duration);
    toast._timeout = timeout;
  },

  dismissToast(toast) {
    if (!toast) return;
    clearTimeout(toast._timeout);
    toast.classList.remove("show");
    toast.classList.add("hide");
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  },

  // ----------------------------------------------------
  // STAR RATING RENDERER
  // ----------------------------------------------------
  renderStars(rating = 5) {
    const fullStars = Math.floor(rating);
    let starsHtml = "";
    for (let i = 1; i <= 5; i++) {
      starsHtml += (i <= fullStars) ? "★" : "☆";
    }
    return `<span class="product-card-stars" title="${rating} out of 5 stars">${starsHtml}</span>`;
  },

  // ----------------------------------------------------
  // MINIMALIST PRODUCT CARD ("LESS, BUT BETTER")
  // ----------------------------------------------------
  renderProductCard(product) {
    const isWishlisted = Wishlist.hasItem(product.id);
    const mainImage = (product.images && product.images.length > 0) 
      ? product.images[0] 
      : "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80";

    const isOutOfStock = product.stock <= 0;
    const defaultSize = (product.sizes && product.sizes.length) ? product.sizes[0] : "50ml";
    const displayPrice = (product.sizePricing && product.sizePricing[defaultSize]) ? product.sizePricing[defaultSize] : product.price;

    return `
      <article class="product-card ${isOutOfStock ? 'out-of-stock' : ''}" data-product-id="${product.id}">
        <div class="product-card-media">
          <a href="product.html?id=${product.id}" class="product-card-image-link" aria-label="Explore ${product.name}">
            <img 
              src="${mainImage}" 
              alt="${product.name}" 
              class="product-card-image" 
              loading="lazy"
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80';"
            />
          </a>

          <div class="product-card-actions">
            ${!isOutOfStock ? `
              <button 
                type="button" 
                class="product-card-quick-add" 
                data-quick-add="${product.id}"
                data-size="${defaultSize}"
                data-price="${displayPrice}"
              >
                + Add to Bag (${defaultSize})
              </button>
            ` : `
              <span class="product-card-quick-add" style="background:#555; color:#fff; cursor:not-allowed;">Sold Out</span>
            `}
            <button 
              type="button" 
              class="product-card-wish-btn ${isWishlisted ? 'active' : ''}" 
              data-wishlist-btn="${product.id}"
              aria-label="Wishlist"
              title="Save to Scent Vault"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="product-card-info">
          <span class="product-card-brand">DEEPFEEL</span>
          <h3 class="product-card-title">
            <a href="product.html?id=${product.id}">${product.name}</a>
          </h3>
          <span class="product-card-family">${product.fragranceFamily || 'Extrait de Parfum'}</span>
          <div class="product-card-price-row">
            <span>${Store.formatCurrency(displayPrice)}</span>
            ${this.renderStars(product.rating || 5)}
          </div>
        </div>
      </article>

    `;
  },

  // ----------------------------------------------------
  // FRAGRANCE PYRAMID VISUALIZER COMPONENT
  // ----------------------------------------------------
  renderFragrancePyramid(notes) {
    if (!notes) return "";
    const topNotes = notes.top || [];
    const heartNotes = notes.heart || [];
    const baseNotes = notes.base || [];

    return `
      <div class="fragrance-pyramid-container">
        <div style="text-align:center; margin-bottom: 2rem;">
          <span class="editorial-tagline">Olfactory Architecture</span>
          <h3 class="editorial-heading-md">The Fragrance Pyramid</h3>
        </div>

        <div class="pyramid-tier">
          <span class="pyramid-tier-label">Top Notes (Opening 15–30 Mins)</span>
          <div class="pyramid-notes">
            ${topNotes.map(n => `<span class="note-chip">${n}</span>`).join("")}
          </div>
        </div>

        <div class="pyramid-tier">
          <span class="pyramid-tier-label">Heart Notes (Hours 1–4)</span>
          <div class="pyramid-notes">
            ${heartNotes.map(n => `<span class="note-chip">${n}</span>`).join("")}
          </div>
        </div>

        <div class="pyramid-tier">
          <span class="pyramid-tier-label">Base Notes (Hours 4–16+ Dry Down)</span>
          <div class="pyramid-notes">
            ${baseNotes.map(n => `<span class="note-chip">${n}</span>`).join("")}
          </div>
        </div>
      </div>
    `;
  },

  // ----------------------------------------------------
  // SCENT PERFORMANCE SPECIFICATIONS COMPONENT
  // ----------------------------------------------------
  renderScentSpecs(product) {
    return `
      <div class="scent-spec-grid">
        <div class="scent-spec-card">
          <span class="scent-spec-label">Longevity</span>
          <div class="scent-spec-val">${product.longevity || '12–16 Hours'}</div>
        </div>

        <div class="scent-spec-card">
          <span class="scent-spec-label">Sillage</span>
          <div class="scent-spec-val">${product.sillage || 'Enveloping'}</div>
        </div>

        <div class="scent-spec-card">
          <span class="scent-spec-label">Best For</span>
          <div class="scent-spec-val">${product.occasion || 'Evening & Signature'}</div>
        </div>

        <div class="scent-spec-card">
          <span class="scent-spec-label">Concentration</span>
          <div class="scent-spec-val">${product.concentration || 'Extrait de Parfum (30%)'}</div>
        </div>
      </div>
    `;
  },

  // ----------------------------------------------------
  // SLIDE-OVER CART DRAWER
  // ----------------------------------------------------
  initCartDrawer() {
    let overlay = document.getElementById("cart-drawer-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "cart-drawer-overlay";
      overlay.className = "cart-drawer-overlay";
      overlay.innerHTML = `
        <div class="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping Bag">
          <div class="cart-drawer-header">
            <h3 class="cart-drawer-title">Shopping Bag (<span class="cart-drawer-count">0</span>)</h3>
            <button type="button" class="cart-drawer-close" aria-label="Close bag">&times;</button>
          </div>

          <div class="cart-drawer-shipping">
            <div id="drawer-shipping-text">Complimentary delivery across Pakistan on orders over Rs. 5,000</div>
            <div class="cart-shipping-bar">
              <div class="cart-shipping-fill" id="drawer-shipping-fill"></div>
            </div>
          </div>

          <div class="cart-drawer-body" id="cart-drawer-body">
            <!-- Items rendered dynamically -->
          </div>

          <div class="cart-drawer-footer">
            <div class="cart-drawer-subtotal">
              <span>Subtotal</span>
              <strong id="drawer-subtotal">Rs. 0</strong>
            </div>
            <a href="checkout.html" class="btn btn-primary btn-full btn-lg" style="margin-bottom:0.75rem;">
              Proceed to Checkout &rarr;
            </a>
            <a href="cart.html" class="btn btn-outline btn-full btn-sm">
              View Bag Details
            </a>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    // Bind bag open triggers (Header bag icon, mobile drawer bag icon)
    const bagTriggers = document.querySelectorAll("[data-open-bag], a[href='cart.html'].header-icon-btn, .mobile-bag-trigger");
    bagTriggers.forEach(btn => {
      btn.addEventListener("click", (e) => {
        // If not on cart.html, open the slide-over drawer
        const path = window.location.pathname.toLowerCase();
        if (!path.endsWith("cart.html") && !path.endsWith("checkout.html")) {
          e.preventDefault();
          this.openCartDrawer();
        }
      });
    });

    const closeBtn = overlay.querySelector(".cart-drawer-close");
    if (closeBtn) closeBtn.addEventListener("click", () => this.closeCartDrawer());

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) this.closeCartDrawer();
    });

    // Cart update event listener
    window.addEventListener("cart:updated", () => this.renderCartDrawer());
  },

  openCartDrawer() {
    const overlay = document.getElementById("cart-drawer-overlay");
    if (!overlay) return;
    this.renderCartDrawer();
    overlay.classList.add("active");
    document.body.classList.add("drawer-open");
  },

  closeCartDrawer() {
    const overlay = document.getElementById("cart-drawer-overlay");
    if (!overlay) return;
    overlay.classList.remove("active");
    document.body.classList.remove("drawer-open");
  },

  renderCartDrawer() {
    const body = document.getElementById("cart-drawer-body");
    const countSpan = document.querySelector(".cart-drawer-count");
    const subtotalEl = document.getElementById("drawer-subtotal");
    const shippingText = document.getElementById("drawer-shipping-text");
    const shippingFill = document.getElementById("drawer-shipping-fill");
    if (!body) return;

    const cart = Cart.getCart();
    const totals = Cart.getTotals();

    if (countSpan) countSpan.textContent = Cart.getItemCount();
    if (subtotalEl) subtotalEl.textContent = Store.formatCurrency(totals.subtotal);

    // Free shipping tracker
    if (shippingText && shippingFill) {
      if (totals.remainingForFreeShipping > 0) {
        const pct = Math.min(100, Math.round((totals.subtotal / totals.freeShippingThreshold) * 100));
        shippingFill.style.width = `${pct}%`;
        shippingText.textContent = `Add ${Store.formatCurrency(totals.remainingForFreeShipping)} more for complimentary delivery across Pakistan.`;
      } else {
        shippingFill.style.width = "100%";
        shippingText.textContent = `🎉 You have unlocked complimentary express delivery across Pakistan!`;
      }
    }

    if (cart.length === 0) {
      body.innerHTML = `
        <div style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
          <div style="font-size:2rem; margin-bottom:0.8rem;">🛍️</div>
          <p style="font-size:1rem; color:var(--text-primary); margin-bottom:0.4rem;">Your shopping bag is empty</p>
          <span style="font-size:0.85rem;">Discover our signature extraits and coffrets.</span>
        </div>
      `;
      return;
    }

    body.innerHTML = cart.map(item => `
      <div class="cart-drawer-item">
        <img src="${item.image}" alt="${item.name}" class="cart-drawer-thumb" />
        <div class="cart-drawer-item-info">
          <h4>${item.name}</h4>
          <span class="cart-drawer-item-size">${item.size || '50ml'} • ${Store.formatCurrency(item.price)}</span>
          <div class="cart-drawer-qty-wrap">
            <button type="button" class="cart-drawer-qty-btn drawer-minus" data-id="${item.productId}" data-vkey="${item.variantKey}">-</button>
            <span class="cart-drawer-qty-val">${item.quantity}</span>
            <button type="button" class="cart-drawer-qty-btn drawer-plus" data-id="${item.productId}" data-vkey="${item.variantKey}">+</button>
          </div>
          <div>
            <button type="button" class="cart-drawer-remove" data-id="${item.productId}" data-vkey="${item.variantKey}">Remove</button>
          </div>
        </div>
        <div>
          <strong>${Store.formatCurrency(item.price * item.quantity)}</strong>
        </div>
      </div>
    `).join("");


    // Bind drawer buttons
    body.querySelectorAll(".drawer-minus").forEach(btn => {
      btn.addEventListener("click", () => {
        const item = cart.find(i => i.productId === btn.dataset.id && i.variantKey === btn.dataset.vkey);
        if (item) Cart.updateQuantity(btn.dataset.id, btn.dataset.vkey, item.quantity - 1);
      });
    });

    body.querySelectorAll(".drawer-plus").forEach(btn => {
      btn.addEventListener("click", () => {
        const item = cart.find(i => i.productId === btn.dataset.id && i.variantKey === btn.dataset.vkey);
        if (item) Cart.updateQuantity(btn.dataset.id, btn.dataset.vkey, item.quantity + 1);
      });
    });

    body.querySelectorAll(".cart-drawer-remove").forEach(btn => {
      btn.addEventListener("click", () => {
        Cart.removeItem(btn.dataset.id, btn.dataset.vkey);
      });
    });
  },

  // ----------------------------------------------------
  // FULL SCREEN MOBILE NAVIGATION OVERLAY
  // ----------------------------------------------------
  // ----------------------------------------------------
  // FULL SCREEN / OFF-CANVAS MOBILE NAVIGATION
  // ----------------------------------------------------
  initMobileMenu() {
    let overlay = document.getElementById("mobile-nav-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "mobile-nav-overlay";
      overlay.className = "mobile-nav-overlay";
      overlay.innerHTML = `
        <div class="mobile-nav-top">
          <a href="index.html" class="brand-logo" style="color:#FFFFFF;">DEEP<span>FEEL</span></a>
          <button type="button" class="mobile-nav-close" aria-label="Close menu">&times;</button>
        </div>

        <div class="mobile-nav-body">
          <!-- Quick Search Button in Menu -->
          <button type="button" class="mobile-nav-search-bar" data-open-search>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>Search fragrances, notes...</span>
          </button>

          <!-- Core Navigation -->
          <div class="mobile-nav-section-title">Explore Fragrances</div>
          <nav class="mobile-nav-links">
            <a href="shop.html" class="mobile-nav-link">
              <span>SHOP</span>
              <span class="mobile-nav-arrow">&rarr;</span>
            </a>
            <a href="categories.html" class="mobile-nav-link">
              <span>COLLECTIONS</span>
              <span class="mobile-nav-arrow">&rarr;</span>
            </a>
            <a href="shop.html?gender=Men" class="mobile-nav-link">
              <span>MEN</span>
              <span class="mobile-nav-arrow">&rarr;</span>
            </a>
            <a href="shop.html?gender=Women" class="mobile-nav-link">
              <span>WOMEN</span>
              <span class="mobile-nav-arrow">&rarr;</span>
            </a>
            <a href="shop.html?gender=Unisex" class="mobile-nav-link">
              <span>UNISEX</span>
              <span class="mobile-nav-arrow">&rarr;</span>
            </a>
            <a href="shop.html?category=oud-collection" class="mobile-nav-link">
              <span>OUD</span>
              <span class="mobile-nav-badge">Prestige</span>
            </a>
            <a href="about.html" class="mobile-nav-link">
              <span>ABOUT</span>
              <span class="mobile-nav-arrow">&rarr;</span>
            </a>
            <a href="journal.html" class="mobile-nav-link">
              <span>JOURNAL</span>
              <span class="mobile-nav-arrow">&rarr;</span>
            </a>
            <a href="contact.html" class="mobile-nav-link">
              <span>CONTACT</span>
              <span class="mobile-nav-arrow">&rarr;</span>
            </a>
          </nav>


          <!-- Patron Services -->
          <div class="mobile-nav-section-title" style="margin-top: 1.5rem;">Patron Services</div>
          <nav class="mobile-nav-links">
            <a href="account.html" class="mobile-nav-link mobile-account-link">
              <span>My Account</span>
              <span class="mobile-nav-arrow">&rarr;</span>
            </a>
            <a href="wishlist.html" class="mobile-nav-link">
              <span>Saved Scent Vault</span>
              <span class="badge-count wishlist-count-badge" style="position:static; display:inline-flex;">0</span>
            </a>
            <a href="orders.html" class="mobile-nav-link">
              <span>Order Chronicles</span>
              <span class="mobile-nav-arrow">&rarr;</span>
            </a>
            <a href="faq.html" class="mobile-nav-link">
              <span>Concierge & FAQ</span>
              <span class="mobile-nav-arrow">&rarr;</span>
            </a>
            <a href="contact.html" class="mobile-nav-link">
              <span>Contact Atelier</span>
              <span class="mobile-nav-arrow">&rarr;</span>
            </a>
          </nav>
        </div>

        <div class="mobile-nav-footer">
          <span style="color:var(--text-light-muted); font-size:0.78rem;">Maison DeepFeel &bull; Pure Extraits Pakistan</span>
          <span style="color:var(--accent-gold); font-size:0.78rem; font-weight:600;">Complimentary Delivery ${Store.formatCurrency(5000)}+</span>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    const openBtns = document.querySelectorAll(".mobile-menu-toggle");
    openBtns.forEach(b => {
      b.addEventListener("click", () => {
        overlay.classList.add("active");
        document.body.classList.add("modal-open");
        
        // Update account link label in menu
        const user = Auth.getCurrentUser();
        const accLink = overlay.querySelector(".mobile-account-link span");
        if (accLink) {
          accLink.textContent = user ? `Account (${user.name})` : "Sign In / Register";
        }
        Wishlist.updateBadges();
      });
    });

    const closeBtn = overlay.querySelector(".mobile-nav-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        overlay.classList.remove("active");
        document.body.classList.remove("modal-open");
      });
    }

    // Close on navigation click
    overlay.querySelectorAll(".mobile-nav-link").forEach(link => {
      link.addEventListener("click", () => {
        overlay.classList.remove("active");
        document.body.classList.remove("modal-open");
      });
    });
  },

  // ----------------------------------------------------
  // LIVE GLOBAL SEARCH OVERLAY
  // ----------------------------------------------------
  initSearchOverlay() {
    let overlay = document.getElementById("search-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "search-overlay";
      overlay.className = "search-overlay";
      overlay.innerHTML = `
        <div class="search-overlay-container">
          <div class="search-input-wrap">
            <input 
              type="search" 
              id="global-search-input" 
              class="search-input" 
              placeholder="Search fragrances, notes, or moods..." 
              autocomplete="off" 
            />
            <button class="search-overlay-close" style="font-size:1.8rem; color:var(--text-muted);" aria-label="Close search">&times;</button>
          </div>

          <div class="search-popular-tags">
            <span style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:var(--text-muted);">Popular:</span>
            <button class="search-tag-chip" data-search-term="Oud">Oud</button>
            <button class="search-tag-chip" data-search-term="Amber">Amber</button>
            <button class="search-tag-chip" data-search-term="Rose">Rose</button>
            <button class="search-tag-chip" data-search-term="Sandalwood">Sandalwood</button>
            <button class="search-tag-chip" data-search-term="Noir">Noir</button>
          </div>

          <div class="search-results-container" id="search-results-wrap">
            <p style="text-align:center; padding:2rem; color:var(--text-muted); font-size:0.95rem;">
              Begin typing to explore Maison DeepFeel extraits and olfactive creations...
            </p>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    const triggers = document.querySelectorAll(".nav-search-trigger, [data-open-search]");
    triggers.forEach(t => {
      t.addEventListener("click", (e) => {
        e.preventDefault();
        const mobileMenu = document.getElementById("mobile-nav-overlay");
        if (mobileMenu) mobileMenu.classList.remove("active");
        overlay.classList.add("active");
        document.body.classList.add("modal-open");
        setTimeout(() => {
          const inp = document.getElementById("global-search-input");
          if (inp) inp.focus();
        }, 100);
      });
    });


    const closeBtn = overlay.querySelector(".search-overlay-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        overlay.classList.remove("active");
        document.body.classList.remove("modal-open");
      });
    }

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("active");
        document.body.classList.remove("modal-open");
      }
    });

    const input = document.getElementById("global-search-input");
    let debounceTimer;
    if (input) {
      input.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => this.renderSearchResults(e.target.value), 200);
      });
    }

    const tags = overlay.querySelectorAll(".search-tag-chip");
    tags.forEach(btn => {
      btn.addEventListener("click", () => {
        if (input) {
          input.value = btn.dataset.searchTerm;
          this.renderSearchResults(btn.dataset.searchTerm);
        }
      });
    });
  },

  renderSearchResults(query) {
    const wrap = document.getElementById("search-results-wrap");
    if (!wrap) return;

    if (!query || !query.trim()) {
      wrap.innerHTML = `<p style="text-align:center; padding:2rem; color:var(--text-muted);">Begin typing to explore Maison DeepFeel extraits...</p>`;
      return;
    }

    const results = Store.getProducts({ search: query, status: "active" });

    if (results.length === 0) {
      wrap.innerHTML = `
        <div style="text-align:center; padding:2.5rem 1rem;">
          <p>No fragrances found matching "<strong>${query}</strong>".</p>
          <span style="font-size:0.85rem; color:var(--text-muted); display:block; margin-top:0.4rem;">
            Explore our <a href="shop.html" style="text-decoration:underline;">Full Fragrance Catalog</a>.
          </span>
        </div>
      `;
      return;
    }

    wrap.innerHTML = `
      <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:var(--accent-gold); margin-bottom:1rem;">
        ${results.length} Creation${results.length === 1 ? '' : 's'} Discovered
      </div>
      <div class="search-results-grid">
        ${results.map(prod => `
          <a href="product.html?id=${prod.id}" class="search-result-item">
            <img src="${prod.images[0]}" alt="${prod.name}" class="search-result-thumb" />
            <div>
              <div style="font-size:0.7rem; font-weight:600; text-transform:uppercase; color:var(--text-muted);">${prod.category}</div>
              <h4 style="font-family:var(--font-display); font-size:1.1rem; color:var(--text-primary);">${prod.name}</h4>
              <span style="font-size:0.85rem; font-weight:600;">${Store.formatCurrency(prod.price)}</span>
            </div>
          </a>
        `).join("")}
      </div>
    `;
  },

  // ----------------------------------------------------
  // MOBILE FILTER DRAWER (SHOP CATALOG)
  // ----------------------------------------------------
  initFilterDrawer() {
    const trigger = document.getElementById("mobile-filter-trigger");
    const overlay = document.getElementById("filter-drawer-overlay");
    const closeBtn = document.getElementById("filter-drawer-close");
    const applyBtn = document.getElementById("filter-drawer-apply");

    if (trigger && overlay) {
      trigger.addEventListener("click", () => {
        overlay.classList.add("active");
        document.body.classList.add("modal-open");
      });
    }

    if (closeBtn && overlay) {
      closeBtn.addEventListener("click", () => {
        overlay.classList.remove("active");
        document.body.classList.remove("modal-open");
      });
    }

    if (applyBtn && overlay) {
      applyBtn.addEventListener("click", () => {
        overlay.classList.remove("active");
        document.body.classList.remove("modal-open");
      });
    }

    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          overlay.classList.remove("active");
          document.body.classList.remove("modal-open");
        }
      });
    }
  },

  // ----------------------------------------------------
  // GLOBAL EVENT DELEGATION
  // ----------------------------------------------------
  initGlobalEvents() {
    document.addEventListener("click", (e) => {
      // Wishlist toggle
      const wishBtn = e.target.closest("[data-wishlist-btn]");
      if (wishBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = wishBtn.dataset.wishlistBtn;
        Wishlist.toggleItem(id);
        const active = Wishlist.hasItem(id);
        wishBtn.classList.toggle("active", active);
        const svg = wishBtn.querySelector("svg");
        if (svg) svg.setAttribute("fill", active ? "currentColor" : "none");
        return;
      }

      // Quick Add to Bag
      const quickAddBtn = e.target.closest("[data-quick-add]");
      if (quickAddBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = quickAddBtn.dataset.quickAdd;
        const size = quickAddBtn.dataset.size || "50ml";
        const price = parseFloat(quickAddBtn.dataset.price) || 89;
        Cart.addItem(id, 1, { size, price });
        this.openCartDrawer();
        return;
      }
    });

    // Escape key closes modals & drawers
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeCartDrawer();
        const searchOverlay = document.getElementById("search-overlay");
        if (searchOverlay && searchOverlay.classList.contains("active")) {
          searchOverlay.classList.remove("active");
          document.body.classList.remove("modal-open");
        }
        const mobileMenu = document.getElementById("mobile-nav-overlay");
        if (mobileMenu && mobileMenu.classList.contains("active")) {
          mobileMenu.classList.remove("active");
          document.body.classList.remove("modal-open");
        }
        const filterOverlay = document.getElementById("filter-drawer-overlay");
        if (filterOverlay && filterOverlay.classList.contains("active")) {
          filterOverlay.classList.remove("active");
          document.body.classList.remove("modal-open");
        }
      }
    });
  },


  init() {
    this.initCartDrawer();
    this.initMobileMenu();
    this.initSearchOverlay();
    this.initFilterDrawer();
    this.initGlobalEvents();
  }
};

document.addEventListener("DOMContentLoaded", () => UI.init());

