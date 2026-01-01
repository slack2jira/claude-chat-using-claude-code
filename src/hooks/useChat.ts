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

export function useChat(apiKey: string, initialModel: ModelId): UseChatReturn {
  const [conversation, setConversation] = useState<Conversation>(() => {
    const saved = getConversation();
    if (saved) return saved;

    return {
      id: generateId(),
      messages: [],
      model: initialModel,
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
        const response = await sendMessage(apiKey, conversation.model, messagesForApi);

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
    [apiKey, conversation.messages, conversation.model, isLoading]
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
