import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BookCard.css'; // Estilos para la tarjeta

function BookCard({ book }) {
  // Asegúrate de que 'book' exista y tenga las propiedades esperadas
  if (!book) {
    return null; // O un placeholder si prefieres
  }

  const { _id, title, author, coverImageUrl, description } = book;

  return (
    <div className="book-card">
      <img src={coverImageUrl || 'placeholder.jpg'} alt={`Portada de ${title}`} className="book-card-image" />
      <div className="book-card-content">
        <h3 className="book-card-title">{title}</h3>
        <p className="book-card-author">Autor: {author}</p>
        <p className="book-card-description">{description}</p>
        {/* Puedes añadir más detalles aquí como género, disponibilidad, etc. */}
        <Link to={`/books/${_id}`} className="book-card-button">
          Ver Detalles
        </Link>
      </div>
    </div>
  );
}

export default BookCard;