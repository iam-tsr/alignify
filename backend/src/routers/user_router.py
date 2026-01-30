from fastapi import FastAPI
from contextlib import asynccontextmanager
from .api_router import router as survey_router
from src.services.scheduler import start_scheduler
from loguru import logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    start_scheduler()
    logger.info("Application started, scheduler initialized")
    yield
    # Shutdown
    logger.info("Application shutting down")

app = FastAPI(lifespan=lifespan)

app.include_router(survey_router)

@app.get("/health")
async def health_check():
    logger.info("Health check endpoint was called.")
    return {"status": "healthy"}