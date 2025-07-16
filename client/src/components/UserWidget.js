/**
 * Menú de inicio sesión / registrarse cuando el usuario no está autenticado
 * y nombre de usuario y foto de perfíl cuando sí lo está.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function UserWidget() {
  const { userInfo, logout } = useAuth();
  
  return (
    <div className="user-widget">
      {userInfo ? (
        <div className="profile-info">
          {userInfo?.profilePicUrl ? ( // Si el usuario tiene una URL de foto de perfil
            <img
              src={userInfo.profilePicUrl}
              alt="Foto de perfil"
              className="profile-pic"
            />
          ) : ( // Si no tiene URL de foto de perfil, usa el icono de Font Awesome
            <FontAwesomeIcon icon="user-circle" className="profile-icon" /> // Usa el nombre del icono
          )}
          <Link to="/myUser"><span className="user-name">Hola, {userInfo?.username || 'Usuario'}</span></Link>
          <button onClick={logout} className="logout-button">Cerrar Sesión</button>
        </div>
      ) : (
        <div className="auth-links">
          <Link to="/login" className="login-link">Iniciar Sesión</Link>
          <span className="separator"> | </span>
          <Link to="/register" className="register-link">Registrarse</Link>
        </div>
      )}
    </div>
  );
}

export default UserWidget;