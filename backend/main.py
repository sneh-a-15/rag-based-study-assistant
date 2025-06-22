from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from rag_utils import answer_question  # ✅ Import your RAG logic

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "FastAPI is running!"}

@app.post("/ask")
async def ask(request: Request):
    data = await request.json()
    question = data.get("question")
    subject = data.get("subject")

    answer = answer_question(subject, question)
    return {"answer": answer}
