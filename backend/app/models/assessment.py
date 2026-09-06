import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(String(64), primary_key=True, default=lambda: f"asm-{uuid.uuid4().hex[:8]}")
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    assessment_type_id = Column(String(64), ForeignKey("assessment_types.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), nullable=False, default="draft") # draft, in_progress, incomplete, ready, analyzing, completed, failed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="assessments")
    assessment_type = relationship("AssessmentType", back_populates="assessments")
    answers = relationship("Answer", back_populates="assessment", cascade="all, delete-orphan")
    result = relationship("AssessmentResult", back_populates="assessment", uselist=False, cascade="all, delete-orphan")
