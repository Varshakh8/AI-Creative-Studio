from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user
from app.models import User
from app.utils.usage_tracker import track_usage

load_dotenv()

router = APIRouter(prefix="/poetry", tags=["Poetry"])

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")

API_URL = "https://api-inference.huggingface.co/models/gpt2"
HEADERS = {
    "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
    "Content-Type": "application/json"
}

class PoetryPrompt(BaseModel):
    prompt: str


@router.post("/generate-poetry")
async def generate_poetry(
    data: PoetryPrompt,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    check_and_increment_usage(current_user, db, cost=2)
    try:
        # 🔐 Get logged-in user
        user = db.query(User).filter(User.username == current_user).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        # 📊 Track usage
        track_usage(db, user.id, "poetry")

        payload = {
            "inputs": data.prompt,
            "parameters": {
                "max_new_tokens": 100,
                "temperature": 0.8,
                "top_p": 0.95
            }
        }

        response = requests.post(API_URL, headers=HEADERS, json=payload)

        if response.status_code != 200:
            return {"error": response.text}

        generated_text = response.json()[0]["generated_text"]

        return {
            "message": "Poetry generated successfully!",
            "poetry": generated_text
        }

    except Exception as e:
        return {"error": str(e)}
