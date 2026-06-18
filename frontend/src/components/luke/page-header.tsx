import { Badge } from "@/components/ui/badge";

export function PageHeader({ title, eyebrow, description }: { title: string; eyebrow: string; description: string }) {
  return (
    <header className="mb-6 pt-2">
      <Badge className="border-brand-warm/20 bg-bg-surface/35 text-foreground-legal">{eyebrow}</Badge>
      <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-normal text-white md:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">{description}</p>
    </header>
  );
}

