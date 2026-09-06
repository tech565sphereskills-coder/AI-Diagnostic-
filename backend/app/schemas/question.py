from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class QuestionOptionBase(BaseModel):
    option_text: str
    value: str
    order_number: int = 1

class QuestionOptionCreate(QuestionOptionBase):
    id: Optional[str] = None

class QuestionOptionResponse(QuestionOptionBase):
    id: str
    question_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class QuestionBase(BaseModel):
    assessment_type_id: str
    question_text: str
    question_type: str # text, textarea, single_choice, multiple_choice, number, boolean, rating, date, dropdown
    is_required: bool = True
    order_number: int = 1
    help_text: Optional[str] = None
    is_active: bool = True

class QuestionCreate(QuestionBase):
    id: Optional[str] = None
    options: Optional[List[QuestionOptionCreate]] = None

class QuestionUpdate(BaseModel):
    question_text: Optional[str] = None
    question_type: Optional[str] = None
    is_required: Optional[bool] = None
    order_number: Optional[int] = None
    help_text: Optional[str] = None
    is_active: Optional[bool] = None

class QuestionResponse(QuestionBase):
    id: str
    created_at: datetime
    updated_at: datetime
    options: List[QuestionOptionResponse] = []

    class Config:
        from_attributes = True
