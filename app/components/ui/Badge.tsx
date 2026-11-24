type BadgeVariant = "default" | "accent";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
};

export default function Badge({
  children,
  variant = "default",
}: BadgeProps) {
  const variantStyles = {
    default:
      "border border-white/10 bg-white/5 text-gray-200 transition-colors hover:border-[#bc0202]/50",
    accent:
      "border border-[#830000]/60 bg-[#830000]/20 text-[#ff0000] font-bold uppercase tracking-wider",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
