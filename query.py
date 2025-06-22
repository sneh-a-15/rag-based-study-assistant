from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
import google.generativeai as genai

# === CONFIG ===
PINECONE_API_KEY = "pcsk_5ATdWc_RKn8FWqmTvVz6xi7igLP7fuDDqiGKxCqYPHRWusc3daX8RUwUUuJEKGZNnj2Tiq"
GEMINI_API_KEY = "AIzaSyALCAadpN9tVPVE7nkS6SbBffy1KJ9chhM"  # Get from makersuite
INDEX_NAME = "cs-study-assistant"
EMBEDDING_MODEL = 'all-MiniLM-L6-v2'
SUBJECT = "CN"

# === INIT ===
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(INDEX_NAME)

model = SentenceTransformer(EMBEDDING_MODEL)

genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel("gemini-1.5-flash")

# === Ask Question ===
question = input("🔍 Enter your question: ")

# === 1. Embed the question ===
query_vector = model.encode(question).tolist()

# === 2. Query Pinecone ===
top_k = 5
response = index.query(
    vector=query_vector,
    top_k=top_k,
    include_metadata=True
)

# === 3. Extract relevant chunks ===
contexts = [match['metadata']['text'] for match in response['matches']]
combined_context = "\n\n---\n\n".join(contexts)

# === 4. Construct prompt ===
prompt = f"""
You are a helpful computer science tutor. Use the context below to answer the user's question clearly and concisely.

Context:
{combined_context}

Question: {question}
"""

# === 5. Generate answer with Gemini ===
response = gemini_model.generate_content(prompt)

# === 6. Show result ===
print("\n💡 Answer:\n")
print(response.text)



