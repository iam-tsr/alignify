import sys
import os

from bson import ObjectId

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from src.database.mongo_db import MongoDBHandler

mongo = MongoDBHandler()

id = "697e55e0af6f4bbbd70acabf"

query = { "_id": { "$ne": ObjectId(id) } }

mongo.delete_many("responses", query)