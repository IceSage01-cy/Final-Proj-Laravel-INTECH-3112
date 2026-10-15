# Inventory Management System (INTECH 3112 Final Project)

A production-grade **Inventory Management System** developed with **Laravel 12**, **Inertia.js**, **React 19**, **Bootstrap 5**, and **Tailwind CSS**, backed by **MySQL**. 

This application was developed as the capstone assessment for **INTECH 3112**, synthesizing:
- **Activity 3**: Laravel MVC Backend Architecture & Normalized Migrations
- **Activity 4**: Modern Frontend Integration (React, Inertia.js, Vite)
- **Activity 5**: Headless Authentication (Laravel Fortify) & Role-Based Access Control (Spatie Permission)

---

## 📌 Features & Capabilities

- **Multi-Role Authentication (Laravel Fortify + Spatie RBAC)**:
  - **Super Admin**: Full administrative control, system metrics dashboard, manager accounts management, employee account moderation.
  - **Product Manager**: Complete CRUD operations on products, categories, suppliers, and review/approval of monthly employee reports.
  - **Employee**: Product catalog viewer, and personal monthly accomplishment report submission/tracking.
- **Inventory & Stock Management**:
  - Normalized database schema with `cascadeOnDelete()` relational integrity.
  - Automatic low-stock warnings, out-of-stock badges, and suggested reorder quantity calculations.
- **Monthly Accomplishment Reports**:
  - Employee workflow for drafting, submitting, and tracking hours worked and monthly accomplishments.
  - Manager review and approval interface.
- **Single Page Application (SPA) Experience**:
  - Fast, client-side page transitions via **Inertia.js** without full page reloads.
  - Real-time form validation feedback, flash notifications, and role-conditional UI rendering (`useCan()` hook).

---

## 🛠️ Technology Stack

