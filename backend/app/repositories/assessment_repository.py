from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.assessment import Assessment
from app.models.answer import Answer

class AssessmentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, assessment_id: str) -> Optional[Assessment]:
        return self.db.query(Assessment).filter(Assessment.id == assessment_id).first()

    def get_user_assessments(
        self,
        user_id: str,
        status: Optional[str] = None,
        assessment_type_id: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Assessment]:
        query = self.db.query(Assessment).filter(Assessment.user_id == user_id)
        if status:
            query = query.filter(Assessment.status == status)
        if assessment_type_id:
            query = query.filter(Assessment.assessment_type_id == assessment_type_id)
        return query.order_by(Assessment.created_at.desc()).offset(skip).limit(limit).all()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Assessment]:
        return self.db.query(Assessment).order_by(Assessment.created_at.desc()).offset(skip).limit(limit).all()

    def count(self) -> int:
        return self.db.query(Assessment).count()

    def count_by_status(self, status: str) -> int:
        return self.db.query(Assessment).filter(Assessment.status == status).count()

    def create(self, assessment: Assessment) -> Assessment:
        self.db.add(assessment)
        self.db.commit()
        self.db.refresh(assessment)
        return assessment

    def update_status(self, assessment: Assessment, status: str) -> Assessment:
        assessment.status = status
        self.db.commit()
        self.db.refresh(assessment)
        return assessment

    def save_answers(self, assessment_id: str, answers_data: List[dict]) -> List[Answer]:
        saved_answers = []
        for item in answers_data:
            existing = self.db.query(Answer).filter(
                Answer.assessment_id == assessment_id,
                Answer.question_id == item["question_id"]
            ).first()

            if existing:
                existing.answer_text = item["answer_text"]
                saved_answers.append(existing)
            else:
                new_ans = Answer(
                    assessment_id=assessment_id,
                    question_id=item["question_id"],
                    answer_text=item["answer_text"]
                )
                self.db.add(new_ans)
                saved_answers.append(new_ans)

        self.db.commit()
        for ans in saved_answers:
            self.db.refresh(ans)
        return saved_answers
