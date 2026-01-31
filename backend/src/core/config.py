from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.services.scheduler import start_scheduler
from fastapi import FastAPI
from loguru import logger

def setup_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # For production, specify your frontend URL
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    start_scheduler()
    logger.info("Application started, scheduler initialized")
    yield
    # Shutdown
    logger.info("Application shutting down")