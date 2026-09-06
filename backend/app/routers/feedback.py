from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.feedback import FeedbackCreate, FeedbackResponse
from app.repositories.result_repository import ResultRepository

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.post("", response_model=FeedbackResponse)
def submit_general_feedback(
    result_id: str,
    fb_in: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    repo = ResultRepository(db)
    return repo.add_feedback(
        user_id=current_user.id,
        result_id=result_id,
        rating=fb_in.rating,
        comment=fb_in.comment
    )
