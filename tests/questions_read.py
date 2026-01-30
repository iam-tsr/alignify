import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from src.database.db import MongoDBHandler


mongo = MongoDBHandler("questions")


question = mongo.read_one()
# qua = question["questions"]
print(question)