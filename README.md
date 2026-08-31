# DeepFeel — Premium E-Commerce Website & Admin Suite

DeepFeel is a complete, production-quality e-commerce platform built strictly using **vanilla HTML5, CSS3, and modern ES6+ JavaScript**. It contains **zero external frontend frameworks or UI libraries** (no React, Next.js, Vue, Angular, Bootstrap, or Tailwind).

---

## 🌟 Brand Philosophy & Visual Identity
- **Visual Design**: Warm off-white / ivory background (`#FBF9F5`, `#F5F2EB`), deep charcoal typography (`#18181B`), sophisticated warm cognac/earth accent (`#8C6D53`), crisp white product cards, hairline borders (`#E7E2DA`), and minimal soft elevation shadows.
- **Typography**: Clean, professional pairing using **DM Sans** and **Inter**.
- **Tactile Comfort**: Organically curated lifestyle products (Merino wool throws, Kyoto ceramic pour-overs, capacitive brass desk lamps, Hinoki bath boards, Belgian stonewashed linen, and full-grain leather goods).

---

## 📁 Project Structure

```
DeepFeel/
│
├── index.html                  # High-end Storefront Homepage
├── shop.html                   # Catalog with multi-filter sidebar & sort controls
├── product.html                # PDP with vanilla image zoom, variants, tabs & reviews
├── categories.html             # Categories Hub & collections directory
├── cart.html                   # Cart table, coupon validator, free shipping progress
├── checkout.html               # Multi-section checkout with validation & card preview
├── order-confirmation.html     # Dynamic receipt, timeline tracker, printable invoice
├── wishlist.html               # Saved items gallery with 1-click move to bag
├── about.html                  # Brand craftsmanship story & tenets
├── contact.html                # Studio contact form with instant toast alerts
├── faq.html                    # Interactive categorized accordion FAQs
├── login.html                  # Customer authentication gateway + demo quick fill
├── register.html               # Customer account creation
├── account.html                # Customer profile & saved addresses editor
├── orders.html                 # Customer order history table with status pills
├── 404.html                    # Polished 404 error page
│
├── admin/
│   ├── login.html              # Admin Authentication Gateway (Protected)
│   ├── index.html              # Executive Dashboard (KPI metrics, SVG/Canvas charts)
│   ├── products.html           # Product Catalog CRUD (Search, Filters, Switches)
│   ├── product-form.html       # Add / Edit Product interface with image preview & SKU
│   ├── inventory.html          # Inventory Command Center (Quick +/- stock adjusters)
│   ├── orders.html             # Order processing with status dropdown workflow
│   ├── order-details.html      # Order detail view & printable official receipt
│   ├── customers.html          # Customer Directory with lifetime spending analytics
│   ├── categories.html         # Category CRUD & live SKU count recalculation
│   ├── coupons.html            # Coupon & discount engine
│   └── settings.html           # Store settings (Tax, Shipping, Factory Data Reset)
│
├── css/
│   ├── style.css               # Core CSS variables, typography, cards, modals, toasts
│   ├── responsive.css          # Breakpoints (Laptop, Tablet, Mobile) & Off-canvas drawer
│   └── admin.css               # Admin Dashboard layout, data tables, and metrics
│
├── js/
│   ├── data.js                 # 22 Curated lifestyle products, categories, seed orders
│   ├── store.js                # Complete LocalStorage Data Access Layer & Store engine
│   ├── auth.js                 # Session management, role guarding, demo fill
│   ├── cart.js                 # Cart state machine, discount math, shipping thresholds
│   ├── wishlist.js             # Wishlist state machine, heart sync, move to cart
│   ├── ui.js                   # Toast engine, modal manager, live debounced search
│   ├── app.js                  # Storefront page controllers
│   └── admin.js                # Admin suite controller (charts, CRUD, inventory)
│
└── README.md
```

---

## 🔑 Demo Credentials & Accounts

### Administrator Account (Full Admin Panel Access)
- **Portal URL**: `admin/login.html` (or `admin/index.html`)
- **Email**: `admin@deepfeel.com`
- **Password**: `admin123`
- *Note: One-click "Fill Admin Credentials" button is provided on the admin login page for instant access.*

### Customer Demo Account
- **Portal URL**: `login.html`
- **Email**: `elena.vance@example.com`
- **Password**: `password123`
- *Note: One-click "Customer Demo" button is provided on the customer login page.*

---

## 🎟️ Active Promotional Coupon Codes

You can apply any of the following valid codes during cart review or checkout:

| Coupon Code | Discount | Minimum Order | Description |
| :--- | :--- | :--- | :--- |
| `WELCOME10` | 10% Off | $50.00 | 10% off on your first order over $50 |
| `DEEPFEEL20` | 20% Off | $150.00 | 20% VIP discount on orders over $150 |
| `COMFORT15` | $15.00 Off | $80.00 | $15 off on comfort essentials over $80 |
| `FREESHIP` | $10.00 Off | $40.00 | Free shipping equivalent credit |

---

## ✨ Features & Functionality

### Storefront Experience
1. **Interactive Global Search**: Live debounced product search overlay accessible from any page.
2. **Product Quick View**: Modal dialog with multi-image thumbnail selector, color/size options, and instant add to bag.
3. **Vanilla JS Image Zoom**: Smooth coordinate-based lens zoom on product detail pages without external plugins.
4. **Live Cart & Free Shipping Tracker**: Real-time progress bar calculating how much more is needed to unlock free shipping.
5. **Interactive Reviews System**: Verified reviews display and a working "Write a Review" form that recalculates product star averages in real time.
6. **Robust Checkout Flow**: Complete form validation, live order summary, coupon calculation, payment method selection, and order creation.
7. **Wishlist Sync**: Real-time heart animation state persisted in `localStorage` with 1-click move to bag.
8. **Fully Responsive Mobile Drawer**: Off-canvas sliding navigation with touch-friendly controls and zero layout shift.

### Admin Command Suite
1. **Executive Dashboard**: Real-time KPI metric cards (Total Revenue, Orders, Products, Low Stock) and responsive Canvas-rendered charts.
2. **Product Catalog CRUD**: Search by SKU or title, filter by category/stock, instant featured/bestseller toggle switches, and product deletion.
3. **Product Editor**: Add or edit products with live image URL previews, automated slug/SKU handling, and threshold alerts.
4. **Dedicated Inventory Hub**: Real-time inventory valuation summary and single-click stock adjusters (`-1`, `+5`, `Set Exact`).
5. **Order Processing Workflow**: Track status transitions (`Pending` &rarr; `Processing` &rarr; `Shipped` &rarr; `Delivered` &rarr; `Cancelled`) with audit trails.
6. **Printable Invoices**: Clean `@media print` layout for packing slips and official receipts.
7. **Coupon Builder**: Manage percentage or dollar discounts, minimum order conditions, and usage counters.
8. **Store Settings & Data Reset**: Configure tax rates, shipping rates, and reset demo data back to initial factory state.

---

## 🚀 How to Run

Because DeepFeel uses standard web technologies with zero build steps, you can run it directly:

1. Open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).
2. Or serve locally with any static file server:
   ```bash
   # Using Python:
   python -m http.server 8000
   
   # Using Node (npx):
   npx serve .
   ```
3. Navigate to `http://localhost:8000` to browse the storefront, or `http://localhost:8000/admin/` to open the Admin panel.
