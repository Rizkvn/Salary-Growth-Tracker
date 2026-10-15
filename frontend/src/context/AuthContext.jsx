import { useState } from 'react';
import { login as apiLogin } from '../services/authService';
import { AuthContext } from './AuthContextDef';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const isAuthenticated = !!token;

  const login = async (password) => {
    const data = await apiLogin(password);
    if (data.access_token) {
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
