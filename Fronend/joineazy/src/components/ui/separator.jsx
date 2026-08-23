import { cn } from "@/lib/utils";

function Separator({ className, orientation = "horizontal" }) {
  return (
    <div
      className={cn(
        "bg-surface-200 shrink-0",
        orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
        className
      )}
    />
  );
}

export { Separator };
