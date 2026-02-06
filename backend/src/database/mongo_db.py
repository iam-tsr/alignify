import os
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, OperationFailure
from typing import Dict, Optional
from datetime import datetime
from pytz import timezone

load_dotenv()

class MongoDBHandler:
    """Handler class for MongoDB operations"""
    
    def __init__(self: str = None):
        """Initialize MongoDB connection"""
        # Get configuration from environment variables if not provided
        self.connection_string = os.getenv('MONGODB_URI')
        self.database_name = os.getenv('MONGODB_DATABASE')
        
        try:
            self.client = MongoClient(self.connection_string)
            # Test connection
            self.client.admin.command('ping')
            self.db = self.client[self.database_name]
        except ConnectionFailure as e:
            print(f"Failed to connect to MongoDB: {e}")
            raise
    
    def write_one(self, collection:str, data) -> Optional[str]:
        """Insert a single document into a collection"""
        try:
            collection = self.db[collection]
            datetime_ist = datetime.now(timezone('Asia/Kolkata'))
            data['created_at'] = datetime_ist.strftime("%Y-%m-%d %H:%M:%S")
            result = collection.insert_one(data)
            return str(result.inserted_id)
        except OperationFailure as e:
            print(f"Failed to insert document: {e}")
            return None
    
    def read_one(self, collection: str, field: str, doc_id: Optional[Dict] = None, sub_field: Optional[str] = None) -> Optional[Dict]:
        """Read a single document from a collection
        
        Args:
            collection: Name of the collection
            field: The field to retrieve from the document
            doc_id: Query filter to find the document (e.g., {"_id": ObjectId('...')})
            sub_field: Optional sub-field to extract from each item if field contains a list of dicts
            
        Returns:
            - If sub_field is None: Returns the value of the field
            - If sub_field is provided and field is a list of dicts: Returns list of sub_field values
            - None if document not found or error occurs
        """
        try:
            collection = self.db[collection]
            
            # Use provided doc_id filter or empty dict to get first document
            query_filter = doc_id if doc_id is not None else {}
            
            # Find document
            document = collection.find_one(query_filter)
            
            if not document:
                print("No document found matching the query")
                return None
            
            # Check if field exists in document
            if field not in document:
                print(f"Field '{field}' not found in document")
                return None
            
            field_data = document[field]
            
            # If sub_field is specified, extract it from list of dictionaries
            if sub_field is not None:
                if isinstance(field_data, list):
                    # Extract sub_field value from each dictionary in the list
                    result = []
                    for item in field_data:
                        if isinstance(item, dict) and sub_field in item:
                            result.append(item[sub_field])
                    return result
                elif isinstance(field_data, dict) and sub_field in field_data:
                    # If field_data is a single dict, return the sub_field value
                    return field_data[sub_field]
                else:
                    print(f"Sub-field '{sub_field}' not found or field is not a list/dict")
                    return None
            
            # Return the entire field data if no sub_field specified
            return field_data
            
        except OperationFailure as e:
            print(f"Failed to read document: {e}")
            return None
        except Exception as e:
            print(f"An error occurred: {e}")
            return None
    
    def update_field(self, collection:str, doc_id: Dict, 
                   update_data: Dict, upsert: bool = False) -> bool:
        """Update a single document in a collection"""
        try:
            collection = self.db[collection]

            document = collection.find_one(doc_id)
            
            if not document:
                print("No document found matching the query")
                return None
            datetime_ist = datetime.now(timezone('Asia/Kolkata'))
            update_data['updated_at'] = datetime_ist.strftime("%Y-%m-%d %H:%M:%S")

            result = collection.update_one(
                doc_id,
                {'$set': update_data},
                upsert=upsert
            )

            return result.modified_count
        except OperationFailure as e:
            print(f"Failed to update document: {e}")
            return False
        
    def update_sub_field(self, collection: str, doc_id: Dict, field: str, sub_field: str, values: list, upsert: bool = False) -> bool:
        """Update a sub-field within a list of dictionaries in a document
        
        Args:
            collection: Name of the collection
            query: Query filter to find the document (e.g., {"_id": ObjectId('...')})
            field: The field containing the list of dictionaries (e.g., "entries")
            sub_field: The key to add/update in each dictionary (e.g., "feedbackSentiment")
            values: List of values to add, one for each dictionary in the field list
            upsert: Whether to insert if document doesn't exist
            
        Returns:
            True if successful, False otherwise
        """
        try:
            collection = self.db[collection]
            
            # First, retrieve the current document
            document = collection.find_one(doc_id)
            
            if not document:
                print("No document found matching the query")
                return False
            
            # Check if field exists and is a list
            if field not in document:
                print(f"Field '{field}' not found in document")
                return False
            
            field_data = document[field]
            
            if not isinstance(field_data, list):
                print(f"Field '{field}' is not a list")
                return False
            
            # Check if values list length matches field_data length
            if len(values) != len(field_data):
                print(f"Values list length ({len(values)}) doesn't match field list length ({len(field_data)})")
                return False
            
            # Add sub_field to each dictionary in the list
            for i, item in enumerate(field_data):
                if isinstance(item, dict):
                    item[sub_field] = values[i]
                else:
                    print(f"Item at index {i} is not a dictionary")
                    return False
            
            # Update the document with modified field data
            update_data = {
                field: field_data,
            }
            
            result = collection.update_one(
                doc_id,
                {'$set': update_data},
                upsert=upsert
            )
            
            return result.modified_count
            
        except OperationFailure as e:
            print(f"Failed to update sub-field: {e}")
            return False
        except Exception as e:
            print(f"An error occurred: {e}")
            return False
    
    def delete_one(self, collection:str, query: Dict) -> bool:
        """Delete a single document from a collection"""
        try:
            collection = self.db[collection]
            result = collection.delete_one(query)
            print(f"Deleted {result.deleted_count} document(s)")
            return result.deleted_count > 0
        except OperationFailure as e:
            print(f"Failed to delete document: {e}")
            return False
        
    def delete_many(self, collection:str, query: Dict) -> int:
        """Delete multiple documents from a collection"""
        try:
            collection = self.db[collection]
            result = collection.delete_many(query)
            print(f"Deleted {result.deleted_count} document(s)")
            return result.deleted_count
        except OperationFailure as e:
            print(f"Failed to delete documents: {e}")
            return 0
        
    def count_documents(self, collection: str, query: Dict = {}) -> int:
        """Count the number of documents in a collection matching a query"""
        try:
            collection = self.db[collection]
            count = collection.count_documents(query)
            return count
        except OperationFailure as e:
            print(f"Failed to count documents: {e}")
            return 0
        
    def count_entries(self, collection: str, sub_field: str, value: list) -> int:
        """Count the total number of entries in a specified field across documents matching a query"""
        try:
            pipeline = [
                {"$unwind": "$entries"},
                {
                    "$match": {
                        f"entries.{sub_field}": {"$in": value}
                    }
                },
                {"$count": "total"}
            ]

            collection = self.db[collection]
            result = list(collection.aggregate(pipeline))
            count = result[0]["total"] if result else 0
            return count
        
        except OperationFailure as e:
            print(f"Failed to count entries: {e}")
            return 0
    
    def close_connection(self):
        """Close the MongoDB connection"""
        self.client.close()
        print("MongoDB connection closed")