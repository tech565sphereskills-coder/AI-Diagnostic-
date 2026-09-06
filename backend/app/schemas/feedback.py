from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class FeedbackCreate(BaseModel):
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: str
    user_id: str
    result_id: str
    rating: int
    comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
