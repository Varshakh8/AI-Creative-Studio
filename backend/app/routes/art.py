from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import os
import requests
import time

from dotenv import load_dotenv
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user
from app.models import User
from app.utils.usage_tracker import track_usage
from app.usage import check_and_increment_usage


load_dotenv()

router = APIRouter(prefix="/art", tags=["Art"])

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")

API_URL = "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-dev"
HEADERS = {
    "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
    "Content-Type": "application/json"
}

class ArtPrompt(BaseModel):
    prompt: str


@router.post("/generate-art")
async def generate_art(
    data: ArtPrompt,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    check_and_increment_usage(current_user, db, cost=1)
    try:
        # 🔐 Get logged-in user
        user = db.query(User).filter(User.username == current_user).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        # 📊 Track AI usage
        track_usage(db, user.id, "art")

        # 🎨 Generate image
        payload = {"inputs": data.prompt}
        response = requests.post(API_URL, headers=HEADERS, json=payload)

        if response.status_code != 200:
            return {"error": response.text}

        timestamp = int(time.time())
        os.makedirs("generated", exist_ok=True)
        image_path = f"generated/generated_image_{timestamp}.png"

        with open(image_path, "wb") as f:
            f.write(response.content)

        return {
            "message": "Image generated successfully!",
            "image_url": f"http://127.0.0.1:8000/{image_path}"
        }

    except Exception as e:
        return {"error": str(e)}
