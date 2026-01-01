import type { Message, AppSettings, Conversation } from '../types';

const STORAGE_KEYS = {
  API_KEY: 'claude-chat-api-key',
  CONVERSATION: 'claude-chat-conversation',
  SETTINGS: 'claude-chat-settings',
} as const;

export function saveApiKey(apiKey: string): void {
  localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
}

export function getApiKey(): string {
  return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
}

export function saveConversation(conversation: Conversation): void {
  const serialized = JSON.stringify({
    ...conversation,
    messages: conversation.messages.map((msg) => ({
      ...msg,
      timestamp: msg.timestamp.toISOString(),
    })),
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
  });
  localStorage.setItem(STORAGE_KEYS.CONVERSATION, serialized);
}

export function getConversation(): Conversation | null {
  const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATION);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      messages: parsed.messages.map((msg: Message & { timestamp: string }) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
      createdAt: new Date(parsed.createdAt),
      updatedAt: new Date(parsed.updatedAt),
    };
  } catch {
    return null;
  }
}

export function clearConversation(): void {
  localStorage.removeItem(STORAGE_KEYS.CONVERSATION);
}

export function saveSettings(settings: Partial<AppSettings>): void {
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
}

export function getSettings(): AppSettings {
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  const defaults: AppSettings = {
    apiKey: '',
    selectedModel: 'claude-sonnet-4-5-20250514',
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  };

  if (!stored) return defaults;

  try {
    return { ...defaults, ...JSON.parse(stored) };
  } catch {
    return defaults;
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function exportAsJson(conversation: Conversation): string {
  return JSON.stringify(
    {
      ...conversation,
      exportedAt: new Date().toISOString(),
    },
    null,
    2
  );
}

export function exportAsMarkdown(conversation: Conversation): string {
  const header = `# Claude Chat Export\n\nModel: ${conversation.model}\nDate: ${conversation.createdAt.toLocaleString()}\n\n---\n\n`;

  const messages = conversation.messages
    .map((msg) => {
      const role = msg.role === 'user' ? 'User' : 'Assistant';
      const timestamp = msg.timestamp.toLocaleString();
      return `## ${role}\n*${timestamp}*\n\n${msg.content}\n`;
    })
    .join('\n---\n\n');

  return header + messages;
}

export function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
