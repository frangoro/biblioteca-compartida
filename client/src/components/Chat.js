/* Chat Component for React using Socket.IO */

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import * as userService from '../services/userService';
import ActiveChat from './ActiveChat';
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
  const [conversations, setConversations] = useState([]); // Lista de conversaciones previas con otros usuarios (panel de la izquierda)
  const [activeConversationId, setActiveConversationId] = useState(null); // ID de la conversación activa (actualmente abierta)

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
      socket.emit('join', userInfo);
    }
  }, [userInfo]);

  // Escucha mensajes entrantes
  useEffect(() => {
    socket.on('private message', (msg) => {
      // Si el mensaje es para ti, añádelo a la lista
      if (msg.toUserId === userInfo.id) {
        setConversations((prevConversations) => {
        const senderId = msg.fromUserId;
        const conversationExists = prevConversations.find(
          (conv) => conv.userId === senderId
        );
        setMessages((prevMessages) => [...prevMessages, msg.message]);
        // If a conversation with the sender already exists, add the message to it.
        if (conversationExists) {
          return prevConversations.map((conv) =>
            conv.userId === senderId
              ? { ...conv, messages: [...conv.messages, msg] }
              : conv
          );
        } else {
          // If not, create a new conversation for the sender.
          return [
            ...prevConversations,
            { userId: senderId, messages: [msg], username: userInfo.username }, // TODO: You'll need to fetch the username here.
          ];
        }
      });
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
        toUserId: recipient,
        message: message,
      });
      setMessages((prev) => [...prev, message]); // Muestra tu propio mensaje
      setMessage(''); // Borra el campo de entrada
      // Añade el mensaje a la conversación actual
      setConversations((prevConversations) => {
        const conversationExists = prevConversations.find(
          (conv) => conv.userId === recipient
        );
        if (conversationExists) {
          return prevConversations.map((conv) =>
            conv.userId === recipient
              ? { ...conv, messages: [...conv.messages, { fromUserId: userInfo.id, message }] }
              : conv
          );
        } else {
          // Si no existe la conversación, créala
          return [
            ...prevConversations,
            { userId: recipient, messages: [{ fromUserId: userInfo.id, message }], username: 'Unknown User' }, // TODO: Fetch username
          ];
        }
      });
    }
  };

  // The function to be called from the conversation list
const handleSelectConversation = (userId) => {
    // 1. Check if the conversation already exists
    const existingConversation = conversations.find(conv => conv.userId === userId);

    if (existingConversation) {
        // If it exists, simply set it as the active conversation
        setActiveConversationId(userId);
    } else {
        // If not, create a new conversation placeholder
        const newConversation = {
            userId: userId,
            username: searchResults.find(user => user.id === userId)?.username || 'Usuario Desconocido',
            messages: []
        };
        // Add it to the conversations state
        setConversations(prevConversations => [...prevConversations, newConversation]);
        // Set the new conversation as active
        setActiveConversationId(userId);
    }
    setRecipient(userId);
};

  return (
  <div className={styles.chatLayout}>
    {/* Left Panel: Conversation List */}
    <div className={styles.conversationList}>
      <input
        type="text"
        placeholder="Buscar usuario..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* List search results or existing conversations */}
      <ul>
        {searchResults.map((user) => (
          <li key={user.id} onClick={() => handleSelectConversation(user.id)}>
            {user.username}
          </li>
        ))}
        {conversations.map((conv) => (
          <li
            key={conv.userId}
            onClick={() => handleSelectConversation(conv.userId)}
            className={conv.userId === activeConversationId ? styles.active : ''}
          >
            {conv.username}
          </li>
        ))}
      </ul>
    </div>

    {/* Right Panel: Active Chat Window */}
      <div className={styles.chatWindow}>
        {activeConversationId ? (
          <ActiveChat
            conversation={
              conversations.find((conv) => conv.userId === activeConversationId)
            }
            userInfo={userInfo}
            sendMessage={sendMessage}
            message={message}
            setMessage={setMessage} 
          />
        ) : (
          <div className={styles.emptyChat}>
            Selecciona una conversación para chatear.
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;