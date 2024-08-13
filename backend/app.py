#Routes for uploading, querying and deleting pdf file
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pathlib import Path
import os
import index as ind #Importing index.py functions
#import models as mod #Importing models.py functiosn
from utils import save_file
import shutil

app = FastAPI()

PDF_DIR = Path("data/pdfs")
INDEX_DIR = Path("data/storage")

#Ensure directories exist

PDF_DIR.mkdir(parents=True, exist_ok=True)
INDEX_DIR.mkdir(parents=True, exist_ok=True)

class QueryRequest(BaseModel):
    question : str

# @app.post("/upload/")
# async def upload_pdf(file: UploadFile = File(...)):
#     filepath = save_file(file, PDF_DIR)
#     ind.create_index(filepath, INDEX_DIR)
#     return {"filename": file.filename}

# @app.post("/query/{filename}")
# async def query_pdf(filename: str, request: QueryRequest):
#     index_path = INDEX_DIR / f"{filename}.json"
#     if not index_path.exists():
#         raise HTTPException(status_code=404, detail="index not found")
#     answer = ind.query_index(index_path, request.question)

#     return JSONResponse({"answer": answer})

# @app.delete("delete/{filename}")
# async def delete_pdf(filename: str):
#     pdf_path = PDF_DIR / filename
#     index_path = INDEX_DIR / f"{filename}.json"
#     if not pdf_path.exists() or not index_path.exists():
#         raise HTTPException(status_code=404, detail="File or index not found")
    
#     os.remove(pdf_path)
#     ind.delete_index(index_path)

#     return {"status": "deleted"}

@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    filepath = save_file(file, PDF_DIR)
    ind.create_index(filepath, str(INDEX_DIR))
    return {"filename": file.filename}

@app.post("/query/{filename}")
async def query_pdf(filename: str, request: QueryRequest):
    index_path = INDEX_DIR
    if not index_path.exists():
        raise HTTPException(status_code=404, detail="Index not found")
    answer = ind.query_index(str(index_path), request.question)
    return JSONResponse({"answer": str(answer)})

@app.delete("/delete/{filename}")
async def delete_pdf(filename: str):
    pdf_path = PDF_DIR / filename
    index_path = INDEX_DIR
    if not pdf_path.exists() or not index_path.exists():
        raise HTTPException(status_code=404, detail="File or index not found")
    
    os.remove(pdf_path)
    shutil.rmtree(index_path)  # Remove the entire index directory

    return {"status": "deleted"}