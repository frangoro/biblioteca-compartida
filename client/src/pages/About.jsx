import React from 'react';
import styles from './About.module.css';

const About = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <section className={`${styles.hero} text-center mb-16`}>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Nuestra Biblioteca</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Creemos que un libro guardado es una historia dormida. Nuestra misión es despertar esas historias 
          conectando a lectores de toda la comunidad.
        </p>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        <div className={`${styles.card} p-6 bg-white rounded-lg shadow-md`}>
          <h3 className="font-semibold text-xl mb-2 text-primary">Comunidad</h3>
          <p className="text-gray-600">Fomentamos lazos entre vecinos a través del intercambio cultural.</p>
        </div>
        <div className={`${styles.card} p-6 bg-white rounded-lg shadow-md`}>
          <h3 className="font-semibold text-xl mb-2 text-primary">Sostenibilidad</h3>
          <p className="text-gray-600">Reutilizar libros reduce el impacto ambiental y promueve la economía circular.</p>
        </div>
        <div className={`${styles.card} p-6 bg-white rounded-lg shadow-md`}>
          <h3 className="font-semibold text-xl mb-2 text-primary">Acceso</h3>
          <p className="text-gray-600">Hacemos que la lectura sea accesible para todos, sin barreras económicas.</p>
        </div>
      </div>
    </div>
  );
};

export default About;