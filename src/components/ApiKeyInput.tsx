import { useState } from 'react';
import { Eye, EyeOff, Key } from 'lucide-react';

interface ApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ApiKeyInput({ value, onChange }: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="relative flex-1 max-w-xs">
      <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type={showKey ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter API key..."
        className="w-full bg-secondary text-secondary-foreground rounded-lg pl-9 pr-10 py-2
                   text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        type="button"
        onClick={() => setShowKey(!showKey)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
        title={showKey ? 'Hide API key' : 'Show API key'}
      >
        {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
