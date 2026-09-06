import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class KeyFinding(Base):
    __tablename__ = "key_findings"

    id = Column(String(64), primary_key=True, default=lambda: f"kf-{uuid.uuid4().hex[:8]}")
    result_id = Column(String(64), ForeignKey("assessment_results.id", ondelete="CASCADE"), nullable=False)
    finding = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    result = relationship("AssessmentResult", back_populates="key_findings")
