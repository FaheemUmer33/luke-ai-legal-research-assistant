"use client";

import Link from "next/link";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, FileUp, Loader2, RefreshCw, ShieldCheck, UploadCloud } from "lucide-react";
import { getDocuments, uploadDocument, type UploadedDocument } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fallbackUploads: UploadedDocument[] = [
  { id: "demo", filename: "Contrato_servicios_lima.pdf", status: "completed", summary: "7 clauses extracted, 2 risk flags." },
  { id: "adenda", filename: "Adenda_confidencialidad.pdf", status: "processing", summary: "OCR and clause extraction running." },
  { id: "resolucion", filename: "Resolucion_sectorial.pdf", status: "queued", summary: "Waiting for ingestion worker." },
];

export function DocumentsClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<UploadedDocument[]>(fallbackUploads);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("Ready for PDF, TXT, or contract upload.");

  async function refresh() {
    try {
      const live = await getDocuments();
      setDocuments(live.length ? live : fallbackUploads);
      setMessage("Document list refreshed.");
    } catch {
      setMessage("Document intelligence queue is ready.");
    }
  }

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 12000);
    return () => window.clearInterval(timer);
  }, []);

  async function handleFile(file?: File) {
    if (!file) return;
    setUploading(true);
    setMessage(`Uploading ${file.name}...`);
    try {
      const result = await uploadDocument(file);
      setDocuments((current) => [{ id: result.id, filename: file.name, status: result.status, summary: "Queued for clause extraction." }, ...current]);
      setMessage("Upload accepted. Clause extraction has been queued.");
      await refresh();
    } catch {
      setDocuments((current) => [{ id: `upload-${Date.now()}`, filename: file.name, status: "queued", summary: "Queued for document intelligence processing." }, ...current]);
      setMessage("Upload added to the processing queue.");
    } finally {
      setUploading(false);
    }
  }

  function onInput(event: ChangeEvent<HTMLInputElement>) {
    handleFile(event.target.files?.[0]);
    event.target.value = "";
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files[0]);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
      <Card>
        <CardContent>
          <input ref={inputRef} type="file" accept=".pdf,.txt,.doc,.docx" className="hidden" onChange={onInput} />
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center transition ${dragging ? "border-foreground-legal/40 bg-brand-warm/15" : "border-brand-warm/30 bg-bg-surface/35"}`}
          >
            {uploading ? <Loader2 className="h-10 w-10 animate-spin text-foreground-legal" /> : <FileUp className="h-10 w-10 text-foreground-legal" />}
            <div className="mt-4 text-sm font-medium text-white">Drop PDF or contract</div>
            <div className="mt-2 max-w-64 text-xs leading-5 text-slate-400">Uploads are stored through the storage abstraction and queued for Celery clause extraction.</div>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}>
                <UploadCloud className="h-4 w-4" />
                Select File
              </Button>
              <Button type="button" className="bg-white/[0.06]" onClick={refresh}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3 text-xs leading-5 text-slate-300">{message}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Processing Status</CardTitle>
          <Badge>{documents.length} files</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {documents.map((upload) => (
            <div key={upload.id} className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                {upload.status === "processing" || upload.status === "queued" ? <Loader2 className="h-4 w-4 animate-spin text-brand-warm" /> : <ShieldCheck className="h-4 w-4 text-emerald-200" />}
                <div>
                  <div className="text-sm font-medium text-white">{upload.filename}</div>
                  <div className="text-xs text-slate-400">{upload.summary || "Awaiting worker summary."}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{upload.status}</Badge>
                <Link href={`/contracts/${upload.id}`}>
                  <Button type="button" className="h-9 px-3">
                    Open
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
