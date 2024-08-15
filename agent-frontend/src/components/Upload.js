// import React, { useState } from "react"; // Import React and useState hook for managing state

// function Upload({ onUpload }) { // Define the Upload component, receiving the onUpload function as a prop
//   const [selectedFile, setSelectedFile] = useState(null); // State to hold the selected file

//   // Handle file selection from the input
//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]); // Update the state with the selected file
//   };

//   // Handle the file upload button click
//   const handleUploadClick = () => {
//     if (selectedFile) {
//       onUpload(selectedFile); // Call the onUpload function passed as a prop with the selected file
//       setSelectedFile(null); // Clear the selected file from the state
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} /> {/* File input field */}
//       <button onClick={handleUploadClick}>Upload PDF</button> {/* Button to trigger the upload */}
//     </div>
//   );
// }

// export default Upload; // Export the Upload component as the default export



import React, { useState } from 'react';

function Upload({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUploadClick}>Upload PDF</button>
    </div>
  );
}

export default Upload;