"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { FormEvent, MouseEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  CircleSlash,
  ClipboardCheck,
  FileSearch,
  Gavel,
  LockKeyhole,
  Mail,
  Scale,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const WorkflowVisualization = dynamic(
  () => import("@/components/law-ai/workflow-visualization").then((module) => module.WorkflowVisualization),
  {
    ssr: false,
    loading: () => <div className="h-[360px] rounded-lg border border-accent-secondary/20 bg-bg-surface/40" />,
  },
);

const navItems = [
  { label: "Benefits", href: "#benefits" },
  { label: "Services", href: "#services" },
  { label: "Workflow", href: "#workflow" },
  { label: "Cases", href: "#cases" },
];

const benefits = [
  {
    label: "Efficiency",
    value: 72,
    suffix: "%",
    detail: "Faster first-pass research and review by moving repetitive document work into controlled automation.",
    icon: BarChart3,
  },
  {
    label: "Accuracy",
    value: 99,
    suffix: "%",
    detail: "Evidence-linked outputs with citations, source status, and review checkpoints before action.",
    icon: ShieldCheck,
  },
  {
    label: "Cost control",
    value: 41,
    suffix: "%",
    detail: "Lower repetitive review effort across contracts, intake packets, and regulatory monitoring.",
    icon: BriefcaseBusiness,
  },
  {
    label: "Client response",
    value: 4,
    suffix: "x",
    detail: "Higher matter intake throughput with structured routing, triage, and drafting support.",
    icon: BadgeCheck,
  },
];

const services = [
  {
    title: "AI Contract Review",
    detail: "Extract obligations, compare clauses to playbooks, and escalate non-standard positions.",
    image: "/images/law-ai/contracts-review.jpg",
    icon: ClipboardCheck,
  },
  {
    title: "Legal Research Automation",
    detail: "Retrieve verified authorities first, rank sources by weight, and draft citation-backed answers.",
    image: "/images/law-ai/litigation-research.jpg",
    icon: FileSearch,
  },
  {
    title: "E-Discovery Assistance",
    detail: "Cluster facts, identify privileged material signals, and prepare issue-focused review sets.",
    image: "/images/law-ai/legal-team.jpg",
    icon: BrainCircuit,
  },
  {
    title: "Compliance Monitoring",
    detail: "Track official updates, summarize legal impact, and route alerts to the right owner.",
    image: "/images/law-ai/compliance-review.jpg",
    icon: Gavel,
  },
];

const workflowSteps = [
  { label: "Intake", manual: "18h", ai: "45m" },
  { label: "Research", manual: "3d", ai: "4h" },
  { label: "Drafting", manual: "1d", ai: "2h" },
  { label: "Review", manual: "9h", ai: "90m" },
  { label: "Filing", manual: "4h", ai: "40m" },
];

const caseStudies = [
  {
    id: "litigation",
    type: "Litigation support",
    title: "Issue Research Command Center",
    image: "/images/law-ai/litigation-research.jpg",
    problem: "Research memos were slowed by scattered pleadings, prior work product, and inconsistent citation tracking.",
    solution: "Built a source-gated research layer with authority ranking and evidence packets for counsel review.",
    result: "62% faster research turnaround",
  },
  {
    id: "contract",
    type: "Commercial contracts",
    title: "Contract Review Desk",
    image: "/images/law-ai/contracts-review.jpg",
    problem: "Legal teams reviewed high-volume agreements manually against fragmented fallback positions.",
    solution: "Automated clause extraction, missing-clause detection, and playbook variance scoring.",
    result: "41% lower first-pass review cost",
  },
  {
    id: "compliance",
    type: "Regulatory operations",
    title: "Compliance Monitoring System",
    image: "/images/law-ai/compliance-review.jpg",
    problem: "Teams monitored regulatory changes manually across official notices and internal obligations.",
    solution: "Created prioritized alerting with legal impact summaries and accountable routing.",
    result: "44% less weekly monitoring effort",
  },
];

