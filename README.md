# Vegist — Organic Grocery E-Commerce Platform

A production-minded, full-stack organic grocery e-commerce platform combining the tactile abundance of a premier farmers' market with modern digital commerce efficiency. Inspired by the functional scope of the Vegist Shopify theme, built with **Django REST Framework** and **React + TypeScript + Vite + Tailwind CSS**.

---

## 🌿 System Architecture

```
                      ┌─────────────────────────────────┐
                      │   React + TypeScript Frontend   │
                      │   (Vite, Tailwind, Lucide, SPA) │
                      └────────────────┬────────────────┘
                                       │ HTTP / REST (JWT Auth)
                                       ▼
                      ┌─────────────────────────────────┐
                      │    Django REST Framework API    │
                      │     (Gunicorn / WSGI, v1)       │
                      └────┬───────────────┬────────────┘
                           │               │
                           ▼               ▼
                ┌──────────────────┐  ┌──────────────────┐
                │ PostgreSQL / ORM │  │  OpenAPI/Swagger │
                │ (Atomic Locking) │  │  (/api/docs/)    │
                └──────────────────┘  └──────────────────┘
```

### Core Features

- **Storefront & Catalog**:
  - Live category navigation (Vegetables, Fruits, Dairy & Eggs, Bakery, Juices, Pantry).
  - Search with debounced autocomplete, multi-facet filtering (category, price range, organic certification, stock status), and sorting (price low/high, newest, popular).
  - Product detail views with organic certifications, harvest origins, nutrition, and bundle quantity steppers.
- **Cart & Order Processing**:
  - Slide-out Cart Drawer with real-time subtotal, free shipping meter, and optimistic quantity adjustment.
  - Full dedicated Cart page (`/cart`).
  - Cash on Delivery (COD) and simulated Card checkout.
  - **Transaction-Safe Order Creation**: Database-level atomic transactions with `select_for_update()` row locking to strictly prevent inventory overselling.
  - Server-side recalculation and validation of all prices, line totals, delivery fees, and order totals.
  - Duplicate order prevention via idempotency keys.
  - Stock restoration upon order cancellation.
- **Customer & Auth Flow**:
  - JWT Authentication (Access + Refresh token rotation).
  - Customer registration, login, and profile editing.
  - Guest checkout supported with secure order verification lookup (`/api/v1/orders/guest-lookup/`).
  - Authenticated customer order history dashboard with tracking statuses.
  - Persistent wishlist syncing for registered users and guests.
- **Administrative Tools**:
  - Django Admin suite at `/admin/` for catalog management, stock audits, and order fulfillment updates.
  - Swagger UI API documentation at `/api/docs/`.
  - Health check endpoint at `/api/v1/health/`.

---

## 🎨 Design System & Tokens

Defined according to [`FRONTEND_DESIGN.md`](./FRONTEND_DESIGN.md):
- **Vegist Green (`#62ab00`)**: Primary brand accent, primary CTA buttons, active states, cart badges.
- **Deep Leaf (`#203a27`)**: Editorial headings, dark navigation bars, contrast footers.
- **Fresh White (`#ffffff`)**: Clean card surfaces and modal canvas.
- **Mist Gray (`#f5f7f2`)**: Background canvas for low eye fatigue.
- **Ink Soil (`#222822`)**: High-legibility body typography.
- **Typography**: Google Fonts **Outfit** (headings, brand display) + **Inter** (tabular pricing, product specs, UI).

---

## 🚀 Quick Start / Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### 1. Backend Setup (Django)

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment (if not already created)
python -m venv ../venv
# On Windows:
..\venv\Scripts\activate
# On Linux/macOS:
source ../venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
copy .env.example .env

# Run database migrations
python manage.py migrate

# Seed catalog with organic produce and demo accounts
python manage.py seed_catalog

# Start Django development server
python manage.py runserver 127.0.0.1:8000
```

The backend API will be live at `http://127.0.0.1:8000/api/v1/`.
Interactive Swagger API Documentation: `http://127.0.0.1:8000/api/docs/`.

