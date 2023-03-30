"use client";

import * as React from "react";
import {
  Combobox as AriakitComboBox,
  ComboboxItem as AriakitComboBoxItem,
  ComboboxPopover as AriakitComboBoxPopover,
  ComboboxProps as AriakitComboboxProps,
  ComboboxItemProps as AriakitComboboxItemProps,
  ComboboxPopoverProps as AriakitComboboxPopoverProps,
} from "ariakit/combobox";
import { VariantProps, cva } from "class-variance-authority";

import { cn } from "~/utils/styleHelpers";

import { inputVariants } from "~/components/ui/Input";

type ComboboxProps = AriakitComboboxProps & VariantProps<typeof inputVariants>;

const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <AriakitComboBox
        {...props}
        ref={ref}
        className={cn(inputVariants({ variant }), className)}
      />
    );
  }
);
Combobox.displayName = "Combobox";

const comboBoxItemVariants = cva(
  "flex h-8 items-center gap-2 rounded-md px-2 text-sm",
  {
    variants: {
      variant: {
        neutral:
          "text-slate-11 hover:bg-slate-5 hover:text-slate-12 data-[active-item]:bg-slate-7 data-[active-item]:text-slate-12",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

type ComboboxItemProps = AriakitComboboxItemProps &
  VariantProps<typeof comboBoxItemVariants>;

const ComboboxItem = React.forwardRef<HTMLDivElement, ComboboxItemProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <AriakitComboBoxItem
        {...props}
        ref={ref}
        className={cn(comboBoxItemVariants({ variant }), className)}
      />
    );
  }
);

ComboboxItem.displayName = "ComboboxItem";

const comboBoxPopoverVariants = cva(
  "border-slate-6 bg-root data-[placement=bottom-start]:data-[enter]:animate-open-slide-down-fade data-[placement=top-start]:data-[enter]:animate-open-slide-up-fade data-[placement=bottom-start]:data-[leave]:animate-close-slide-up-fade data-[placement=top-start]:data-[leave]:animate-close-slide-down-fade z-20 w-min rounded-lg border p-1 data-[placement=bottom-start]:origin-top-left data-[placement=top-start]:origin-bottom",
  {
    variants: {
      width: {
        min: "w-min",
        full: "w-full",
      },
    },
    defaultVariants: {
      width: "min",
    },
  }
);

type ComboboxPopoverProps = AriakitComboboxPopoverProps &
  VariantProps<typeof comboBoxPopoverVariants>;

const ComboboxPopover = React.forwardRef<HTMLDivElement, ComboboxPopoverProps>(
  ({ className, width, ...props }, ref) => {
    return (
      <AriakitComboBoxPopover
        {...props}
        ref={ref}
        className={cn(comboBoxPopoverVariants({ width }), className)}
      />
    );
  }
);

ComboboxPopover.displayName = "ComboboxPopover";

export { Combobox, ComboboxItem, ComboboxPopover };
