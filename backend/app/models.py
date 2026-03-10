from sqlalchemy import Column, Integer, Text, DateTime
from sqlalchemy.sql import func
from database import Base

class Generation(Base):
    __tablename__ = "generations"

    id = Column(Integer, primary_key=True, index=True)
    job_description = Column(Text, nullable=False)
    experience = Column(Text, nullable=False)
    bullets = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())