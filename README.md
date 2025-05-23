# 🏪 Store App
🌐 Live App URL:
🔗 https://store-ratings-app.onrender.com

A role-based full-stack store management web application using Node.js, Express, React, Prisma, and PostgreSQL.
Login Details for Testing every roles is below in the file. 
---

## API Base URL Configuration

The frontend automatically sets the API base URL depending on where it is running:

- **Local Development:**  
  Uses `http://localhost:5000/api` as the backend API base URL.

- **Production:**  
  Uses `https://store-ratings-app.onrender.com/api` as the backend API base URL.

This is determined dynamically in the frontend code by checking the current hostname
## 📁 Project Structuree

```plaintext
store_app-root/
├── backend/                 # Express + Prisma backend
├── frontend/
│   └── store-app/           # React frontend
├── package.json             # Root scripts
└── README.md
```
---
## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/store-app-root.git
cd store-app-root
```
---

### 2. Install Dependencies and Build the Project

```bash
npm run build
```

This command will:
- Install dependencies in `backend/`
- Install dependencies in `frontend/store-app/`
- Build the React frontend

---

### 3. Set Up Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
```

For Prisma, to generate and push to db run:

```bash
npx prisma generate
npx prisma db push
```

---

### 4. Run the Application

#### Development Mode (hot reload for backend)

```bash
npm run dev
```

#### Production Mode (runs backend and serves frontend)

```bash
npm start
```

---

---

## 👥 Predefined Users

### 🔑 Admin (Full Access)

| Email              | Password     | Role  | Notes        |
|--------------------|--------------|-------|--------------|
| admin1@gmail.com   | Admin@1234   | ADMIN | Sys admin    |

---

### 👤 Users (Must change password on first login)

| Email              | Password     | Role  | Notes                               |
|--------------------|--------------|-------|-------------------------------------|
| test1@gmail.com    | Testuser1@   | USER  | Created by admin – change pass on login |
| test2@example.com  | Testuser1@   | USER  | Created by admin – change pass on login |

---

### 🧑‍💼 Store Owners

| Email              | Password     | Role   |
|--------------------|--------------|--------|
| owner1@example.com | Testuser1@   | OWNER  |
| owner2@example.com | Testuser1@   | OWNER  |

---

## 🔐 Role Description

- **ADMIN** – Manage users and stores, full system access.
- **OWNER** – Manage only their own store and view ratings.
- **USER** – View store listings and rate stores.

---

## 🙌 Contributing

Feel free to fork the project and open a pull request!