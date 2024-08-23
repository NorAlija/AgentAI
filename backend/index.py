from dotenv import load_dotenv
from llama_index.core import readers
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core import StorageContext, load_index_from_storage


import os 

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

#Check if api key is available
if not OPENAI_API_KEY:
    raise ValueError("You need an API key for this to work")

def create_index(pdf_path: str, index_dir: str):

    pdf_directory = os.path.dirname(pdf_path)

    document = SimpleDirectoryReader(input_dir=pdf_directory, recursive=True).load_data()

    storage_context = StorageContext.from_defaults()

    #Split the document into nodes/chunkz per index
    index = VectorStoreIndex.from_documents(
        document,
        storage_context=storage_context,
        transformations=[SentenceSplitter(chunk_size=1024, chunk_overlap=20)]
    )
    #Storage
    index.storage_context.persist(index_dir)

def query_index(index_dir: str, question: str) -> str:
    storage_context = StorageContext.from_defaults(persist_dir=index_dir)
    index = load_index_from_storage(storage_context)
    query_engine = index.as_query_engine()
    return query_engine.query(question)

def delete_index(index_path: str):
    if os.path.exists(index_path):
        os.remove(index_path)