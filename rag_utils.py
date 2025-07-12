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
    vector = embedding_fn.remote(question)

    response = index.query(
        vector=vector,
        top_k=top_k,
        include_metadata=True,
        filter={"subject": subject}
    )

    contexts = [match["metadata"]["text"] for match in response["matches"]]
    context_block = "\n\n---\n\n".join(contexts)

    prompt = f"""
You are Milo, an intelligent, friendly, and helpful Computer Science tutor.

Your job is to help students understand core CS subjects like Computer Networks, Operating Systems, and Database Management Systems.

Based on the context below, answer the user’s question clearly and thoroughly.

Guidelines:
- Prioritize *clarity* and *depth*, not just brevity.
- Use analogies, examples, or comparisons if they make the concept easier to grasp.
- You may rephrase or reorganize the information in the context.
- If the context doesn't fully answer the question, you may still try to answer it or politely mention that.
- Do NOT say "Based on the context..." or reference the context directly.

Context:
{context_block}

Question: {question}

Answer:
"""
    response = gemini_model.generate_content(prompt)
    return response.text

def generate_followups(subject: str, question: str) -> str:
    prompt = f"""
You are Milo, an expert CS tutor.

The student just asked:
"{question}"

Suggest 2 thoughtful follow-up questions that help deepen their understanding. Format clearly.

Only return:
1. Question A
2. Question B
"""
    response = gemini_model.generate_content(prompt)
    return response.text.strip()