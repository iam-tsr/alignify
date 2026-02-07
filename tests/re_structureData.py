import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

import random
from src.database.mongo_db import MongoDBHandler
mongo = MongoDBHandler()

# Fetch all documents from the "responses" collection
collection = mongo.db["responses"]


result = collection.update_many(
    {"entries.selectedOption": {"$exists": True}},
    [
        {
            "$set": {
                "entries": {
                    "$map": {
                        "input": "$entries",
                        "as": "e",
                        "in": {
                            "$mergeObjects": [
                                "$$e",
                                {"nps": "$$e.selectedOption"}
                            ]
                        }
                    }
                }
            }
        },
        {
            "$unset": "entries.selectedOption"
        }
    ]
)