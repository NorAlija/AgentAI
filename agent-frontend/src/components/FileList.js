import React from 'react';


// function FileList({ onDelete }) {
//   const [files, setFiles] = useState([]);

//   useEffect(() => {

//   const fetchFiles = async () => {
//     try {
//       const response = await axios.get('/files');
//       setFiles(response.data.files);
//     } catch (error) {
//       console.error('Error fetching files:', error);
//     }
//   };

//   fetchFiles();
// }, []);

function FileList({ files = [], onDelete}){

  return (
    <div>
      <p>Uploaded files</p>
      <ul>
        {files.map((file) => (
          <li key={file}>
            {file}
            <button onClick={() => onDelete(file)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileList;
