from pinecone import Pinecone
import google.generativeai as genai
from dotenv import load_dotenv
import os
import modal

load_dotenv()

# Environment variables
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("INDEX_NAME")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Init
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(INDEX_NAME)
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel("gemini-1.5-flash")

# Modal embedding function
embedding_fn = modal.Function.lookup(
    "sentence-transformer-embedder",  # <- change if you used another app name
    "embed_text"
)

def answer_question(subject: str, question: str, top_k: int = 5) -> str:
    # Embed via Modal
    vector = embedding_fn.cremote(question)

    response = index.query(
        vector=vector,
        top_k=top_k,
        include_metadata=True,
        filter={"subject": subject}
    )

    contexts = [match["metadata"]["text"] for match in response["matches"]]
    context_block = "\n\n---\n\n".join(contexts)

    prompt = f"""
You are a helpful computer science tutor. Use the context below to answer the user's question clearly and concisely.

Context:
{context_block}

Question: {question}
"""

    response = gemini_model.generate_content(prompt)
    return response.text
