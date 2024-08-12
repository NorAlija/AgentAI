from dotenv import load_dotenv
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core import Settings
from llama_index.core import StorageContext, load_index_from_storage
from llama_index.core import query_engine
import os 

#load the api key from .env file
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("Where is your API key you little s***? Did you forget it or are you just broke?")

def create_index(pdf_path: str, index_dir: str):
    document = SimpleDirectoryReader([pdf_path]).load_data()

    #Globally
    #Settings.text_splitter = SentenceSplitter(chunk_size=1024)
    #Per index
    index = VectorStoreIndex.from_documents(
        document,
        transformations=[SentenceSplitter(chunk_size=1024, chunk_overlap=20)]
    )
    index.storage_context(persist_dir="<persist_dir")

def query_index(index_path: str, question: str) -> str:
    storage_context = StorageContext.from_defaults(persist_dir="<persist_dir>")
    index = load_index_from_storage(storage_context)
    query_engine = index.as_query_engine()
    return query_engine.query(question)