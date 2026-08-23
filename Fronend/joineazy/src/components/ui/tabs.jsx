import { cn } from "@/lib/utils";

function Tabs({ value, onValueChange, children, className }) {
  return (
    <div className={cn("w-full", className)}>
      {typeof children === "function" ? children({ value, onValueChange }) : children}
    </div>
  );
}

function TabsList({ className, children }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-xl bg-surface-100 p-1",
        className
      )}
    >
      {children}
    </div>
  );
}

function TabsTrigger({ value, activeValue, onValueChange, className, children }) {
  const isActive = value === activeValue;

  return (
    <button
      type="button"
      onClick={() => onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
        isActive
          ? "bg-white text-primary-700 shadow-sm"
          : "text-surface-500 hover:text-surface-700 hover:bg-white/50",
        className
      )}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, activeValue, className, children }) {
  if (value !== activeValue) return null;

  return (
    <div className={cn("mt-4 animate-fade-in", className)}>
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
