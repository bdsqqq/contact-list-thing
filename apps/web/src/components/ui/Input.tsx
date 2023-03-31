import { VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/utils/styleHelpers";

export const inputVariants = cva(
  "placeholder:text-slate-11 relative h-8 w-full select-none appearance-none rounded-md border px-2 pl-[var(--text-field-left-slot-width)] pr-[var(--text-field-right-slot-width)] text-sm outline-none transition duration-200 ease-in-out focus:ring-2",
  {
    variants: {
      variant: {
        default: "border-slate-6 bg-slate-4 text-slate-12 focus:ring-slate-7",
        ghost:
          "bg-transparent border-none text-slate-12 placeholder:text-slate-11 focus:ring-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type InputProps = VariantProps<typeof inputVariants> &
  React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <input
        className={cn(inputVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
