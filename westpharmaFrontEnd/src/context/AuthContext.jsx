import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('westpharma_user');
    const token = localStorage.getItem('westpharma_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('westpharma_user', JSON.stringify(userData));
    localStorage.setItem('westpharma_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('westpharma_user');
    localStorage.removeItem('westpharma_token');
    setUser(null);
  };

  const hasRole = (role) => user?.roles?.includes(role);

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
