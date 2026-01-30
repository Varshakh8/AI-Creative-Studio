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

load_dotenv()

router = APIRouter(prefix="/music", tags=["Music"])

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")

API_URL = "https://api-inference.huggingface.co/models/Riffusion/riffusion-model-v1"
HEADERS = {
    "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
    "Content-Type": "application/json"
}

class MusicPrompt(BaseModel):
    prompt: str


@router.post("/generate-music")
async def generate_music(
    data: MusicPrompt,
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
        track_usage(db, user.id, "music")

        # 🎵 Generate music
        payload = {"inputs": data.prompt}
        response = requests.post(API_URL, headers=HEADERS, json=payload)

        if response.status_code != 200:
            return {"error": response.text}

        os.makedirs("generated", exist_ok=True)
        timestamp = int(time.time())
        music_path = f"generated/generated_music_{timestamp}.wav"

        with open(music_path, "wb") as f:
            f.write(response.content)

        return {
            "message": "Music generated successfully!",
            "music_url": f"http://127.0.0.1:8000/{music_path}"
        }

    except Exception as e:
        return {"error": str(e)}
