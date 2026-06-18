import { Activity, AlertTriangle, BookOpenCheck, FileText, Scale, ShieldCheck } from "lucide-react";

export const stats = [
  { label: "Verified sources", value: "1,284", trend: "+18 this week", icon: BookOpenCheck },
  { label: "Citation pass rate", value: "99.2%", trend: "strict validation", icon: ShieldCheck },
  { label: "Contracts processed", value: "342", trend: "27 high-risk flags", icon: FileText },
  { label: "Regulatory monitors", value: "16", trend: "El Peruano + SPIJ", icon: Activity },
];

export const recentQuestions = [
  "What is the legal definition of contract under civil law?",
  "Which authority governs labor inspection sanctions?",
  "Can a commercial agreement omit termination language?",
];

export const alerts = [
  { title: "El Peruano monitor", source: "Official Gazette", severity: "Freshness priority 10" },
  { title: "SPIJ checksum audit", source: "MINJUSDH", severity: "No drift detected" },
  { title: "SUNAFIL update queue", source: "Regulatory agency", severity: "2 documents pending" },
];

export const sources = [
  { name: "Constitucion Politica del Peru", type: "constitution", authority: 100, reliability: 99, url: "congreso.gob.pe" },
  { name: "El Peruano", type: "official gazette", authority: 90, reliability: 98, url: "elperuano.pe" },
  { name: "SPIJ", type: "legal database", authority: 88, reliability: 98, url: "spij.minjus.gob.pe" },
  { name: "Ministerios", type: "ministry guidance", authority: 70, reliability: 94, url: "gob.pe" },
  { name: "Regulatory agencies", type: "agency resolutions", authority: 68, reliability: 93, url: "gob.pe/*" },
];

export const contractClauses = [
  { title: "Parties", risk: "low", detail: "Legal identity appears complete.", icon: Scale },
  { title: "Confidentiality", risk: "medium", detail: "Scope lacks survival period.", icon: FileText },
  { title: "Termination", risk: "high", detail: "Missing cure period and notice mechanics.", icon: AlertTriangle },
  { title: "Governing Law", risk: "high", detail: "No explicit governing law reference detected.", icon: ShieldCheck },
];
