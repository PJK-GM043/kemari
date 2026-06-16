interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: string;
}

export function Input({ value, onChange, placeholder, className = "", type = "text" }: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`h-12 rounded-button border border-border bg-surface px-4 text-body text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all ${className}`}
    />
  );
}
