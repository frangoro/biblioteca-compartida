import React from 'react';
import Navigation from './Navigation'; 
import logo from '../assets/images/logo.png';
import UserWidget from './UserWidget';
import '../styles/Header.css';

function Header() {
  return (
    <header className="app-header">
      <div className="container">
        <div className="primera-fila">
          <div className="logo-titulo">
            <img src={logo} className="app-logo" alt="logo" />
            <h1>Biblioteca Compartida</h1>
          </div>
          <UserWidget /> 
        </div>
        <div className="segunda-fila">
          <Navigation />
        </div>
      </div>
    </header>
  );
}

export default Header;