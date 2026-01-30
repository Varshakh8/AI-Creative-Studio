from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy import func
import re

from app.database import get_db
from app.models import User, AIUsage, AdminLog
from app.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)
from app.utils.admin_logger import log_admin_action

router = APIRouter(prefix="/auth", tags=["Auth"])

# ---------- Schemas ----------
class SignupData(BaseModel):
    username: str
    email: EmailStr
    password: str

class LoginData(BaseModel):
    username: str
    password: str

class UpdateProfile(BaseModel):
    username: str

class EmailUpdate(BaseModel):
    email: EmailStr

class UpdatePassword(BaseModel):
    old_password: str
    new_password: str

class DeleteAccount(BaseModel):
    password: str

# ---------- Password validation ----------
def validate_password(password: str):
    if len(password) < 8:
        raise HTTPException(400, "Password must be at least 8 characters")
    if not re.search(r"[A-Z]", password):
        raise HTTPException(400, "Password must contain uppercase")
    if not re.search(r"[a-z]", password):
        raise HTTPException(400, "Password must contain lowercase")
    if not re.search(r"[0-9]", password):
        raise HTTPException(400, "Password must contain number")
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise HTTPException(400, "Password must contain special char")

# ---------- Admin dependency ----------
def require_admin(user: User = Depends(get_current_user)):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ---------- Auth ----------
@router.post("/signup")
def signup(data: SignupData, db: Session = Depends(get_db)):
    validate_password(data.password)

    if db.query(User).filter(
        (User.username == data.username) | (User.email == data.email)
    ).first():
        raise HTTPException(400, "Username or email exists")

    user = User(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password)
    )
    db.add(user)
    db.commit()
    return {"message": "User created"}

@router.post("/login")
def login(data: LoginData, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(401, "Invalid credentials")

    token = create_access_token({"sub": user.username})

    return {
        "access_token": token,
        "token_type": "bearer",
        "is_admin": user.is_admin
    }

# ---------- Profile ----------
@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return {
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin
    }

# ---------- Admin ----------
@router.get("/admin/users")
def get_users(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    return [
        {"id": u.id, "username": u.username, "email": u.email, "is_admin": u.is_admin}
        for u in db.query(User).all()
    ]

@router.put("/admin/make-admin/{user_id}")
def make_admin(user_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).get(user_id)
    user.is_admin = True
    db.commit()
    log_admin_action(db, admin.username, f"Promoted {user.username}")
    return {"message": "Promoted"}

@router.delete("/admin/delete-user/{user_id}")
def delete_user(user_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).get(user_id)
    db.delete(user)
    db.commit()
    log_admin_action(db, admin.username, f"Deleted {user.username}")
    return {"message": "Deleted"}

@router.get("/admin/stats")
def stats(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    total = db.query(User).count()
    admins = db.query(User).filter(User.is_admin == True).count()
    return {
        "total_users": total,
        "total_admins": admins,
        "normal_users": total - admins
    }

@router.get("/admin/logs")
def logs(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    return [
        {
            "id": l.id,
            "admin_username": l.admin_username,
            "action": l.action,
            "timestamp": l.timestamp
        }
        for l in db.query(AdminLog).order_by(AdminLog.timestamp.desc()).all()
    ]

@router.get("/admin/usage")
def usage(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    data = (
        db.query(
            User.username,
            AIUsage.feature,
            func.sum(AIUsage.count).label("total")
        )
        .join(User, User.id == AIUsage.user_id)
        .group_by(User.username, AIUsage.feature)
        .all()
    )

    return [
        {"username": u, "feature": f, "total": t}
        for u, f, t in data
    ]

@router.put("/admin/reset-usage/{user_id}")
def reset(user_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).get(user_id)
    user.used_today = 0
    db.commit()
    return {"message": "Reset done"}
