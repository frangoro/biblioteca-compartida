/* Ventana derecha del Chat*/

import React, { useEffect, useRef } from 'react';
import styles from './Chat.module.css';

const ActiveChat = ({ conversation, userInfo, sendMessage, message, setMessage }) => {
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages.length]); // Scroll cada vez que cambia el número de mensajes

  if (!conversation) {
    return <div className={styles.emptyChat}>Selecciona una conversación para chatear.</div>;
  }

  // Find the username of the conversation's other participant
  const otherParticipant = conversation.username;

  return (
    <div className={styles.chatWindow}>
      <h3>Chateando con: {otherParticipant}</h3>
      <ul className={styles.messageList}>
        {conversation.messages.map((msg, index) => (
          <li
            key={index}
            className={
              msg.sender === userInfo.id || msg.fromUserId === userInfo.id
                ? styles.myMessage
                : styles.otherMessage
            }
          >
            <p>{msg.content || msg.message}</p> {/* Usa content para DB y message para Socket */}
          </li>
        ))}
        <div ref={messagesEndRef} /> {/* Elemento vacío al final */}
      </ul>
      <form onSubmit={sendMessage} className={styles.messageForm}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default ActiveChat;