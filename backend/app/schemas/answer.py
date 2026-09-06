from datetime import datetime
from typing import List
from pydantic import BaseModel

class AnswerBase(BaseModel):
    question_id: str
    answer_text: str

class AnswerCreate(AnswerBase):
    pass

class AnswersBatchCreate(BaseModel):
    answers: List[AnswerCreate]

class AnswerResponse(AnswerBase):
    id: str
    assessment_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
