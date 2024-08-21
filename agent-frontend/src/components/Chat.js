import React, { useState, useEffect, useRef } from "react";

function Chat({ messages, onSendMessage }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef(null);  // Create a ref to scroll to the end of the chat

  const handleSendMessageClick = () => {
    if (currentMessage.trim()) {
      onSendMessage(currentMessage);
      setCurrentMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessageClick();
    }
  };

  // Use useEffect to scroll to the bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-box message-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {/* This is a dummy div used for scrolling to the last message */}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyDown}  // Add this line to handle Enter key
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessageClick}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
