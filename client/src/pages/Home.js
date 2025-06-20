import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Home() {
  return (
    <div className="page-wrapper">
      <Header />
      <main className="page-content">
        <div className="container">
          <h2>Bienvenido a nuestra página de inicio</h2>
          <p>Este es el contenido principal de la página de inicio. Puedes añadir cualquier información, imágenes o componentes específicos aquí.</p>
          {/* Add more content specific to your home page */}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;