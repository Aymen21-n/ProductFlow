# ProduitFlow

[![React](https://img.shields.io/badge/React-19.2.6-blue?logo=react)](https://reactjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-blue?logo=typescript)](https://www.typescriptlang.org/) [![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green?logo=nodedotjs)](https://nodejs.org/) [![MongoDB](https://img.shields.io/badge/MongoDB-6.0-darkgreen?logo=mongodb)](https://www.mongodb.com/) [![Vite](https://img.shields.io/badge/Vite-8.0.12-yellow?logo=vite)](https://vitejs.dev/) [![JWT](https://img.shields.io/badge/JWT-auth-orange?logo=JSON%20web%20tokens)](https://jwt.io/) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> ProduitFlow is a full-stack B2B SaaS platform built for Moroccan SMEs to manage products, orders, and invoices in a single secure experience. Developed as the Final Year Project (PFA) for EMSI 4DSIO G3, 2025/2026.

## 📌 Table of Contents

- [Project Overview](#project-overview)
- [Why ProduitFlow](#why-produitflow)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Environment Variables](#environment-variables)
- [Run the Application](#run-the-application)
- [API Documentation](#api-documentation)
- [Test Accounts](#test-accounts)
- [Git Workflow](#git-workflow)
- [Team](#team)
- [License](#license)

## Project Overview

ProduitFlow is a product, order, and invoice management platform designed for Moroccan SMEs and small distributors. It combines an admin management space and a customer-facing user space to simplify stock control, order validation, and invoice generation.

Built for the Final Year Project (Projet de Fin d'Etudes, PFA) at École Marocaine des Sciences de l'Ingénieur (EMSI) for the 4DSIO G3 program (Développement des Systèmes d'Information et des Objets connectés), academic year 2025/2026. This project demonstrates a complete full-stack workflow using modern web technologies.

## Why ProduitFlow

- Streamlines product lifecycle management from catalog to invoice.
- Supports role-based access for admins and users.
- Enables structured order approval and automatic financial tracking.
- Provides visibility into business metrics through a centralized dashboard.

## ✨ Key Features

- ✅ Role-based JWT authentication (`admin` / `user`)
- 🧭 Admin portal with product, order, invoice, and user management
- 🛍️ User catalogue with product browsing, cart, and checkout flow
- 🔄 Automated stock decrement on approved orders
- 🧾 Auto-generated invoices when orders are approved
- 📈 Dashboard KPIs: total orders, revenue, low stock alerts, total users
- 📌 Nested routing with React Router DOM and reusable UI components
- 🛡️ Protected API routes using JWT middleware
- 💼 Separate workflows for admin and end-user experiences

## 🧰 Tech Stack

- Frontend
  - React 19.2.6
  - TypeScript 6.0.2
  - Vite 8.0.12
  - React Router DOM v7
  - Zustand
  - Axios
  - React Hook Form
  - React Icons
- Backend
  - Node.js
  - Express.js
  - TypeScript
  - Mongoose
  - MongoDB
  - bcryptjs
  - JSON Web Token (JWT)
- Supporting Tools
  - VS Code
  - GitHub
  - MongoDB Compass

## 📁 Project Structure

```text
produitflow/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/               # axios instance + setAuthToken()
│   │   ├── assets/            # static assets
│   │   ├── components/        # layout + ui reusable components
│   │   ├── features/auth/     # auth context, reducer, Login page
│   │   ├── hooks/             # custom hooks
│   │   ├── pages/             # admin / user page views
│   │   ├── services/          # API service layer
│   │   ├── store/             # Zustand cart store
│   │   └── types/             # shared TypeScript interfaces
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── backend/
    ├── src/
    │   ├── config/           # MongoDB connection
    │   ├── controllers/      # auth, produit, commande, facture, user
    │   ├── middleware/       # JWT auth middleware
    │   ├── models/           # Mongoose schemas
    │   ├── routes/           # express route definitions
    │   └── server.ts         # application entry point
    ├── package.json
    └── tsconfig.json
```

## ✅ Prerequisites

Before running ProduitFlow, ensure you have installed:

- Node.js (recommended v18 or later)
- npm or pnpm
- MongoDB (local installation or Atlas cluster)
- Git

## 🚀 Installation & Setup

### Backend

1. Open a terminal and change directory to the backend folder:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `backend/` with the environment values below.
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend

1. Open a second terminal and change directory to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the frontend application:
   ```bash
   npm run dev
   ```

## 🌐 Environment Variables

Create a `.env` file in `backend/` with these values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/produitflow
JWT_SECRET=produitflow_secret_2024
```

> If you deploy on MongoDB Atlas, update `MONGODB_URI` accordingly and keep the JWT secret secure.

## ▶️ Run the Application

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

### Recommended local startup

1. Start MongoDB locally or ensure your Atlas connection is available.
2. Run backend in one terminal:
   ```bash
   cd backend
   npm run dev
   ```
3. Run frontend in another terminal:
   ```bash
   cd frontend
   npm run dev
   ```

## 🧾 API Documentation

> All authenticated routes require a valid JWT token in the `Authorization` header.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user account |
| POST | `/api/auth/login` | Public | Authenticate user and return JWT |
| GET | `/api/produits` | Authenticated | Retrieve all products |
| GET | `/api/produits/:id` | Authenticated | Retrieve a single product by ID |
| POST | `/api/produits` | Admin | Create a new product |
| PUT | `/api/produits/:id` | Admin | Update an existing product |
| DELETE | `/api/produits/:id` | Admin | Delete a product |
| GET | `/api/commandes` | Admin | List all orders |
| GET | `/api/commandes/user/:id` | User | List orders for a specific user |
| POST | `/api/commandes` | User | Create a new order |
| PUT | `/api/commandes/:id/statut` | Admin | Update order status (approve/reject) |
| GET | `/api/factures` | Admin | List all invoices |
| GET | `/api/factures/user/:id` | User | List invoices for a specific user |
| GET | `/api/factures/:id` | Authenticated | Get invoice details by invoice ID |
| GET | `/api/users` | Admin | List all users |
| PUT | `/api/users/:id/bloquer` | Admin | Block or unblock a user account |
| DELETE | `/api/users/:id` | Admin | Remove a user account |

## 🧪 Test Accounts

Use these credentials for development and testing:

- **Admin**: `admin@produitflow.com` / `admin123`
- **User**: `aymen@gmail.com` / `aymen123`

## 🌿 Git Workflow

ProduitFlow used a simplified branch strategy with four main branches:

- `main` — production-ready code
- `feature/auth-produits-utilisateurs` — authentication, products, and users
- `feature/ui-catalogue-dashboard` — frontend UI, catalogue, and admin dashboard
- `feature/panier-commandes-factures` — cart, orders, and invoices

Each feature branch was created by one team member, pushed, and then merged into `main` via a Pull Request reviewed by the lead integrator, **Aymen NAFIS**.

### Pull Request Guidelines

- Create a branch from `main`
- Add a clear title and description
- Include related notes or improvements
- Request review from the lead integrator
- Merge only after approval and validation

## 👥 Team

- **Aymen NAFIS** — Lead Integration (backend, authentication, system integration)
- **Imad EL GABBAS** — Frontend UI (layouts, dashboard, catalogue)
- **Manal LAHMER** — Transactional Modules (cart, orders, invoices)

## 📄 License

ProduitFlow is released under the [MIT License](https://opensource.org/licenses/MIT).
