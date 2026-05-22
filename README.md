# Westpharma Order Management System

A high-performance, production-ready Order and User Management system built with **Clean Architecture**, **ASP.NET Core 10.0**, and a **Premium React Frontend**.

## 🚀 Key Features

- **Premium Design System**: Immersive user experience featuring Glassmorphism, dynamic background effects, and fluid animations.
- **Role-Based Workflow**: Strict enforcement of hierarchical approval paths (Users → Managers → Admins).
- **Intelligent Routing**: Automated order escalation for high-value requests (≥ $10,000).
- **Concurrency Protection**: Atomic approval operations using SQL Stored Procedures and `RowVersion` optimistic concurrency.
- **Audit Transparency**: Detailed logging of all approval and rejection actions.
- **Identity Management**: Comprehensive user provisioning and role assignment portal for administrators.

## 🛠️ Tech Stack

### Backend
- **Framework**: ASP.NET Core 10.0 Web API
- **Architecture**: Clean Architecture (Domain, Application, Infrastructure, API)
- **Database**: SQL Server with Entity Framework Core
- **Auth**: JWT (JSON Web Tokens) with ASP.NET Core Identity
- **Stored Procedures**: Optimized atomic transactions for order processing.

### Frontend
- **Framework**: React 18+ (Vite)
- **Aesthetics**: Custom Vanilla CSS Design System with **Outfit** Typography.
- **Motion**: Framer Motion for micro-animations and page transitions.
- **Icons**: Lucide React.
- **Dialogs**: SweetAlert2 for premium feedback and confirmations.

## ⚙️ Getting Started

### 1. Prerequisites
- .NET 10 SDK
- Node.js & npm
- SQL Server

### 2. Backend Setup
1. Update `DefaultConnection` in `westpharmaapi/Westpharma.API/appsettings.json`.
2. Apply database migrations:
   ```bash
   cd westpharmaapi
   dotnet ef database update --project Westpharma.Infrastructure --startup-project Westpharma.API
   ```
3. Start the API:
   ```bash
   dotnet run --project Westpharma.API
   ```

### 3. Frontend Setup
1. Navigate to `westpharmaFrontEnd`.
2. Install & Start:
   ```bash
   npm install
   npm run dev
   ```

## ⚖️ Business Rules

| Role | Capabilities | Approval Authority |
| :--- | :--- | :--- |
| **Standard User** | Create orders, view own history. | None |
| **Department Manager** | Review team orders, manage users. | Orders < $10,000 |
| **System Administrator** | Full oversight, system configuration. | **Any Order Amount** |

*Note: Managers cannot approve their own submitted orders.*

## 📂 Project Structure

- `westpharmaapi/`: Clean Architecture backend layers.
- `westpharmaFrontEnd/`: Modern React dashboard and modules.
- `docs/`: Implementation plans and technical walkthroughs.

---
*Built with ❤️ for Westpharma Engineering.*

