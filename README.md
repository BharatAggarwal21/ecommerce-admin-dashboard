# E-Commerce Admin Dashboard

A MERN-stack admin dashboard for managing an online store — products, orders, customers,
categories, and sales analytics. Built for **admins/staff**, not shoppers (no storefront/cart).

## Stack

- **Backend:** Node, Express, MongoDB (Mongoose), JWT auth, bcrypt
- **Frontend:** React (Vite), Tailwind CSS, React Router, Recharts, Axios

## Features

- JWT login with admin/staff roles, protected routes on both client and server
- Dashboard: orders today, total revenue, product count, pending orders, 7-day
  revenue/orders charts, top selling products, recent orders
- Products: CRUD, search, sort (price/name/newest), pagination
- Orders: list with status filter, detail view, status update (Pending → Processing →
  Delivered/Cancelled)
- Customers: list with computed order count and total spend
- Categories: CRUD

## Local setup

### 1. Backend

```bash
cd server
cp .env.example .env   # edit MONGO_URI / JWT_SECRET if needed
npm install
npm run seed            # wipes DB and loads demo data + admin user
npm run server           # starts on http://localhost:8000 (nodemon)
```

Test admin login: `admin@ecommdash.com` / `Admin@123`

### 2. Frontend

```bash
cd client
cp .env.example .env   # VITE_API_URL should point at the server above
npm install
npm run dev              # starts on http://localhost:5173
```

Requires a local or Atlas MongoDB instance reachable at `MONGO_URI`.

## API overview

```
POST   /api/v1/auth/login
GET    /api/v1/auth/me

GET    /api/v1/products          ?search=&sort=&category=&page=&limit=
POST   /api/v1/products
GET    /api/v1/products/:id
PATCH  /api/v1/products/:id
DELETE /api/v1/products/:id

GET    /api/v1/orders            ?status=&page=&limit=
GET    /api/v1/orders/:id
PATCH  /api/v1/orders/:id        { status }

GET    /api/v1/customers         ?search=&page=&limit=

GET    /api/v1/categories
POST   /api/v1/categories
PATCH  /api/v1/categories/:id
DELETE /api/v1/categories/:id

GET    /api/v1/dashboard/summary
```

All routes except `/auth/login` require `Authorization: Bearer <token>` and an
`admin` role.

## Deployment (free tier)

- **Frontend (client/):** GitHub Pages or Vercel — static build, `npm run build`.
- **Backend (server/):** Render free web service — it's a persistent Node process
  so it's fine for a plain REST API (no WebSockets used here). Free tier spins down
  after inactivity, so expect a cold-start delay on the first request.
- **Database:** MongoDB Atlas free tier (M0, 512MB).

Set these env vars on the hosting platform:

- Server: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL` (your deployed
  frontend origin, for CORS)
- Client: `VITE_API_URL` (your deployed backend URL + `/api/v1`)

After deploying the backend, run `npm run seed` once against the production
`MONGO_URI` (locally, pointed at the Atlas connection string) to populate demo data.
