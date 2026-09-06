import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Answer(Base):
    __tablename__ = "answers"

    id = Column(String(64), primary_key=True, default=lambda: f"ans-{uuid.uuid4().hex[:8]}")
    assessment_id = Column(String(64), ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(String(64), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    answer_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    assessment = relationship("Assessment", back_populates="answers")
    question = relationship("Question", back_populates="answers")
