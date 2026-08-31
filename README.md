# DeepFeel Haute Parfumerie — Production E-Commerce Platform & Admin Suite

DeepFeel is a full-stack, production-grade e-commerce application built with a **Node.js + Express.js REST API**, **PostgreSQL Database**, and a **Vanilla HTML5/CSS3/JavaScript Client**.

---

## 🏗️ Production Architecture

```
DeepFeel/
│
├── client/                      # Customer & Admin Frontend App
│   ├── index.html               # Storefront Homepage
│   ├── shop.html                # Fragrance Catalog & Filtering
│   ├── product.html             # Product Details & Image Zoom
│   ├── cart.html                # Shopping Bag
│   ├── checkout.html            # Pakistani Payment Gateways & Address
│   ├── order-confirmation.html  # Tax Invoice Receipt & Email Confirmation
│   ├── account.html             # Customer Profile
│   ├── orders.html              # Patron Order Chronicles
│   ├── wishlist.html            # Scent Vault
│   ├── login.html               # Patron Sign In
│   ├── register.html            # Patron Registration
│   ├── admin/                   # Administrative Management Command Center
│   │   ├── login.html           # Admin Authentication Gateway (Protected)
│   │   ├── index.html           # Executive KPI Dashboard & Charts
│   │   ├── products.html        # Product CRUD Manager
│   │   ├── inventory.html       # Stock & Inventory Control
│   │   ├── orders.html          # Order Logistics Workflow
│   │   ├── order-details.html   # Order Detail & Packing Invoice
│   │   ├── customers.html       # Customer Directory
│   │   ├── categories.html      # Category Management
│   │   ├── coupons.html         # Voucher Engine
│   │   └── settings.html        # Atelier Store Settings
│   ├── css/                     # Production Stylesheets
│   ├── js/                      # Frontend JavaScript Controllers
│   │   ├── api.js               # Unified REST API Client
│   │   ├── auth.js              # Session & Role Management
│   │   ├── cart.js              # Shopping Cart Engine
│   │   ├── wishlist.js          # Saved Items Engine
│   │   ├── ui.js                # Toast, Modal & UI Controls
│   │   ├── app.js               # Storefront Controller
│   │   └── admin.js             # Admin Suite Controller
│   ├── robots.txt               # SEO Crawl Rules & Admin Protection
│   └── sitemap.xml              # Storefront XML Sitemap
│
├── server/                      # Node.js + Express.js Backend API
│   ├── src/
│   │   ├── config/              # Environment (env.js) & DB Connection (db.js)
│   │   ├── controllers/         # Auth, Product, Order, Admin, Coupon Controllers
│   │   ├── middleware/          # Auth JWT/RBAC, Rate Limits, Security, Error Handler
│   │   ├── routes/              # Express API Route Routers
│   │   ├── services/            # DataStore Data Access & Audit Logger
│   │   ├── utils/               # Password Hashing, JWT, Logger, Sanitization
│   │   └── app.js               # Main Express Server
│   ├── package.json
│   └── .env.example
│
├── database/                    # Database Resources
│   ├── schema.sql               # PostgreSQL Schema Definition
│   ├── migrations/              # SQL Database Migrations (001_init.sql)
│   └── seed/                    # Seed Datasets
│
├── .gitignore
├── package.json                 # Root Project Runner
└── README.md
```

---

## 🔒 Security Measures Implemented

1. **Server-Side Authentication & Authorization**:
   - Passwords hashed using **bcrypt** with 12 salt rounds.
   - JWT session management via **HttpOnly SameSite cookies**.
   - Server-side Role-Based Access Control (`requireAdmin`, `requireRole`) enforcing permissions on every sensitive API route.
   - Admin routes block unauthorized customers returning `401 Unauthorized` / `403 Forbidden`.

2. **Server-Side Price & Checkout Verification**:
   - Cart order totals are recalculated on the backend directly from PostgreSQL product pricing and valid vouchers.
   - Client-submitted unit prices or line totals are completely ignored.

3. **IDOR / BOLA Prevention**:
   - `GET /api/orders/:id` verifies ownership server-side. Customers can only view their own orders; admins can view all.

4. **Security Headers & CORS**:
   - Configured with `helmet` for CSP, HSTS, X-Content-Type-Options, Frame protection, and Referrer-Policy.
   - Strict CORS origin validation preventing unauthorized domain access.

5. **Rate Limiting**:
   - IP rate limiting on `/api/auth/login`, `/api/auth/register`, `/api/orders`, and admin endpoints.

6. **SEO & Search Crawler Disallow**:
   - `robots.txt` disallows `/admin/` and `/api/` indexing.
   - `<meta name="robots" content="noindex, nofollow" />` applied to all administrative pages.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.0.0 or higher)
- PostgreSQL (v14 or higher, optional for local test mode)

### 1. Installation
```bash
git clone https://github.com/abdulwaris707/DeepFeel.git
cd DeepFeel
npm install
```

### 2. Environment Setup
Copy `.env.example` to `server/.env`:
```bash
cp server/.env.example server/.env
```

Set your production secrets in `server/.env`:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://deepfeel_user:password@localhost:5432/deepfeel_db
JWT_SECRET=your_secure_jwt_secret_key_here
INITIAL_ADMIN_EMAIL=admin@deepfeel.pk
INITIAL_ADMIN_PASSWORD=AdminSecurePass2026!
```

### 3. Launching the Production Server
```bash
npm start
```
The server will start listening on `http://localhost:5000`.

### 4. Admin Gateway Credentials
- **URL**: `http://localhost:5000/admin/login.html`
- **Email**: `admin@deepfeel.pk`
- **Password**: `admin123` *(or your configured INITIAL_ADMIN_PASSWORD)*

---

## 🧪 Health & Security Verification
To verify server health and security:
```bash
# Health Check Endpoint
curl http://localhost:5000/api/health

# Verify Admin Protection (Returns 401 Unauthorized)
curl -i http://localhost:5000/api/admin/customers
```

---

## 🌐 Production Hosting Recommendation
- **Backend API**: Render, Railway, or Node VPS.
- **Frontend**: Vercel, Netlify, or served directly via Nginx / Node static middleware.
- **Database**: Managed PostgreSQL (Supabase, Neon, AWS RDS, Railway PostgreSQL).
