import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { useChat } from '../context/ChatContext'; 
import { useAuth } from '../context/AuthContext';
import styles from "./BookCard.module.css";

function BookCard({ book }) {

  const navigate = useNavigate();
  const { startNewChat } = useChat();
  const { userInfo } = useAuth(); // Para verificar si eres el propietario

  if (!book) {
    return null;
  }

  const { _id, title, author, image, description } = book;

  const handleSolicitarPrestamo = () => {
    const propietarioId = book.propietarioId; // Asumiendo que este campo existe
    const propietarioUsername = book.propietario; 

    if (userInfo && propietarioId === userInfo.id) {
        alert("¡No puedes chatear contigo mismo!");
        return;
    }

    // 1. Establece el estado global del chat
    startNewChat(propietarioId, propietarioUsername); 
    
    // 2. Navega a la página de chat
    navigate('/chat'); // Asegúrate que esta es la ruta correcta
  };

  return (
    <div className={styles["book-card"]}>
      <img src={image || process.env.REACT_APP_PLACEHOLDER_IMAGE_URL} alt={`Portada de ${title}`} className={styles["book-card-image"]} />
      <div className={styles["book-card-content"]}>
        <h3 className={styles["book-card-title"]}>{title}</h3>
        <p className={styles["book-card-author"]}>Autor: {author}</p>
        <p className={styles["book-card-description"]}>{description}</p>
        <Link to={`/books/${_id}`} className={styles["book-card-button"]}
        onClick={handleSolicitarPrestamo}>
          Ver Detalles
        </Link>
      </div>
    </div>
  );
}

export default BookCard;