import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navigation() {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  // Redirige al login después de cerrar sesión
  const handleLogout = () => {
      logout();
      navigate('/login'); 
  };

  // Abrir la ventana del chat en una nueva pestaña
  const handleClick = (event) => {
    // Abre una nueva ventana en blanco con la URL
    window.open('/chat', '_blank');
    // Que el enlace de <Link> no navegue en la misma pestaña
    event.preventDefault(); 
  };

  return (
    <nav className="main-nav">
      <ul>
        {/* Se muestra para usuarios autenticados o no*/}
        <li><Link to="/">Inicio</Link></li>
        {userInfo ? (
          // Si el usuario está logueado...
          <>
            <li><Link to="/myBooks">Mis libros</Link></li>
            <li><Link to="/loans">Mis préstamos</Link></li>
            <li><Link to="/chat" onClick={handleClick} >Chat</Link></li>
            <li><Link to={`/profile/${userInfo.id}`}>Mi usuario</Link></li>
            {/* Mostramos el enlace de admin solo si el usuario tiene ese rol */}
            {userInfo.role === 'admin' && (
              <li><Link to="/admin/userlist">Administrar Usuarios</Link></li>
            )}
          </>
        ) : (
          // Si no está logueado...
          <>
            <li><Link to="/login">Iniciar Sesión</Link></li>
            <li><Link to="/register">Registrarse</Link></li>
          </>
        )}
        <li><Link to="/about">Nosotros</Link></li>
        <li><Link to="/contact">Contacto</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation;