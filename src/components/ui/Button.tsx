import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}

const variants = {
  primary: "bg-foreground text-background hover:opacity-90",
  secondary: "bg-surface text-foreground border border-border hover:bg-surface-elevated",
  ghost: "bg-transparent text-foreground hover:bg-surface",
  danger: "bg-negative text-white hover:opacity-90",
};

const sizes = {
  sm: "h-8 px-3 text-label",
  md: "h-10 px-5 text-label",
  lg: "h-12 px-7 text-body",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  disabled,
  className = "",
  type = "button",
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-button font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
