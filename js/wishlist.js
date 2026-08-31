/**
 * DeepFeel - Wishlist Module
 * Manages saved products, heart toggle state, and transfer to shopping bag.
 */

const Wishlist = {
  getItems() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST) || "[]");
  },

  saveItems(items) {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(items));
    this.updateBadges();
    this.syncHeartIcons();
    window.dispatchEvent(new CustomEvent("wishlist:updated", { detail: { items } }));
  },

  hasItem(productId) {
    const items = this.getItems();
    return items.includes(productId);
  },

  toggle(productId) {
    let items = this.getItems();
    const product = Store.getProductById(productId);
    const productName = product ? product.name : "Item";

    if (items.includes(productId)) {
      items = items.filter(id => id !== productId);
      this.saveItems(items);
      if (window.UI) UI.showToast(`Removed "${productName}" from your wishlist`, "info");
      return false;
    } else {
      items.push(productId);
      this.saveItems(items);
      if (window.UI) UI.showToast(`Saved "${productName}" to your wishlist`, "success");
      return true;
    }
  },

  removeItem(productId) {
    let items = this.getItems();
    const product = Store.getProductById(productId);
    items = items.filter(id => id !== productId);
    this.saveItems(items);
    if (window.UI) UI.showToast(`Removed "${product ? product.name : 'Item'}" from wishlist`, "info");
  },

  moveToCart(productId) {
    const product = Store.getProductById(productId);
    if (!product) return;

    if (product.stock <= 0) {
      if (window.UI) UI.showToast("Cannot move to bag: Item is out of stock", "error");
      return;
    }

    Cart.addItem(productId, 1);
    this.removeItem(productId);
  },

  getItemCount() {
    return this.getItems().length;
  },

  updateBadges() {
    const count = this.getItemCount();
    const badges = document.querySelectorAll(".wishlist-count-badge");
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? "inline-flex" : "none";
    });
  },

  syncHeartIcons() {
    const items = this.getItems();
    const buttons = document.querySelectorAll("[data-wishlist-btn]");
    buttons.forEach(btn => {
      const pId = btn.getAttribute("data-wishlist-btn");
      if (items.includes(pId)) {
        btn.classList.add("active");
        btn.setAttribute("aria-label", "Remove from wishlist");
      } else {
        btn.classList.remove("active");
        btn.setAttribute("aria-label", "Add to wishlist");
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  Wishlist.updateBadges();
  Wishlist.syncHeartIcons();
});
