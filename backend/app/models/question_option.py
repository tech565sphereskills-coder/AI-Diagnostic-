import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class QuestionOption(Base):
    __tablename__ = "question_options"

    id = Column(String(64), primary_key=True, default=lambda: f"opt-{uuid.uuid4().hex[:8]}")
    question_id = Column(String(64), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    option_text = Column(String(255), nullable=False)
    value = Column(String(255), nullable=False)
    order_number = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    question = relationship("Question", back_populates="options")
