/* Ventana derecha del Chat*/

import styles from './Chat.module.css';

const ActiveChat = ({ conversation, userInfo, sendMessage, message, setMessage }) => {
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
              msg.fromUserId === userInfo.id
                ? styles.myMessage
                : styles.otherMessage
            }
          >
            <p>{msg.message}</p>
          </li>
        ))}
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