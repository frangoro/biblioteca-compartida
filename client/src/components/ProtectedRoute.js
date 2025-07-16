import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useAuth();

  if (!userInfo) {
    // Redirige al usuario a la página de inicio de sesión si no está autenticado
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;