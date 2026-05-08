"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-primary-grey-200">
      <SliderPrimitive.Range className="absolute h-full bg-primary-green" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      aria-label="Slider thumb"
      className="block h-3.5 w-3.5 rounded-full border border-primary-green bg-primary-black shadow transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green disabled:pointer-events-none disabled:opacity-50"
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
