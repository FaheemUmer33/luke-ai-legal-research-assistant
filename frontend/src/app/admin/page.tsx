import { LukeShell } from "@/components/luke/shell";
import { PageHeader } from "@/components/luke/page-header";
import { AdminClient } from "@/components/luke/admin-client";

export default function AdminPage() {
  return (
    <LukeShell>
      <PageHeader eyebrow="Admin Control Plane" title="Source registry, ingestion logs, and system health." description="Administrators control source authority, reliability, freshness priority, ingestion state, and operational integrity." />
      <AdminClient />
    </LukeShell>
  );
}
