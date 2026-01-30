from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import art, poetry, music 
from app.routes import auth
from app.database import Base, engine

Base.metadata.create_all(bind=engine)


app = FastAPI(title="AI Creative Studio")
app.include_router(auth.router)

# Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 REQUIRED: Serve generated images
app.mount("/generated", StaticFiles(directory="generated"), name="generated")

app.include_router(art.router)
app.include_router(poetry.router)
app.include_router(music.router)

@app.get("/")
def home():
    return {"message": "AI Creative Studio backend is running!"}
