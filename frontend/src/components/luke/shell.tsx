import Link from "next/link";
import { Activity, BookOpenCheck, FileText, LayoutDashboard, Menu, Settings, Scale } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/research", label: "Research", icon: BookOpenCheck },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/contracts/demo", label: "Contracts", icon: Scale },
  { href: "/admin", label: "Admin", icon: Settings },
] as const;

export function LukeShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-white/10 bg-slate-950/60 p-5 backdrop-blur-xl lg:block">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-sky-300/30 bg-sky-400/15">
            <Scale className="h-5 w-5 text-sky-200" />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-wide text-white">LUKE</div>
            <div className="text-xs text-slate-400">Peruvian legal intelligence</div>
          </div>
        </div>
        <nav className="mt-10 space-y-2">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-slate-300 transition hover:bg-white/[0.07] hover:text-white">
              <item.icon className="h-4 w-4 text-sky-200" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-emerald-300/20 bg-emerald-400/10 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-100">
            <Activity className="h-4 w-4" />
            Citation Gate Active
          </div>
          <p className="mt-2 text-xs leading-5 text-emerald-100/70">LLM output is blocked when verified sources cannot be validated.</p>
        </div>
      </aside>
      <div className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur-xl lg:hidden">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-sky-300/30 bg-sky-400/15">
                <Scale className="h-5 w-5 text-sky-200" />
              </div>
              <div>
                <div className="text-base font-semibold text-white">LUKE</div>
                <div className="text-xs text-slate-400">Legal intelligence</div>
              </div>
            </div>
            <Menu className="h-5 w-5 text-slate-200" />
          </summary>
          <nav className="mt-4 grid gap-2">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-slate-200">
                <item.icon className="h-4 w-4 text-sky-200" />
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
      <main className="relative z-10 px-4 py-5 lg:ml-72 lg:px-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
