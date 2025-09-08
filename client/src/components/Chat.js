/* Chat Component for React using Socket.IO */

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import * as userService from '../services/userService';
import styles from './Chat.module.css';

// Conecta al servidor de Socket.IO
const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');

function Chat({ recipientId }) {
  const { userInfo } = useAuth(); // Obtén el ID del usuario logueado
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recipient, setRecipient] = useState(null); // Almacena el usuario seleccionado

  // Buscar usuarios mientras el usuario escribe
  useEffect(() => {
    const fetchUsers = async () => {
      if (searchTerm) {
        try {
          const user = await userService.getUserByUsername(searchTerm);
          if (user) {
            setSearchResults([user]);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error("Error al buscar usuarios:", error);
        }
      } else {
        setSearchResults([]);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500); // Pequeño retraso para evitar llamadas excesivas a la API

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);
  
  // El usuario se une al chat y le dice al servidor quién es
  useEffect(() => {
    if (userInfo && userInfo.id) {
      socket.emit('join', userInfo.id);
    }
  }, [userInfo]);

  // Escucha mensajes entrantes
  useEffect(() => {
    socket.on('private message', (msg) => {
      // Si el mensaje es para ti, añádelo a la lista
      if (msg.toUserId === userInfo.id) {
        setMessages((prevMessages) => [...prevMessages, msg.message]);
      }
    });
    return () => {
      socket.off('private message');
    };
  }, [userInfo]);

  // Envía un mensaje privado al usuario seleccionado
  const sendMessage = (e) => {
    e.preventDefault();
    if (message && recipient) {
      socket.emit('private message', {
        fromUserId: userInfo.id,
        toUserId: recipient.id,
        message: message,
      });
      setMessages((prev) => [...prev, message]); // Muestra tu propio mensaje
      setMessage('');
    }
  };

  // Limpia la búsqueda y los mensajes de la pantalla y selecciona un usuario para chatear
  const handleSelectRecipient = (selectedUser) => {
    setRecipient(selectedUser);
    setSearchTerm('');
    setSearchResults([]);
    setMessages([]); 
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Buscar usuario para chatear..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchResults.length > 0 && (
          <ul className={styles.searchResults}>
            {searchResults.map((user) => (
              <li key={user.id} onClick={() => handleSelectRecipient(user)}>
                {user.username}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* La interfaz de chat solo se muestra si hay un destinatario. TODO. mostrar siempre que haya conversaciones previas */}
      {recipient && (
        <div className={styles.chatWindow}>
          <h3>Chateando con: {recipient.username}</h3>
          <ul className={styles.messageList}>
            {messages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
          <form onSubmit={sendMessage}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
            />
            <button type="submit">Enviar</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;