import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(String(64), primary_key=True, default=lambda: f"res-{uuid.uuid4().hex[:8]}")
    assessment_id = Column(String(64), ForeignKey("assessments.id", ondelete="CASCADE"), unique=True, nullable=False)
    result_title = Column(String(255), nullable=False)
    result_summary = Column(Text, nullable=False)
    confidence_score = Column(Float, nullable=False, default=0.85) # Decimal between 0.00 and 1.00
    explanation = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    assessment = relationship("Assessment", back_populates="result")
    key_findings = relationship("KeyFinding", back_populates="result", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="result", cascade="all, delete-orphan")
    next_steps = relationship("NextStep", back_populates="result", cascade="all, delete-orphan", order_by="NextStep.step_number")
    feedback = relationship("Feedback", back_populates="result", cascade="all, delete-orphan")
