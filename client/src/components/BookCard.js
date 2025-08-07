import React from 'react';
import { Link } from 'react-router-dom';
import styles from "./BookCard.module.css";

function BookCard({ book }) {
  if (!book) {
    return null;
  }

  const { _id, title, author, image, description } = book;

  return (
    <div className={styles["book-card"]}>
      <img src={image || process.env.REACT_APP_PLACEHOLDER_IMAGE_URL} alt={`Portada de ${title}`} className={styles["book-card-image"]} />
      <div className={styles["book-card-content"]}>
        <h3 className={styles["book-card-title"]}>{title}</h3>
        <p className={styles["book-card-author"]}>Autor: {author}</p>
        <p className={styles["book-card-description"]}>{description}</p>
        <Link to={`/books/${_id}`} className={styles["book-card-button"]}>
          Ver Detalles
        </Link>
      </div>
    </div>
  );
}

export default BookCard;