#Routes for uploading, querying and deleting pdf file
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pathlib import Path
import os
import index as ind #Importing index.py functions
from utils import save_file
import shutil
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:3000",
    
]

#CORS to communicate with the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow only specified origins
    allow_credentials=True,  # Allow cookies to be sent with cross-origin requests
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, DELETE)
    allow_headers=["*"],  # Allow all headers 
)


PDF_DIR = Path("data/pdfs")
INDEX_DIR = Path("data/storage")

#Ensure directories exist

PDF_DIR.mkdir(parents=True, exist_ok=True)
INDEX_DIR.mkdir(parents=True, exist_ok=True)

class QueryRequest(BaseModel):
    question : str

@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    filepath = save_file(file, PDF_DIR)
    ind.create_index(filepath, str(INDEX_DIR))
    return {"filename": file.filename}

@app.get("/files")
async def list_files():
    try:
        dir_list = os.listdir(PDF_DIR)
        return {"files": dir_list}
    except Exception as e:
        return {"error": str(e)}

@app.post("/query/{filename}")
async def query_pdf(filename: str, request: QueryRequest):
    index_path = INDEX_DIR / f"{filename}.json"
    if not index_path.exists():
        raise HTTPException(status_code=404, detail="Index not found")
    answer = ind.query_index(str(index_path), request.question)
    return JSONResponse({"answer": str(answer)})

@app.delete("/delete/{filename}")
async def delete_pdf(filename: str):
    pdf_path = PDF_DIR / filename
    index_path = INDEX_DIR / f"{filename}.json"
    if not pdf_path.exists(): 
        raise HTTPException(status_code=404, detail="File not found")
    if not index_path.exists():
        raise HTTPException(status_code=404, detail="Index file not found")
    
    try:

        os.remove(pdf_path)
        #Remove the index directory
        #shutil.rmtree(index_path)  
        os.remove(index_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete file: {str(e)}")

    return {"status": "deleted"}