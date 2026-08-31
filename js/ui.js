/**
 * DeepFeel - Reusable UI Engine
 * Provides toast alerts, modal managers, live search overlay, quick-view dialogs,
 * product card generators, and mobile navigation interactions.
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
  // PRODUCT CARD HTML COMPONENT
  // ----------------------------------------------------
  renderProductCard(product) {
    const isWishlisted = Wishlist.hasItem(product.id);
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
      : 0;

    const mainImage = (product.images && product.images.length > 0) 
      ? product.images[0] 
      : "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80";

    const isOutOfStock = product.stock <= 0;

    return `
      <article class="product-card ${isOutOfStock ? 'out-of-stock' : ''}" data-product-id="${product.id}">
        <div class="product-card-media">
          <a href="product.html?id=${product.id}" class="product-card-image-link" aria-label="View ${product.name}">
            <img 
              src="${mainImage}" 
              alt="${product.name}" 
              class="product-card-image" 
              loading="lazy"
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80';"
            />
          </a>

          <div class="product-card-badges">
            ${isOutOfStock ? '<span class="badge badge-sold-out">Out of Stock</span>' : ''}
            ${hasDiscount && !isOutOfStock ? `<span class="badge badge-sale">-${discountPercent}%</span>` : ''}
            ${product.isNew && !hasDiscount && !isOutOfStock ? '<span class="badge badge-new">New</span>' : ''}
            ${product.bestseller && !hasDiscount && !product.isNew && !isOutOfStock ? '<span class="badge badge-bestseller">Bestseller</span>' : ''}
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
              + Quick Add
            </button>
          ` : ''}
        </div>

        <div class="product-card-info">
          <span class="product-card-category">${product.category}</span>
          <h3 class="product-card-title">
            <a href="product.html?id=${product.id}">${product.name}</a>
          </h3>

          <div class="product-card-rating">
            ${this.renderStars(product.rating || 5)}
            <span class="review-count">(${product.reviewCount || 0})</span>
          </div>

          <div class="product-card-price-row">
            <span class="price-current">${Store.formatCurrency(product.price)}</span>
            ${hasDiscount ? `<span class="price-original">${Store.formatCurrency(product.originalPrice)}</span>` : ''}
          </div>
        </div>
      </article>
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

    const colorsHtml = product.variants && product.variants.colors ? `
      <div class="variant-group">
        <label class="variant-label">Color / Finish:</label>
        <div class="variant-options color-options">
          ${product.variants.colors.map((c, i) => `
            <button type="button" class="variant-chip ${i === 0 ? 'selected' : ''}" data-variant-type="color" data-variant-val="${c}">
              ${c}
            </button>
          `).join("")}
        </div>
      </div>
    ` : "";

    const sizesHtml = product.variants && product.variants.sizes ? `
      <div class="variant-group">
        <label class="variant-label">Size / Dimension:</label>
        <div class="variant-options size-options">
          ${product.variants.sizes.map((s, i) => `
            <button type="button" class="variant-chip ${i === 0 ? 'selected' : ''}" data-variant-type="size" data-variant-val="${s}">
              ${s}
            </button>
          `).join("")}
        </div>
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
            <span class="product-card-category">${product.category}</span>
            <h2 class="quickview-title">${product.name}</h2>
            
            <div class="quickview-rating-row">
              ${this.renderStars(product.rating || 5)}
              <span class="review-count">(${product.reviewCount} customer reviews)</span>
              <span class="stock-status-pill ${product.stock < 10 ? 'low-stock' : 'in-stock'}">
                ${product.stock > 0 ? (product.stock <= 10 ? `Only ${product.stock} left in stock` : 'In Stock') : 'Out of Stock'}
              </span>
            </div>

            <div class="quickview-price-row">
              <span class="price-current large">${Store.formatCurrency(product.price)}</span>
              ${hasDiscount ? `<span class="price-original">${Store.formatCurrency(product.originalPrice)}</span>` : ""}
            </div>

            <p class="quickview-description">${product.shortDescription || product.description}</p>

            ${colorsHtml}
            ${sizesHtml}

            <div class="quickview-actions-row">
              <div class="quantity-picker">
                <button type="button" class="qty-btn" id="qv-qty-minus" aria-label="Decrease quantity">-</button>
                <input type="number" id="qv-qty-input" value="1" min="1" max="${product.stock}" readonly />
                <button type="button" class="qty-btn" id="qv-qty-plus" aria-label="Increase quantity">+</button>
              </div>

              <button 
                type="button" 
                class="btn btn-primary btn-add-bag" 
                id="qv-add-to-cart-btn"
                ${isOutOfStock ? 'disabled' : ''}
              >
                ${isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
              </button>

              <button 
                type="button" 
                class="btn btn-icon-outline wishlist-toggle-btn ${isWishlisted ? 'active' : ''}" 
                id="qv-wishlist-btn"
                data-wishlist-btn="${product.id}"
                aria-label="Save to Wishlist"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

            <div class="quickview-footer-link">
              <a href="product.html?id=${product.id}">View full product specifications & reviews &rarr;</a>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Setup interactive events inside modal
    const closeBtn = modal.querySelector(".modal-close-btn");
    closeBtn.addEventListener("click", () => this.closeModal(modal));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) this.closeModal(modal);
    });

    // Thumb click
    const thumbs = modal.querySelectorAll(".qv-thumb");
    const mainImg = modal.querySelector("#qv-main-img");
    thumbs.forEach(t => {
      t.addEventListener("click", () => {
        thumbs.forEach(x => x.classList.remove("active"));
        t.classList.add("active");
        mainImg.src = t.getAttribute("data-thumb-src");
      });
    });

    // Variant selection
    const chips = modal.querySelectorAll(".variant-chip");
    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        const parent = chip.parentElement;
        parent.querySelectorAll(".variant-chip").forEach(c => c.classList.remove("selected"));
        chip.classList.add("selected");
      });
    });

    // Quantity controls
    const qtyInput = modal.querySelector("#qv-qty-input");
    const minusBtn = modal.querySelector("#qv-qty-minus");
    const plusBtn = modal.querySelector("#qv-qty-plus");

    minusBtn.addEventListener("click", () => {
      let val = parseInt(qtyInput.value, 10);
      if (val > 1) qtyInput.value = val - 1;
    });

    plusBtn.addEventListener("click", () => {
      let val = parseInt(qtyInput.value, 10);
      if (val < product.stock) qtyInput.value = val + 1;
      else UI.showToast(`Only ${product.stock} items available`, "warning");
    });

    // Add to cart click
    const addBtn = modal.querySelector("#qv-add-to-cart-btn");
    addBtn.addEventListener("click", () => {
      const selectedVariants = {};
      modal.querySelectorAll(".variant-group").forEach(group => {
        const selected = group.querySelector(".variant-chip.selected");
        if (selected) {
          selectedVariants[selected.getAttribute("data-variant-type")] = selected.getAttribute("data-variant-val");
        }
      });

      const qty = parseInt(qtyInput.value, 10) || 1;
      Cart.addItem(product.id, qty, Object.keys(selectedVariants).length > 0 ? selectedVariants : null);
      this.closeModal(modal);
    });

    // Wishlist click
    const qvWishlistBtn = modal.querySelector("#qv-wishlist-btn");
    qvWishlistBtn.addEventListener("click", () => {
      const active = Wishlist.toggle(product.id);
      qvWishlistBtn.classList.toggle("active", active);
    });
  },

  closeModal(modalElement) {
    if (!modalElement) return;
    modalElement.classList.remove("active");
    document.body.style.overflow = "";
  },

  // ----------------------------------------------------
  // GLOBAL SEARCH MODAL & OVERLAY
  // ----------------------------------------------------
  openSearchModal() {
    let modal = document.getElementById("search-overlay-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "search-overlay-modal";
      modal.className = "modal-overlay search-overlay";
      modal.innerHTML = `
        <div class="search-modal-container">
          <div class="search-input-header">
            <svg class="search-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              id="live-search-input" 
              placeholder="Search products by name, category, material, or keyword..." 
              autocomplete="off"
            />
            <button class="search-modal-close" aria-label="Close search">&times;</button>
          </div>

          <div class="search-quick-tags">
            <span class="tags-label">Popular Searches:</span>
            <button class="tag-link" data-search-tag="Merino">Merino Throw</button>
            <button class="tag-link" data-search-tag="Ceramic">Ceramic Pour-Over</button>
            <button class="tag-link" data-search-tag="Desk">Workspace</button>
            <button class="tag-link" data-search-tag="Lamp">Ambient Lighting</button>
            <button class="tag-link" data-search-tag="Linen">Belgian Linen</button>
          </div>

          <div class="search-results-area" id="search-results-area">
            <div class="search-placeholder-state">
              <p>Type above to find soothing goods for restorative living.</p>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const input = modal.querySelector("#live-search-input");
      const resultsContainer = modal.querySelector("#search-results-area");
      const closeBtn = modal.querySelector(".search-modal-close");

      closeBtn.addEventListener("click", () => this.closeModal(modal));
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.closeModal(modal);
      });

      let debounceTimer;
      input.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        const q = e.target.value.trim();
        debounceTimer = setTimeout(() => {
          this.executeLiveSearch(q, resultsContainer);
        }, 250);
      });

      // Tag suggestions
      modal.querySelectorAll("[data-search-tag]").forEach(tag => {
        tag.addEventListener("click", () => {
          const val = tag.getAttribute("data-search-tag");
          input.value = val;
          this.executeLiveSearch(val, resultsContainer);
        });
      });
    }

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    const input = modal.querySelector("#live-search-input");
    if (input) {
      setTimeout(() => input.focus(), 150);
    }
  },

  executeLiveSearch(query, container) {
    if (!query) {
      container.innerHTML = `
        <div class="search-placeholder-state">
          <p>Type above to find soothing goods for restorative living.</p>
        </div>
      `;
      return;
    }

    const results = Store.getProducts({ search: query });

    if (results.length === 0) {
      container.innerHTML = `
        <div class="search-no-results">
          <p>No products found matching "<strong>${query}</strong>"</p>
          <span class="subtext">Try checking your spelling or searching for a broader term like "lamp", "wool", or "coffee".</span>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="search-results-header">
        <span>Found ${results.length} item${results.length === 1 ? '' : 's'}</span>
        <a href="shop.html?search=${encodeURIComponent(query)}" class="view-all-results">View all in shop &rarr;</a>
      </div>
      <div class="search-results-list">
        ${results.slice(0, 6).map(p => `
          <a href="product.html?id=${p.id}" class="search-result-item">
            <img src="${p.images[0]}" alt="${p.name}" class="result-thumb" />
            <div class="result-meta">
              <span class="result-category">${p.category}</span>
              <h4 class="result-name">${p.name}</h4>
              <span class="result-price">${Store.formatCurrency(p.price)}</span>
            </div>
          </a>
        `).join("")}
      </div>
    `;
  },

  // ----------------------------------------------------
  // EVENT LISTENERS DELEGATION
  // ----------------------------------------------------
  initGlobalEvents() {
    // Quick view delegation
    document.addEventListener("click", (e) => {
      const qvBtn = e.target.closest("[data-quickview-id]");
      if (qvBtn) {
        e.preventDefault();
        const id = qvBtn.getAttribute("data-quickview-id");
        this.openQuickView(id);
      }

      // Quick add delegation
      const quickAddBtn = e.target.closest("[data-quick-add]");
      if (quickAddBtn) {
        e.preventDefault();
        const id = quickAddBtn.getAttribute("data-quick-add");
        Cart.addItem(id, 1);
      }

      // Wishlist delegation
      const wishlistBtn = e.target.closest("[data-wishlist-btn]");
      if (wishlistBtn && !wishlistBtn.closest(".modal-quickview")) {
        e.preventDefault();
        const id = wishlistBtn.getAttribute("data-wishlist-btn");
        Wishlist.toggle(id);
      }

      // Search button triggers
      const searchTrigger = e.target.closest(".nav-search-trigger, [data-open-search]");
      if (searchTrigger) {
        e.preventDefault();
        this.openSearchModal();
      }

      // Mobile Menu Trigger
      const mobileToggle = e.target.closest(".mobile-menu-toggle");
      if (mobileToggle) {
        e.preventDefault();
        const drawer = document.getElementById("mobile-nav-drawer");
        if (drawer) {
          drawer.classList.toggle("active");
          document.body.classList.toggle("drawer-open");
        }
      }

      // Mobile Menu Close
      const mobileClose = e.target.closest(".mobile-drawer-close, .mobile-drawer-overlay");
      if (mobileClose) {
        e.preventDefault();
        const drawer = document.getElementById("mobile-nav-drawer");
        if (drawer) {
          drawer.classList.remove("active");
          document.body.classList.remove("drawer-open");
        }
      }
    });

    // Keyboard ESC listener for modals
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-overlay.active").forEach(m => this.closeModal(m));
        const drawer = document.getElementById("mobile-nav-drawer");
        if (drawer && drawer.classList.contains("active")) {
          drawer.classList.remove("active");
          document.body.classList.remove("drawer-open");
        }
      }
    });
  }
};

// Initialize listeners on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  UI.initGlobalEvents();
});
