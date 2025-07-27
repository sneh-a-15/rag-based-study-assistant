# === rag_utils.py ===
from pinecone import Pinecone
import google.generativeai as genai
from dotenv import load_dotenv
import os
import asyncio
import time
import modal
from typing import List, Dict, Optional
import hashlib
import json

load_dotenv()

# Environment variables
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("INDEX_NAME")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Init
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(INDEX_NAME)
genai.configure(api_key=GEMINI_API_KEY)

# Initialize Modal function
embedding_fn = modal.Function.lookup("sentence-transformer-embedder", "embed_text")

# Cache setup
CACHE_FILE = "embedding_cache.json"
embedding_cache = {}

def load_cache():
    """Load embedding cache from file"""
    global embedding_cache
    try:
        with open(CACHE_FILE, 'r') as f:
            embedding_cache = json.load(f)
        print(f"📦 Loaded {len(embedding_cache)} cached embeddings")
    except (FileNotFoundError, json.JSONDecodeError):
        embedding_cache = {}
        print("📦 Starting with empty cache")

def save_cache():
    """Save embedding cache to file"""
    try:
        with open(CACHE_FILE, 'w') as f:
            json.dump(embedding_cache, f)
    except Exception as e:
        print(f"Failed to save cache: {e}")

def get_embedding_hash(text: str) -> str:
    """Create consistent hash for caching"""
    return hashlib.md5(text.encode()).hexdigest()

# Configure Gemini
gemini_model = genai.GenerativeModel(
    "gemini-1.5-flash",
    generation_config=genai.types.GenerationConfig(
        temperature=0.7,
        max_output_tokens=600,
        candidate_count=1,
    )
)

async def get_embedding_fast(text: str) -> List[float]:
    """Get embedding with caching"""
    # Check cache first
    text_hash = get_embedding_hash(text)
    if text_hash in embedding_cache:
        return embedding_cache[text_hash]
    
    # Call Modal async
    try:
        embedding = await embedding_fn.arun(text)
        
        # Cache the result
        embedding_cache[text_hash] = embedding
        
        # Save cache periodically
        if len(embedding_cache) % 10 == 0:
            save_cache()
        
        return embedding
    except Exception as e:
        print(f"Embedding failed: {e}")
        return [0.0] * 384  # Fallback

def select_best_context(matches, max_chunks=2, min_score=0.75):
    """Select only the most relevant chunks"""
    good_matches = [m for m in matches if m.score > min_score]
    
    if not good_matches:
        good_matches = matches[:max_chunks]
    
    return good_matches[:max_chunks]

async def answer_question(subject: str, question: str, top_k: int = 4) -> str:
    """Optimized answer function"""
    start_time = time.time()
    
    # Get embedding
    vector = await get_embedding_fast(question)
    embed_time = time.time() - start_time
    
    # Query Pinecone
    query_start = time.time()
    response = index.query(
        vector=vector,
        top_k=top_k,
        namespace=subject,
        include_metadata=True
    )
    query_time = time.time() - query_start
    
    # Select best context
    best_matches = select_best_context(response.matches, max_chunks=2)
    contexts = [match.metadata["text"] for match in best_matches]
    
    context_block = "\n\n".join(contexts)
    if len(context_block) > 2000:
        context_block = context_block[:2000] + "..."
    
    # Generate answer
    llm_start = time.time()
    prompt = f"""You are Milo, an intelligent CS tutor. Answer clearly and thoroughly.

Context:
{context_block}

Question: {question}

Answer:"""
    
    response = await asyncio.get_event_loop().run_in_executor(
        None, 
        lambda: gemini_model.generate_content(prompt)
    )
    llm_time = time.time() - llm_start
    
    total_time = time.time() - start_time
    print(f"⏱️ Total: {total_time:.2f}s (Embed: {embed_time:.2f}s, Query: {query_time:.2f}s, LLM: {llm_time:.2f}s)")
    
    return response.text

async def generate_followups(subject: str, question: str) -> str:
    """Generate follow-up questions"""
    prompt = f"""Student asked: "{question}"

Suggest 2 follow-up questions:
1. 
2. """
    
    response = await asyncio.get_event_loop().run_in_executor(
        None,
        lambda: gemini_model.generate_content(prompt)
    )
    return response.text.strip()

async def warmup_cache():
    """Precompute embeddings for common queries"""
    common_queries = [
        "what is tcp",
        "explain deadlock", 
        "how does dns work",
        "what is normalization",
        "explain process scheduling"
    ]
    
    print("🔥 Warming up common queries...")
    tasks = [get_embedding_fast(query) for query in common_queries]
    await asyncio.gather(*tasks, return_exceptions=True)
    save_cache()
    print(f"✅ Warmed up {len(common_queries)} queries")

# Load cache on import
load_cache()