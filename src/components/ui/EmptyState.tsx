interface EmptyStateProps {
  message: string;
  className?: string;
}

export function EmptyState({ message, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-3xl text-foreground-secondary ${className}`}>
      <span className="text-4xl mb-md opacity-40">📭</span>
      <p className="text-label">{message}</p>
    </div>
  );
}
