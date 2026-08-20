from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI(
    title="Student Question API",
    description="A simple FastAPI backend for a React application",
    version="1.0.0",
)


# Allow both local React and deployed React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://askmynotes-web.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request format
class QuestionRequest(BaseModel):
    question: str


# Response format
class QuestionResponse(BaseModel):
    question: str
    answer: str


# Home page
@app.get("/")
def home():
    return {
        "message": "FastAPI backend is running"
    }


# Health check
@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# Ask question
@app.post("/ask", response_model=QuestionResponse)
def ask_question(request: QuestionRequest):

    cleaned_question = request.question.strip()

    # Check if question is empty
    if not cleaned_question:
        return QuestionResponse(
            question="",
            answer="Please enter a question.",
        )

    # Return the received question
    return QuestionResponse(
        question=cleaned_question,
        answer=f"{cleaned_question} message received",
    )