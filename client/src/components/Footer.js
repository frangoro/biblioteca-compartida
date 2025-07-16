import React from 'react';
import '../styles/Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <div className="container">
        <p>&copy; {currentYear} Biblioteca Compartida. Todos los derechos reservados.</p>
        {/* You can add social media icons, quick links, etc. here */}
        <div className="footer-links">
          <a href="/privacy">Política de Privacidad</a> | 
          <a href="/terms">Términos de Servicio</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;