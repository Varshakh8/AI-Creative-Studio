from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, ForeignKey
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    is_admin = Column(Boolean, default=False)

    daily_limit = Column(Integer, default=10)
    used_today = Column(Integer, default=0)
    last_reset = Column(Date, nullable=True)

class AdminLog(Base):
    __tablename__ = "admin_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_username = Column(String)
    action = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class AIUsage(Base):
    __tablename__ = "ai_usage"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    feature = Column(String)
    count = Column(Integer, default=0)
