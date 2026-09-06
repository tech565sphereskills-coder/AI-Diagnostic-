import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(String(64), primary_key=True, default=lambda: f"fb-{uuid.uuid4().hex[:8]}")
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    result_id = Column(String(64), ForeignKey("assessment_results.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False) # 1 to 5
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="feedback")
    result = relationship("AssessmentResult", back_populates="feedback")
