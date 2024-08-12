from pydantic import BaseModel

class PDFFile(BaseModel):
    filename: str
    path : str