import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-sky-300/20 bg-sky-400/15 px-4 text-sm font-medium text-sky-50 shadow-lg shadow-sky-950/20 transition hover:bg-sky-400/25 focus:outline-none focus:ring-2 focus:ring-sky-300/40 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

