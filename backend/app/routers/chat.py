from fastapi import APIRouter, HTTPException

from app.services.claude_service import (
    ChatRequest,
    ChatResponse,
    ClaudeService,
    ModelInfo,
)
from app.config import get_settings
from typing import List

router = APIRouter(prefix="/api", tags=["chat"])

claude_service = ClaudeService()


@router.post("/chat/message", response_model=ChatResponse)
async def send_message(request: ChatRequest) -> ChatResponse:
    """Send a message to Claude and return the response."""
    try:
        return await claude_service.send_message(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/models", response_model=List[ModelInfo])
async def get_models() -> List[ModelInfo]:
    """Return list of available Claude models."""
    return claude_service.get_models()


@router.get("/health")
async def health_check() -> dict:
    """Health check endpoint."""
    settings = get_settings()
    return {
        "status": "healthy",
        "anthropic_configured": bool(settings.anthropic_api_key),
    }
