from anthropic import Anthropic
from pydantic import BaseModel

from app.config import get_settings
from typing import List
from typing import Optional

class Message(BaseModel):
    """A single message in the conversation."""
    role: str
    content: str


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    message: str
    model: str = "claude-sonnet-4-20250514"
    conversation_history: List[Message] = []
    api_key: Optional[str] = None  # Optional: if provided, use this; otherwise fallback to .env


class UsageInfo(BaseModel):
    """Token usage information."""
    input_tokens: int
    output_tokens: int


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""
    content: str
    model: str
    usage: UsageInfo


class ModelInfo(BaseModel):
    """Model information."""
    id: str
    name: str


AVAILABLE_MODELS: List[ModelInfo] = [
    ModelInfo(id="claude-sonnet-4-20250514", name="Claude Sonnet 4"),
    ModelInfo(id="claude-opus-4-20250514", name="Claude Opus 4"),
    ModelInfo(id="claude-haiku-4-20250514", name="Claude Haiku 4"),
]


class ClaudeService:
    """Service for interacting with Claude API."""

    def __init__(self):
        settings = get_settings()
        # Default client using .env key (for debugging/fallback)
        self.default_api_key = settings.anthropic_api_key
        self.client = Anthropic(api_key=self.default_api_key) if self.default_api_key else None

    def _get_client(self, api_key: Optional[str] = None) -> Anthropic:
        """Get Anthropic client - uses provided key or falls back to .env key."""
        if api_key:
            return Anthropic(api_key=api_key)
        if self.client:
            return self.client
        raise ValueError("No API key provided and no default key configured in .env")

    async def send_message(self, request: ChatRequest) -> ChatResponse:
        """Send a message to Claude and return the response."""
        client = self._get_client(request.api_key)

        messages = [
            {"role": msg.role, "content": msg.content}
            for msg in request.conversation_history
        ]
        messages.append({"role": "user", "content": request.message})

        response = client.messages.create(
            model=request.model,
            max_tokens=4096,
            messages=messages,
        )

        content = ""
        for block in response.content:
            if hasattr(block, "text"):
                content += block.text

        return ChatResponse(
            content=content,
            model=response.model,
            usage=UsageInfo(
                input_tokens=response.usage.input_tokens,
                output_tokens=response.usage.output_tokens,
            ),
        )

    def get_models(self) -> List[ModelInfo]:
        """Return list of available models."""
        return AVAILABLE_MODELS
