import * as React from "react";
import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-full rounded-md border border-accent-secondary/20 bg-bg-surface/35 px-3 text-sm text-foreground-legal outline-none transition placeholder:text-muted-legal focus:border-brand-warm/50 focus:ring-2 focus:ring-brand-warm/20",
        props.className,
      )}
    />
  );
}
