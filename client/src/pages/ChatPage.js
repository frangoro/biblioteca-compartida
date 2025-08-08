import Header from '../components/Header';
import Footer from '../components/Footer';
import Chat from '../components/Chat'; 



function ChatPage() {
  
  return (
    <div className="page-wrapper">
      <Header />
      <main className="page-content">
        <div className="container">
          <h2>Contactar con otros usuarios</h2>
          <Chat />
        </div>
      </main>
      <Footer />
    </div>
  );

}

export default ChatPage;