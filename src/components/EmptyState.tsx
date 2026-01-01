import { MessageSquare } from 'lucide-react';

interface EmptyStateProps {
  hasApiKey: boolean;
}

export function EmptyState({ hasApiKey }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <MessageSquare size={32} className="text-primary" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">Start a conversation</h2>
      <p className="text-muted-foreground max-w-md">
        {hasApiKey
          ? 'Type a message below to start chatting with Claude. You can ask questions, get help with code, or just have a conversation.'
          : 'Enter your Anthropic API key above to get started. You can get an API key from the Anthropic Console.'}
      </p>
    </div>
  );
}