### 2. Frontend Setup (React + Vite)

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Configure environment variables
copy .env.example .env

# Start Vite development server
npm run dev
```

The frontend application will be live at `http://127.0.0.1:5173/`.

---

## 🔑 Demo & Test Credentials

The `seed_catalog` command automatically sets up the following accounts:

| Role | Username / Email | Password | Access / Role |
|---|---|---|---|
| **Administrator** | `admin` / `admin@vegist.com` | `AdminPass2026!` | Django Admin (`/admin/`), Superuser |
| **Demo Customer** | `customer` / `customer@vegist.com` | `CustomerPass2026!` | Storefront customer, order history, profile |

*Note: Guest checkout is fully enabled — orders can be placed without prior registration.*

---

## 📡 REST API Reference

All API endpoints are versioned under `/api/v1/`:

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/health/` | Health check & database connection probe | No |
| `GET` | `/api/v1/categories/` | List all active categories | No |
| `GET` | `/api/v1/categories/:slug/` | Retrieve specific category details | No |
| `GET` | `/api/v1/products/` | Filter, search, and paginate catalog items | No |
| `GET` | `/api/v1/products/:slug/` | Detailed product specifications and stock | No |
| `POST` | `/api/v1/auth/register/` | Register new customer account | No |
| `POST` | `/api/v1/auth/token/` | JWT token login (returns access + refresh) | No |
| `POST` | `/api/v1/auth/token/refresh/`| Rotate / refresh JWT access token | No |
| `GET` | `/api/v1/auth/me/` | Current authenticated customer profile | Yes |
| `POST` | `/api/v1/orders/` | Create transactional order with row-lock | No (Guests allowed) |
| `GET` | `/api/v1/orders/` | Authenticated customer order history | Yes |
| `GET` | `/api/v1/orders/:order_number/` | Order detail view | Ownership / Staff |
| `POST` | `/api/v1/orders/guest-lookup/` | Secure guest order lookup with email/phone | No |
| `POST` | `/api/v1/orders/:order_number/cancel/` | Cancel order and auto-restore stock | Owner / Staff |
| `GET` | `/api/v1/wishlist/` | Fetch saved wishlist products | Yes (or guest local) |
| `POST` | `/api/v1/wishlist/toggle/` | Add/remove product from wishlist | Yes |

Interactive Swagger UI is available at `/api/docs/`.

---

## 🧪 Automated Testing

### Backend Unit & Integration Tests
To execute the comprehensive Django test suite covering authentication, permissions, inventory validation, order processing, and cancellation stock restoration:

```bash
cd backend
python manage.py test
```
*Result: 10 test cases executed and passed with 0 errors.*

### Frontend Production Build & Typecheck
To test the TypeScript compilation and Vite production bundling:

```bash
cd frontend
npm run build
```
*Result: Transformed 2000+ modules, generated optimized production bundle in `dist/` with 0 type errors.*

---

## 🌐 Production Deployment

### Frontend (Vercel)
1. Link the `frontend/` directory to Vercel.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Set Environment Variables in Vercel Dashboard:
   - `VITE_API_BASE_URL`: `https://your-backend-domain.onrender.com/api/v1`
   - `VITE_STORE_NAME`: `Vegist Organic Grocery`
   - `VITE_CURRENCY_SYMBOL`: `Rs.`
5. `frontend/vercel.json` is included with SPA rewrites to ensure deep routing (`/product/:slug`, `/checkout`, `/account`) functions without 404 errors on browser refresh.

### Backend (Render / Railway)
1. Connect repository root or `backend/` directory to Render Web Service.
2. Environment: `Python`
3. Build Command: `./build.sh` (or `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --no-input`)
4. Start Command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
5. Environment Variables:
   - `SECRET_KEY`: `<production-random-secret-key>`
   - `DEBUG`: `False`
   - `DATABASE_URL`: `postgresql://<user>:<password>@<host>:<port>/<dbname>`
   - `ALLOWED_HOSTS`: `your-service.onrender.com,yourcustomdomain.com`
   - `CORS_ALLOWED_ORIGINS`: `https://your-frontend.vercel.app`
