"use client";

import * as React from "react";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";

import { cn } from "@/lib/utils";

const Toolbar = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Root
    ref={ref}
    className={cn("flex items-center gap-1", className)}
    {...props}
  />
));
Toolbar.displayName = ToolbarPrimitive.Root.displayName;

const ToolbarButton = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Button>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Button> & {
    active?: boolean;
  }
>(({ className, active, ...props }, ref) => (
  <ToolbarPrimitive.Button
    ref={ref}
    data-active={active ? "" : undefined}
    className={cn(
      "inline-flex h-8 w-8 items-center justify-center rounded-md text-primary-grey-300 transition-colors",
      "hover:bg-primary-grey-200 hover:text-white",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-green",
      "data-[active]:bg-primary-green data-[active]:text-primary-black",
      className
    )}
    {...props}
  />
));
ToolbarButton.displayName = ToolbarPrimitive.Button.displayName;

const ToolbarSeparator = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Separator
    ref={ref}
    className={cn("mx-1 h-5 w-px bg-primary-grey-200", className)}
    {...props}
  />
));
ToolbarSeparator.displayName = ToolbarPrimitive.Separator.displayName;

export { Toolbar, ToolbarButton, ToolbarSeparator };
