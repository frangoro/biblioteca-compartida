import React from 'react';
import Navigation from './Navigation'; 
import logo from '../assets/images/logo.png';

function Header() {
  return (
    <header className="app-header">
      <div className="container">
        <img src={logo} className="app-logo" alt="logo" />
        <h1>Biblioteca Compartida</h1>
        <Navigation />
      </div>
    </header>
  );
}

export default Header;