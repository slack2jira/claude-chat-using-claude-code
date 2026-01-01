# Claude Chat Backend

FastAPI backend that proxies requests to the Claude API.

## Setup

1. Create a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

5. Add your Anthropic API key to `.env`:
   ```
   ANTHROPIC_API_KEY=your-actual-api-key
   ```

## Running the Server

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/message` | Send message to Claude |
| GET | `/api/models` | List available models |
| GET | `/api/health` | Health check |

## API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Request/Response Examples

### POST /api/chat/message

Request:
```json
{
  "message": "Hello, Claude!",
  "model": "claude-sonnet-4-20250514",
  "conversation_history": []
}
```

Response:
```json
{
  "content": "Hello! How can I help you today?",
  "model": "claude-sonnet-4-20250514",
  "usage": {
    "input_tokens": 10,
    "output_tokens": 15
  }
}
```

### GET /api/models

Response:
```json
[
  {"id": "claude-sonnet-4-20250514", "name": "Claude Sonnet 4"},
  {"id": "claude-opus-4-20250514", "name": "Claude Opus 4"},
  {"id": "claude-haiku-4-20250514", "name": "Claude Haiku 4"}
]
```
