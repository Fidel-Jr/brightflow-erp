# BrightFlow ERP (Ongoing Project)

**Project Type:** Web-based ERP / Logistics Management System  
**Stack:** React (Frontend) + ASP.NET Core (Backend) + PostgreSQL (Database)  

> BrightFlow ERP is an ongoing project designed to streamline inventory, orders, and delivery management for logistics and warehouse operations. This system demonstrates a full-stack approach with role-based access and modular architecture.

---

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Current Features](#current-features)  
3. [Roles & Permissions](#roles--permissions)  
4. [System Architecture](#system-architecture)  
5. [Tech Stack](#tech-stack)  
6. [Installation & Setup](#installation--setup)  
7. [Project Status](#project-status)

---

## Project Overview

BrightFlow ERP aims to:

- Reduce manual work in warehouse and logistics operations  
- Track inventory and orders in real-time  
- Provide dashboards and reports for managers  
- Ensure secure, role-based access to sensitive data  

**Scope:** Core ERP modules (Users/Roles, Inventory, Orders, Deliveries)  
**Excluded for MVP:** AI/ML, accounting, client portal  

> Note: This project is **still ongoing** and actively under development.

---

## Current Features

### Backend
- ASP.NET Core Web API  
- User & Role management (using Identity)  
- JWT authentication & role-based access  
- CRUD APIs for Users and Roles  

### Frontend
- React application with React Router  
- AuthContext for JWT and user info  
- Login page & role-based protected routes  
- Initial UserManagement and RoleManagement pages (WIP)  
- Navbar & Sidebar layout with role-based menu visibility  

---

## Roles & Permissions

| Role            | Access / Permissions                                                                 |
|-----------------|-------------------------------------------------------------------------------------|
| Admin           | Full access: Users, Roles, Inventory, Orders, Deliveries, Reports                   |
| Manager         | View & update Orders, Inventory; assign deliveries; view dashboards/reports         |
| Warehouse Staff | View Inventory; update stock; view & process assigned orders                         |
| Delivery Staff  | View & update assigned deliveries only                                               |

> Roles are enforced both in backend (API authorization) and frontend (role-based UI menus).

---

**Workflow Highlights:**
- Login → JWT token issued → Protected routes based on roles  
- Admin can manage users and roles  
- Managers, Warehouse, and Delivery staff see tailored dashboards  

---

## Tech Stack

| Layer       | Technology                              |
|------------|----------------------------------------|
| Frontend   | React, React Router, Axios, Bootstrap  |
| Backend    | ASP.NET Core, Entity Framework Core    |
| Authentication | JWT, ASP.NET Identity               |
| Database   | PostgreSQL                              |
| Version Control | Git + GitHub                         |

---

## Installation & Setup

1. **Clone repository**
```
git clone https://github.com/your-username/brightflow-erp.git

```
2. **Backend setup**
```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run

```

3. **Frontend setup**
```
cd frontend
npm install
npm start

```

4. **Environment Variables**
```
JWT_SECRET → Secret key for JWT

ConnectionStrings:DefaultConnection → PostgreSQL database connection

```

---

## Project Status

| Module                  | Status                                      |
|-------------------------|--------------------------------------------|
| Auth (JWT + Identity)   | ✅ Completed                                |
| User & Role Management  | ✅ Backend complete, Frontend Initial (WIP) |
| Navbar & Sidebar Layout & Dashboard | ✅ Initial                                  |
| Inventory Module        | ⬜ Pending                                  |
| Orders Module           | ⬜ Pending                                  |
| Deliveries Module       | ⬜ Pending                                  |
| Dashboard & Reports     | ⬜ Pending                                  |

**Current phase:** Frontend and Backend development for Order Management, Layout refinement