const comparisonRows = [
  ["Turnaround time", "Days of manual searching and memo drafting", "Hours with retrieval, summarization, and review routing"],
  ["Error exposure", "Higher risk of missed clauses, outdated sources, and inconsistent notes", "Source-bound evidence, validation gates, and structured escalation"],
  ["Cost per matter", "Linear with lawyer hours and document volume", "Lower marginal cost as intake and review volume increases"],
  ["Scalability", "Depends on headcount and availability", "Reusable workflows across practice groups and jurisdictions"],
];

const roiItems = [
  "8-12 hours recovered per senior lawyer each week",
  "Reduced external research and review spend",
  "Fewer missed obligations, dates, clauses, and source conflicts",
  "Consistent legal operations across distributed teams",
];

function MagneticLink({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "secondary" }) {
  const reduceMotion = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function handleMouseMove(event: MouseEvent<HTMLAnchorElement>) {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setOffset({
      x: (event.clientX - rect.left - rect.width / 2) * 0.18,
      y: (event.clientY - rect.top - rect.height / 2) * 0.18,
    });
  }

  return (
    <motion.a
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={offset}
      transition={{ type: "spring", stiffness: 190, damping: 15 }}
      className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground-legal/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep"
    >
      <Button
        className={
          variant === "primary"
            ? "cta-glow border border-brand-warm/30 bg-gradient-to-r from-accent-primary to-brand-warm px-5 text-bg-deep hover:brightness-110"
            : "border border-accent-secondary/35 bg-bg-surface/55 px-5 text-foreground-legal hover:bg-bg-elevated/70"
        }
      >
        {children}
      </Button>
    </motion.a>
  );
}

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const totalFrames = 34;
    const interval = window.setInterval(() => {
      frame += 1;
      setDisplayValue(Math.round((value * frame) / totalFrames));
      if (frame >= totalFrames) window.clearInterval(interval);
    }, 28);

    return () => window.clearInterval(interval);
  }, [inView, value]);

  return (
    <motion.span
      ref={ref}
      className="font-data"
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {displayValue}
      {suffix}
    </motion.span>
  );
}

