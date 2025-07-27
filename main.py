# === main.py ===
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import time
import os

# Import from rag_utils
from rag_utils import (
    answer_question, 
    generate_followups, 
    warmup_cache,
    embedding_cache,
    save_cache,
    get_embedding_hash,
    CACHE_FILE
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Warmup the system"""
    print("🚀 Starting optimized RAG system...")
    await warmup_cache()
    print("✅ System ready!")

@app.on_event("shutdown")
async def shutdown_event():
    """Save cache on shutdown"""
    save_cache()
    print("💾 Cache saved!")

@app.get("/api")
def root():
    return {
        "message": "Optimized Modal RAG is running!", 
        "cache_size": len(embedding_cache)
    }

@app.post("/api/ask")
async def ask(request: Request):
    data = await request.json()
    question = data.get("question")
    subject = data.get("subject")
    
    if not question or not subject:
        return {"error": "Missing question or subject"}
    
    start_time = time.time()
    answer = await answer_question(subject, question)
    response_time = time.time() - start_time
    
    return {
        "answer": answer,
        "response_time": f"{response_time:.2f}s",
        "cached": get_embedding_hash(question) in embedding_cache
    }

@app.post("/api/followup")
async def followup(request: Request):
    data = await request.json()
    question = data.get("question")
    subject = data.get("subject")
    
    followups = await generate_followups(subject, question)
    return {"followups": followups}

@app.post("/api/batch")
async def batch_ask(request: Request):
    """Process multiple questions efficiently"""
    data = await request.json()
    questions = data.get("questions", [])
    
    tasks = []
    for q_data in questions:
        task = answer_question(q_data['subject'], q_data['question'])
        tasks.append(task)
    
    answers = await asyncio.gather(*tasks, return_exceptions=True)
    
    results = []
    for i, answer in enumerate(answers):
        if isinstance(answer, Exception):
            results.append({"error": str(answer), "question": questions[i]['question']})
        else:
            results.append({
                "question": questions[i]['question'],
                "subject": questions[i]['subject'],
                "answer": answer
            })
    
    return {"results": results}

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "cache_size": len(embedding_cache),
        "cache_file_exists": os.path.exists(CACHE_FILE)
    }

@app.post("/api/cache/clear")
def clear_cache():
    """Clear embedding cache"""
    global embedding_cache
    embedding_cache.clear()
    try:
        os.remove(CACHE_FILE)
    except FileNotFoundError:
        pass
    return {"message": "Cache cleared"}

@app.get("/api/cache/stats")
def cache_stats():
    """Get cache statistics"""
    return {
        "total_entries": len(embedding_cache),
        "cache_file_exists": os.path.exists(CACHE_FILE)
    }