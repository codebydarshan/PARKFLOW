"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoOptional } from "@/features/demo/demo-provider";
import { cn } from "@/lib/utils";

interface StartDemoButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "secondary" | "ghost";
  label?: string;
}

export function StartDemoButton({
  className,
  size = "lg",
  variant = "default",
  label = "Start Live Demo",
}: StartDemoButtonProps) {
  const demo = useDemoOptional();

  return (
    <Button
      size={size}
      variant={variant}
      className={cn("gap-2", className)}
      data-demo-target="demo-start"
      onClick={() => demo?.start()}
    >
      <Play className="size-4 fill-current" aria-hidden="true" />
      {label}
    </Button>
  );
}
