/**
 * DeepFeel - Authentication & Session Management Module
 * Manages customer and administrator sessions, role gating, and demo account prefilling.
 */

const Auth = {
  getCurrentUser() {
    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user !== null && user.role === "admin";
  },

  login(email, password) {
    const trimmedEmail = email ? email.trim().toLowerCase() : "";
    const users = Store.getUsers();
    
    // Check match
    const found = users.find(u => 
      u.email.toLowerCase() === trimmedEmail && 
      u.password === password
    );

    if (found) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(found));
      return { success: true, user: found };
    }

    return { 
      success: false, 
      message: "Invalid email or password. Check credentials or use demo quick-fill." 
    };
  },

  register(userData) {
    const existing = Store.getUserByEmail(userData.email);
    if (existing) {
      return { success: false, message: "An account with this email address already exists." };
    }

    const newUser = Store.saveUser({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: "customer",
      phone: userData.phone || "",
      address: userData.address || {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: ""
      }
    });

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    return { success: true, user: newUser };
  },

  logout(redirectUrl = null) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    if (window.UI) UI.showToast("You have been securely signed out", "info");
    setTimeout(() => {
      window.location.href = redirectUrl || "index.html";
    }, 400);
  },

  requireAuth(redirectUrl = "login.html") {
    if (!this.isLoggedIn()) {
      window.location.href = `${redirectUrl}?redirect=${encodeURIComponent(window.location.pathname)}`;
      return false;
    }
    return true;
  },

  requireAdmin(redirectUrl = "login.html") {
    if (!this.isAdmin()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  },

  // Fill credentials helper for demo convenience
  fillDemoCredentials(type = "admin", emailInputId = "email", passwordInputId = "password") {
    const emailInput = document.getElementById(emailInputId);
    const passwordInput = document.getElementById(passwordInputId);

    if (!emailInput || !passwordInput) return;

    if (type === "admin") {
      emailInput.value = "admin@deepfeel.com";
      passwordInput.value = "admin123";
    } else {
      emailInput.value = "elena.vance@example.com";
      passwordInput.value = "password123";
    }

    if (window.UI) UI.showToast(`Filled demo ${type} credentials`, "info");
  }
};
