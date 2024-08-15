import React, { useState } from "react"; 

function Chat({ messages, onSendMessage, onDeleteFile }) { // Define the Chat component, receiving messages, onSendMessage, and onDeleteFile as props
  const [currentMessage, setCurrentMessage] = useState(""); // State to hold the current message typed by the user

  // Handle the send message button click
  const handleSendMessageClick = () => {
    if (currentMessage.trim()) { // Check if the current message is not empty
      onSendMessage(currentMessage); // Call the onSendMessage function passed as a prop with the current message
      setCurrentMessage(""); // Clear the current message from the state
    }
  };

  return (
    <div>
      <div className="chat-box"> {/* Container for the chat messages */}
        {messages.map((msg, index) => ( // Map over the messages array to render each message
          <div key={index} className={`message ${msg.sender}`}> {/* Apply a different style based on the sender */}
            <p>{msg.text}</p> {/* Display the message text */}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={currentMessage} // Bind the input value to currentMessage state
        onChange={(e) => setCurrentMessage(e.target.value)} // Update currentMessage state on input change
        placeholder="Type your message..." // Placeholder text in the input field
      />
      <button onClick={handleSendMessageClick}>Send</button> 
      <button onClick={onDeleteFile}>Delete File</button> {/* Button to trigger file deletion */}
    </div>
  );
}

export default Chat; 