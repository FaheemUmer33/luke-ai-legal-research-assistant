import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-28 w-full resize-none rounded-md border border-accent-secondary/20 bg-bg-surface/35 p-3 text-sm leading-6 text-foreground-legal outline-none transition placeholder:text-muted-legal focus:border-brand-warm/50 focus:ring-2 focus:ring-brand-warm/20",
        props.className,
      )}
    />
  );
}
