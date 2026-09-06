import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String(64), primary_key=True, default=lambda: f"rec-{uuid.uuid4().hex[:8]}")
    result_id = Column(String(64), ForeignKey("assessment_results.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(String(50), nullable=False, default="medium") # low, medium, high
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    result = relationship("AssessmentResult", back_populates="recommendations")
