# Backend Technical Documentation - Westpharma API

## 🏛️ Architecture: Clean Architecture
The backend is structured into four distinct layers to ensure separation of concerns and maintainability:

1.  **Domain Layer**: Contains pure entities (`Order`, `AuditLog`, `ApplicationUser`) and core interfaces. No external dependencies.
2.  **Application Layer**: Contains DTOs, AutoMapper profiles, FluentValidation rules, and business interfaces (`IUnitOfWork`, `IOrderRepository`).
3.  **Infrastructure Layer**: Handles data persistence (EF Core `ApplicationDbContext`), Identity services, and specific repository implementations.
4.  **API Layer**: ASP.NET Core controllers, JWT configuration, and Swagger integration.

## 🗄️ Database & Persistence
- **Engine**: SQL Server.
- **ORM**: Entity Framework Core.
- **Concurrency**: `RowVersion` (byte array) on the `Order` entity provides optimistic concurrency control.
- **Stored Procedures**: `sp_ApproveOrder` is used for high-integrity approval operations, ensuring audit logs and order status updates are handled atomically.

## 🔐 Identity & Security
- **Authentication**: JWT Bearer Tokens.
- **Authorization**: Role-based Access Control (RBAC).
- **Default Roles**: `Admin`, `Manager`, `User`.
- **Password Hashing**: Uses ASP.NET Core Identity's default PBKDF2 hashing.

## 📊 Business Rules (API Enforcement)
- **Order Lifecycle**: Orders start in `Pending` (1). Transition to `Approved` (2) or `Rejected` (3).
- **Approval Constraints**:
  - Managers can only approve orders where `Amount < 10,000`.
  - Managers cannot approve orders they created themselves.
- **Ownership**: Users can only edit or delete orders they own, and only if the order is still `Pending`.

## 🛠️ Key API Endpoints
- `POST /api/auth/login`: Issue JWT.
- `POST /api/auth/register`: Onboard new users.
- `GET /api/orders`: Retrieve orders based on role visibility.
- `POST /api/orders/{id}/approve`: Invoke the `sp_ApproveOrder` procedure.
- `DELETE /api/auth/users/{id}`: Administrative account removal.

## 🪵 Logging & Monitoring
- **Provider**: Serilog.
- **Sinks**: Console (Standard Output).
- **Audit Logs**: Every approval and rejection is captured in the `AuditLogs` table with a timestamp, user ID, and order reference.

## 🚀 Environment Setup
Ensure the `DefaultConnection` in `appsettings.json` is configured before running `dotnet ef database update`.
