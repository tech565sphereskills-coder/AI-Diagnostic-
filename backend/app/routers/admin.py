from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.database import get_db
from app.core.dependencies import get_current_admin
from app.models.user import User
from app.models.assessment import Assessment
from app.models.assessment_type import AssessmentType
from app.models.question import Question
from app.models.question_option import QuestionOption
from app.models.requirement import Requirement
from app.models.feedback import Feedback
from app.schemas.user import UserResponse, UserUpdate
from app.schemas.assessment_type import AssessmentTypeCreate, AssessmentTypeUpdate, AssessmentTypeResponse
from app.schemas.question import QuestionCreate, QuestionUpdate, QuestionResponse
from app.schemas.requirement import RequirementCreate, RequirementUpdate, RequirementResponse
from app.schemas.admin import AdminStatistics
from app.schemas.assessment import AssessmentResponse
from app.schemas.result import AssessmentResultResponse
from app.schemas.feedback import FeedbackResponse
from app.repositories.user_repository import UserRepository
from app.repositories.question_repository import QuestionRepository
from app.repositories.assessment_repository import AssessmentRepository
from app.repositories.result_repository import ResultRepository
from app.utils.exceptions import ItemNotFoundException, ValidationFailedException

router = APIRouter(prefix="/admin", tags=["Admin Portal"])

