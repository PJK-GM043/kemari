interface BadgeProps {
  children: React.ReactNode;
  variant?: "positive" | "neutral" | "negative" | "accent" | "default";
  className?: string;
}

const badgeVariants = {
  positive: "bg-positive/10 text-positive",
  neutral: "bg-neutral/10 text-neutral",
  negative: "bg-negative/10 text-negative",
  accent: "bg-accent/10 text-accent",
  default: "bg-border/30 text-foreground-secondary",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 h-7 text-caption font-medium ${badgeVariants[variant]} ${className}`}>
      {children}
    </span>
  );
}