function SplitSeamPanel({ compact = false }: { compact?: boolean }) {
  const [position, setPosition] = useState(50);

  return (
    <div className={`relative overflow-hidden rounded-lg border border-accent-secondary/20 bg-bg-surface/35 ${compact ? "h-48" : "min-h-[420px]"}`}>
      <div className="absolute inset-0 grid grid-cols-2">
        <div className="paper-grain relative overflow-hidden">
          <Image src="/images/law-ai/manual-files.jpg" alt="Manual legal files and records" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-35 grayscale" />
          <div className="absolute inset-0 bg-bg-deep/55" />
        </div>
        <div className="relative overflow-hidden bg-bg-deep">
          <div className="ambient-mesh absolute -inset-20 opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(230,218,216,0.16),transparent_28rem)]" />
        </div>
      </div>

      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <div className="flex h-full flex-col justify-between p-5 md:p-7">
          <div>
            <div className="font-data text-xs uppercase tracking-[0.24em] text-muted-legal">Manual process</div>
            <h3 className="font-display mt-3 max-w-xs text-3xl font-semibold text-foreground-legal md:text-4xl">Files move slower than legal risk.</h3>
          </div>
          {!compact && (
            <div className="grid gap-2 text-sm text-foreground-legal/78">
              {["Unstructured inboxes", "Manual source checks", "Repeated review cycles"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CircleSlash className="h-4 w-4 text-muted-legal" />
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
        <div className="flex h-full flex-col justify-between p-5 text-right md:p-7">
          <div className="ml-auto max-w-sm">
            <div className="font-data text-xs uppercase tracking-[0.24em] text-brand-warm">AI operating layer</div>
            <h3 className="font-display mt-3 text-3xl font-semibold text-white md:text-4xl">Evidence becomes action-ready.</h3>
          </div>
          {!compact && (
            <div className="ml-auto grid max-w-sm gap-2 text-sm text-foreground-legal">
              {["Retrieval before generation", "Clause and authority ranking", "Counsel-controlled outputs"].map((item) => (
                <div key={item} className="flex items-center justify-end gap-2">
                  {item}
                  <CheckCircle2 className="h-4 w-4 text-brand-warm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="split-seam absolute top-0 h-full w-12 -translate-x-1/2" style={{ left: `${position}%` }} aria-hidden="true" />
      <input
        aria-label="Compare manual and AI legal workflows"
        type="range"
        min="28"
        max="72"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="absolute bottom-4 left-1/2 z-20 h-2 w-[72%] -translate-x-1/2 cursor-ew-resize appearance-none rounded-full bg-foreground-legal/15 accent-brand-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground-legal/70"
      />
    </div>
  );
}

function TiltCaseCard({ study, index }: { study: (typeof caseStudies)[number]; index: number }) {
  const reduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: y * -6, rotateY: x * 6 });
  }

  return (
    <motion.article
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.09 }}
      animate={tilt}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ rotateX: 0, rotateY: 0 })}
      className="group overflow-hidden rounded-lg border border-accent-secondary/20 bg-bg-surface/45 shadow-2xl shadow-black/30"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={study.image} alt={`${study.title} case study`} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/22 to-transparent" />
        <div className="absolute bottom-4 left-4 rounded-md border border-foreground-legal/15 bg-bg-deep/65 px-3 py-2 font-data text-xs uppercase tracking-[0.18em] text-foreground-legal backdrop-blur-md">
          {study.type}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-2xl font-semibold text-white">{study.title}</h3>
        <p className="mt-4 text-sm leading-6 text-foreground-legal/72">
          <span className="text-brand-warm">Problem:</span> {study.problem}
        </p>
        <p className="mt-3 text-sm leading-6 text-foreground-legal/72">
          <span className="text-brand-warm">Solution:</span> {study.solution}
        </p>
        <a href="#contact" className="mt-5 flex items-center justify-between rounded-md border border-foreground-legal/15 bg-foreground-legal/8 p-3 text-sm font-medium text-foreground-legal transition hover:border-brand-warm/45 hover:bg-foreground-legal/12">
          {study.result}
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </motion.article>
  );
}

export function LawAiHome() {
  const [activeStep, setActiveStep] = useState(1);
  const [mode, setMode] = useState<"manual" | "ai">("ai");
  const [formStatus, setFormStatus] = useState("Share your highest-friction workflow and receive a private automation map.");
  const [submitting, setSubmitting] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const previousScrollY = useRef(0);
  const navVisibleRef = useRef(true);
  const selectedStep = workflowSteps[activeStep];

  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Law AI Solutions",
      description: "AI automation systems for legal research, contract review, compliance monitoring, and legal operations.",
      serviceType: "Legal AI automation and workflow modernization",
      areaServed: "Global",
    }),
    [],
  );

  useEffect(() => {
    previousScrollY.current = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const nextVisible = currentScrollY <= 8 || currentScrollY < previousScrollY.current;

      if (nextVisible !== navVisibleRef.current) {
        navVisibleRef.current = nextVisible;
        setNavVisible(nextVisible);
      }

      previousScrollY.current = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      if (!response.ok) {
        setFormStatus("Please provide your name and a valid business email so the workflow review can be routed correctly.");
        return;
      }

      setFormStatus("Request received. A workflow specialist will follow up with a tailored review path.");
      form.reset();
    } catch {
      setFormStatus("Request received locally. Contact the team directly for urgent scheduling.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-transparent text-foreground-legal">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="site-atmosphere" aria-hidden="true" />
      <div className="site-noise" aria-hidden="true" />

      <motion.header
        animate={{ y: navVisible ? "0%" : "-100%" }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-50 border-b border-accent-secondary/20 bg-bg-deep/72 backdrop-blur-2xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <a href="#top" className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground-legal/70">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-brand-warm/35 bg-bg-elevated/55 shadow-xl shadow-black/25">
              <Scale className="h-5 w-5 text-foreground-legal" />
            </span>
            <span>
              <span className="block text-sm font-semibold uppercase tracking-[0.22em] text-foreground-legal">Law AI Solutions</span>
              <span className="text-xs text-muted-legal">From case files to case wins, faster</span>
            </span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-foreground-legal/74 md:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground-legal/70">
                {item.label}
              </a>
            ))}
          </nav>
          <MagneticLink href="#contact">Request a Demo</MagneticLink>
        </div>
      </motion.header>

      <section id="top" className="relative mx-auto grid min-h-[88vh] max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-[1.02fr_0.98fr] md:px-8 md:py-20">
        <div className="absolute inset-x-0 top-0 -z-10 h-[82vh] overflow-hidden">
          <Image src="/images/law-ai/hero-law-office.jpg" alt="Modern law office interior at night" fill priority sizes="100vw" className="object-cover opacity-28" />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/25 via-bg-deep/78 to-bg-deep" />
        </div>

        <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 rounded-md border border-accent-secondary/30 bg-bg-surface/55 px-3 py-2 font-data text-xs uppercase tracking-[0.18em] text-brand-warm backdrop-blur-md">
            <Sparkles className="h-4 w-4" />
            Legal transformation by design
          </div>
          <h1 className="font-display mt-6 max-w-4xl text-[2.65rem] font-semibold leading-[1.02] tracking-[-0.01em] text-white md:text-[4rem]">
            Legal work, re-engineered by AI.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-foreground-legal/78 md:text-[1.0625rem]">
            Law AI Solutions turns research, contracts, compliance, and intake into auditable workflows that reduce turnaround time while preserving lawyer judgment and source control.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticLink href="#contact">
              Request a Demo
              <ArrowRight className="h-4 w-4" />
            </MagneticLink>
            <MagneticLink href="#comparison" variant="secondary">
              See the Difference
              <Workflow className="h-4 w-4" />
            </MagneticLink>
          </div>
          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            {["Retrieval before generation", "Counsel review controls", "Citation-aware outputs"].map((item) => (
              <div key={item} className="rounded-lg border border-accent-secondary/20 bg-bg-deep/58 p-4 text-sm text-foreground-legal shadow-xl shadow-black/20 backdrop-blur-md">
                <CheckCircle2 className="mb-3 h-4 w-4 text-brand-warm" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={false} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.12 }} className="space-y-4">
          <SplitSeamPanel compact />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-accent-secondary/20 bg-bg-surface/45 p-4 backdrop-blur-md">
              <div className="font-data text-3xl font-semibold text-white">72%</div>
              <div className="mt-1 font-data text-xs uppercase tracking-[0.16em] text-muted-legal">Faster research</div>
            </div>
            <div className="rounded-lg border border-accent-secondary/20 bg-bg-surface/45 p-4 backdrop-blur-md">
              <div className="font-data text-3xl font-semibold text-white">4x</div>
              <div className="mt-1 font-data text-xs uppercase tracking-[0.16em] text-muted-legal">Review capacity</div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="benefits" className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="mb-8 max-w-3xl">
          <div className="font-data text-sm uppercase tracking-[0.18em] text-brand-warm">Business benefits</div>
          <h2 className="font-display mt-4 text-3xl font-semibold text-white md:text-5xl">AI improves legal work where delay, repetition, and risk compound.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {benefits.map((benefit, index) => (
            <motion.article
              key={benefit.label}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.08 }}
              className="rounded-lg border border-accent-secondary/20 bg-bg-surface/42 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl"
            >
              <benefit.icon className="h-5 w-5 text-brand-warm" />
              <div className="mt-5 text-4xl font-semibold text-white">
                <AnimatedCounter value={benefit.value} suffix={benefit.suffix} />
              </div>
              <h3 className="mt-3 font-medium text-foreground-legal">{benefit.label}</h3>
              <p className="mt-3 text-sm leading-6 text-foreground-legal/70">{benefit.detail}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="max-w-3xl">
          <div className="font-data text-sm uppercase tracking-[0.18em] text-brand-warm">AI legal services</div>
          <h2 className="font-display mt-4 text-3xl font-semibold text-white md:text-5xl">Automation built around legal standards, not generic productivity claims.</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.08 }}
              className="group relative overflow-hidden rounded-lg border border-accent-secondary/20 bg-bg-deep/76 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl"
            >
              <Image src={service.image} alt={`${service.title} workspace`} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover opacity-14 transition duration-500 group-hover:scale-105 group-hover:opacity-22" />
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-brand-warm/25 bg-bg-surface/75">
                  <service.icon className="h-5 w-5 text-brand-warm" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-foreground-legal/72">{service.detail}</p>
                <div className="mt-5 h-px w-12 bg-brand-warm transition-all duration-300 group-hover:w-24" />
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="workflow" className="relative mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="ambient-mesh pointer-events-none absolute inset-0 -z-10 opacity-45" />
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <div className="font-data text-sm uppercase tracking-[0.18em] text-brand-warm">Before vs after AI</div>
            <h2 className="font-display mt-4 text-3xl font-semibold text-white md:text-5xl">A legal workflow that visibly compresses cycle time.</h2>
            <p className="mt-5 text-sm leading-7 text-foreground-legal/74">
              Move between stages to see how intake, research, drafting, review, and filing change when automation handles routing, retrieval, extraction, and evidence preparation.
            </p>
            <div className="mt-6 flex rounded-lg border border-accent-secondary/20 bg-bg-surface/36 p-1">
              {(["manual", "ai"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMode(item)}
                  className={`flex-1 rounded-md px-4 py-3 font-data text-xs uppercase tracking-[0.18em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground-legal/70 ${
                    mode === item ? "bg-foreground-legal text-bg-deep" : "text-foreground-legal/70 hover:text-white"
                  }`}
                >
                  {item === "manual" ? "Manual" : "AI-powered"}
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-2">
              {workflowSteps.map((step, index) => (
                <button
                  key={step.label}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className={`rounded-lg border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground-legal/70 ${
                    activeStep === index ? "border-foreground-legal/35 bg-accent-secondary/50" : "border-accent-secondary/20 bg-bg-deep/48 hover:border-brand-warm/45"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-white">{step.label}</span>
                    <span className="font-data text-xs text-muted-legal">
                      {step.manual} {"->"} {step.ai}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <WorkflowVisualization activeIndex={activeStep} mode={mode} />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-accent-secondary/25 bg-bg-surface/35 p-5">
                <div className="font-data text-xs uppercase tracking-[0.18em] text-muted-legal">Manual stage time</div>
                <div className="mt-3 font-data text-3xl text-white">{selectedStep.manual}</div>
                <p className="mt-3 text-sm leading-6 text-foreground-legal/70">Sequential handoffs, manual source verification, and repeated status coordination.</p>
              </div>
              <div className="rounded-lg border border-brand-warm/25 bg-foreground-legal/8 p-5">
                <div className="font-data text-xs uppercase tracking-[0.18em] text-brand-warm">AI stage time</div>
                <div className="mt-3 font-data text-3xl text-white">{selectedStep.ai}</div>
                <p className="mt-3 text-sm leading-6 text-foreground-legal/76">Parallel retrieval, extraction, and routing with lawyer-controlled review points.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="comparison" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <SplitSeamPanel />
          <div>
            <div className="font-data text-sm uppercase tracking-[0.18em] text-brand-warm">Decision view</div>
            <h2 className="font-display mt-4 text-3xl font-semibold text-white md:text-5xl">Without AI vs. with Law AI Solutions.</h2>
            <div className="mt-7 overflow-hidden rounded-lg border border-accent-secondary/20 bg-bg-surface/36">
              {comparisonRows.map(([metric, manual, ai]) => (
                <div key={metric} className="grid gap-0 border-b border-accent-secondary/15 last:border-b-0 md:grid-cols-[0.72fr_1fr_1fr]">
                  <div className="border-b border-accent-secondary/15 p-4 font-data text-xs uppercase tracking-[0.16em] text-brand-warm md:border-b-0 md:border-r">{metric}</div>
                  <div className="border-b border-accent-secondary/15 p-4 text-sm leading-6 text-foreground-legal/64 md:border-b-0 md:border-r">
                    <CircleSlash className="mb-2 h-4 w-4 text-muted-legal" />
                    {manual}
                  </div>
                  <div className="p-4 text-sm leading-6 text-foreground-legal">
                    <CheckCircle2 className="mb-2 h-4 w-4 text-brand-warm" />
                    {ai}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="cases" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="font-data text-sm uppercase tracking-[0.18em] text-brand-warm">Case studies</div>
            <h2 className="font-display mt-4 max-w-3xl text-3xl font-semibold text-white md:text-5xl">Representative systems for modern legal teams.</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-foreground-legal/70">Each engagement maps a high-friction workflow, identifies the evidence sources, and builds the automation layer around professional review.</p>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {caseStudies.map((study, index) => (
            <TiltCaseCard key={study.id} study={study} index={index} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="rounded-lg border border-accent-secondary/25 bg-bg-surface/38 p-6 shadow-2xl shadow-black/25 md:p-8">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <div className="font-data text-sm uppercase tracking-[0.18em] text-brand-warm">ROI model</div>
              <h2 className="font-display mt-4 text-3xl font-semibold text-white md:text-5xl">Speed, cost, and control in the same operating model.</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {roiItems.map((item) => (
                <div key={item} className="rounded-md border border-accent-secondary/20 bg-bg-deep/45 p-4 text-sm leading-6 text-foreground-legal">
                  <CheckCircle2 className="mb-3 h-4 w-4 text-brand-warm" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-6 rounded-lg border border-foreground-legal/20 bg-bg-deep/86 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl md:grid-cols-[0.85fr_1.15fr] md:p-8">
          <div>
            <div className="font-data text-sm uppercase tracking-[0.18em] text-brand-warm">Demo request</div>
            <h2 className="font-display mt-4 text-3xl font-semibold text-white md:text-5xl">Map your legal workflow to an AI operating layer.</h2>
            <p className="mt-5 text-sm leading-7 text-foreground-legal/72">{formStatus}</p>
            <div className="mt-6 flex items-center gap-3 text-sm text-foreground-legal/70">
              <LockKeyhole className="h-4 w-4 text-brand-warm" />
              Confidential workflow review. No schema or system changes required.
            </div>
          </div>
          <form onSubmit={submitLead} className="grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <Input name="name" required placeholder="Name" className="border-accent-secondary/25 bg-bg-surface/35 text-foreground-legal placeholder:text-muted-legal focus-visible:ring-brand-warm" />
              <Input name="email" type="email" required placeholder="Email" className="border-accent-secondary/25 bg-bg-surface/35 text-foreground-legal placeholder:text-muted-legal focus-visible:ring-brand-warm" />
            </div>
            <Input name="company" placeholder="Company" className="border-accent-secondary/25 bg-bg-surface/35 text-foreground-legal placeholder:text-muted-legal focus-visible:ring-brand-warm" />
            <Textarea name="message" placeholder="Which legal workflow should be improved first?" className="min-h-32 border-accent-secondary/25 bg-bg-surface/35 text-foreground-legal placeholder:text-muted-legal focus-visible:ring-brand-warm" />
            <Button disabled={submitting} className="cta-glow border border-brand-warm/30 bg-gradient-to-r from-accent-primary to-brand-warm text-bg-deep hover:brightness-110">
              {submitting ? "Submitting" : "Request Workflow Review"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>

      <footer className="border-t border-accent-secondary/20 px-4 py-10 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <Scale className="h-5 w-5 text-brand-warm" />
              <span className="font-semibold uppercase tracking-[0.22em]">Law AI Solutions</span>
            </div>
            <p className="mt-4 max-w-lg text-sm leading-7 text-foreground-legal/68">AI automation systems for legal teams that need speed, source control, and operational discipline.</p>
          </div>
          <div className="grid gap-2 text-sm text-foreground-legal/68">
            <div className="font-data text-xs uppercase tracking-[0.18em] text-brand-warm">Company</div>
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#workflow" className="hover:text-white">Workflow</a>
            <a href="#cases" className="hover:text-white">Case studies</a>
          </div>
          <div className="grid gap-2 text-sm text-foreground-legal/68">
            <div className="font-data text-xs uppercase tracking-[0.18em] text-brand-warm">Contact</div>
            <a href="mailto:contact@lawaisolutions.com" className="inline-flex items-center gap-2 hover:text-white">
              <Mail className="h-4 w-4" />
              contact@lawaisolutions.com
            </a>
            <a href="#privacy" className="hover:text-white">Privacy Policy</a>
            <a href="#terms" className="hover:text-white">Terms</a>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl text-xs leading-6 text-muted-legal">
          © {new Date().getFullYear()} Law AI Solutions. This site describes legal operations technology and does not provide legal advice.
        </div>
      </footer>
    </main>
  );
}
