import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// Contexto para obtener la info del usuario
import { useAuth } from '../context/AuthContext'; 

const AdminRoute = () => {
    const { userInfo } = useAuth(); // Esto debería devolver { ..., role: 'admin' }
    console.log('El contexto pertenece al usuario:', userInfo);

    // Si el usuario está logueado y es admin, renderiza el contenido de la ruta (Outlet)
    // Si no, lo redirige a la página de login o a la home.
    return userInfo && userInfo.role === 'admin' ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;