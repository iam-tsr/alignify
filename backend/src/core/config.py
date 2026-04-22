from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.services.scheduler import start_scheduler
from fastapi import FastAPI
from loguru import logger
import os
import dotenv

dotenv.load_dotenv()

def setup_cors(app):
    origins_env = os.getenv("CORS_ORIGINS")
    origins = origins_env.split(",") if origins_env else ["*"]
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
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