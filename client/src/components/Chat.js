/* Chat Component for React using Socket.IO */

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import * as userService from '../services/userService';
import ActiveChat from './ActiveChat';
import styles from './Chat.module.css';

// Conecta al servidor de Socket.IO
const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');

const getConversationsFromDB = async (userId) => {
    // TODO: Implementa aquí la llamada a tu nueva ruta de Express: /api/conversations/:userId
    // Ejemplo:
    const response = await fetch(`/api/conversations/${userId}`);
    if (!response.ok) throw new Error('Error al cargar las conversaciones');
    return response.json();
};

function Chat({ recipientId }) {
  const { userInfo } = useAuth(); // Obtén el ID del usuario logueado
  const [message, setMessage] = useState('');
  //TODO: ELiminar esto: const [messages, setMessages] = useState([]);
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
  
  // Efecto para Unirse al Chat y Cargar Conversaciones
  useEffect(() => {
    if (!userInfo || !userInfo.id) return;
    
    // Unirse al chat
    socket.emit('join', userInfo); 

    // Cargar conversaciones desde MongoDB
    const loadConversations = async () => {
      try {
        const dbConversations = await getConversationsFromDB(userInfo.id);
        
        // Transformar los datos de la DB al formato de estado local:
        const formattedConversations = dbConversations.map(conv => {
            // Encuentra al otro participante
            const otherParticipant = conv.participants.find(p => p.id !== userInfo.id);
            
            return {
                conversationId: conv._id, // Usamos el ID de la conversación de Mongo
                userId: otherParticipant.id, // ID del otro usuario
                username: otherParticipant.username,
                messages: conv.messages // Historial completo de mensajes
            };
        });
        
        setConversations(formattedConversations);

        // Opcional: Establecer la conversación más reciente como activa
        if (formattedConversations.length > 0) {
            setActiveConversationId(formattedConversations[0].userId);
            // También debes establecer el destinatario (recipient)
            setRecipient(formattedConversations[0].userId);
        }

      } catch (error) {
        console.error("Error al cargar conversaciones iniciales:", error);
      }
    };

    loadConversations();
  }, [userInfo]);

  // Manejo de Mensajes Entrantes (Simplificado y Corrección de Lógica)
  useEffect(() => {
    if (!userInfo || !userInfo.id) return;
    
    // Asegúrate de que el servidor envía el objeto `msg` con:
    // { fromUserId, message, conversationId, username }
    socket.on('private message', (msg) => {
      // El mensaje siempre tiene que ir a la conversación correcta, sin importar quién la tenga abierta
      setConversations((prevConversations) => {
        const senderId = msg.fromUserId;
        // Busca si ya tienes una conversación con el remitente
        const conversationExists = prevConversations.find(
          (conv) => conv.userId === senderId
        );
        
        // Si existe, actualiza el array de mensajes
        if (conversationExists) {
          return prevConversations.map((conv) =>
            conv.userId === senderId
              ? { ...conv, messages: [...conv.messages, msg] }
              : conv
          );
        } else {
          // Si es la primera vez que te escribe, crea una nueva conversación
          return [
            { userId: senderId, messages: [msg], username: msg.fromUsername }, // Asegúrate que el servidor envíe `fromUsername`
            ...prevConversations, // Pon la nueva conversación al inicio
          ];
        }
      });
    });

    return () => {
      socket.off('private message');
    };
  }, [userInfo]);

  // Envío de Mensajes (Asegurando la consistencia con la DB)
  const sendMessage = (e) => {
    e.preventDefault();
    // Asegúrate de usar el ID del usuario activo para el envío
    const currentRecipientId = activeConversationId; 
    
    if (message && currentRecipientId) {
      // 1. Emitir al servidor
      socket.emit('private message', {
        fromUserId: userInfo.id,
        toUserId: currentRecipientId,
        message: message,
      });

      // 2. Actualizar el estado local inmediatamente (sin esperar la respuesta del socket)
      setConversations((prevConversations) => {
        const newMessage = { fromUserId: userInfo.id, content: message, timestamp: new Date() }; // Usa content o message según lo que esperes
        
        return prevConversations.map((conv) =>
          conv.userId === currentRecipientId
            ? { ...conv, messages: [...conv.messages, newMessage] }
            : conv
        );
      });
      
      setMessage('');
    }
  };

  // Función de Selección de Conversación (Simplificada)
  const handleSelectConversation = (userId) => {
    const existingConversation = conversations.find(conv => conv.userId === userId);

    if (existingConversation) {
        // Establecer el ID de la conversación activa y el recipient
        setActiveConversationId(userId);
        setRecipient(userId);
    } else {
        // Lógica para crear un placeholder para una nueva conversación (si el usuario la busca)
        const newRecipient = searchResults.find(user => user.id === userId);
        const newConversation = {
            userId: userId,
            username: newRecipient?.username || 'Usuario Desconocido',
            messages: []
        };
        
        setConversations(prevConversations => [newConversation, ...prevConversations]);
        setActiveConversationId(userId);
        setRecipient(userId);
        
        // Limpiar resultados de búsqueda después de seleccionar
        setSearchTerm('');
        setSearchResults([]);
    }
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
    <div className={styles.rightPanelContainer}>
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