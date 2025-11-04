/* Contexto de Chat que almacene el ID del destinatario, dado que la información
 del chat debe viajar entre páginas (rutas distintas)*/

import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  // Almacena el ID del usuario que se va a chatear. Si es null, no hay chat activo.
  const [recipientUserId, setRecipientUserId] = useState(null);
  const [recipientUsername, setRecipientUsername] = useState(null);
  
  // Función que se usará en el botón para iniciar el chat.
  const startNewChat = (userId, username) => {
    setRecipientUserId(userId);
    setRecipientUsername(username);
  };
  
  // Función para limpiar o cerrar el chat
  const clearChat = () => {
    setRecipientUserId(null);
    setRecipientUsername(null);
  };

  return (
    <ChatContext.Provider value={{ 
      recipientUserId, 
      recipientUsername,
      startNewChat, 
      clearChat 
    }}>
      {children}
    </ChatContext.Provider>
  );
};