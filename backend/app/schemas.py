from pydantic import BaseModel
from datetime import datetime

class GenerateRequest(BaseModel):
    job_description: str
    experience: str

class GenerationResponse(BaseModel):
    id: int
    job_description: str
    experience: str
    bullets: str
    created_at: datetime

    class Config:
        from_attributes = True