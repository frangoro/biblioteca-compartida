import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './Loans.module.css'; 

function Loans() {

  const [lentBooks, setLentBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- ¡IMPORTANTE: Aquí necesitas el ID real del usuario logueado! ---
  // Por ahora, usaremos un ID fijo para desarrollo.
  // En una app real, esto vendría del contexto de autenticación (ej. un hook useAuth())
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    // Simula la obtención del ID de usuario (reemplaza con tu lógica de autenticación)
    const getUserId = async () => {
      // Por ejemplo, si tienes un endpoint para obtener el usuario actual:
      // const response = await axios.get('/api/me');
      // setCurrentUserId(response.data._id);
      // O si lo guardas en localStorage después de un login:
      // const storedUserId = localStorage.getItem('userId');
      // if (storedUserId) {
      //   setCurrentUserId(storedUserId);
      // } else {
      //   // Si no hay ID, puedes crear uno de prueba o redirigir a login
      //   console.warn("No hay ID de usuario. Usando un ID de prueba por defecto.");
          // Este ID debe existir en tu base de datos para que el populate funcione
      //   setCurrentUserId('667f3a971234567890abcdef'); // <-- ¡Usa un ID REAL de un usuario de tu DB!
          // Para el seedDatabase de arriba, puedes usar el ID de user1 (Alice)
          // Que obtendrías de la consola de MongoDB o de un log después de seedear.
          // Por ejemplo: si user1._id en la consola es ObjectId("667f3a971234567890abcdef")
          // entonces usarías '667f3a971234567890abcdef' aquí.
          setCurrentUserId('66301a1f4d4b4a001a234b11'); // Asegúrate que este sea un ID de usuario válido de tu DB
      // }
    };
    getUserId();

    // --- Lógica para obtener el ID del usuario logueado ---
    // ESTO ES CRÍTICO. Reemplaza esta simulación con tu método real:
    // Por ejemplo, si tu app devuelve el userId después del login y lo almacenas en localStorage:
    /*const storedUserId = localStorage.getItem('userId'); // Suponiendo que guardas el ID aquí
    if (storedUserId) {
      setCurrentUserId(storedUserId);
    } else {
      // Si no hay ID, quizás redirigir al login o mostrar un mensaje
      setError("No se pudo obtener el ID del usuario logueado. Por favor, inicie sesión.");
      setLoading(false);
      // alert("Por favor, inicie sesión para ver esta página.");
      // navigate('/login'); // Si usas react-router-dom para navegación
    }
*/
    // O si tienes un contexto/hook de autenticación que proporciona el ID:
    // const { user } = useAuth(); // Ejemplo de un hook de autenticación
    // if (user && user._id) {
    //   setCurrentUserId(user._id);
    // }

    // Para probar con tu `server.js` modificado (con el hardcoded `req.userId`):
    // Simplemente puedes establecer un valor fijo para `currentUserId`
    // Asegúrate de que este ID corresponda a un usuario existente en tu DB.
    //setCurrentUserId('66301a1f4d4b4a001a234b11'); // <--- ¡Úsalo aquí!
    // Nota: El `useEffect` de arriba para `getUserId` ya no es necesario si lo haces así.

  }, []); // Se ejecuta una sola vez al montar el componente

  useEffect(() => {
    const fetchUserLoans = async () => {
      if (!currentUserId) {
        setLoading(false);
        setError("No se pudo obtener el ID del usuario logueado.");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Peticiones al Backend - Ahora el ID es dinámico
        const lentResponse = await axios.get(`/api/users/${currentUserId}/lent-books`);
        setLentBooks(lentResponse.data);

        const borrowedResponse = await axios.get(`/api/users/${currentUserId}/borrowed-books`);
        setBorrowedBooks(borrowedResponse.data);

        const requestsResponse = await axios.get(`/api/users/${currentUserId}/loan-requests`);
        setLoanRequests(requestsResponse.data);

      } catch (err) {
        console.error('Error al cargar la información de préstamos:', err);
        if (err.response) {
          setError(err.response.data.message || `Error del servidor: ${err.response.status}`);
        } else if (err.request) {
          setError('No se recibió respuesta del servidor. Verifica que el backend esté funcionando.');
        } else {
          setError(err.message || 'Error desconocido al cargar los datos.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) { // Solo ejecuta la carga si el ID de usuario ya está disponible
      fetchUserLoans();
    }
  }, [currentUserId]); // Se ejecuta cuando el ID de usuario cambia o se establece

  // --- Funciones para manejar acciones (aprobar, rechazar, devolver) ---

  const handleApproveLoan = async (requestId) => { // No necesitamos bookId aquí si el backend lo saca del loan
    try {
      await axios.put(`/api/loans/${requestId}/approve`);
      // Refrescar los datos después de una acción exitosa
      setLoanRequests(prev => prev.filter(req => req._id !== requestId));
      alert('Solicitud aprobada con éxito.');
      // Opcional: Re-fetch completo para actualizar todas las listas
      // fetchUserLoans();
    } catch (err) {
      console.error('Error al aprobar préstamo:', err);
      alert(err.response?.data?.message || 'Error al aprobar préstamo.');
    }
  };

  const handleRejectLoan = async (requestId) => {
    try {
      await axios.put(`/api/loans/${requestId}/reject`);
      setLoanRequests(prev => prev.filter(req => req._id !== requestId));
      alert('Solicitud rechazada.');
    } catch (err) {
      console.error('Error al rechazar préstamo:', err);
      alert(err.response?.data?.message || 'Error al rechazar préstamo.');
    }
  };

  const handleReturnBook = async (loanId) => { // No necesitamos bookId aquí si el backend lo saca del loan
    try {
      await axios.put(`/api/loans/${loanId}/return`);
      setBorrowedBooks(prev => prev.filter(loan => loan._id !== loanId));
      alert('Libro marcado como devuelto.');
      // Opcional: Re-fetch completo para actualizar todas las listas
      // fetchUserLoans();
    } catch (err) {
      console.error('Error al devolver libro:', err);
      alert(err.response?.data?.message || 'Error al devolver libro.');
    }
  };

  // ... (el resto del JSX de renderizado es el mismo, pero asegúrate de acceder a los datos populados)

  return (
    <div className="page-wrapper">
      <Header />
      <main className={`${styles['user-loans-page']} page-content`}>
        <div className="container">
          <h1>Gestión de Mis Préstamos</h1>

          {/* Sección de Solicitudes de Préstamo */}
          <section>
            <h2>Solicitudes de Préstamo Pendientes ({loanRequests.length})</h2>
            {loanRequests.length === 0 ? (
              <p>No hay solicitudes de préstamo pendientes para tus libros.</p>
            ) : (
              <div className={styles['loan-requests-list']}>
                {loanRequests.map(request => (
                  <div key={request._id} className={styles['loan-request-item']}>
                    {/* Accede a request.book.title y request.borrower.username */}
                    <p>Libro: <strong>{request.book ? request.book.title : 'N/A'}</strong> (de {request.book ? request.book.author : 'N/A'})</p>
                    <p>Solicitado por: {request.borrower ? request.borrower.username : 'N/A'}</p>
                    <p>Fecha de solicitud: {new Date(request.requestDate).toLocaleDateString()}</p>
                    <div className={styles['request-actions']}>
                      <button onClick={() => handleApproveLoan(request._id)} className={styles['approve-button']}>Aprobar</button>
                      <button onClick={() => handleRejectLoan(request._id)} className={styles['reject-button']}>Rechazar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Sección de Libros que he prestado */}
          <section>
            <h2>Libros que he prestado ({lentBooks.length})</h2>
            {lentBooks.length === 0 ? (
              <p>Actualmente no tienes libros prestados a otros usuarios.</p>
            ) : (
              <div className={styles['lent-books-list']}>
                {lentBooks.map(loan => (
                  <div key={loan._id} className={styles['lent-book-item']}>
                    {/* Accede a loan.book.title y loan.borrower.username */}
                    <p>Libro: <strong>{loan.book ? loan.book.title : 'N/A'}</strong> (de {loan.book ? loan.book.author : 'N/A'})</p>
                    <p>Prestado a: {loan.borrower ? loan.borrower.username : 'N/A'}</p>
                    <p>Fecha de préstamo: {loan.loanDate ? new Date(loan.loanDate).toLocaleDateString() : 'Pendiente'}</p>
                    <p>Estado: {loan.status}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Sección de Libros que me han prestado */}
          <section>
            <h2>Libros que me han prestado ({borrowedBooks.length})</h2>
            {borrowedBooks.length === 0 ? (
              <p>Actualmente no tienes libros prestados de otros usuarios.</p>
            ) : (
              <div className={styles['borrowed-books-list']}>
                {borrowedBooks.map(loan => (
                  <div key={loan._id} className={styles['borrowed-book-item']}>
                    {/* Accede a loan.book.title y loan.owner.username */}
                    <p>Libro: <strong>{loan.book ? loan.book.title : 'N/A'}</strong> (de {loan.book ? loan.book.author : 'N/A'})</p>
                    <p>Prestado por: {loan.owner ? loan.owner.username : 'N/A'}</p>
                    <p>Fecha de préstamo: {loan.loanDate ? new Date(loan.loanDate).toLocaleDateString() : 'Pendiente'}</p>
                    <p>Estado: {loan.status}</p>
                    {loan.status === 'approved' && (
                      <button onClick={() => handleReturnBook(loan._id)} className={styles['return-button']}>Marcar como devuelto</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
} 

export default Loans;