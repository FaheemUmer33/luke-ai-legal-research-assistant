"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Copy, ExternalLink, RotateCcw, Send, ShieldAlert, Sparkles } from "lucide-react";
import { askLuke, type Citation } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

const sampleQuestions = [
  "What is the legal definition of contract under civil law?",
  "Which verified source should be used before answering labor inspection questions?",
  "What happens when there is no verified legal source?",
];

export function ResearchConsole({ initialQuestion }: { initialQuestion?: string }) {
  const [question, setQuestion] = useState(initialQuestion || sampleQuestions[0]);
  const [answer, setAnswer] = useState("Ask a question. Law AI Solutions will retrieve verified sources before generating any legal answer.");
  const [status, setStatus] = useState("ready");
  const [citations, setCitations] = useState<Citation[]>([]);
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setStatus("retrieving");
    try {
      const result = await askLuke(question);
      setAnswer(result.answer);
      setStatus(result.status);
      setCitations(result.citations);
      setSelectedCitation(result.citations[0] ?? null);
    } catch {
      setAnswer("Insufficient verified legal sources");
      setStatus("validation required");
      setCitations([]);
    } finally {
      setLoading(false);
    }
  }

  async function copyAnswer() {
    await navigator.clipboard.writeText(answer);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  function reset() {
    setQuestion(sampleQuestions[0]);
    setAnswer("Ask a question. Law AI Solutions will retrieve verified sources before generating any legal answer.");
    setStatus("ready");
    setCitations([]);
    setSelectedCitation(null);
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
      <Card className="min-h-[620px]">
        <CardContent className="flex min-h-[620px] flex-col">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="text-sm font-medium text-white">Legal Q&A</div>
              <div className="text-xs text-slate-400">Retrieval, authority ranking, citation validation</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="capitalize">{status}</Badge>
              <Button type="button" className="h-9 bg-white/[0.06] px-3" onClick={copyAnswer}>
                <Copy className="h-4 w-4" />
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {sampleQuestions.map((sample) => (
              <button key={sample} type="button" onClick={() => setQuestion(sample)} className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-xs text-slate-300 transition hover:border-brand-warm/30 hover:text-white">
                {sample}
              </button>
            ))}
          </div>
          <div className="flex-1 py-6">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-white/10 bg-black/20 p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground-legal">
                  {status.includes("refused") || status.includes("failed") ? <ShieldAlert className="h-4 w-4 text-amber-200" /> : <Sparkles className="h-4 w-4 text-brand-warm" />}
                  AI Research Response
                </div>
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-200">{answer}</p>
              </motion.div>
            )}
          </div>
          <form onSubmit={submit} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <Textarea value={question} onChange={(event) => setQuestion(event.target.value)} />
            <div className="mt-3 flex flex-wrap justify-end gap-2">
              <Button type="button" className="bg-white/[0.06]" onClick={reset} disabled={loading}>
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button disabled={loading || !question.trim()}>
                <Send className="h-4 w-4" />
                Ask AI
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className="citation-glow">
        <CardContent>
          <div className="mb-4">
            <div className="text-sm font-semibold text-white">Citation Panel</div>
            <div className="text-xs text-slate-400">Document, article/section, and source reference</div>
          </div>
          <div className="space-y-3">
            {citations.length === 0 ? (
              <div className="rounded-lg border border-dashed border-white/15 p-5 text-sm leading-6 text-slate-400">No validated citations yet.</div>
            ) : (
              citations.map((citation, index) => (
                <motion.button key={`${citation.document_name}-${citation.section}`} type="button" onClick={() => setSelectedCitation(citation)} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.07 }} className={`w-full rounded-lg border p-4 text-left transition ${selectedCitation === citation ? "border-foreground-legal/40 bg-brand-warm/15" : "border-brand-warm/20 bg-bg-surface/35 hover:bg-bg-elevated/45"}`}>
                  <div className="text-sm font-medium text-white">{citation.document_name}</div>
                  <div className="mt-1 text-xs text-foreground-legal">{citation.section}</div>
                  <p className="mt-3 line-clamp-5 text-xs leading-5 text-slate-300">{citation.quote}</p>
                  <div className="mt-3 truncate text-xs text-slate-400">{citation.official_url || citation.storage_uri}</div>
                </motion.button>
              ))
            )}
          </div>
          <div className="mt-5 min-h-48 rounded-lg border border-white/10 bg-slate-950/70 p-4 text-xs text-slate-400">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-slate-200">Source Viewer</span>
              {selectedCitation?.official_url && (
                <a href={selectedCitation.official_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-brand-warm hover:text-white">
                  Open
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
            {selectedCitation ? (
              <div>
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
                  <div className="font-medium text-white">{selectedCitation.document_name}</div>
                  <div className="mt-1 text-foreground-legal">{selectedCitation.section}</div>
                  <p className="mt-3 leading-5 text-slate-300">{selectedCitation.quote}</p>
                </div>
                <div className="mt-3 truncate text-slate-500">{selectedCitation.official_url || selectedCitation.storage_uri}</div>
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-white/15 p-4 leading-5">Select a validated citation to inspect its stored excerpt and source reference.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
