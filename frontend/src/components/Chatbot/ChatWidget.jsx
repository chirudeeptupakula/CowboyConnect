import React, { useState } from 'react';
import { Chatbot } from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';

import config from './ChatbotConfig';
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';

import './ChatWidget.css';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="chatbot-wrapper">
      {/* Toggle Button */}
      {!isOpen && (
        <button className="chatbot-toggle-btn" onClick={() => setIsOpen(true)}>
          <img src="/pistol-pete.png" alt="Chat" />
        </button>
      )}

      {/* Chatbot UI */}
      {isOpen && (
        <div className="chatbot-popup">
          <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>×</button>
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </div>
      )}
    </div>
  );
}

export default ChatWidget;
