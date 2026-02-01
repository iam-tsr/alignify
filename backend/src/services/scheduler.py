from apscheduler.schedulers.background import BackgroundScheduler
from pytz import timezone
from bson import ObjectId
from src.database.mongo_db import MongoDBHandler
from src.model.gardio.qwen_gen import generate
from loguru import logger

def update_questions():
    """Background job to update questions"""
    try:
        mongo = MongoDBHandler()

        gen = generate()
        logger.info("Statements generated!")

        _id = mongo.read_one('questions', "_id")
        filter = {"_id": ObjectId(_id)}
        
        data = {"questions": gen}
        result = mongo.update_field("questions", filter, data)

        if result is None:
            logger.warning("No document found to update.")
        else:
            logger.info("Questions updated in the database")

    except Exception as e:
        logger.error(f"Error updating questions: {e}")

def start_scheduler():
    """Start the background scheduler"""
    scheduler = BackgroundScheduler(timezone=timezone("Asia/Kolkata"))
    # Run every Monday at 12 AM IST
    scheduler.add_job(update_questions, 'cron', day_of_week='mon', hour=0, minute=0)
    scheduler.start()