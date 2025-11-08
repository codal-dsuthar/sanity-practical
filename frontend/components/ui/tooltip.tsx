"use client";

import {
  Content as TooltipContentPrimitive,
  Provider as TooltipProviderPrimitive,
  Root as TooltipRootPrimitive,
  Trigger as TooltipTriggerPrimitive,
} from "@radix-ui/react-tooltip";
import React from "react";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipProviderPrimitive;

const Tooltip = TooltipRootPrimitive;

const TooltipTrigger = TooltipTriggerPrimitive;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipContentPrimitive>,
  React.ComponentPropsWithoutRef<typeof TooltipContentPrimitive>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipContentPrimitive
    className={cn(
      "fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 animate-in overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-popover-foreground text-sm shadow-md data-[state=closed]:animate-out",
      className
    )}
    ref={ref}
    sideOffset={sideOffset}
    {...props}
  />
));
TooltipContent.displayName = TooltipContentPrimitive.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
