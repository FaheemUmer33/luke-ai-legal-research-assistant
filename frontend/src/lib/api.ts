export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type Citation = { document_name: string; section: string; official_url?: string; storage_uri?: string; quote: string };
export type LegalSource = {
  id?: string;
  name: string;
  source_type?: string;
  type?: string;
  base_url?: string;
  url?: string;
  authority_level?: number;
  authority?: number;
  reliability_score?: number;
  reliability?: number;
  freshness_priority?: number;
  is_active?: boolean;
};
export type UploadedDocument = { id: string; filename: string; status: string; summary?: string | null };
export type ContractClause = {
  id?: string;
  title: string;
  clause_type?: string;
  risk_level: string;
  risk_reason?: string | null;
  missing_recommendation?: string | null;
  body?: string;
};
export type ContractDetail = { id: string; filename: string; status: string; summary?: string | null; clauses: ContractClause[] };
export type AdminHealth = { sources: number; documents: number; chunks: number; regulatory_updates: number; rag_policy: string };

async function jsonFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: init?.body instanceof FormData ? init.headers : { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) throw new Error(`${path} failed with ${response.status}`);
  return response.json() as Promise<T>;
}

export async function askLuke(question: string) {
  return jsonFetch<{
    answer: string;
    status: string;
    refusal_reason?: string;
    citations: Citation[];
  }>("/api/research/ask", {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

export function getAdminHealth() {
  return jsonFetch<AdminHealth>("/api/admin/health");
}

export function getSources() {
  return jsonFetch<LegalSource[]>("/api/admin/sources");
}

export function createSource(payload: {
  name: string;
  source_type: string;
  base_url: string;
  jurisdiction: string;
  authority_level: number;
  freshness_priority: number;
  reliability_score: number;
}) {
  return jsonFetch<{ id: string }>("/api/admin/sources", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getDocuments() {
  return jsonFetch<UploadedDocument[]>("/api/documents");
}

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return jsonFetch<{ id: string; status: string }>("/api/documents/upload", {
    method: "POST",
    body: formData,
  });
}

export function getContract(id: string) {
  return jsonFetch<ContractDetail>(`/api/contracts/${id}`);
}
