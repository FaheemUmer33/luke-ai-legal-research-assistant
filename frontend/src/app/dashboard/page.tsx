import { LukeShell } from "@/components/luke/shell";
import { PageHeader } from "@/components/luke/page-header";
import { DashboardClient } from "@/components/luke/dashboard-client";

export default function DashboardPage() {
  return (
    <LukeShell>
      <PageHeader eyebrow="Operational Command" title="Citation-first legal intelligence for Peruvian law." description="Monitor source freshness, verified answers, contract risk, and regulatory ingestion from one enterprise-grade console." />
      <DashboardClient />
    </LukeShell>
  );
}
