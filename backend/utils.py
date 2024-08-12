#Routes for uploading, querying and deleting pdf file
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pathlib import Path
import os
from .index import create_index, query_index, delete_index
from .models import PDFFile
from .utils import save_file

app = FastAPI()

PDF_DIR = Path("data/pdfs")
INDEX_DIR = Path("data/indexes")

#Ensure directories exist

PDF_DIR.mkdir(parents=True, exist_ok=True)
INDEX_DIR.mkdir(parents=True, exist_ok=True)

class QueryRequest(BaseModel):
    question : str

@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    filepath = save_file(file, PDF_DIR)
    create_index(filepath, INDEX_DIR)
    return {"filename": file.filename}

@app.post("/query/{filename}")
async def query_pdf(filename: str, request: QueryRequest):
    index_path = INDEX_DIR / f"{filename}.json"
    if not index_path.exists():
        raise HTTPException(status_code=404, detail="index not found")
    answer = query_index(index_path, request.question)

    return JSONResponse({"answer": answer})

@app.delete("delete/{filename}")
async def delete_pdf(filename: str):
    pdf_path = PDF_DIR / filename
    index_path = INDEX_DIR / f"{filename}.json"
    if not pdf_path.exists() or not index_path.exists():
        raise HTTPException(status_code=404, detail="File or index not found")
    
    os.remove(pdf_path)
    os.remove(index_path)

    return {"status": "deleted"}