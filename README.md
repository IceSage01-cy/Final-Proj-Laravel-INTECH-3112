# Inventory Management System (INTECH 3112 Final Project)

An **Inventory Management System** developed with **Laravel 12**, **Inertia.js**, **React**, and **Tailwind CSS**, backed by **MySQL**. This project modernizes a traditional inventory web application into a full-stack Single Page Application (SPA).

---

## 📌 Project Overview

This application manages product inventories, categories, suppliers, and user roles (Admin & Employee). It incorporates:
- **Role-Based Access Control**: Separate workflows for `admin` and `employee` users.
- **Product Management**: Tracking product quantities, unit prices, and custom low-stock thresholds.
- **Category & Supplier Linking**: Relational database structure connecting products to categories and suppliers.
- **Modern Full-Stack Stack**: Backend routing, migrations, and Eloquent ORM powered by Laravel; reactive UI powered by Inertia.js and React.

---

## 🛠️ Tech Stack

- **Backend Framework**: [Laravel 12](https://laravel.com/) (PHP ^8.3)
- **Frontend SPA Bridge**: [Inertia.js 2.x](https://inertiajs.com/)
- **Frontend Framework**: [React 19](https://react.dev/)
- **CSS / Styling**: [Tailwind CSS v4](https://tailwindcss.com/)/[Bootstrap](https://getbootstrap.com)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Database**: MySQL / MariaDB (via Laragon, XAMPP, or native install)

---

## 📋 Prerequisites

Ensure the following tools are installed on the computer before setup:

1. **PHP >= 8.2** (with extensions: `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `curl`)
2. **Composer** (v2.x) - [getcomposer.org](https://getcomposer.org/)
3. **Node.js** (v18.x or v20.x+) and **npm** - [nodejs.org](https://nodejs.org/)
4. **MySQL** or **Laragon / XAMPP**
5. **Git** - [git-scm.com](https://git-scm.com/)

---

## 🚀 Setup & Installation Guide

Follow these steps to set up and run the repository on any computer:

### 1. Clone the Repository

```bash
git clone https://github.com/IceSage01-cy/Final-Proj-Laravel-INTECH-3112.git
cd Final-Proj-Laravel-INTECH-3112
```

### 2. Switch to the Working Branch

Check out the branch containing the latest migrations, models, and React integration:

```bash
git checkout migrations-models
```

---

### 3. Configure the Environment (`.env`)

Duplicate the sample environment file to create your local `.env`:

**On Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```
**On macOS / Linux / Git Bash:**
```bash
cp .env.example .env
```

Open `.env` and verify your database configuration (matches default Laragon settings):

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=final-proj
DB_USERNAME=root
DB_PASSWORD=
```
*(If using XAMPP or custom MySQL credentials, update `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` accordingly).*

---

### 4. Create the Database

Make sure your MySQL service is running (e.g. click **Start All** in Laragon/XAMPP).

Create a database named **`final-proj`** using your preferred database client (HeidiSQL, phpMyAdmin, or MySQL CLI):

```sql
CREATE DATABASE `final-proj`;
```

---

### 5. Install Dependencies

Install PHP backend packages:
```bash
composer install
```

Install frontend JavaScript packages:
```bash
npm install
```

---

### 6. Generate Application Encryption Key

Generate your unique Laravel application key:

```bash
php artisan key:generate
```

---

### 7. Run Database Migrations & Seeders

Migrate the database tables and populate initial inventory data:

```bash
php artisan migrate:fresh --seed
```

This sets up:
- `users` (Admin and Employee accounts)
- `categories` (Electronics, Office Supplies, Furniture, etc.)
- `suppliers` (TechSupply Inc., OfficePlus, etc.)
- `products` (Stock quantities, unit prices, low stock alerts)

---

### 8. Run the Development Server

Start both the Laravel backend and the Vite asset server:

#### Option A: Single Command
```bash
composer run dev
```

#### Option B: Separate Terminals
- **Terminal 1 (Backend):**
  ```bash
  php artisan serve
  ```
- **Terminal 2 (Frontend / Vite):**
  ```bash
  npm run dev
  ```

---

### 9. Access the Application

- **Main Welcome Page**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Inertia / React Test Page**: [http://127.0.0.1:8000/hello](http://127.0.0.1:8000/hello)

---

## 🔑 Seeded Demo Credentials

| Role | Username | Notes |
| :--- | :--- | :--- |
| **Admin** | `admin` | Full administrative access |
| **Employee** | `user` | Standard staff access |

---

## 🗂️ Project Directory Structure

```text
├── app/
│   ├── Http/
│   │   ├── Controllers/         # Admin, Employee, Product, Report controllers
│   │   └── Middleware/          # Inertia requests & role-based middleware
│   └── Models/                  # Eloquent models (User, Product, Category, Supplier)
├── database/
│   ├── migrations/              # Database schema migrations
│   └── seeders/                 # Inventory & user seeders
├── resources/
│   ├── js/                      # Inertia React components & pages
│   │   ├── pages/               # Page components (e.g., hello.jsx)
│   │   └── app.jsx              # Inertia frontend entry point
│   └── views/
│       └── app.blade.php        # Root Blade template for Inertia
├── routes/
│   └── web.php                  # Web application routes
└── vite.config.js               # Vite + React + Laravel bundler configuration
```

---

## 💡 Troubleshooting & Windows Tips

- **Laragon PATH issues (`'php'` or `'composer'` not recognized)**:
  If running outside the Laragon terminal, temporarily append Laragon's binaries to your PowerShell session:
  ```powershell
  $env:Path += ";C:\laragon\bin\php\php-8.3.30-Win32-vs16-x64;C:\laragon\bin\composer"
  ```
  *(Or use the built-in **Terminal** button directly inside Laragon).*

- **`The [pcntl] extension is required to run Pail`**:
  Laravel Pail is a Linux-only real-time log viewer. On Windows, `php artisan pail` should not be included in the `dev` script in `composer.json`.

- **500 Server Error on First Run**:
  Ensure you ran `php artisan key:generate` to generate the `APP_KEY` in your `.env` file.
