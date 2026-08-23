import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

function Avatar({ name, className, size = "md" }) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const colors = [
    "bg-primary-100 text-primary-700",
    "bg-amber-100 text-amber-700",
    "bg-cyan-100 text-cyan-700",
    "bg-rose-100 text-rose-700",
    "bg-emerald-100 text-emerald-700",
    "bg-indigo-100 text-indigo-700",
  ];

  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold shrink-0",
        sizes[size],
        colors[colorIndex],
        className
      )}
    >
      {getInitials(name || "?")}
    </div>
  );
}

export { Avatar };
