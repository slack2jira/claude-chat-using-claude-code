export type ModelId = 'claude-sonnet-4-20250514' | 'claude-opus-4-20250514' | 'claude-3-5-haiku-20241022';

export interface Model {
  id: ModelId;
  name: string;
  inputCostPer1k: number;
  outputCostPer1k: number;
}

export const MODELS: Model[] = [
  {
    id: 'claude-sonnet-4-20250514',
    name: 'Claude Sonnet 4',
    inputCostPer1k: 0.003,
    outputCostPer1k: 0.015,
  },
  {
    id: 'claude-opus-4-20250514',
    name: 'Claude Opus 4',
    inputCostPer1k: 0.015,
    outputCostPer1k: 0.075,
  },
  {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude Haiku 3.5',
    inputCostPer1k: 0.0008,
    outputCostPer1k: 0.004,
  },
];

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  inputTokens?: number;
  outputTokens?: number;
}

export interface Conversation {
  id: string;
  messages: Message[];
  model: ModelId;
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
}

export interface ApiResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface ApiError {
  type: string;
  error: {
    type: string;
    message: string;
  };
}

export interface AppSettings {
  apiKey: string;
  selectedModel: ModelId;
  darkMode: boolean;
}
