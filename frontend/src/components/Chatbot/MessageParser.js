class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    console.log("User typed:", message);
    this.actionProvider.handleDefault();
  }
}

export default MessageParser;
