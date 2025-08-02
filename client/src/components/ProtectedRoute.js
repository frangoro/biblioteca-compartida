/* Protegue la página que se quiere acceder para que solo los usuarios autenticados puedan acceder a ella */
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useAuth();

  if (!userInfo) {
    // Redirige al usuario a la página de inicio de sesión si no está autenticado
    return <Navigate to="/login" replace />;
  }
  // Si el usuario está autenticado, renderiza los hijos (la página protegida)
  return children;
};

export default ProtectedRoute;