/**
 * DeepFeel - Reusable UI Engine
 * Provides toast alerts, modal managers, live search overlay, quick-view dialogs,
 * fragrance pyramid visualizers, perfume card generators, and mobile navigation interactions.
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
      <span class="toast-icon">${icon}</span>
      <div class="toast-content">${message}</div>
      <button class="toast-close" aria-label="Dismiss notification">&times;</button>
    `;

    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", () => {
      this.dismissToast(toast);
    });

    container.appendChild(toast);

    // Trigger entrance animation
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    // Auto dismiss
    const timeout = setTimeout(() => {
      this.dismissToast(toast);
    }, duration);

    toast._timeout = timeout;
  },

  dismissToast(toast) {
    if (!toast) return;
    clearTimeout(toast._timeout);
    toast.classList.remove("show");
    toast.classList.add("hide");
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 300);
  },

  // ----------------------------------------------------
  // STAR RATING RENDERER
  // ----------------------------------------------------
  renderStars(rating = 5) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let starsHtml = "";

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        starsHtml += '<span class="star star-filled">★</span>';
      } else if (i === fullStars + 1 && hasHalf) {
        starsHtml += '<span class="star star-half">★</span>';
      } else {
        starsHtml += '<span class="star star-empty">☆</span>';
      }
    }
    return `<div class="rating-stars" title="${rating} out of 5 stars">${starsHtml} <span class="rating-score">${rating.toFixed(1)}</span></div>`;
  },

  // ----------------------------------------------------
  // PERFUME PRODUCT CARD HTML COMPONENT
  // ----------------------------------------------------
  renderProductCard(product) {
    const isWishlisted = Wishlist.hasItem(product.id);
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
      : 0;

    const mainImage = (product.images && product.images.length > 0) 
      ? product.images[0] 
      : "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80";

    const isOutOfStock = product.stock <= 0;
    const sizeDisplay = product.sizes && product.sizes.length ? product.sizes[0] : "50ml";

    return `
      <article class="product-card ${isOutOfStock ? 'out-of-stock' : ''}" data-product-id="${product.id}">
        <div class="product-card-media">
          <a href="product.html?id=${product.id}" class="product-card-image-link" aria-label="View ${product.name}">
            <img 
              src="${mainImage}" 
              alt="${product.name}" 
              class="product-card-image" 
              loading="lazy"
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80';"
            />
          </a>

          <div class="product-card-badges">
            ${isOutOfStock ? '<span class="badge badge-sold-out">Out of Stock</span>' : ''}
            ${hasDiscount && !isOutOfStock ? `<span class="badge badge-sale">-${discountPercent}%</span>` : ''}
            ${product.isNew && !hasDiscount && !isOutOfStock ? '<span class="badge badge-new">New</span>' : ''}
            ${product.bestseller && !hasDiscount && !product.isNew && !isOutOfStock ? '<span class="badge badge-bestseller">Bestseller</span>' : ''}
            ${product.exclusive && !hasDiscount && !product.isNew && !product.bestseller && !isOutOfStock ? '<span class="badge badge-exclusive" style="background:var(--accent-primary); color:#fff;">Exclusive</span>' : ''}
          </div>

          <div class="product-card-actions">
            <button 
              type="button" 
              class="card-action-btn wishlist-btn ${isWishlisted ? 'active' : ''}" 
              data-wishlist-btn="${product.id}"
              aria-label="${isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}"
              title="Save to wishlist"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <button 
              type="button" 
              class="card-action-btn quick-view-btn" 
              data-quickview-id="${product.id}"
              aria-label="Quick View"
              title="Quick view"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>

          ${!isOutOfStock ? `
            <button 
              type="button" 
              class="product-card-quick-add-btn" 
              data-quick-add="${product.id}"
            >
              + Quick Add (${sizeDisplay})
            </button>
          ` : ''}
        </div>

        <div class="product-card-info">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.3rem;">
            <span class="product-card-category">${product.category}</span>
            <span style="font-size:0.75rem; color:var(--accent-primary); font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">${product.concentration || 'Extrait'}</span>
          </div>
          <h3 class="product-card-title">
            <a href="product.html?id=${product.id}">${product.name}</a>
          </h3>

          <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:0.4rem; font-style:italic;">
            Family: <strong>${product.fragranceFamily || 'Oriental'}</strong>
          </div>

          <div class="product-card-rating">
            ${this.renderStars(product.rating || 5)}
            <span class="review-count">(${product.reviewCount || 0})</span>
          </div>

          <div class="product-card-price-row">
            <span class="price-current">$${product.price.toFixed(2)}</span>
            ${hasDiscount ? `<span class="price-original">$${product.originalPrice.toFixed(2)}</span>` : ''}
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
      <div class="fragrance-pyramid">
        <div style="text-align:center; margin-bottom: 1.5rem;">
          <span style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:var(--accent-primary); display:block; margin-bottom:0.3rem;">Olfactory Architecture</span>
          <h3 style="font-family:var(--font-serif); font-size:1.6rem; font-weight:500;">The Fragrance Pyramid</h3>
        </div>

        <div class="pyramid-level">
          <span class="pyramid-tier-tag">Top Notes (First 15–30 Mins)</span>
          <div class="pyramid-notes-list">
            ${topNotes.map(n => `<span class="note-pill">✨ ${n}</span>`).join("")}
          </div>
        </div>

        <div class="pyramid-level">
          <span class="pyramid-tier-tag">Heart Notes (Hours 1–4)</span>
          <div class="pyramid-notes-list">
            ${heartNotes.map(n => `<span class="note-pill">🌹 ${n}</span>`).join("")}
          </div>
        </div>

        <div class="pyramid-level">
          <span class="pyramid-tier-tag">Base Notes (Hours 4–14+)</span>
          <div class="pyramid-notes-list">
            ${baseNotes.map(n => `<span class="note-pill">🪵 ${n}</span>`).join("")}
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
          <div class="scent-spec-val">${product.longevity || '10–14 Hours'}</div>
          <span class="scent-spec-stars">★★★★★</span>
        </div>

        <div class="scent-spec-card">
          <span class="scent-spec-label">Sillage</span>
          <div class="scent-spec-val">${product.sillage || 'Enveloping'}</div>
          <span class="scent-spec-stars">★★★★★</span>
        </div>

        <div class="scent-spec-card">
          <span class="scent-spec-label">Best Season</span>
          <div class="scent-spec-val">${product.season || 'All Seasons'}</div>
        </div>

        <div class="scent-spec-card">
          <span class="scent-spec-label">Concentration</span>
          <div class="scent-spec-val">${product.concentration || 'Extrait de Parfum'}</div>
        </div>
      </div>
    `;
  },

  // ----------------------------------------------------
  // QUICK VIEW MODAL
  // ----------------------------------------------------
  openQuickView(productId) {
    const product = Store.getProductById(productId);
    if (!product) return;

    let modal = document.getElementById("quickview-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "quickview-modal";
      modal.className = "modal-overlay";
      document.body.appendChild(modal);
    }

    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const isOutOfStock = product.stock <= 0;
    const isWishlisted = Wishlist.hasItem(product.id);
    const defaultSize = (product.sizes && product.sizes.length) ? product.sizes[0] : "50ml";

    const sizesHtml = product.sizes && product.sizes.length ? `
      <div class="variant-group">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
          <label class="variant-label" style="margin-bottom:0;">Flacon Volume:</label>
          <span style="font-size:0.8rem; color:var(--text-muted);">Select size for price</span>
        </div>
        <div class="size-btn-group" id="qv-size-group">
          ${product.sizes.map((s, i) => {
            const sPrice = (product.sizePricing && product.sizePricing[s]) ? product.sizePricing[s] : product.price;
            return `
              <button 
                type="button" 
                class="size-btn ${i === 0 ? 'active' : ''}" 
                data-size="${s}"
                data-price="${sPrice}"
              >
                ${s} — $${sPrice.toFixed(0)}
              </button>
            `;
          }).join("")}
        </div>
      </div>
    ` : "";

    const notesSummary = product.notes ? `
      <div style="background:var(--bg-surface-subtle); border-radius:var(--radius-sm); padding:0.9rem; margin:1rem 0; font-size:0.85rem;">
        <div style="margin-bottom:0.3rem;"><strong>Top:</strong> ${(product.notes.top || []).join(", ")}</div>
        <div style="margin-bottom:0.3rem;"><strong>Heart:</strong> ${(product.notes.heart || []).join(", ")}</div>
        <div><strong>Base:</strong> ${(product.notes.base || []).join(", ")}</div>
      </div>
    ` : "";

    modal.innerHTML = `
      <div class="modal-dialog modal-quickview" role="dialog" aria-modal="true">
        <button class="modal-close-btn" aria-label="Close modal">&times;</button>
        <div class="quickview-grid">
          <div class="quickview-gallery">
            <img 
              src="${product.images[0]}" 
              alt="${product.name}" 
              class="quickview-main-image"
              id="qv-main-img"
            />
            ${product.images.length > 1 ? `
              <div class="quickview-thumbs">
                ${product.images.map((img, i) => `
                  <button type="button" class="qv-thumb ${i === 0 ? 'active' : ''}" data-thumb-src="${img}">
                    <img src="${img}" alt="${product.name} thumbnail ${i+1}" />
                  </button>
                `).join("")}
              </div>
            ` : ""}
          </div>

          <div class="quickview-details">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem;">
              <span class="product-card-category">${product.category}</span>
              <span style="font-size:0.75rem; color:var(--accent-primary); font-weight:700; text-transform:uppercase;">${product.concentration || 'Extrait'}</span>
            </div>
            <h2 class="quickview-title font-serif" style="font-size:1.8rem; margin-bottom:0.4rem;">${product.name}</h2>
            
            <div class="quickview-rating-row">
              ${this.renderStars(product.rating || 5)}
              <span class="review-count">(${product.reviewCount || 0} reviews)</span>
            </div>

            <div class="quickview-price-row">
              <span class="price-current" id="qv-price-display">$${product.price.toFixed(2)}</span>
              ${hasDiscount ? `<span class="price-original">$${product.originalPrice.toFixed(2)}</span>` : ''}
            </div>

            <p class="quickview-desc">${product.shortDescription || product.description}</p>

            ${notesSummary}
            ${sizesHtml}

            <div class="quickview-actions">
              <div class="quantity-picker">
                <button type="button" class="qty-btn" id="qv-qty-minus" aria-label="Decrease quantity">-</button>
                <input type="number" id="qv-qty-input" value="1" min="1" max="${product.stock}" class="qty-input" />
                <button type="button" class="qty-btn" id="qv-qty-plus" aria-label="Increase quantity">+</button>
              </div>

              <button 
                type="button" 
                class="btn btn-primary btn-lg" 
                id="qv-add-to-cart-btn"
                ${isOutOfStock ? 'disabled' : ''}
                style="flex: 1;"
              >
                ${isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
              </button>

              <button 
                type="button" 
                class="btn btn-outline btn-icon-only ${isWishlisted ? 'active' : ''}" 
                id="qv-wishlist-toggle"
                aria-label="Wishlist"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

            <div class="quickview-footer-link">
              <a href="product.html?id=${product.id}" class="link-arrow">
                Explore Full Olfactory Story & Notes &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add("active");
    document.body.classList.add("modal-open");

    // Event Bindings
    const closeBtn = modal.querySelector(".modal-close-btn");
    closeBtn.addEventListener("click", () => this.closeModal(modal));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) this.closeModal(modal);
    });

    // Thumbnails
    const thumbs = modal.querySelectorAll(".qv-thumb");
    const mainImg = modal.querySelector("#qv-main-img");
    thumbs.forEach(t => {
      t.addEventListener("click", () => {
        thumbs.forEach(other => other.classList.remove("active"));
        t.classList.add("active");
        mainImg.src = t.dataset.thumbSrc;
      });
    });

    // Size Switcher
    let selectedSize = defaultSize;
    let currentPrice = product.price;
    const sizeBtns = modal.querySelectorAll("#qv-size-group .size-btn");
    const priceDisplay = modal.querySelector("#qv-price-display");
    sizeBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        sizeBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedSize = btn.dataset.size;
        currentPrice = parseFloat(btn.dataset.price);
        priceDisplay.textContent = `$${currentPrice.toFixed(2)}`;
      });
    });

    // Quantity Picker
    const qtyInput = modal.querySelector("#qv-qty-input");
    modal.querySelector("#qv-qty-minus").addEventListener("click", () => {
      let val = parseInt(qtyInput.value, 10) || 1;
      if (val > 1) qtyInput.value = val - 1;
    });
    modal.querySelector("#qv-qty-plus").addEventListener("click", () => {
      let val = parseInt(qtyInput.value, 10) || 1;
      if (val < product.stock) qtyInput.value = val + 1;
    });

    // Add to Cart
    const addBtn = modal.querySelector("#qv-add-to-cart-btn");
    if (addBtn && !isOutOfStock) {
      addBtn.addEventListener("click", () => {
        const qty = parseInt(qtyInput.value, 10) || 1;
        Cart.addItem(product.id, qty, { size: selectedSize, price: currentPrice });
        this.closeModal(modal);
      });
    }

    // Wishlist Toggle
    const wishBtn = modal.querySelector("#qv-wishlist-toggle");
    wishBtn.addEventListener("click", () => {
      Wishlist.toggleItem(product.id);
      const isNow = Wishlist.hasItem(product.id);
      wishBtn.classList.toggle("active", isNow);
      wishBtn.querySelector("svg").setAttribute("fill", isNow ? "currentColor" : "none");
    });
  },

  closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
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
          <div class="search-overlay-header">
            <div class="search-input-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="search" 
                id="global-search-input" 
                class="search-input" 
                placeholder="Search perfumes, notes (Oud, Rose, Amber, Jasmine), or collections..." 
                autocomplete="off" 
              />
            </div>
            <button class="search-overlay-close" aria-label="Close search">&times;</button>
          </div>

          <div class="search-popular-tags">
            <span class="search-tags-label">Popular Notes:</span>
            <button class="search-tag-chip" data-search-term="Oud">Oud</button>
            <button class="search-tag-chip" data-search-term="Rose">Rose</button>
            <button class="search-tag-chip" data-search-term="Sandalwood">Sandalwood</button>
            <button class="search-tag-chip" data-search-term="Vanilla">Vanilla</button>
            <button class="search-tag-chip" data-search-term="Amber">Amber</button>
            <button class="search-tag-chip" data-search-term="Jasmine">Jasmine</button>
          </div>

          <div class="search-results-container" id="search-results-wrap">
            <div class="search-initial-prompt">
              Begin typing to explore Maison DeepFeel extraits and olfactive creations...
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    const triggers = document.querySelectorAll(".nav-search-trigger, [data-open-search]");
    triggers.forEach(t => {
      t.addEventListener("click", (e) => {
        e.preventDefault();
        overlay.classList.add("active");
        document.body.classList.add("modal-open");
        setTimeout(() => {
          document.getElementById("global-search-input").focus();
        }, 100);
      });
    });

    const closeBtn = overlay.querySelector(".search-overlay-close");
    closeBtn.addEventListener("click", () => {
      overlay.classList.remove("active");
      document.body.classList.remove("modal-open");
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("active");
        document.body.classList.remove("modal-open");
      }
    });

    const input = document.getElementById("global-search-input");
    let debounceTimer;
    input.addEventListener("input", (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.renderSearchResults(e.target.value);
      }, 250);
    });

    const tags = overlay.querySelectorAll(".search-tag-chip");
    tags.forEach(btn => {
      btn.addEventListener("click", () => {
        input.value = btn.dataset.searchTerm;
        this.renderSearchResults(btn.dataset.searchTerm);
      });
    });
  },

  renderSearchResults(query) {
    const wrap = document.getElementById("search-results-wrap");
    if (!wrap) return;

    if (!query || !query.trim()) {
      wrap.innerHTML = `
        <div class="search-initial-prompt">
          Begin typing to explore Maison DeepFeel extraits and olfactive creations...
        </div>
      `;
      return;
    }

    const results = Store.getProducts({ search: query, status: "active" });

    if (results.length === 0) {
      wrap.innerHTML = `
        <div class="search-no-results">
          <p>No fragrances found matching "<strong>${query}</strong>".</p>
          <span style="font-size: 0.9rem; color: var(--text-muted); display: block; margin-top: 0.5rem;">
            Try exploring notes such as <em>Oud, Amber, Rose, Jasmine, Sandalwood</em> or browse our <a href="shop.html" style="text-decoration: underline;">Full Fragrance Catalog</a>.
          </span>
        </div>
      `;
      return;
    }

    wrap.innerHTML = `
      <div class="search-results-header">
        Found ${results.length} fragrance${results.length === 1 ? '' : 's'}
      </div>
      <div class="search-results-grid">
        ${results.map(prod => `
          <a href="product.html?id=${prod.id}" class="search-result-item">
            <img src="${prod.images[0]}" alt="${prod.name}" class="search-result-thumb" />
            <div class="search-result-info">
              <span class="search-result-category">${prod.category} • ${prod.fragranceFamily || 'Extrait'}</span>
              <h4 class="search-result-title">${prod.name}</h4>
              <span class="search-result-price">$${prod.price.toFixed(2)}</span>
            </div>
          </a>
        `).join("")}
      </div>
    `;
  },

  // ----------------------------------------------------
  // MOBILE NAVIGATION DRAWER
  // ----------------------------------------------------
  initMobileDrawer() {
    const openBtn = document.querySelector(".mobile-menu-toggle");
    const drawer = document.getElementById("mobile-nav-drawer");
    if (!openBtn || !drawer) return;

    const closeBtn = drawer.querySelector(".mobile-drawer-close");
    const overlay = drawer.querySelector(".mobile-drawer-overlay");

    const openDrawer = () => {
      drawer.classList.add("active");
      document.body.classList.add("modal-open");
    };

    const closeDrawer = () => {
      drawer.classList.remove("active");
      document.body.classList.remove("modal-open");
    };

    openBtn.addEventListener("click", openDrawer);
    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    if (overlay) overlay.addEventListener("click", closeDrawer);
  },

  // ----------------------------------------------------
  // GLOBAL EVENT DELEGATION
  // ----------------------------------------------------
  initGlobalEvents() {
    document.addEventListener("click", (e) => {
      // Wishlist Button Click
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

      // Quick View Click
      const qvBtn = e.target.closest("[data-quickview-id]");
      if (qvBtn) {
        e.preventDefault();
        e.stopPropagation();
        this.openQuickView(qvBtn.dataset.quickviewId);
        return;
      }

      // Quick Add Click
      const quickAddBtn = e.target.closest("[data-quick-add]");
      if (quickAddBtn) {
        e.preventDefault();
        e.stopPropagation();
        Cart.addItem(quickAddBtn.dataset.quickAdd, 1);
        return;
      }
    });

    // Escape key closes modals & search
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const activeModal = document.querySelector(".modal-overlay.active");
        if (activeModal) this.closeModal(activeModal);

        const searchOverlay = document.getElementById("search-overlay");
        if (searchOverlay && searchOverlay.classList.contains("active")) {
          searchOverlay.classList.remove("active");
          document.body.classList.remove("modal-open");
        }
      }
    });
  },

  // Initialize UI Engine on DOMContentLoaded
  init() {
    this.initSearchOverlay();
    this.initMobileDrawer();
    this.initGlobalEvents();
  }
};

// Auto-run UI bootstrap
document.addEventListener("DOMContentLoaded", () => {
  UI.init();
});
