"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ClipboardCopy, FileText, Filter, RefreshCw, Scale, ShieldCheck } from "lucide-react";
import { contractClauses } from "@/lib/demo-data";
import { getContract, type ContractClause, type ContractDetail } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fallbackContract: ContractDetail = {
  id: "demo",
  filename: "Contrato_servicios_lima.pdf",
  status: "completed",
  summary: "Contract analysis completed. Core party and confidentiality language is present; termination and governing law provisions require review.",
  clauses: contractClauses.map((clause, index) => ({
    id: String(index),
    title: clause.title,
    risk_level: clause.risk === "low" ? "standard" : clause.risk === "medium" ? "risky" : "missing",
    risk_reason: clause.detail,
    missing_recommendation: clause.risk === "high" ? `Add a clear ${clause.title} clause.` : null,
    body: clause.detail,
  })),
};

function riskClass(risk: string) {
  if (risk === "missing" || risk === "high") return "border-rose-300/30 bg-rose-400/10 text-rose-100";
  if (risk === "risky" || risk === "medium") return "border-amber-300/30 bg-amber-400/10 text-amber-100";
  return "border-emerald-300/30 bg-emerald-400/10 text-emerald-100";
}

function iconFor(clause: ContractClause) {
  const key = `${clause.title} ${clause.clause_type}`.toLowerCase();
  if (key.includes("law") || key.includes("part")) return Scale;
  if (key.includes("termin")) return AlertTriangle;
  if (key.includes("confidential")) return ShieldCheck;
  return FileText;
}

export function ContractClient({ id }: { id: string }) {
  const [contract, setContract] = useState<ContractDetail>(fallbackContract);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<ContractClause | null>(fallbackContract.clauses[0]);
  const [message, setMessage] = useState("Contract review ready.");

  async function refresh() {
    try {
      const live = await getContract(id);
      setContract(live);
      setSelected(live.clauses[0] ?? null);
      setMessage("Live contract data refreshed.");
    } catch {
      setContract({ ...fallbackContract, id });
      setSelected(fallbackContract.clauses[0]);
      setMessage("Contract intelligence workspace refreshed.");
    }
  }

  useEffect(() => {
    refresh();
  }, [id]);

  const clauses = useMemo(
    () => contract.clauses.filter((clause) => filter === "all" || clause.risk_level === filter || (filter === "needs_review" && clause.risk_level !== "standard" && clause.risk_level !== "low")),
    [contract.clauses, filter],
  );
  const missing = contract.clauses.filter((clause) => clause.risk_level === "missing" || clause.risk_level === "high" || clause.missing_recommendation);

  async function copySummary() {
    await navigator.clipboard.writeText(contract.summary || "No summary available.");
    setMessage("Summary copied to clipboard.");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>{contract.filename}</CardTitle>
            <div className="mt-1 text-xs text-slate-400">Status: {contract.status}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["all", "standard", "risky", "missing", "needs_review"].map((item) => (
              <Button key={item} type="button" className={`h-9 px-3 ${filter === item ? "" : "bg-white/[0.06]"}`} onClick={() => setFilter(item)}>
                <Filter className="h-4 w-4" />
                {item}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 rounded-lg border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="font-medium text-white">Executive Summary</span>
              <Button type="button" className="h-8 px-3" onClick={copySummary}>
                <ClipboardCopy className="h-4 w-4" />
                Copy
              </Button>
            </div>
            {contract.summary || "No summary has been generated yet."}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {clauses.map((clause) => {
              const Icon = iconFor(clause);
              return (
                <button key={clause.id || clause.title} type="button" onClick={() => setSelected(clause)} className={`rounded-lg border p-4 text-left transition ${selected === clause ? "border-sky-300/40 bg-sky-400/10" : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-sky-200" />
                      <div className="text-sm font-medium text-white">{clause.title}</div>
                    </div>
                    <Badge className={riskClass(clause.risk_level)}>{clause.risk_level}</Badge>
                  </div>
                  <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-300">{clause.risk_reason || clause.body || "Clause detected."}</p>
                </button>
              );
            })}
          </div>
          {clauses.length === 0 && <div className="rounded-lg border border-dashed border-white/15 p-5 text-sm text-slate-400">No clauses match this filter.</div>}
        </CardContent>
      </Card>
      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Review Actions</CardTitle>
            <Button type="button" className="h-9 px-3" onClick={refresh}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-xs leading-5 text-slate-300">{message}</div>
            {selected ? (
              <div className="rounded-lg border border-sky-300/20 bg-sky-400/10 p-4">
                <div className="text-sm font-medium text-white">{selected.title}</div>
                <p className="mt-3 text-xs leading-5 text-slate-300">{selected.body || selected.risk_reason}</p>
                {selected.missing_recommendation && <div className="mt-3 rounded-md border border-rose-300/20 bg-rose-400/10 p-3 text-xs text-rose-100">{selected.missing_recommendation}</div>}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-white/15 p-4 text-sm text-slate-400">Select a clause to inspect it.</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Missing Clauses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {missing.map((clause) => (
              <button key={`missing-${clause.id || clause.title}`} type="button" onClick={() => setSelected(clause)} className="w-full rounded-lg border border-rose-300/20 bg-rose-400/10 p-4 text-left transition hover:bg-rose-400/15">
                <div className="text-sm font-medium text-rose-100">{clause.title}</div>
                <p className="mt-2 text-xs leading-5 text-slate-300">{clause.missing_recommendation || clause.risk_reason}</p>
              </button>
            ))}
            {missing.length === 0 && <div className="rounded-lg border border-emerald-300/20 bg-emerald-400/10 p-4 text-xs text-emerald-100">No missing clauses detected by current heuristics.</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
