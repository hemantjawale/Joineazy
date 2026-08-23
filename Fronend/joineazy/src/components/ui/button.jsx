import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white shadow-md hover:bg-primary-700 hover:shadow-lg",
        secondary: "bg-surface-100 text-surface-900 hover:bg-surface-200 border border-surface-200",
        outline: "border border-surface-300 bg-white text-surface-700 hover:bg-surface-50 hover:border-primary-300",
        ghost: "text-surface-600 hover:bg-surface-100 hover:text-surface-900",
        danger: "bg-danger text-white shadow-md hover:bg-red-600",
        success: "bg-success text-white shadow-md hover:bg-emerald-600",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
