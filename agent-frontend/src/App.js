// import React, { useState } from "react"; 
// import Upload from "./components/Upload"; 
// import Chat from "./components/Chat"; 
// import axios from "./services/API"; 
// import "./App.css" 

// function App() {
//   // State to hold the chat messages
//   const [messages, setMessages] = useState([]);
//   // Track file if uploaded
//   const [fileUploaded, setFileUploaded] = useState(false);
//   // for dynamic filename
//   const [uploadedFileName, setUploadedFileName] = useState(null)

 
//   const handleUpload = async (file) => {
//     const formData = new FormData(); // Create a new FormData object to hold the file data
//     formData.append("file", file); // Append the file to the FormData object

//     try {
//       await axios.post("/upload/", formData);
//       setUploadedFileName(file.name);
//       setFileUploaded(true);
//       setMessages([...messages, { sender: "user", text: `File uploaded: ${file.name}` }]);
//     } catch (error) {
//       console.error("Upload error:", error); // Log the error
//       setMessages([...messages, { sender: "bot", text: "Failed to upload the file." }]);
//     }
    
//   };

  
//   const handleSendMessage = async (question) => {
//     // If no file is uploaded, notify the user
//     if (!fileUploaded) {
//       setMessages([...messages, { sender: "bot", text: "Please provide a PDF document so I can be helpful." }]);
//       return;
//     }

//     // User question to chat and indicate that bot is typing
//     setMessages([...messages, { sender: "user", text: question }, { sender: "bot", text: "norGPT is typing..." }]);

//     try {
//       // Send a post request to the backend to query the uploaded PDF
//       const response = await axios.post(`/query/${uploadedFileName}`, { question });
//       const botResponse = response.data.answer; // Extract the bot's response from the API response

//       // Replace the "norGPT is typing..." message with the actual response
//       setMessages((prevMessages) =>
//         prevMessages.map((msg, idx) =>
//           idx === prevMessages.length - 1 ? { sender: "bot", text: botResponse } : msg
//         )
//       );
//     } catch (error) {
//       // Add a message to the chat indicating that querying the PDF failed
//       setMessages([...messages, { sender: "bot", text: "Failed to retrieve an answer." }]);
//     }
//   };


//   const handleDeleteFile = async () => {
//     try {
//       // Send a delete request to the backend 
//       await axios.delete(`/delete/${uploadedFileName}`);
//       setFileUploaded(false); // Set the fileUploaded state to false
//       // Add a message to the chat indicating the file was deleted
//       setMessages([...messages, { sender: "bot", text: "File deleted." }]);
//     } catch (error) {
//       // Add a message to the chat indicating that deleting the file failed
//       setMessages([...messages, { sender: "bot", text: "Failed to delete the file." }]);
//     }
//   };

//   return (
//     <div className="App">
//       <h1>norGPT Chat</h1> {/* Main title of the app */}
//       <Upload onUpload={handleUpload} /> {/* Render the Upload component and pass the handleUpload function as a prop */}
//       <Chat messages={messages} onSendMessage={handleSendMessage} onDeleteFile={handleDeleteFile} /> {/* Render the Chat component and pass the necessary props */}
//     </div>
//   );
// }

// export default App; // Export the App component as the default export

import React, { useState, useEffect } from 'react';
import Upload from './components/Upload';
import FileList from './components/FileList';
import Chat from './components/Chat';
import axios from './services/API';
import "./App.css"

function App() {
  const [messages, setMessages] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null)
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try{
        const response = await axios.get("/files");
        setFiles(response.data.files);
      }catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();

  },[]
);

  // Function to handle file uploads
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('/upload/', formData);
      setFileUploaded(true);
      setUploadedFileName(file.name)
      setMessages([...messages, { sender: 'user', text: `File uploaded: ${file.name}` }]);

      setFiles([...files, file.name])
    } catch (error) {
      setMessages([...messages, { sender: 'bot', text: 'Failed to upload the file.' }]);
    }
  };

  // Function to handle file deletion
  const handleDeleteFile = async (filename) => {
    try {
      await axios.delete(`/delete/${filename}`);
      //setFileUploaded(false);
      //setUploadedFileName(null) // Clear the filename after deletion

      setFiles(prevFiles => prevFiles.filter(file => file !== filename))
      setMessages([...messages, { sender: 'bot', text: 'File deleted.' }]);
    } catch (error) {
      setMessages([...messages, { sender: 'bot', text: 'Failed to delete the file.' }]);
    }
  };

  const handleSendMessage = async (question) => {
    if (!fileUploaded || !uploadedFileName) {
      setMessages([...messages, {sender: "bot", text: "Please upload file first"}]);
      return;
    }

    setMessages([...messages, {sender: "user", text: question}, {sender: "bot", text: "norGPT..."}]);

    try {
      // Send a post request to the backend to query the uploaded PDF
      const response = await axios.post(`/query/${uploadedFileName}`, { question });
      const botResponse = response.data.answer; // Extract the bot's response from the API response

      // Replace the "norGPT is typing..." message with the actual response
      setMessages((prevMessages) =>
        prevMessages.map((msg, idx) =>
          idx === prevMessages.length - 1 ? { sender: "bot", text: botResponse } : msg
        )
      );

    } catch (error) {
      setMessages([...messages, { sender: "bot", text: "Please upload a file first so we can talk" }]);
    }
  };

  return (
    <div className="App">
      <h1>norGPT Chat</h1>
      <Upload onUpload={handleUpload} /> {/* Upload component */}
      <FileList files={files} onDelete={handleDeleteFile} /> {/* File list component */}
      <Chat messages={messages} onSendMessage={handleSendMessage} /> {/* Chat component */}
    </div>
  );
}

export default App;