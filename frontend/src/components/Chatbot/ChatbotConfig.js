import { createChatBotMessage } from 'react-chatbot-kit';
import ActionProvider from './ActionProvider';
import MessageParser from './MessageParser';

const config = {
  initialMessages: [
    createChatBotMessage("Welcome to CowboyBot! How can I help you?")
  ],
  botName: "CowboyBot",
  customComponents: {},
  state: {},
  actionProvider: ActionProvider,
  messageParser: MessageParser,
};

export default config;
