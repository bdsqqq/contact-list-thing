import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/utils/styleHelpers";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const inputVariants = cva(
  "border-slate-6 bg-slate-4 text-slate-12 focus:ring-slate-7 placeholder:text-slate-11 relative h-8 w-full select-none appearance-none rounded-md border px-2 pl-[var(--text-field-left-slot-width)] pr-[var(--text-field-right-slot-width)] text-sm outline-none transition duration-200 ease-in-out focus:ring-2"
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input className={cn(inputVariants(), className)} ref={ref} {...props} />
    );
  }
);
Input.displayName = "Input";

export { Input };
