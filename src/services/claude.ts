import type { Message, ModelId } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export class ClaudeApiError extends Error {
  statusCode?: number;
  errorType?: string;

  constructor(message: string, statusCode?: number, errorType?: string) {
    super(message);
    this.name = 'ClaudeApiError';
    this.statusCode = statusCode;
    this.errorType = errorType;
  }
}

interface BackendResponse {
  content: string;
  model: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface BackendErrorResponse {
  detail: string;
}

interface HealthResponse {
  status: string;
  anthropic_configured: boolean;
}

export async function checkBackendHealth(): Promise<{ healthy: boolean; anthropicConfigured: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) {
      return { healthy: false, anthropicConfigured: false };
    }
    const data = (await response.json()) as HealthResponse;
    return {
      healthy: data.status === 'healthy',
      anthropicConfigured: data.anthropic_configured,
    };
  } catch {
    return { healthy: false, anthropicConfigured: false };
  }
}

export async function sendMessage(
  model: ModelId,
  messages: Message[],
  apiKey?: string
): Promise<{ content: string; inputTokens: number; outputTokens: number }> {
  const conversationHistory = messages.slice(0, -1).map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  const currentMessage = messages[messages.length - 1];
  if (!currentMessage) {
    throw new ClaudeApiError('No message to send');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: currentMessage.content,
        model,
        conversation_history: conversationHistory,
        api_key: apiKey || undefined,
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as BackendErrorResponse;
      throw new ClaudeApiError(
        errorData.detail || `API request failed with status ${response.status}`,
        response.status
      );
    }

    const data = (await response.json()) as BackendResponse;

    return {
      content: data.content,
      inputTokens: data.usage.input_tokens,
      outputTokens: data.usage.output_tokens,
    };
  } catch (error) {
    if (error instanceof ClaudeApiError) {
      throw error;
    }
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ClaudeApiError('Cannot connect to backend. Please ensure the server is running.');
    }
    throw new ClaudeApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ClaudeApiError) {
    if (error.statusCode === 401) {
      return 'Backend API key is invalid. Please check the server configuration.';
    }
    if (error.statusCode === 429) {
      return 'Rate limit exceeded. Please wait a moment and try again.';
    }
    if (error.statusCode === 500) {
      return 'Server error. Please try again later.';
    }
    if (error.statusCode === 503) {
      return 'Backend service unavailable. Please ensure the server is running.';
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
