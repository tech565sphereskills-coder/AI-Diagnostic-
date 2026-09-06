import logging
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.core.config import settings
from app.database.database import engine, SessionLocal
from app.database.base import Base
from app.database.seed import seed_initial_data
from app.routers import (
    auth_router,
    users_router,
    assessment_types_router,
    assessments_router,
    results_router,
    feedback_router,
    admin_router,
)
from app.api.endpoints import router as legacy_clinical_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("aid_backend")

# Create tables automatically on startup for zero-config dev run
Base.metadata.create_all(bind=engine)

# Seed default initial data
try:
    with SessionLocal() as seed_db:
        seed_initial_data(seed_db)
except Exception as e:
    logger.warning(f"Initial DB seeding skipped or encountered issue: {e}")


app = FastAPI(
    title="AI Diagnostic & Recommendation System API",
    description="Enterprise REST API for AI-powered assessment, validation, and recommendation platform.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for Frontend Development & Staging
allowed_origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Standardized Error Handlers (Section #47 & #60)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Input validation failed",
                "details": exc.errors()
            }
        }
    )

# Include Core API Routers under /api
api_prefix = settings.API_V1_STR # /api

app.include_router(auth_router, prefix=api_prefix)
app.include_router(users_router, prefix=api_prefix)
app.include_router(assessment_types_router, prefix=api_prefix)
app.include_router(assessments_router, prefix=api_prefix)
app.include_router(results_router, prefix=api_prefix)
app.include_router(feedback_router, prefix=api_prefix)
app.include_router(admin_router, prefix=api_prefix)

# Include Legacy / CDSS Clinical router for backward compatibility
app.include_router(legacy_clinical_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "status": "online",
        "system": "AI Diagnostic & Recommendation System API v2.0",
        "docsUrl": "/docs",
        "healthCheck": "/api/health"
    }

@app.get("/api/health")
async def health_check():
    """
    Health check endpoint (Section #58).
    """
    try:
        with engine.connect() as conn:
            conn.execute(Base.metadata.tables["users"].select().limit(1))
        db_status = "connected"
    except Exception as e:
        logger.error(f"Health check DB ping failed: {str(e)}")
        db_status = "degraded"

    return {
        "status": "healthy",
        "database": db_status
    }
