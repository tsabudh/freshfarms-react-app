type ChatMessage = {
  sender: string;
  recipient: string;
  message: string;
  messageId: string;
  timestamp?: string; // optional fields
  // add more if needed
};