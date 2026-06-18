import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-brand-warm/20 bg-bg-surface/55 px-4 text-sm font-medium text-foreground-legal shadow-lg shadow-black/20 transition hover:bg-bg-elevated/45 focus:outline-none focus:ring-2 focus:ring-brand-warm/45 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
