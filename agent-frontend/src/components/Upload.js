
// import React, { useState } from 'react';

// function Upload({ onUpload }) {
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   const handleUploadClick = () => {
//     if (selectedFile) {
//       onUpload(selectedFile);
//       setSelectedFile(null);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} id="InputFile"/>
//       <button onClick={handleUploadClick}>Upload PDF</button>
//     </div>
//   );
// }

// export default Upload;

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
      <input
        type="file"
        onChange={handleFileChange}
        id="InputFile"
        className="file-input"
      />
      <label htmlFor="InputFile" className="custom-file-label">
        Choose File
      </label>
      {selectedFile && <span className="file-name">{selectedFile.name}</span>}
      <button onClick={handleUploadClick} className="upload-button">
        Upload PDF
      </button>
    </div>
  );
}

export default Upload;



