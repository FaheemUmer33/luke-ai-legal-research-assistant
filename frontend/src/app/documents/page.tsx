import { LukeShell } from "@/components/luke/shell";
import { PageHeader } from "@/components/luke/page-header";
import { DocumentsClient } from "@/components/luke/documents-client";

export default function DocumentsPage() {
  return (
    <LukeShell>
      <PageHeader eyebrow="Document Intelligence" title="Upload contracts and official legal PDFs for controlled analysis." description="Contracts are stored, summarized, and decomposed into clauses with risk indicators and missing clause detection." />
      <DocumentsClient />
    </LukeShell>
  );
}
