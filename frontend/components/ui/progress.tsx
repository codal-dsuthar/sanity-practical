"use client";

import {
  Indicator as ProgressIndicatorPrimitive,
  Root as ProgressRootPrimitive,
} from "@radix-ui/react-progress";
import React from "react";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressRootPrimitive>,
  React.ComponentPropsWithoutRef<typeof ProgressRootPrimitive>
>(({ className, value, ...props }, ref) => (
  <ProgressRootPrimitive
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    ref={ref}
    {...props}
  >
    <ProgressIndicatorPrimitive
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressRootPrimitive>
));
Progress.displayName = ProgressRootPrimitive.displayName;

export { Progress };
