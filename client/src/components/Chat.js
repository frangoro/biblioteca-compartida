/* Chat Component for React using Socket.IO */

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Conecta al servidor de Socket.IO
const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Escucha el evento 'chat message' del servidor
    socket.on('chat message', (msg) => {
      // Añade el mensaje recibido al estado de mensajes
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Función de limpieza para desconectarse al desmontar el componente
    return () => {
      socket.off('chat message');
    };
  }, []); // Se ejecuta solo una vez al montar el componente

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      // Envía el mensaje al servidor
      socket.emit('chat message', message);
      setMessage(''); // Limpia el input del mensaje
    }
  };

  return (
    <div>
      <ul id="messages">
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
  );
}

export default Chat;