import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Requirement(Base):
    __tablename__ = "requirements"

    id = Column(String(64), primary_key=True, default=lambda: f"req-{uuid.uuid4().hex[:8]}")
    assessment_type_id = Column(String(64), ForeignKey("assessment_types.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(String(64), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    is_required = Column(Boolean, default=True, nullable=False)
    validation_rule = Column(String(255), nullable=True) # e.g. 'not_empty', 'min:1'
    conditional_question_id = Column(String(64), ForeignKey("questions.id", ondelete="SET NULL"), nullable=True)
    conditional_operator = Column(String(50), nullable=True) # equals, not_equals, contains, greater_than, less_than, greater_than_or_equal, less_than_or_equal
    conditional_value = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    assessment_type = relationship("AssessmentType", back_populates="requirements")
    question = relationship("Question", foreign_keys=[question_id], back_populates="requirements")
    conditional_question = relationship("Question", foreign_keys=[conditional_question_id])
