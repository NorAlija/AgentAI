# norGPT
This project is a FastAPI-based web application that allows users to upload, query, and delete PDF files. Using the LlamaIndex framework, it creates an index of uploaded PDFs, allowing users to perform natural language queries on document content. It uses openAI gpt3.5-turbo as a natural language model. The system is designed for easy integration with a frontend React and includes CORS middleware for secure cross-origin communication.

### API needed for this project:
  - https://platform.openai.com/api-keys
  - https://docs.cloud.llamaindex.ai/llamacloud/getting_started/api_key
  - These API keys are stored in a .env file
## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About the Project

This project was developed to simplify the process of managing, searching, and interacting with PDF files using natural language queries. The core problem it addresses is the challenge of extracting meaningful insights from PDF documents, especially when dealing with large volumes of data or complex technical content. Instead of manually scanning through documents, users can now ask questions and retrieve specific answers quickly and easily.

The project leverages FastAPI for building a high-performance API and LlamaIndex (previously known as GPT Index) for creating a search index of uploaded PDFs, allowing users to perform natural language queries. The goal is to provide a streamlined experience where users can upload PDF documents, ask questions about their content, and manage files—all through a simple API interface.

## Features

- Upload any PDF file
- Using LlamaParse API, the system can efficiently parse documents with complex structures, including tables, images, and dense formatting. This allows for accurate querying regardless of the document’s layout or content type.
- Prompt norGPT about the PDF file

## Technologies

List the key technologies used in the project:

- **Language**: Python 3.10.12
- **Language**: React
- **Framework**: FastAPI
- **Framework**: LlamaIndex 0.11.9

## Getting Started

### Prerequisites

You will need the following installed to run the project:

- Python 3.10.12
- LlamaIndex 0.11.9
- React

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/NorAlija/AgentAI.git
   cd AgentAI
   ```

2. Set up a virtual environment and install dependencies:

   ```bash
   python -m venv env
   source env/bin/activate
   pip install -r requirements.txt
   ```

3. Configure your API keys in the `.env` file:

   ```
   OPENAI_API_KEY=sk-*****************************************************
   LLAMA_CLOUD_API_KEY=llx-*****************************************************
   ```


### Running the Project

To start the FastAPI server, run the following command:

```bash
uvicorn app.main:app --reload
```

The API will be accessible at `http://localhost:8000`.



## API Documentation

1. **Base URL**
   - `http://localhost:8000`

2. **Endpoints**
   
   #### 1. Upload PDF
   - **URL**: `/upload/`
   - **Method**: `POST`
   - **Description**: Uploads a PDF file and creates an index for it.
   - **Request Body**: 
     - `file` (required): A PDF file to be uploaded.
   - **Response**:
     - `200 OK`: 
       ```json
       {
         "filename": "your-file-name.pdf"
       }
       ```
   - **Example cURL**:
     ```bash
     curl -X POST "http://localhost:8000/upload/" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@your-pdf-file.pdf"
     ```

   #### 2. List Available PDFs
   - **URL**: `/files`
   - **Method**: `GET`
   - **Description**: Returns a list of all uploaded PDF files.
   - **Response**:
     - `200 OK`:
       ```json
       {
         "files": [
           "file1.pdf",
           "file2.pdf",
           "file3.pdf"
         ]
       }
       ```
   - **Example cURL**:
     ```bash
     curl -X GET "http://localhost:8000/files"
     ```

   #### 3. Query a PDF
   - **URL**: `/query/{filename}`
   - **Method**: `POST`
   - **Description**: Queries a specific PDF file for an answer based on the user’s question.
   - **Path Parameter**:
     - `filename` (required): The name of the PDF file to query.
   - **Request Body**:
     ```json
     {
       "question": "What is the conclusion of the document?"
     }
     ```
   - **Response**:
     - `200 OK`:
       ```json
       {
         "answer": "The conclusion of the document is..."
       }
       ```
   - **Error Response**:
     - `404 Not Found`: If the PDF or its index cannot be found.
       ```json
       {
         "detail": "Index not found"
       }
       ```
   - **Example cURL**:
     ```bash
     curl -X POST "http://localhost:8000/query/sample.pdf" \
     -H "Content-Type: application/json" \
     -d '{"question": "What is the conclusion?"}'
     ```

   #### 4. Delete a PDF
   - **URL**: `/delete/{filename}`
   - **Method**: `DELETE`
   - **Description**: Deletes both the PDF file and its index.
   - **Path Parameter**:
     - `filename` (required): The name of the PDF file to delete.
   - **Response**:
     - `200 OK`:
       ```json
       {
         "status": "deleted",
         "message": "PDF file deleted successfully"
       }
       ```
   - **Error Response**:
     - `404 Not Found`: If the PDF does not exist.
       ```json
       {
         "detail": "PDF file not found"
       }
       ```
     - `500 Internal Server Error`: If the file deletion fails.
       ```json
       {
         "detail": "Failed to delete file: error message"
       }
       ```
   - **Example cURL**:
     ```bash
     curl -X DELETE "http://localhost:8000/delete/sample.pdf"
     ```
