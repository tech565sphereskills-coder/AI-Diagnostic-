import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(String(64), primary_key=True, default=lambda: f"q-{uuid.uuid4().hex[:8]}")
    assessment_type_id = Column(String(64), ForeignKey("assessment_types.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(String(50), nullable=False) # text, textarea, single_choice, multiple_choice, number, boolean, rating, date, dropdown
    is_required = Column(Boolean, default=True, nullable=False)
    order_number = Column(Integer, nullable=False, default=1)
    help_text = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    assessment_type = relationship("AssessmentType", back_populates="questions")
    options = relationship("QuestionOption", back_populates="question", cascade="all, delete-orphan", order_by="QuestionOption.order_number")
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")
    requirements = relationship("Requirement", foreign_keys="[Requirement.question_id]", back_populates="question", cascade="all, delete-orphan")
