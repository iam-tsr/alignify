from fastapi import APIRouter, HTTPException
from src.database.mongo_db import MongoDBHandler
from typing import List, Dict, Any
from src.model.classify import classifier
from src.database.mongo_db import MongoDBHandler
from bson.objectid import ObjectId
from datetime import datetime
from loguru import logger

router = APIRouter()

mongo = MongoDBHandler()

@router.get("/api/qFetch")
async def get_survey_questions():
    """Get survey questions from the database (MongoDB)"""
    try:
        question = mongo.read_one(collection="questions", field="questions")

        return question
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/rFetch")
async def get_explore_data():
    """Get all survey responses for the explore page"""
    try:
        data = mongo.read_all("responses")
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/save")
async def submit_survey(response: List[Dict[str, Any]]):
    """Save survey responses to the database (MongoDB)"""
    try:
        submission = {"entries": response}
        result = mongo.write_one("responses", submission)
        logger.info(f"Survey responses of id {result} saved on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/resp_classify")
async def text_classification(doc_id: Dict[str, str]):
    """Retrieve the data pushed to database (MongoDB) and analyze and classify the user response text using BERT model"""
    try:
        if doc_id is None:
            logger.error("Document ID is missing")
            return None
        
        doc_id = doc_id['doc_id']
        text = mongo.read_one(collection="responses", field="entries", doc_id={"_id": ObjectId(doc_id)}, sub_field="feedback")
        sentiments = ["NEUTRAL" if not entry or entry.isspace() else classifier(entry) for entry in text]
    
        update_result = mongo.update_sub_field(
            collection="responses",
            doc_id={"_id": ObjectId(doc_id)},
            field="entries",
            sub_field="feedbackSentiment",
            values=sentiments,
        )
        logger.info("Text classification completed and updated successfully")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/score")
async def calculate_score(engagement=False, positive=False, negative=False):
    """Calculate the engagement score based on the user responses and return the score to the frontend"""
    try:
        collection = "responses"

        if engagement:
            logger.info(f"Called engagement score API")

            num_doc = mongo.count_documents(collection=collection)
            score = (num_doc/(num_doc+5))*10
            return round(score, 1)
        elif positive:
            logger.info(f"Called positive score API")

            num_feedbacks = mongo.count_entries(collection=collection, sub_field="feedbackSentiment", value=["POSITIVE"])
            num_selectedOptions = mongo.count_entries(collection=collection, sub_field="selectedOption", value=[8, 9, 10])
            num_doc = mongo.count_documents(collection=collection)

            num_entries = num_feedbacks + num_selectedOptions
            score = (num_entries/(num_doc*10))*10
            return round(score, 1)
        elif negative:
            logger.info(f"Called negative score API")

            num_feedbacks = mongo.count_entries(collection=collection, sub_field="feedbackSentiment", value=["NEGATIVE"])
            num_selectedOptions = mongo.count_entries(collection=collection, sub_field="selectedOption", value=[0, 1, 2, 3, 4])
            num_doc = mongo.count_documents(collection=collection)

            num_entries = num_feedbacks + num_selectedOptions
            score = (num_entries/(num_doc*10))*10
            return round(score, 1)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
