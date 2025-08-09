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

  // Efecto para buscar usuarios mientras el usuario escribe
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

  useEffect(() => {
    // El usuario se une al chat y le dice al servidor quién es
    if (userInfo && userInfo._id) {
      socket.emit('join', userInfo._id);
    }
  }, [userInfo]);

  useEffect(() => {
    socket.on('private message', (msg) => {
      // Asegúrate de que el mensaje es para la conversación actual
      if (recipient && (msg.fromUserId === recipient._id || msg.toUserId === recipient._id)) {
        setMessages((prevMessages) => [...prevMessages, msg.message]);
      }
    });
    return () => {
      socket.off('private message');
    };
  }, [recipient]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message && recipient) {
      socket.emit('private message', {
        toUserId: recipient._id,
        message: message,
      });
      setMessages((prev) => [...prev, message]); // Muestra tu propio mensaje
      setMessage('');
    }
  };

  const handleSelectRecipient = (selectedUser) => {
    setRecipient(selectedUser);
    setSearchTerm('');
    setSearchResults([]);
    setMessages([]); // Limpia los mensajes para la nueva conversación
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
              <li key={user._id} onClick={() => handleSelectRecipient(user)}>
                {user.username}
              </li>
            ))}
          </ul>
        )}
      </div>

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