from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session
import ollama
from database import SessionLocal, engine, Base
from models import Generation
from schemas import GenerateRequest, GenerationResponse

Base.metadata.create_all(bind=engine)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/generate-bullets")
async def generate_bullets(data: GenerateRequest, db: Session = Depends(get_db)):
    prompt = f"""
    You are a resume writing assistant.

    Write 4 strong resume bullets tailored to the job description.

    Job Description:
    {data.job_description}

    Candidate Experience:
    {data.experience}

    Return only bullet points.
    """

    try:
        response = ollama.chat(
            model="phi3:mini",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            options={
                "num_predict": 120,
                "temperature": 0.3,
            }
        )

        bullets = response["message"]["content"]

        generation = Generation(
            job_description=data.job_description,
            experience=data.experience,
            bullets=bullets
        )

        db.add(generation)
        db.commit()
        db.refresh(generation)

        return {
            "id": generation.id,
            "bullets": generation.bullets
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/generations", response_model=list[GenerationResponse])
def get_generations(db: Session = Depends(get_db)):
    query = text("SELECT * FROM generations ORDER BY created_at DESC")
    results = db.execute(query).all()
    return results