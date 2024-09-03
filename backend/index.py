from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core import StorageContext, load_index_from_storage
import os 
from llama_index.core import Settings
from llama_index.llms.openai import OpenAI
from llama_index.core.llms import ChatMessage, MessageRole
#These lines were added
from llama_parse import LlamaParse
from dotenv import load_dotenv
import nest_asyncio
nest_asyncio.apply()



TEXT_QA_SYSTEM_PROMPT = ChatMessage(
    content=(
        "You are an expert Q&A system that is trusted around the world.\n"
        "Some rules to follow:\n"
        "1. Always answer the query using the provided context information, "
        "and not prior knowledge.\n"
        "2. Avoid statements like 'Based on the context, ...' or "
        "'The context information ...' or anything along "
        "those lines."
    ),
    role=MessageRole.SYSTEM,
)
#these lines were added
load_dotenv()                          
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
LLAMA_CLOUD_API_KEY = os.getenv("LLAMA_CLOUD_API_KEY")

#Check if api key is available
if not OPENAI_API_KEY or not LLAMA_CLOUD_API_KEY:
    raise ValueError("You need an API key for this to work")

#Global setting
Settings.llm = OpenAI(temperature=0, model="gpt-3.5-turbo", max_tokens= 512)

def create_index(pdf_path: str, index_dir: str):
    #Get the directory of the PDF file
    pdf_directory = os.path.dirname(pdf_path)

    #Parsing the document to markdown/These lines were added
    parser = LlamaParse(result_type="markdown")
    file_extractor ={".pdf":parser}
    
    #Load the pDF documents from the directory
    document = SimpleDirectoryReader(input_dir=pdf_directory, recursive=True, required_exts=[".pdf"], num_files_limit=10,
                                     file_extractor=file_extractor).load_data()
    #Creating a storage context for the index
    storage_context = StorageContext.from_defaults()
    #Create vector store index from the documents
    #Split the document into nodes/chunkz per index
    index = VectorStoreIndex.from_documents(
        document,
        storage_context=storage_context,
        transformations=[SentenceSplitter(chunk_size=1024, chunk_overlap=20)]
    )
    #Storage/persist to disk
    index.storage_context.persist(index_dir)

def query_index(index_dir: str, question: str) -> str:
    #Load the index from the disk
    storage_context = StorageContext.from_defaults(persist_dir=index_dir)
    index = load_index_from_storage(storage_context)
    #Create query engine from the index
    query_engine = index.as_query_engine(TEXT_QA_SYSTEM_PROMPT=TEXT_QA_SYSTEM_PROMPT)
    #query the index and return the result
    return query_engine.query(question)

def delete_index(index_path: str):
    #Delete the index file if it exists
    if os.path.exists(index_path):
        os.remove(index_path)