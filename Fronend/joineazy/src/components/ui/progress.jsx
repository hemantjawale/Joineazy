import { cn } from "@/lib/utils";

function Progress({ value = 0, className, size = "md" }) {
  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const getColor = (val) => {
    if (val >= 80) return "bg-success";
    if (val >= 50) return "bg-accent-500";
    if (val >= 25) return "bg-amber-500";
    return "bg-surface-400";
  };

  return (
    <div className={cn("w-full bg-surface-200 rounded-full overflow-hidden", sizes[size], className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500 ease-out", getColor(value))}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export { Progress };
