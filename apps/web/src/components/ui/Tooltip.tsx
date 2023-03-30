"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "~/utils/styleHelpers";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = ({ ...props }) => <TooltipPrimitive.Root {...props} />;
Tooltip.displayName = TooltipPrimitive.Tooltip.displayName;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "border-slate-6 bg-root __variable_6280c3 data-[side=top]:data-[state=delayed-open]:animate-open-slide-up-fade data-[side=top]:data-[state=closed]:animate-close-slide-down-fade data-[side=bottom]:data-[state=delayed-open]:animate-open-slide-down-fade data-[side=bottom]:data-[state=closed]:animate-close-slide-up-fade z-30 inline-flex max-w-[250px] select-none gap-2 rounded-md border px-2 py-1 font-sans text-sm",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
