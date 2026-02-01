import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# from src.services.qa_gen import generate
from src.model.gardio.qwen_gen import generate
from src.database.mongo_db import MongoDBHandler
from bson.objectid import ObjectId

def spase_gen_data(data):
    data = data.strip().strip('"').strip("'")
    data = data[1:-1].split(", ")
    data = [_.strip().strip("'").strip('"') for _ in data]
    return data

gen = generate()
gen = spase_gen_data(gen)

mongo = MongoDBHandler()

filter = {"_id": ObjectId('697ceac080d830a7ef53f790')}
collection = "questions"
data = {"questions": gen}

doc_id = mongo.update_field(collection, filter, data)