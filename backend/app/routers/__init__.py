from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.assessment_types import router as assessment_types_router
from app.routers.assessments import router as assessments_router
from app.routers.results import router as results_router
from app.routers.feedback import router as feedback_router
from app.routers.admin import router as admin_router

__all__ = [
    "auth_router",
    "users_router",
    "assessment_types_router",
    "assessments_router",
    "results_router",
    "feedback_router",
    "admin_router",
]