- **Backend**: [Laravel 12](https://laravel.com/) (PHP ^8.3)
- **Authentication**: [Laravel Fortify](https://laravel.com/docs/fortify) (Headless auth)
- **Authorization & RBAC**: [Spatie Laravel-Permission](https://spatie.be/docs/laravel-permission/)
- **Frontend SPA Bridge**: [Inertia.js 2.x](https://inertiajs.com/)
- **Frontend Framework**: [React 19](https://react.dev/)
- **Styling**: [Bootstrap 5](https://getbootstrap.com/) & [Tailwind CSS v4](https://tailwindcss.com/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Database**: MySQL 8.x / MariaDB (via Laragon, XAMPP, or native install)

---

## 📋 Prerequisites

Ensure the following tools are installed on your computer before starting:

1. **PHP >= 8.3** (with extensions: `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `curl`)
2. **Composer (v2.x)** - [getcomposer.org](https://getcomposer.org/)
3. **Node.js (v18.x or v20.x+) and npm** - [nodejs.org](https://nodejs.org/)
4. **MySQL** or **Laragon / XAMPP**
5. **Git** - [git-scm.com](https://git-scm.com/)

---

## 🚀 Setup & Installation Guide

Follow these steps to set up the repository from scratch:

### 1. Clone the Repository

```bash
git clone https://github.com/IceSage01-cy/Final-Proj-Laravel-INTECH-3112.git
cd Final-Proj-Laravel-INTECH-3112
```

### 2. Switch to the Working Branch

Check out the branch containing the full Spatie RBAC and Fortify implementation:

```bash
git checkout spatie-role
```

---

### 3. Configure the Environment (`.env`)

Copy the sample environment file to `.env`:

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```
**macOS / Linux / Git Bash:**
```bash
cp .env.example .env
```

Open `.env` and verify your database connection (default Laragon MySQL settings):

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=final-proj
DB_USERNAME=root
DB_PASSWORD=
```
*(If using XAMPP or custom credentials, change `DB_DATABASE`, `DB_USERNAME`, or `DB_PASSWORD` accordingly).*

---

### 4. Create the Database

Ensure MySQL is running (e.g. click **Start All** in Laragon).

Create a new database named **`final-proj`** using your MySQL client (HeidiSQL, phpMyAdmin, or MySQL CLI):

```sql
CREATE DATABASE `final-proj`;
```

---

### 5. Install Dependencies

Install PHP backend dependencies:
```bash
composer install
```

Install frontend Node dependencies:
```bash
npm install
```

---

### 6. Generate Application Encryption Key

```bash
php artisan key:generate
```

---

### 7. Run Database Migrations & Seeders

Run the migrations to create all application, auth, and permission tables, and populate the database with default demo data:

```bash
php artisan migrate:fresh --seed
```

This automatically runs:
- `InventorySeeders`: Populates initial categories, suppliers, products, and default user accounts.
- `RolesAndPermissionsSeeder`: Sets up Spatie roles (`super-admin`, `product-manager`, `employee`) and assigns granular permissions.

---

### 8. Run the Development Server

Start the application servers:

```bash
composer run dev
```

*(This command starts both the Laravel backend server at `http://127.0.0.1:8000` and the Vite asset server at `http://localhost:5173` concurrently).*

---

### 9. Access the Application

Open your browser and navigate to:
👉 **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

*(The root URL will automatically direct you to the Login page at `/login`).*

---

## 🔑 Demo Login Accounts

The database comes pre-seeded with 3 test accounts corresponding to each role in the RBAC hierarchy:

| Role | Username | Password | Access & Capabilities |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `SuperAdmin` | `admin123` | Analytics dashboard, manage manager accounts, manage employee accounts, product overview |
| **Product Manager** | `Manager` | `12345` | Product CRUD, Category CRUD, Supplier CRUD, review/approve monthly reports |
| **Employee** | `Employee` | `456123` | View product catalog, draft and submit personal monthly accomplishment reports |

---

## 🗂️ Project Directory Structure

```text
├── app/
│   ├── Actions/Fortify/         # Fortify headless auth actions (registration, password reset)
│   ├── Http/
│   │   ├── Controllers/         # RESTful resource controllers (Products, Categories, Suppliers, Reports, Admin)
│   │   └── Middleware/          # HandleInertiaRequests (shares auth & permissions with React)
│   ├── Models/                  # Eloquent models (User, Product, Category, Supplier, MonthlyReport)
│   └── Support/                 # InventoryQueries domain query logic
├── database/
│   ├── migrations/              # Normalized relational tables & permission schemas
│   └── seeders/                 # InventorySeeders & RolesAndPermissionsSeeder
├── resources/
│   ├── css/                     # Custom stylesheet & Bootstrap integration
│   ├── js/
│   │   ├── inventory/           # Reusable components (AppLayout, ProductForm, NameCrud, permissions hook)
│   │   ├── pages/               # Inertia React page components
│   │   │   ├── admin/           # Super Admin dashboard & account management
│   │   │   ├── auth/            # Fortify auth views (login, register, forgot-password)
│   │   │   ├── categories/      # Category management views
│   │   │   ├── products/        # Product inventory views (index, create, edit, show)
│   │   │   ├── reports/         # Monthly report submission & review views
│   │   │   └── suppliers/       # Supplier management views
│   │   └── app.jsx              # Inertia React entry point (createInertiaApp)
│   └── views/
│       └── app.blade.php        # Root HTML template hosting Inertia & Vite
└── routes/                      # Modular route definitions
    ├── admin.php                # Super admin routes (role:super-admin)
    ├── categories.php           # Category resource routes
    ├── products.php             # Product resource routes
    ├── reports.php              # Monthly report routes
    ├── suppliers.php            # Supplier resource routes
    └── web.php                  # Main entry route aggregator
```

---

## 💡 Troubleshooting & Windows Tips

- **Laragon PATH issues (`'php'` or `'composer'` not recognized)**:
  Run this one-liner in your PowerShell session to temporarily add Laragon's binaries to your terminal PATH:
  ```powershell
  $env:Path += ";C:\laragon\bin\php\php-8.3.30-Win32-vs16-x64;C:\laragon\bin\composer"
  ```
  *(Or use the built-in **Terminal** button in the Laragon app window).*

- **`The [pcntl] extension is required to run Pail`**:
  Laravel Pail is a Linux-only real-time log viewer. On Windows, `php artisan pail` has been removed from the `dev` script in `composer.json` to prevent crashes.

- **Composer PHP Version Mismatch (`platform-check`)**:
  If Composer warns about packages requiring PHP 8.4+, `"platform-check": false` is configured in `composer.json` to allow Laragon's PHP 8.3.30 to run smoothly.
