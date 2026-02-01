from fastapi import FastAPI
from .api_router import router as survey_router
from src.core.config import setup_cors
from src.core.config import lifespan
from loguru import logger

app = FastAPI(lifespan=lifespan)

setup_cors(app)

app.include_router(survey_router)

@app.get("/health")
async def health_check():
    logger.info("Health check endpoint was called.")
    return {"status": "healthy"}

@app.get("/connection_check")
async def connection_check():
    logger.info("Connection check endpoint was called.")
    return {"status": "connected"}