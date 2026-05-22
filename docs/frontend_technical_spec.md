# Frontend Technical Documentation - Westpharma Order System

## 🌟 Overview
The Westpharma Frontend is a high-performance, responsive React application designed with a focus on "Premium Enterprise" aesthetics and strict role-based functionality. It leverages modern web technologies to provide a fluid, glassmorphism-inspired user interface.

## 🏗️ Architecture
- **Framework**: React 18+ (Vite)
- **State Management**: React Context API (`AuthContext`)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with interceptors for JWT injection

## 🎨 Design System
The application uses a custom Vanilla CSS design system defined in `src/index.css`.
- **Typography**: `Outfit` font family (imported via Google Fonts).
- **Styling**: Leverages CSS Variables for themes, glassmorphism (`glass-card`), and dynamic gradients.
- **Animations**: `framer-motion` for page transitions and micro-interactions.
- **Icons**: `lucide-react` for consistent vector iconography.
- **Modals**: `sweetalert2` for premium confirmation and feedback dialogs.

## 🔐 Authentication & Authorization
- **JWT Storage**: Tokens are stored in `localStorage` and automatically injected into API headers via Axios.
- **Role Enforcement**:
  - `Admin`: Full access to Users, Dashboard, and all Order actions.
  - `Manager`: Access to Dashboard and Orders. Limited to approving orders < $10,000.
  - `User`: Access to Dashboard and personal Orders.

## 📂 Component Structure
- `/src/components`:
  - `Sidebar.jsx`: Dynamic navigation with role-based link filtering.
  - `Layout.jsx`: Master wrapper for sidebar and main content.
- `/src/pages`:
  - `Login.jsx` & `Register.jsx`: Immersive onboarding flows.
  - `Dashboard.jsx`: Data-driven analytics overview.
  - `Orders.jsx`: Core workflow engine for listing and processing orders.
  - `Users.jsx`: Administrator portal for system access control.

## 📡 API Integration
All requests are centralized in `src/api/api.js`.
- **Base URL**: Configurable for development and production.
- **Interceptors**: Handles 401 Unauthorized errors by automatically clearing local session and redirecting to login.

## 🚀 Deployment
Run `npm run build` to generate the production bundle in the `dist/` directory.
