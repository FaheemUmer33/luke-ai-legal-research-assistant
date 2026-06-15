import { LukeShell } from "@/components/luke/shell";
import { PageHeader } from "@/components/luke/page-header";
import { ContractClient } from "@/components/luke/contract-client";

export default async function ContractPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <LukeShell>
      <PageHeader eyebrow={`Contract ${id}`} title="Clause breakdown with risk and missing-term detection." description="The analyzer highlights legal drafting gaps while keeping source-backed legal research separate from uploaded contract intelligence." />
      <ContractClient id={id} />
    </LukeShell>
  );
}
