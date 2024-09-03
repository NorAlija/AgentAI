from fastapi import UploadFile
from pathlib import Path

def save_file(uploaded_file: UploadFile, upload_dir: Path) -> str:
    # Construct the full file path by joining the upload directory and the filename
    filepath = upload_dir /uploaded_file.filename

    # Open the file in write-binary mode
    with filepath.open("wb") as buffer:
        # Read the contents of the uploaded file and write them to the new file
        buffer.write(uploaded_file.file.read())
    
    return str(filepath)