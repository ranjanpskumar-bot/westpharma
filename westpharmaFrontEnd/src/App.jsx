import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import CreateOrder from './pages/CreateOrder';
import EditOrder from './pages/EditOrder';
import Users from './pages/Users';
import CreateUser from './pages/CreateUser';
import Layout from './components/Layout';
import './index.css';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading, hasRole } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  if (roles && !roles.some(role => hasRole(role))) {
    return <Navigate to="/dashboard" />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders/create" 
            element={
              <ProtectedRoute>
                <CreateOrder />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders/edit/:id" 
            element={
              <ProtectedRoute>
                <EditOrder />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute roles={['Admin']}>
                <Users />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users/create" 
            element={
              <ProtectedRoute roles={['Admin']}>
                <CreateUser />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users/edit/:id" 
            element={
              <ProtectedRoute roles={['Admin']}>
                <CreateUser />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
