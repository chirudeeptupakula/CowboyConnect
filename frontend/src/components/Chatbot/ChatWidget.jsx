import { useState } from 'react';
import { Chatbot } from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import config from './ChatbotConfig';
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';
import pistolPete from 'C:/Users/chiru/IdeaProjects/CowboyConnect/frontend/public/pistol-pete.png'; // ✅ Make sure this image exists in the same folder

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '90px', right: '20px', zIndex: 1000 }}>
      {isOpen ? (
        <div style={{
          position: "fixed",
          bottom: "90px",
          right: "20px",
          zIndex: 1000,
          height: "500px",     // ✅ Add height
          width: "350px",      // ✅ Optional: fixed width
          overflow: "hidden",  // ✅ Allow scroll if needed
          backgroundColor: "#fff",
          borderRadius: "15px"
        }}>

          {/* ❌ Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              top: '5px',
              right: '8px',
              zIndex: 1001,
              background: 'transparent',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer'
            }}
            aria-label="Close Chat"
          >
            ❌
          </button>

          {/* 🤖 Chatbot */}
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </div>
      ) : (
        <img
          src={pistolPete}
          alt="Chat with Pistol Pete"
          title="Chat with Pistol Pete"
          style={{
            width: '60px',
            height: '60px',
            cursor: 'pointer',
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)'
          }}
          onClick={() => setIsOpen(true)}
        />
      )}
    </div>
  );
}

export default ChatWidget;
