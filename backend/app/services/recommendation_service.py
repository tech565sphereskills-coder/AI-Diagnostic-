from typing import List
from sqlalchemy.orm import Session
from app.models.recommendation import Recommendation
from app.schemas.result import RecommendationResponse

class RecommendationService:
    def __init__(self, db: Session):
        self.db = db

    def get_by_result_id(self, result_id: str) -> List[RecommendationResponse]:
        recs = self.db.query(Recommendation).filter(Recommendation.result_id == result_id).all()
        return [RecommendationResponse.model_validate(r) for r in recs]
