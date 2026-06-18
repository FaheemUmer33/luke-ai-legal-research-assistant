import { LukeShell } from "@/components/luke/shell";
import { PageHeader } from "@/components/luke/page-header";
import { ResearchConsole } from "@/components/luke/research-console";

export default async function ResearchPage({ searchParams }: { searchParams: Promise<{ question?: string }> }) {
  const { question } = await searchParams;
  return (
    <LukeShell>
      <PageHeader eyebrow="Legal Research" title="Ask only what verified sources can prove." description="The research engine retrieves trusted legal sources, ranks by authority, assembles evidence, then validates citations before showing an answer." />
      <ResearchConsole initialQuestion={question} />
    </LukeShell>
  );
}
