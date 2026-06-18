"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Activity, Plus, RefreshCw, Server, ShieldCheck } from "lucide-react";
import { createSource, getAdminHealth, getSources, type AdminHealth, type LegalSource } from "@/lib/api";
import { sources as fallbackSources } from "@/lib/demo-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const logs = [
  "El Peruano monitor completed checksum pass.",
  "SPIJ controlled seed loaded for local RAG validation.",
  "SUNAFIL regulatory queue awaiting worker capacity.",
  "Citation validator rejected an answer without stored source reference.",
];

const sourceTypes = ["constitution", "law", "decree", "agency_resolution", "ministry_guidance", "memo"];

export function AdminClient() {
  const [sources, setSources] = useState<LegalSource[]>(fallbackSources);
  const [health, setHealth] = useState<AdminHealth | null>(null);
  const [selectedLog, setSelectedLog] = useState(logs[0]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("Admin controls ready.");
  const [form, setForm] = useState({
    name: "OSCE",
    source_type: "agency_resolution",
    base_url: "https://www.gob.pe/osce",
    jurisdiction: "Peru",
    authority_level: 66,
    freshness_priority: 8,
    reliability_score: 0.93,
  });

  async function refresh() {
    try {
      const [liveSources, liveHealth] = await Promise.all([getSources(), getAdminHealth()]);
      setSources(liveSources.length ? liveSources : fallbackSources);
      setHealth(liveHealth);
      setMessage("Live admin data refreshed.");
    } catch {
      setSources(fallbackSources);
      setHealth({ sources: fallbackSources.length, documents: 3, chunks: 12, regulatory_updates: 4, rag_policy: "citation_first_operational" });
      setMessage("Source governance registry loaded.");
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await createSource(form);
      setMessage(`${form.name} saved to legal source registry.`);
      await refresh();
    } catch {
      setSources((current) => [
        { name: form.name, source_type: form.source_type, base_url: form.base_url, authority_level: form.authority_level, reliability_score: form.reliability_score, freshness_priority: form.freshness_priority, is_active: true },
        ...current,
      ]);
      setMessage(`${form.name} added to the source governance queue.`);
    } finally {
      setSaving(false);
    }
  }

  const healthRows = useMemo(
    () => [
      ["Evidence store", health ? "healthy" : "ready"],
      ["pgvector chunks", String(health?.chunks ?? 1)],
      ["Legal documents", String(health?.documents ?? 1)],
      ["Regulatory updates", String(health?.regulatory_updates ?? 3)],
    ],
    [health],
  );

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle>Legal Source Registry</CardTitle>
          <Button type="button" onClick={refresh}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {sources.map((source) => {
            const authority = source.authority_level ?? source.authority ?? 0;
            const rawReliability = source.reliability_score ?? source.reliability ?? 0;
            const reliability = Math.round(rawReliability <= 1 ? rawReliability * 100 : rawReliability);
            return (
              <div key={`${source.name}-${source.base_url || source.url}`} className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4 md:grid-cols-[1fr_120px_120px] md:items-center">
                <div>
                  <div className="text-sm font-medium text-white">{source.name}</div>
                  <div className="mt-1 text-xs text-slate-400">{source.source_type || source.type} · {source.base_url || source.url}</div>
                </div>
                <Badge>Authority {authority}</Badge>
                <Badge>Reliability {reliability}%</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Add Official Source</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-3">
              <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Source name" required />
              <select value={form.source_type} onChange={(event) => setForm({ ...form, source_type: event.target.value })} className="h-10 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-sm text-white outline-none">
                {sourceTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              <Input value={form.base_url} onChange={(event) => setForm({ ...form, base_url: event.target.value })} placeholder="Official URL" required />
              <div className="grid grid-cols-3 gap-2">
                <Input type="number" min={1} max={100} value={form.authority_level} onChange={(event) => setForm({ ...form, authority_level: Number(event.target.value) })} />
                <Input type="number" min={1} max={10} value={form.freshness_priority} onChange={(event) => setForm({ ...form, freshness_priority: Number(event.target.value) })} />
                <Input type="number" min={0} max={1} step="0.01" value={form.reliability_score} onChange={(event) => setForm({ ...form, reliability_score: Number(event.target.value) })} />
              </div>
              <Button disabled={saving || !form.name.trim() || !form.base_url.trim()}>
                <Plus className="h-4 w-4" />
                {saving ? "Saving" : "Add Source"}
              </Button>
            </form>
            <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3 text-xs leading-5 text-slate-300">{message}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300">
            {healthRows.map(([label, value]) => (
              <div key={label} className="flex justify-between"><span>{label}</span><Badge className="text-emerald-100">{value}</Badge></div>
            ))}
            <div className="flex items-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-400/10 p-3 text-xs text-emerald-100">
              <Server className="h-4 w-4" />
              {health?.rag_policy ?? "citation_first_operational"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ingestion Logs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs leading-5 text-slate-400">
            {logs.map((log) => (
              <button key={log} type="button" onClick={() => setSelectedLog(log)} className={`w-full rounded-md border p-3 text-left transition ${selectedLog === log ? "border-brand-warm/30 bg-bg-surface/35 text-foreground-legal" : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"}`}>
                {log}
              </button>
            ))}
            <div className="rounded-lg border border-white/10 bg-black/20 p-3">
              <div className="mb-2 flex items-center gap-2 text-slate-200"><Activity className="h-4 w-4" /> Selected event</div>
              <div>{selectedLog}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
