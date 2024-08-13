from fastapi import UploadFile
from pathlib import Path

def save_file(uploaded_file: UploadFile, upload_dir: Path) -> str:
    filepath = upload_dir /uploaded_file.filename

    with filepath.open("wb") as buffer:
        buffer.write(uploaded_file.file.read())
    
    return str(filepath)