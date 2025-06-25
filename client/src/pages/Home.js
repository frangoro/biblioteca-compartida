import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard'; 
import '../styles/Home.css';


function Home() {
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Esta función simulará la carga de datos desde tu API REST
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        setBooks(data);
      } catch (error) {
        console.error("Error al cargar los libros:", error);
        setError("No se pudieron cargar los libros. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  if (loading) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="page-content">
          <div className="container">
            <p>Cargando libros...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="page-content">
          <div className="container">
            <p className="error-message">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Header />
      <main className="page-content">
        <div className="container">
          <h2>Nuestros Libros Disponibles</h2>
          <div className="book-cards-grid"> {/* Contenedor para las tarjetas */}
            {books.map(book => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
          {books.length === 0 && !loading && (
            <p>No hay libros disponibles en este momento.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );

}

export default Home;