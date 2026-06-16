export const productSources = [
  {
    id: "constitution-peru",
    name: "Constitucion Politica del Peru",
    source_type: "constitution",
    base_url: "https://www.congreso.gob.pe/constitucion",
    authority_level: 100,
    freshness_priority: 10,
    reliability_score: 0.99,
    is_active: true,
  },
  {
    id: "el-peruano",
    name: "El Peruano",
    source_type: "law",
    base_url: "https://elperuano.pe",
    authority_level: 90,
    freshness_priority: 10,
    reliability_score: 0.985,
    is_active: true,
  },
  {
    id: "spij",
    name: "SPIJ",
    source_type: "law",
    base_url: "https://spij.minjus.gob.pe",
    authority_level: 88,
    freshness_priority: 9,
    reliability_score: 0.98,
    is_active: true,
  },
  {
    id: "minjus",
    name: "Ministerio de Justicia y Derechos Humanos",
    source_type: "ministry_guidance",
    base_url: "https://www.gob.pe/minjus",
    authority_level: 70,
    freshness_priority: 8,
    reliability_score: 0.94,
    is_active: true,
  },
  {
    id: "sunafil",
    name: "SUNAFIL",
    source_type: "agency_resolution",
    base_url: "https://www.gob.pe/sunafil",
    authority_level: 68,
    freshness_priority: 8,
    reliability_score: 0.93,
    is_active: true,
  },
];

export const productDocuments = [
  { id: "demo", filename: "Contrato_servicios_lima.pdf", status: "completed", summary: "7 clauses extracted, 2 risk flags identified." },
  { id: "adenda", filename: "Adenda_confidencialidad.pdf", status: "processing", summary: "OCR and clause extraction are running." },
  { id: "resolucion", filename: "Resolucion_sectorial.pdf", status: "queued", summary: "Queued for legal source ingestion." },
];

export const productContract = {
  id: "demo",
  filename: "Contrato_servicios_lima.pdf",
  status: "completed",
  summary:
    "The contract contains core party and confidentiality language, but the termination and governing law clauses need review before execution.",
  clauses: [
    {
      id: "parties",
      title: "Parties",
      clause_type: "parties",
      risk_level: "standard",
      risk_reason: "Legal identity and contracting parties appear complete.",
      body: "The contracting parties are identified with representative capacity and document references.",
    },
    {
      id: "confidentiality",
      title: "Confidentiality",
      clause_type: "confidentiality",
      risk_level: "risky",
      risk_reason: "The confidentiality scope is present but lacks a survival period.",
      body: "Confidential information is protected, but post-termination obligations should be clarified.",
    },
    {
      id: "termination",
      title: "Termination",
      clause_type: "termination",
      risk_level: "missing",
      risk_reason: "Termination mechanics are not sufficiently clear.",
      missing_recommendation: "Add notice period, cure window, and permitted termination events.",
      body: "The reviewed text does not provide a complete termination workflow.",
    },
    {
      id: "governing-law",
      title: "Governing Law",
      clause_type: "governing_law",
      risk_level: "missing",
      risk_reason: "No explicit Peruvian governing law clause was detected.",
      missing_recommendation: "Add explicit Peruvian law and competent jurisdiction language.",
      body: "The reviewed text does not identify governing law or forum.",
    },
  ],
};

export const productCitation = {
  document_name: "Codigo Civil Peruano - muestra controlada",
  section: "Articulo 1351",
  official_url: "https://spij.minjus.gob.pe/spij-ext-web/#/detallenorma/H682684",
  storage_uri: "seed://codigo-civil-muestra",
  quote:
    "Articulo 1351.- El contrato es el acuerdo de dos o mas partes para crear, regular, modificar o extinguir una relacion juridica patrimonial.",
};
