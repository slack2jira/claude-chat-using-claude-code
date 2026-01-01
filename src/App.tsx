import { useState, useEffect, useCallback } from 'react';
import { Header, ChatWindow, ChatInput, ErrorMessage } from './components';
import { useChat } from './hooks/useChat';
import { useDarkMode } from './hooks/useDarkMode';
import { getSettings, saveSettings, getConversation, getApiKey, saveApiKey } from './utils/storage';
import { checkBackendHealth } from './services/claude';
import type { Conversation } from './types';

function App() {
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [apiKey, setApiKey] = useState(() => getApiKey());
  const initialModel = getSettings().selectedModel;

  const handleApiKeyChange = useCallback((key: string) => {
    setApiKey(key);
    saveApiKey(key);
  }, []);

  const {
    messages,
    isLoading,
    error,
    tokenUsage,
    sendUserMessage,
    clearChat,
    setModel,
    currentModel,
  } = useChat(initialModel, apiKey);

  const [localError, setLocalError] = useState<string | null>(null);
  const [backendHasKey, setBackendHasKey] = useState(false);

  useEffect(() => {
    async function checkHealth() {
      const { healthy, anthropicConfigured } = await checkBackendHealth();
      if (healthy) {
        setBackendStatus('connected');
        setBackendHasKey(anthropicConfigured);
      } else {
        setBackendStatus('disconnected');
        setLocalError('Cannot connect to backend. Please ensure the server is running at http://localhost:8000');
      }
    }
    checkHealth();
  }, []);

  // Determine if we can send messages (need either frontend key or backend key)
  const hasValidApiKey = apiKey.trim().length > 0 || backendHasKey;

  useEffect(() => {
    saveSettings({ selectedModel: currentModel });
  }, [currentModel]);

  const handleSend = useCallback(
    async (message: string) => {
      if (backendStatus !== 'connected') {
        setLocalError('Cannot send message. Backend is not connected.');
        return;
      }
      if (!hasValidApiKey) {
        setLocalError('Please enter your API key to send messages.');
        return;
      }
      setLocalError(null);
      await sendUserMessage(message);
    },
    [backendStatus, hasValidApiKey, sendUserMessage]
  );

  const handleClearError = useCallback(() => {
    setLocalError(null);
  }, []);

  const conversation: Conversation = {
    id: 'current',
    messages,
    model: currentModel,
    createdAt: getConversation()?.createdAt || new Date(),
    updatedAt: new Date(),
  };

  const displayError = localError || error;

  const getPlaceholder = () => {
    if (backendStatus === 'checking') return 'Connecting to backend...';
    if (backendStatus === 'disconnected') return 'Backend not connected. Please start the server.';
    if (!hasValidApiKey) return 'Enter your API key above to start chatting...';
    return 'Type a message... (Shift+Enter for new line)';
  };

  const canSend = backendStatus === 'connected' && hasValidApiKey;

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header
        model={currentModel}
        onModelChange={setModel}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onClearChat={clearChat}
        tokenUsage={tokenUsage}
        conversation={conversation}
        isLoading={isLoading}
        backendStatus={backendStatus}
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
      />

      <ChatWindow messages={messages} isLoading={isLoading} hasApiKey={canSend} />

      {displayError && <ErrorMessage message={displayError} onDismiss={handleClearError} />}

      <ChatInput
        onSend={handleSend}
        disabled={isLoading || !canSend}
        placeholder={getPlaceholder()}
      />
    </div>
  );
}

export default App;
