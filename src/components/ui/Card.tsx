interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "section";
}

export function Card({ children, className = "", as: Tag = "div" }: CardProps) {
  return (
    <Tag className={`rounded-card bg-surface border border-border shadow-level2 p-lg ${className}`}>
      {children}
    </Tag>
  );
}
