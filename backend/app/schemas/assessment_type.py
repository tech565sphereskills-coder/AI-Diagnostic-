from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class AssessmentTypeBase(BaseModel):
    name: str
    description: str
    estimated_minutes: int = 10
    is_active: bool = True

class AssessmentTypeCreate(AssessmentTypeBase):
    id: Optional[str] = None

class AssessmentTypeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    estimated_minutes: Optional[int] = None
    is_active: Optional[bool] = None

class AssessmentTypeResponse(AssessmentTypeBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
