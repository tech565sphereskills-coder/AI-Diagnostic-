import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.database.database import Base

class AssessmentType(Base):
    __tablename__ = "assessment_types"

    id = Column(String(64), primary_key=True, default=lambda: f"cat-{uuid.uuid4().hex[:8]}")
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    estimated_minutes = Column(Integer, nullable=False, default=10)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    questions = relationship("Question", back_populates="assessment_type", cascade="all, delete-orphan", order_by="Question.order_number")
    assessments = relationship("Assessment", back_populates="assessment_type", cascade="all, delete-orphan")
    requirements = relationship("Requirement", back_populates="assessment_type", cascade="all, delete-orphan")
