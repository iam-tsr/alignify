import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from src.database.mongo_db import MongoDBHandler


mongo = MongoDBHandler()

collection = "questions"

question = mongo.read_one(collection, "_id")
# qua = question["questions"]
print(question)