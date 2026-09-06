from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class RequirementBase(BaseModel):
    assessment_type_id: str
    question_id: str
    is_required: bool = True
    validation_rule: Optional[str] = None
    conditional_question_id: Optional[str] = None
    conditional_operator: Optional[str] = None
    conditional_value: Optional[str] = None

class RequirementCreate(RequirementBase):
    id: Optional[str] = None

class RequirementUpdate(BaseModel):
    is_required: Optional[bool] = None
    validation_rule: Optional[str] = None
    conditional_question_id: Optional[str] = None
    conditional_operator: Optional[str] = None
    conditional_value: Optional[str] = None

class RequirementResponse(RequirementBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
