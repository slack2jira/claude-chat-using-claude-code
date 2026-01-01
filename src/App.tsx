import { useState, useEffect, useCallback } from 'react';
import { Header, ChatWindow, ChatInput, ErrorMessage } from './components';
import { useChat } from './hooks/useChat';
import { useDarkMode } from './hooks/useDarkMode';
import { getSettings, saveSettings, getConversation } from './utils/storage';
import type { Conversation } from './types';

function App() {
  const [apiKey, setApiKey] = useState(() => getSettings().apiKey);
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const initialModel = getSettings().selectedModel;

  const {
    messages,
    isLoading,
    error,
    tokenUsage,
    sendUserMessage,
    clearChat,
    setModel,
    currentModel,
  } = useChat(apiKey, initialModel);

  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    saveSettings({ apiKey });
  }, [apiKey]);

  useEffect(() => {
    saveSettings({ selectedModel: currentModel });
  }, [currentModel]);

  const handleSend = useCallback(
    async (message: string) => {
      if (!apiKey) {
        setLocalError('Please enter your API key to send messages.');
        return;
      }
      setLocalError(null);
      await sendUserMessage(message);
    },
    [apiKey, sendUserMessage]
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

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        model={currentModel}
        onModelChange={setModel}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onClearChat={clearChat}
        tokenUsage={tokenUsage}
        conversation={conversation}
        isLoading={isLoading}
      />

      <ChatWindow messages={messages} isLoading={isLoading} hasApiKey={!!apiKey} />

      {displayError && <ErrorMessage message={displayError} onDismiss={handleClearError} />}

      <ChatInput
        onSend={handleSend}
        disabled={isLoading}
        placeholder={apiKey ? 'Type a message... (Shift+Enter for new line)' : 'Enter your API key to start chatting...'}
      />
    </div>
  );
}

export default App;
