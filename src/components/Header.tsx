import { Sun, Moon, Trash2, Download, FileJson, FileText } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { ModelId, TokenUsage, Conversation } from '../types';
import { ModelSelector } from './ModelSelector';
import { TokenCounter } from './TokenCounter';
import { ApiKeyInput } from './ApiKeyInput';
import { exportAsJson, exportAsMarkdown, downloadFile } from '../utils/storage';

interface HeaderProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  model: ModelId;
  onModelChange: (model: ModelId) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onClearChat: () => void;
  tokenUsage: TokenUsage;
  conversation: Conversation;
  isLoading: boolean;
}

export function Header({
  apiKey,
  onApiKeyChange,
  model,
  onModelChange,
  isDarkMode,
  onToggleDarkMode,
  onClearChat,
  tokenUsage,
  conversation,
  isLoading,
}: HeaderProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportJson = () => {
    const content = exportAsJson(conversation);
    const filename = `claude-chat-${new Date().toISOString().slice(0, 10)}.json`;
    downloadFile(content, filename, 'application/json');
    setShowExportMenu(false);
  };

  const handleExportMarkdown = () => {
    const content = exportAsMarkdown(conversation);
    const filename = `claude-chat-${new Date().toISOString().slice(0, 10)}.md`;
    downloadFile(content, filename, 'text/markdown');
    setShowExportMenu(false);
  };

  const hasMessages = conversation.messages.length > 0;

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-foreground">Claude Chat</h1>
            <ModelSelector value={model} onChange={onModelChange} disabled={isLoading} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ApiKeyInput value={apiKey} onChange={onApiKeyChange} />

            <TokenCounter usage={tokenUsage} />

            <div className="flex items-center gap-1">
              <div className="relative" ref={exportMenuRef}>
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  disabled={!hasMessages}
                  className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80
                             transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Export conversation"
                >
                  <Download size={18} />
                </button>

                {showExportMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg py-1 z-10 min-w-[140px]">
                    <button
                      onClick={handleExportJson}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-card-foreground hover:bg-secondary transition-colors"
                    >
                      <FileJson size={16} />
                      Export JSON
                    </button>
                    <button
                      onClick={handleExportMarkdown}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-card-foreground hover:bg-secondary transition-colors"
                    >
                      <FileText size={16} />
                      Export Markdown
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={onClearChat}
                disabled={!hasMessages}
                className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground
                           transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Clear conversation"
              >
                <Trash2 size={18} />
              </button>

              <button
                onClick={onToggleDarkMode}
                className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
