import uvicorn
from src.routers.user_router import app
import os
import dotenv

dotenv.load_dotenv()

if __name__ == "__main__":
    uvicorn.run(
        app,
        host=os.getenv("HOST"),
        port=int(os.getenv("PORT")),
    )