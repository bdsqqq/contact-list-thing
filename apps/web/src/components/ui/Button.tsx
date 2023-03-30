import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";

import { cn } from "~/utils/styleHelpers";

const buttonVariants = cva(
  "gap-1 font-semibold focus:ring-2 focus:ring-white/20 focus:outline-none inline-flex items-center border justify-center select-none disabled:cursor-not-allowed disabled:opacity-70 transition ease-in-out duration-200 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black focus:bg-white/90 disabled:hover:bg-white hover:bg-white/90 ",
        destructive:
          "bg-red-4 border-red-1 text-red-11 hover:bg-red-5 focus:ring-red-7 focus:bg-red-6 disabled:hover:bg-red-4",
        outline:
          "bg-slate-4 border-slate-6 text-slate-11 hover:bg-slate-5 focus:bg-slate-6 disabled:hover:bg-slate-4",
        ghost:
          "bg-slate-1 border-slate-1 text-slate-11 hover:bg-slate-5 focus:bg-slate-6 disabled:hover:bg-slate-1",
        link: "bg-slate-1 border-slate-1 underline-offset-4 hover:underline text-slate-11 hover:text-slate-12 focus:text-slate-12 hover:bg-slate-1",
      },
      size: {
        default: "text-sm h-8 pl-2 pr-3 rounded-md",
        sm: "h-6 px-2 rounded",
      },
      square: {
        true: "align-middle",
      },
    },
    compoundVariants: [
      {
        square: true,
        size: "default",
        className: "h-8 w-8",
      },
      {
        square: true,
        size: "sm",
        className: "h-6 w-6",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
