import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder = 'Type a message...' }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-3 items-end p-4 border-t border-border bg-background">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm
                   placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring
                   disabled:cursor-not-allowed disabled:opacity-50 max-h-[200px]"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !message.trim()}
        className="flex-shrink-0 h-11 w-11 rounded-xl bg-primary text-primary-foreground
                   flex items-center justify-center transition-colors
                   hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Send message"
      >
        <Send size={20} />
      </button>
    </div>
  );
}
