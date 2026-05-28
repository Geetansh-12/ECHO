import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "echo-button inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "echo-button-primary bg-gradient-to-r from-cyan-300 to-blue-500 text-slate-950 shadow-[0_0_34px_rgba(6,182,212,0.26)] hover:-translate-y-0.5 hover:shadow-[0_0_48px_rgba(6,182,212,0.42)]",
        secondary:
          "echo-button-secondary border border-white/10 bg-white/[0.045] text-slate-100 backdrop-blur-xl hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-white/[0.075]",
        ghost:
          "echo-button-ghost text-slate-300 hover:bg-white/[0.06] hover:text-white",
        danger:
          "echo-button-danger border border-red-400/30 bg-red-500/10 text-red-200 hover:bg-red-500/15",
      },
      size: {
        default: "h-10",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
