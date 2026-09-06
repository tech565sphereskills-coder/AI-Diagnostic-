from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.question import Question
from app.models.assessment_type import AssessmentType
from app.models.requirement import Requirement

class QuestionRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_assessment_types(self, active_only: bool = True) -> List[AssessmentType]:
        query = self.db.query(AssessmentType)
        if active_only:
            query = query.filter(AssessmentType.is_active == True)
        return query.all()

    def get_assessment_type_by_id(self, type_id: str) -> Optional[AssessmentType]:
        return self.db.query(AssessmentType).filter(AssessmentType.id == type_id).first()

    def get_questions_by_type_id(self, type_id: str, active_only: bool = True) -> List[Question]:
        query = self.db.query(Question).filter(Question.assessment_type_id == type_id)
        if active_only:
            query = query.filter(Question.is_active == True)
        return query.order_by(Question.order_number).all()

    def get_question_by_id(self, question_id: str) -> Optional[Question]:
        return self.db.query(Question).filter(Question.id == question_id).first()

    def get_requirements_by_type_id(self, type_id: str) -> List[Requirement]:
        return self.db.query(Requirement).filter(Requirement.assessment_type_id == type_id).all()
