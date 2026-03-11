"use client";

import * as React from "react";
import Link from "next/link";
import { Github, ArrowUpRight, Layers, LayoutGrid } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────

type Project = {
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  gradient: string;
  repoUrl?: string;
  projectUrl?: string;
  badge?: string;
};

// ── Data ──────────────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
  {
    title: "Document Intelligence API",
    subtitle: "Privacy-first RAG for law firms & CA firms",
    description:
      "Production RAG system: upload PDFs, ask plain-English questions, get answers with exact page citations. Runs fully on-premise using Ollama — sensitive client documents never leave the network.",
    tech: ["FastAPI", "FAISS", "Ollama", "RAG", "PyMuPDF", "SQLAlchemy", "Docker", "Streamlit"],
    gradient: "linear-gradient(135deg, #1e0b3a 0%, #0c1a2e 60%, #0a0e1a 100%)",
    repoUrl: "https://github.com/Sandhyavathi",
    projectUrl: "/projects/document-intelligence",
    badge: "Production",
  },
  {
    title: "AI Voice Agent Platform",
    subtitle: "Real-time conversational AI with <500ms latency",
    description:
      "End-to-end voice agent platform using WebRTC, Whisper STT, and TTS with voice activity detection, interruption handling, and LLM reasoning — built for concurrent call-center deployments.",
    tech: ["WebRTC", "Whisper", "LiveKit", "OpenAI", "FastAPI", "VAD", "TTS"],
    gradient: "linear-gradient(135deg, #0b2236 0%, #0d1a2a 60%, #0a0e1a 100%)",
    repoUrl: "https://github.com/Sandhyavathi",
    badge: "DeepLearning.AI Certified",
  },
  {
    title: "Lead Generation API",
    subtitle: "Automated B2B intelligence pipeline",
    description:
      "FastAPI backend for automated company discovery with async processing, confidence-scored lead extraction, LLM-driven data enrichment, and CSV/JSON export for sales teams.",
    tech: ["FastAPI", "LLM", "Async", "SQLite", "LangChain"],
    gradient: "linear-gradient(135deg, #071a12 0%, #0d1d15 60%, #0a0e1a 100%)",
    repoUrl: "https://github.com/Sandhyavathi",
  },
  {
    title: "Quiz-Based Study Plan Generator",
    subtitle: "IEEE Published research project",
    description:
      "AI-powered personalised study plan generator using Cohere Prompt Engineering and Azure Data Pipelines. Generates adaptive quizzes, tracks weak areas, and rebuilds the learning path accordingly.",
    tech: ["Cohere", "Azure", "Prompt Engineering", "Python"],
    gradient: "linear-gradient(135deg, #1a1409 0%, #1d1710 60%, #0a0e1a 100%)",
    badge: "IEEE Published · KSCST Award",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────

function useInView<T extends HTMLElement>(threshold = 0.1) {
  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold, rootMargin: "0px 0px -5% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Project card ──────────────────────────────────────────────────────────

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      ref={ref}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#111118] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transitionDelay: `${delay}ms`,
        boxShadow: hovered
          ? "0 0 0 1px rgba(255,255,255,0.12), 0 16px 48px rgba(0,0,0,0.5)"
          : "0 0 0 1px rgba(255,255,255,0.04)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header gradient */}
      <div
        className="relative h-32 w-full overflow-hidden"
        style={{ background: project.gradient }}
        aria-hidden="true"
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.6s ease",
          }}
        />
        {/* Glow blob */}
        <div
          className="absolute top-1/2 left-1/2 h-20 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(ellipse, rgba(100,130,255,0.25), transparent)",
            opacity: hovered ? 1 : 0.4,
            transition: "opacity 0.5s ease",
          }}
        />
        {/* Badge */}
        {project.badge && (
          <div className="absolute top-3 right-3">
            <span className="rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[10px] font-semibold text-white/65 backdrop-blur-sm">
              {project.badge}
            </span>
          </div>
        )}
        {/* Icon */}
        <div className="absolute bottom-3 left-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <Layers className="h-5 w-5 text-white/60" />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-white leading-tight">{project.title}</h3>
        <p className="mt-0.5 text-xs font-medium text-white/45">{project.subtitle}</p>
        <p className="mt-3 text-sm text-white/50 leading-relaxed flex-1">{project.description}</p>

        {/* Tech tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/8 bg-white/4 px-2.5 py-1 text-[11px] font-medium text-white/45"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center gap-3 border-t border-white/5 pt-4">
          {project.projectUrl && (
            <Link
              href={project.projectUrl}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3.5 py-1.5 text-xs font-semibold text-white/65 hover:bg-white/15 hover:text-white transition-all"
            >
              View Case Study
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-white/70 transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
              Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────

export interface ProjectsSectionProps { className?: string }

export default function ProjectsSection({ className }: ProjectsSectionProps) {
  const { ref: headRef, inView: headInView } = useInView<HTMLDivElement>();

  return (
    <section className={["w-full", className].filter(Boolean).join(" ")} aria-labelledby="projects-heading">
      {/* Header */}
      <div
        ref={headRef}
        className="mb-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ opacity: headInView ? 1 : 0, transform: headInView ? "translateY(0)" : "translateY(20px)" }}
      >
        <span className="section-label">
          <LayoutGrid className="h-3 w-3" />
          Projects
        </span>
        <h2 id="projects-heading" className="mt-4 text-2xl sm:text-3xl font-bold text-white">
          Things I've built
        </h2>
        <p className="mt-2 text-sm sm:text-base text-white/45 max-w-xl">
          Production AI systems — click any card to see the full system design and engineering breakdown.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.title} project={p} delay={i * 80} />
        ))}
      </div>
    </section>
  );
}
