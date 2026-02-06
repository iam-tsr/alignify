"""
old_Option: [Strongly Disagree, Disagree, Neutral, Agree, Strongly Agree]

new_Option: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Changes from old_Option to new_Option. Choose random number from the range for each option in old_Option and assign to new_Option.
Changes:
    Strongly Disagree -> [0, 1]
    Disagree -> [2, 3]
    Neutral -> [4, 5, 6]
    Agree -> [7, 8]
    Strongly Agree -> [9, 10]

Update all the database records in the "respones" collection.
"""

import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

import random
from src.database.mongo_db import MongoDBHandler
mongo = MongoDBHandler()

# Fetch all documents from the "responses" collection
documents = mongo.db["responses"]

# Mapping from old option to numeric ranges
mapping = {
    "Strongly Disagree": [0, 1],
    "Disagree": [2, 3],
    "Neutral": [4, 5, 6],
    "Agree": [7, 8],
    "Strongly Agree": [9, 10],
}

for doc in documents.find():
    updated = False
    entries = doc.get("entries", [])

    for entry in entries:
        old_value = entry.get("selectedOption")

        if old_value in mapping:
            entry["selectedOption"] = random.choice(mapping[old_value])
            updated = True

    if updated:
        documents.update_one(
            {"_id": doc["_id"]},
            {"$set": {"entries": entries}}
        )
