from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import chat

app = FastAPI(
    title="Claude Chat API",
    description="FastAPI backend proxy for Claude API",
    version="1.0.0",
)

settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Claude Chat API", "docs": "/docs"}
