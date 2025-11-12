"use client";

import { type Easing, motion } from "motion/react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import HeroBadge from "@/components/ui/hero-badge";
import { cn } from "@/lib/utils";

const ease: Easing = [0.16, 1, 0.3, 1];

type HeroContentProps = {
  title: string;
  titleHighlight?: string;
  description: string;
  primaryAction?: {
    href: string;
    text: string;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    href: string;
    text: string;
    icon?: React.ReactNode;
  };
};

function HeroContent({
  title,
  titleHighlight,
  description,
  primaryAction,
  secondaryAction,
}: HeroContentProps) {
  return (
    <div className="flex flex-col space-y-4">
      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        className="heading font-bold tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.8, ease }}
      >
        {title}{" "}
        {titleHighlight && (
          <span className="text-primary">{titleHighlight}</span>
        )}
      </motion.h1>
      <motion.p
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl text-muted-foreground leading-normal sm:text-xl sm:leading-8"
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.1, duration: 0.8, ease }}
      >
        {description}
      </motion.p>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 pt-4 sm:flex-row"
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.2, duration: 0.8, ease }}
      >
        {primaryAction && (
          <Link
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full justify-center gap-2 sm:w-auto"
            )}
            href={primaryAction.href}
          >
            {primaryAction.icon}
            {primaryAction.text}
          </Link>
        )}
        {secondaryAction && (
          <Link
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full justify-center gap-2 sm:w-auto"
            )}
            href={secondaryAction.href}
          >
            {secondaryAction.icon}
            {secondaryAction.text}
          </Link>
        )}
      </motion.div>
    </div>
  );
}

type HeroProps = {
  pill?: {
    href?: string;
    text: string;
    icon?: React.ReactNode;
    endIcon?: React.ReactNode;
    variant?: "default" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    className?: string;
  };
  content: HeroContentProps;
  preview?: React.ReactNode;
};

const Hero = ({ pill, content, preview }: HeroProps) => (
  <div className="container relative overflow-hidden">
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center px-4 py-8 md:px-8 lg:flex-row lg:px-12">
      <div className="flex w-full flex-col gap-4 lg:max-w-2xl">
        {pill && <HeroBadge {...pill} />}
        <HeroContent {...content} />
      </div>
      {preview && (
        <div className="mt-12 w-full lg:mt-0 lg:max-w-xl lg:pl-16">
          {preview}
        </div>
      )}
    </div>
  </div>
);

export { Hero };
