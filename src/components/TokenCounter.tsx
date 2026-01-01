import { Coins } from 'lucide-react';
import type { TokenUsage } from '../types';

interface TokenCounterProps {
  usage: TokenUsage;
}

export function TokenCounter({ usage }: TokenCounterProps) {
  const formatCost = (cost: number) => {
    if (cost < 0.01) {
      return `$${cost.toFixed(4)}`;
    }
    return `$${cost.toFixed(2)}`;
  };

  const formatTokens = (tokens: number) => {
    if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(1)}k`;
    }
    return tokens.toString();
  };

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 rounded-lg px-3 py-1.5">
      <Coins size={14} />
      <span>
        {formatTokens(usage.inputTokens)} in / {formatTokens(usage.outputTokens)} out
      </span>
      <span className="text-primary font-medium">{formatCost(usage.totalCost)}</span>
    </div>
  );
}
