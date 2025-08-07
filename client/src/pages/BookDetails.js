import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { readBook } from '../services/bookService';
import styles from './BookDetails.module.css';

function BookDetails() {
  const { id } = useParams(); // Obtiene el ID del libro de la URL (ej. /books/123)
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loanStatus, setLoanStatus] = useState(''); // Estado para el feedback de la solicitud de préstamo

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await readBook(id);
        setBook(response.data);
      } catch (err) {
        console.error('Error al cargar los detalles del libro:', err);
        setError('No se pudieron cargar los detalles del libro.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]); // Dependencia del ID para recargar si el ID cambia

  const handleRequestLoan = async () => {
    setLoanStatus('Cargando...');
    try {
      // Aquí harías la llamada a tu API de préstamo
      const response = await fetch(`/api/loans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${yourAuthToken}` // Si usas autenticación
        },
        body: JSON.stringify({ bookId: id, borrowerId: 'idDelUsuarioLogueado' }) // Envía los datos necesarios
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error al solicitar préstamo: ${response.status}`);
      }

      const result = await response.json();
      setLoanStatus('¡Préstamo solicitado con éxito! Esperando aprobación.');
      console.log('Resultado del préstamo:', result);
      // Aquí podrías actualizar el estado del botón o del libro si fuera necesario
    } catch (err) {
      console.error('Error al solicitar el préstamo:', err);
      setLoanStatus(`Error: ${err.message || 'No se pudo solicitar el préstamo.'}`);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="page-content">
          <div className="container">
            <p>Cargando detalles del libro...</p>
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

  if (!book) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="page-content">
          <div className="container">
            <p>Libro no encontrado.</p>
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
        <div className={`container ${styles['book-details-container']}`}>
          <div className={styles['book-details-content']}>
            <img src={book.image || process.env.REACT_APP_PLACEHOLDER_IMAGE_URL} alt={`Portada de ${book.title}`} className={styles['book-details-image']} />
            <div className={styles['book-details-info']}>
              <h1>{book.title}</h1>
              <p className={styles['book-details-author']}>Autor: {book.author}</p>
              <p className={styles['book-details-description']}>{book.description}</p>
              {/* Aquí podrías añadir más detalles: género, ISBN, disponibilidad, etc. */}
              <button
                className={styles['loan-request-button']}
                onClick={handleRequestLoan}
                disabled={loanStatus === 'Cargando...'} // Deshabilita el botón mientras carga
              >
                {loanStatus === 'Cargando...' ? 'Solicitando...' : 'Solicitar Préstamo'}
              </button>
              {loanStatus && loanStatus !== 'Cargando...' && (
                <p className={`${styles['loan-status-message']} ${loanStatus.includes('Error') ? styles['error'] : styles['success']}`}>
                  {loanStatus}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default BookDetails;