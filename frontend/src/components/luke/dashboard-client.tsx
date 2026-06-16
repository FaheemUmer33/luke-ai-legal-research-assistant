"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { alerts, recentQuestions, stats } from "@/lib/demo-data";
import { getAdminHealth, type AdminHealth } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { OrbitalDepth } from "@/components/luke/orbital-depth";

export function DashboardClient() {
  const [health, setHealth] = useState<AdminHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedAlert, setSelectedAlert] = useState(alerts[0]);

  async function refresh() {
    setLoading(true);
    try {
      setHealth(await getAdminHealth());
    } catch {
      setHealth({ sources: 5, documents: 3, chunks: 12, regulatory_updates: 4, rag_policy: "citation_first_operational" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const filteredQuestions = useMemo(
    () => recentQuestions.filter((question) => question.toLowerCase().includes(filter.toLowerCase())),
    [filter],
  );

  const liveStats = [
    { ...stats[0], value: loading ? "..." : String(health?.sources ?? stats[0].value), trend: "registered legal sources" },
    { ...stats[1], value: "strict", trend: health?.rag_policy ?? "citation validation" },
    { ...stats[2], value: loading ? "..." : String(health?.documents ?? stats[2].value), trend: "stored legal and contract docs" },
    { ...stats[3], value: loading ? "..." : String(health?.regulatory_updates ?? stats[3].value), trend: "regulatory update rows" },
  ];

  return (
    <div className="relative">
      <section className="relative mb-5 overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(15,23,42,0.52))] p-5 shadow-2xl shadow-black/30 md:p-7">
        <OrbitalDepth />
        <div className="relative z-10 max-w-3xl">
          <Badge className="border-violet-300/20 bg-violet-400/10 text-violet-100">Enterprise legal intelligence</Badge>
          <h2 className="mt-4 text-2xl font-semibold tracking-normal text-white md:text-4xl">A citation-controlled research cockpit for Peruvian legal teams.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            LUKE brings research, contract review, source governance, and regulatory monitoring into one evidence-first workspace designed for professional legal operations.
          </p>
          <div className="mt-5 grid max-w-2xl gap-3 sm:grid-cols-3">
            {["Citation gate", "Contract review", "Source registry"].map((item) => (
              <div key={item} className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-3 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Link href="/research">
          <Button>
            <Search className="h-4 w-4" />
            Start Research
          </Button>
        </Link>
        <Button type="button" className="bg-white/[0.06]" onClick={refresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Metrics
        </Button>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {liveStats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Card>
              <CardContent>
                <stat.icon className="h-5 w-5 text-sky-200" />
                {loading ? <Skeleton className="mt-5 h-9 w-24" /> : <div className="mt-5 text-3xl font-semibold text-white">{stat.value}</div>}
                <div className="mt-2 text-sm text-slate-300">{stat.label}</div>
                <div className="mt-3 text-xs text-slate-500">{stat.trend}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>
      <section className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle>Recent Legal Questions</CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input className="pl-9" value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Filter questions" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredQuestions.map((question) => (
              <Link key={question} href={`/research?question=${encodeURIComponent(question)}`} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-200 transition hover:border-sky-300/30 hover:bg-sky-400/10">
                <span>{question}</span>
                <ArrowRight className="h-4 w-4 text-sky-200" />
              </Link>
            ))}
            {filteredQuestions.length === 0 && <div className="rounded-lg border border-dashed border-white/15 p-5 text-sm text-slate-400">No questions match that filter.</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Regulatory Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <button key={alert.title} type="button" onClick={() => setSelectedAlert(alert)} className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-violet-300/30 hover:bg-violet-400/10">
                <div>
                  <div className="text-sm font-medium text-white">{alert.title}</div>
                  <div className="text-xs text-slate-400">{alert.source}</div>
                </div>
                <Badge>{alert.severity}</Badge>
              </button>
            ))}
            <div className="rounded-lg border border-emerald-300/20 bg-emerald-400/10 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-100">
                <ShieldCheck className="h-4 w-4" />
                {selectedAlert.title}
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-300">Selected feed is ready for ingestion review. Source reliability is enforced before legal answers can cite it.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
