

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

  //Fetches the list of files
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
        console.log(`Attempting to delete file: ${filename}`);
        const response = await axios.delete(`/delete/${filename}`);
        console.log("Delete response:", response.data);
        setFiles(prevFiles => prevFiles.filter(file => file !== filename));
        setMessages([...messages, { sender: 'bot', text: `File ${filename} deleted.` }]);
      } catch (error) {
        console.error("Failed to delete file:", error);
        const errorMessage = error.response?.data?.detail || error.message || 'Unknown error occurred';
        setMessages([...messages, { sender: 'bot', text: `Failed to delete the file: ${errorMessage}` }]);
      }
    };

  // Function to handle sendind messages (querys/prompts)
  const handleSendMessage = async (question) => {
    if (!fileUploaded) //|| !uploadedFileName) 
    {
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
      <p>Start using the chatbot by choosing a PDF document. After that, upload the document to the chatbot. After these steps, you are good to go. TIP: You can download more then one PDF documents by downloading one by one.</p>
      <Upload onUpload={handleUpload} /> {/* Upload component */}
      <FileList files={files} onDelete={handleDeleteFile} /> {/* File list component */}
      <Chat messages={messages} onSendMessage={handleSendMessage} /> {/* Chat component */}
    </div>
  );
}

export default App;