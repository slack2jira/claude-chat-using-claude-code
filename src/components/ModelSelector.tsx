import { ChevronDown } from 'lucide-react';
import { MODELS } from '../types';
import type { ModelId } from '../types';

interface ModelSelectorProps {
  value: ModelId;
  onChange: (model: ModelId) => void;
  disabled?: boolean;
}

export function ModelSelector({ value, onChange, disabled }: ModelSelectorProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ModelId)}
        disabled={disabled}
        className="appearance-none bg-secondary text-secondary-foreground rounded-lg px-3 py-2 pr-8
                   text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring
                   disabled:cursor-not-allowed disabled:opacity-50"
      >
        {MODELS.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
      />
    </div>
  );
}
