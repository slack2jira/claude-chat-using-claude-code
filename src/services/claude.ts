import type { Message, ModelId, ApiResponse, ApiError } from '../types';

const API_URL = 'https://api.anthropic.com/v1/messages';
const API_VERSION = '2023-06-01';

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

export async function sendMessage(
  apiKey: string,
  model: ModelId,
  messages: Message[]
): Promise<{ content: string; inputTokens: number; outputTokens: number }> {
  if (!apiKey) {
    throw new ClaudeApiError('API key is required');
  }

  const formattedMessages = messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': API_VERSION,
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        messages: formattedMessages,
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as ApiError;
      throw new ClaudeApiError(
        errorData.error?.message || `API request failed with status ${response.status}`,
        response.status,
        errorData.error?.type
      );
    }

    const data = (await response.json()) as ApiResponse;

    const textContent = data.content.find((c) => c.type === 'text');
    if (!textContent) {
      throw new ClaudeApiError('No text content in response');
    }

    return {
      content: textContent.text,
      inputTokens: data.usage.input_tokens,
      outputTokens: data.usage.output_tokens,
    };
  } catch (error) {
    if (error instanceof ClaudeApiError) {
      throw error;
    }
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ClaudeApiError('Network error. Please check your internet connection.');
    }
    throw new ClaudeApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ClaudeApiError) {
    if (error.statusCode === 401) {
      return 'Invalid API key. Please check your API key and try again.';
    }
    if (error.statusCode === 429) {
      return 'Rate limit exceeded. Please wait a moment and try again.';
    }
    if (error.statusCode === 500) {
      return 'Server error. Please try again later.';
    }
    if (error.errorType === 'overloaded_error') {
      return 'The API is currently overloaded. Please try again later.';
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
