from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from rag_utils import answer_question, generate_followups  # logic handled in utils

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api")
def root():
    return {"message": "FastAPI is running!"}

@app.post("/api/ask")
async def ask(request: Request):
    data = await request.json()
    question = data.get("question")
    subject = data.get("subject")

    answer = answer_question(subject, question)
    return {"answer": answer}

@app.post("/api/followup")
async def followup(request: Request):
    data = await request.json()
    question = data.get("question")
    subject = data.get("subject")

    followups = generate_followups(subject, question)
    return {"followups": followups}
