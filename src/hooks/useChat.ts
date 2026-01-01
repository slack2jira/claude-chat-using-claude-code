import { useState, useCallback, useEffect } from 'react';
import { MODELS } from '../types';
import type { Message, ModelId, Conversation, TokenUsage } from '../types';
import { sendMessage, getErrorMessage } from '../services/claude';
import {
  generateId,
  saveConversation,
  getConversation,
  clearConversation,
} from '../utils/storage';

const DEFAULT_MODEL: ModelId = 'claude-sonnet-4-20250514';

function isValidModel(model: string): model is ModelId {
  return MODELS.some((m) => m.id === model);
}

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  tokenUsage: TokenUsage;
  sendUserMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  setModel: (model: ModelId) => void;
  currentModel: ModelId;
}

export function useChat(initialModel: ModelId, apiKey?: string): UseChatReturn {
  const [conversation, setConversation] = useState<Conversation>(() => {
    const saved = getConversation();
    if (saved) {
      // Validate the saved model - if invalid, use the initialModel or default
      const validModel = isValidModel(saved.model) ? saved.model : (isValidModel(initialModel) ? initialModel : DEFAULT_MODEL);
      return {
        ...saved,
        model: validModel,
      };
    }

    // Validate initialModel as well
    const validInitialModel = isValidModel(initialModel) ? initialModel : DEFAULT_MODEL;
    return {
      id: generateId(),
      messages: [],
      model: validInitialModel,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tokenUsage: TokenUsage = conversation.messages.reduce(
    (acc, msg) => {
      const model = MODELS.find((m) => m.id === conversation.model);
      if (!model) return acc;

      const inputTokens = acc.inputTokens + (msg.inputTokens || 0);
      const outputTokens = acc.outputTokens + (msg.outputTokens || 0);
      const totalCost =
        (inputTokens / 1000) * model.inputCostPer1k +
        (outputTokens / 1000) * model.outputCostPer1k;

      return { inputTokens, outputTokens, totalCost };
    },
    { inputTokens: 0, outputTokens: 0, totalCost: 0 }
  );

  useEffect(() => {
    if (conversation.messages.length > 0) {
      saveConversation(conversation);
    }
  }, [conversation]);

  const sendUserMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      setError(null);

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      setConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        updatedAt: new Date(),
      }));

      setIsLoading(true);

      try {
        const messagesForApi = [...conversation.messages, userMessage];
        const response = await sendMessage(conversation.model, messagesForApi, apiKey);

        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: response.content,
          timestamp: new Date(),
          inputTokens: response.inputTokens,
          outputTokens: response.outputTokens,
        };

        setConversation((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          updatedAt: new Date(),
        }));
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    },
    [conversation.messages, conversation.model, isLoading, apiKey]
  );

  const clearChat = useCallback(() => {
    clearConversation();
    setConversation({
      id: generateId(),
      messages: [],
      model: conversation.model,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setError(null);
  }, [conversation.model]);

  const setModel = useCallback((model: ModelId) => {
    setConversation((prev) => ({
      ...prev,
      model,
      updatedAt: new Date(),
    }));
  }, []);

  return {
    messages: conversation.messages,
    isLoading,
    error,
    tokenUsage,
    sendUserMessage,
    clearChat,
    setModel,
    currentModel: conversation.model,
  };
}
