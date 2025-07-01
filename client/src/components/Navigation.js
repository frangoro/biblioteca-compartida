import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="main-nav">
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/myBooks">Mis libros</Link></li>
        <li><Link to="/loans">Mis préstamos</Link></li>
        <li><Link to="/chat">Chat</Link></li>
        <li><Link to="/miUser">Mi usuario</Link></li>
        <li><Link to="/">Iniciar sesión</Link></li>
        <li><Link to="/about">Nosotros</Link></li>
        <li><Link to="/contact">Contacto</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation;