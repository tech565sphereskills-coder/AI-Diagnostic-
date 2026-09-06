import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class NextStep(Base):
    __tablename__ = "next_steps"

    id = Column(String(64), primary_key=True, default=lambda: f"ns-{uuid.uuid4().hex[:8]}")
    result_id = Column(String(64), ForeignKey("assessment_results.id", ondelete="CASCADE"), nullable=False)
    step_number = Column(Integer, nullable=False, default=1)
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    result = relationship("AssessmentResult", back_populates="next_steps")
