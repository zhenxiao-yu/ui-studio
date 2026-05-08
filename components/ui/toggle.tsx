"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";

import { cn } from "@/lib/utils";

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>
>(({ className, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-primary-grey-300 transition-colors",
      "hover:bg-primary-grey-200 hover:text-white",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-green",
      "data-[state=on]:bg-primary-green data-[state=on]:text-primary-black",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle };
