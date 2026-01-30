from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models import User

def check_and_increment_usage(user: User, db: Session, cost: int = 1):
    if user.is_admin:
        return

    if user.used_today + cost > user.daily_limit:
        raise HTTPException(
            status_code=403,
            detail="Daily AI usage limit reached"
        )

    user.used_today += cost
    db.commit()