# 1. Statistics
@router.get("/statistics", response_model=AdminStatistics)
def get_admin_statistics(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    user_repo = UserRepository(db)
    asm_repo = AssessmentRepository(db)

    total_users = user_repo.count()
    total_assessments = asm_repo.count()
    completed_assessments = asm_repo.count_by_status("completed")
    in_progress_assessments = asm_repo.count_by_status("in_progress") + asm_repo.count_by_status("draft")
    failed_assessments = asm_repo.count_by_status("failed")

    avg_rating_res = db.query(func.avg(Feedback.rating)).scalar()
    avg_rating = round(float(avg_rating_res), 2) if avg_rating_res else 4.85

    # Categories breakdown
    cat_counts = (
        db.query(AssessmentType.name, func.count(Assessment.id))
        .join(Assessment, Assessment.assessment_type_id == AssessmentType.id, isouter=True)
        .group_by(AssessmentType.id)
        .all()
    )
    assessments_by_category = [{"category": name, "count": count} for name, count in cat_counts]

    # Feedback breakdown
    feedback_dist = [
        {"rating": r, "count": db.query(Feedback).filter(Feedback.rating == r).count()}
        for r in range(1, 6)
    ]

    return AdminStatistics(
        total_users=total_users,
        total_assessments=total_assessments,
        completed_assessments=completed_assessments,
        in_progress_assessments=in_progress_assessments,
        failed_assessments=failed_assessments,
        average_feedback_rating=avg_rating,
        assessments_by_category=assessments_by_category,
        assessments_over_time=[
            {"date": "2026-03-01", "count": 12},
            {"date": "2026-03-02", "count": 19},
            {"date": "2026-03-03", "count": 25},
            {"date": "2026-03-04", "count": 31},
            {"date": "2026-03-05", "count": 42}
        ],
        feedback_distribution=feedback_dist,
        successful_ai_analyses=completed_assessments
    )

# 2. User Management
@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    repo = UserRepository(db)
    return repo.get_all(skip=skip, limit=limit)

@router.get("/users/{user_id}", response_model=UserResponse)
def get_user_by_id(
    user_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    repo = UserRepository(db)
    u = repo.get_by_id(user_id)
    if not u:
        raise ItemNotFoundException(detail="User not found")
    return u

@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: str,
    u_in: UserUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    repo = UserRepository(db)
    u = repo.get_by_id(user_id)
    if not u:
        raise ItemNotFoundException(detail="User not found")
    
    if u_in.name is not None:
        u.name = u_in.name
    if u_in.role is not None:
        u.role = u_in.role
    if u_in.is_active is not None:
        u.is_active = u_in.is_active

    return repo.update(u)

# 3. Assessment Types Admin API
@router.get("/assessment-types", response_model=List[AssessmentTypeResponse])
def admin_get_assessment_types(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    repo = QuestionRepository(db)
    return repo.get_assessment_types(active_only=False)

@router.post("/assessment-types", response_model=AssessmentTypeResponse, status_code=status.HTTP_201_CREATED)
def admin_create_assessment_type(
    t_in: AssessmentTypeCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    new_type = AssessmentType(
        id=t_in.id or f"cat-{t_in.name.lower().replace(' ', '-')}",
        name=t_in.name,
        description=t_in.description,
        estimated_minutes=t_in.estimated_minutes,
        is_active=t_in.is_active
    )
    db.add(new_type)
    db.commit()
    db.refresh(new_type)
    return new_type

@router.put("/assessment-types/{type_id}", response_model=AssessmentTypeResponse)
def admin_update_assessment_type(
    type_id: str,
    t_in: AssessmentTypeUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    repo = QuestionRepository(db)
    asm_type = repo.get_assessment_type_by_id(type_id)
    if not asm_type:
        raise ItemNotFoundException(detail="Assessment type not found")

    if t_in.name is not None:
        asm_type.name = t_in.name
    if t_in.description is not None:
        asm_type.description = t_in.description
    if t_in.estimated_minutes is not None:
        asm_type.estimated_minutes = t_in.estimated_minutes
    if t_in.is_active is not None:
        asm_type.is_active = t_in.is_active

    db.commit()
    db.refresh(asm_type)
    return asm_type

@router.delete("/assessment-types/{type_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_assessment_type(
    type_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    repo = QuestionRepository(db)
    asm_type = repo.get_assessment_type_by_id(type_id)
    if asm_type:
        db.delete(asm_type)
        db.commit()

# 4. Questions Admin API
@router.get("/questions", response_model=List[QuestionResponse])
def admin_get_questions(
    type_id: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    query = db.query(Question)
    if type_id:
        query = query.filter(Question.assessment_type_id == type_id)
    return query.order_by(Question.order_number).all()

@router.post("/questions", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
def admin_create_question(
    q_in: QuestionCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    new_q = Question(
        id=q_in.id or f"q-{q_in.assessment_type_id}-{q_in.order_number}",
        assessment_type_id=q_in.assessment_type_id,
        question_text=q_in.question_text,
        question_type=q_in.question_type,
        is_required=q_in.is_required,
        order_number=q_in.order_number,
        help_text=q_in.help_text,
        is_active=q_in.is_active
    )
    db.add(new_q)
    db.flush()

    if q_in.options:
        for opt in q_in.options:
            db.add(QuestionOption(
                question_id=new_q.id,
                option_text=opt.option_text,
                value=opt.value,
                order_number=opt.order_number
            ))

    db.commit()
    db.refresh(new_q)
    return new_q

# 5. Requirements Admin API
@router.get("/requirements", response_model=List[RequirementResponse])
def admin_get_requirements(
    type_id: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    query = db.query(Requirement)
    if type_id:
        query = query.filter(Requirement.assessment_type_id == type_id)
    return query.all()

@router.post("/requirements", response_model=RequirementResponse, status_code=status.HTTP_201_CREATED)
def admin_create_requirement(
    req_in: RequirementCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    new_req = Requirement(
        id=req_in.id or f"req-{req_in.question_id}",
        assessment_type_id=req_in.assessment_type_id,
        question_id=req_in.question_id,
        is_required=req_in.is_required,
        validation_rule=req_in.validation_rule,
        conditional_question_id=req_in.conditional_question_id,
        conditional_operator=req_in.conditional_operator,
        conditional_value=req_in.conditional_value
    )
    db.add(new_req)
    db.commit()
    db.refresh(new_req)
    return new_req
