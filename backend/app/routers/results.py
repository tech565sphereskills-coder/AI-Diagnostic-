from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.result import AssessmentResultResponse
from app.schemas.feedback import FeedbackCreate, FeedbackResponse
from app.repositories.result_repository import ResultRepository
from app.utils.exceptions import ItemNotFoundException, AccessForbiddenException

router = APIRouter(prefix="/results", tags=["Results & Feedback"])

@router.get("/{result_id}", response_model=AssessmentResultResponse)
def get_result_by_id(
    result_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    repo = ResultRepository(db)
    res = repo.get_by_id(result_id)
    if not res:
        raise ItemNotFoundException(detail="Result not found")

    if res.assessment.user_id != current_user.id and current_user.role != "admin":
        raise AccessForbiddenException(detail="Not authorized to access this result")

    return res

@router.post("/{result_id}/feedback", response_model=FeedbackResponse)
def submit_result_feedback(
    result_id: str,
    fb_in: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    repo = ResultRepository(db)
    res = repo.get_by_id(result_id)
    if not res:
        raise ItemNotFoundException(detail="Result not found")

    if res.assessment.user_id != current_user.id and current_user.role != "admin":
        raise AccessForbiddenException(detail="Not authorized to submit feedback for this result")

    return repo.add_feedback(
        user_id=current_user.id,
        result_id=result_id,
        rating=fb_in.rating,
        comment=fb_in.comment
    )
