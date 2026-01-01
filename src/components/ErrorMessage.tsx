import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div className="mx-4 mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
      <AlertCircle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
      <p className="flex-1 text-sm text-destructive">{message}</p>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
        title="Dismiss error"
      >
        <X size={16} />
      </button>
    </div>
  );
}
