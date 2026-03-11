"use client"

import React, { useEffect, useRef, useState } from "react"
import { Briefcase, ChevronRight } from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────

type Experience = {
  company: string
  title: string
  period: string
  type: "full-time" | "intern"
  accent: string          // gradient class for the left accent bar
  achievements: string[]
}

// ── Data (from resume) ────────────────────────────────────────────────────

const EXPERIENCES: Experience[] = [
  {
    company: "Space Marvel AI",
    title: "AI Engineer",
    period: "Apr 2025 – Feb 2026",
    type: "full-time",
    accent: "from-white/60 to-blue-300/50",
    achievements: [
      "Designed and deployed production RAG pipelines with FAISS vector search, reducing hallucination rate by 40%.",
      "Built an AI Voice Agent platform using WebRTC + Whisper STT + TTS with sub-500ms latency for live calls.",
      "Architected agentic automation workflows using LangChain, CrewAI, and n8n for onboarding and support.",
      "Integrated GPT-powered chatbots with Streamlit frontends via FastAPI microservices.",
      "Deployed cloud-native AI backend architecture on Azure using Docker containers.",
    ],
  },
  {
    company: "Space Marvel AI",
    title: "Data Engineer Intern",
    period: "Jan 2025 – Apr 2025",
    type: "intern",
    accent: "from-white/30 to-blue-300/30",
    achievements: [
      "Built automated ETL pipelines ingesting and transforming structured and unstructured data sources.",
      "Developed data quality validation layers that reduced downstream model errors by 30%.",
      "Collaborated with AI team to prepare training datasets for LLM fine-tuning workflows.",
    ],
  },
  {
    company: "Meritshot",
    title: "Data Science Intern",
    period: "Dec 2024 – Mar 2025",
    type: "intern",
    accent: "from-white/20 to-blue-200/25",
    achievements: [
      "Developed an IEEE-published Quiz-Based Study Plan Generator using Cohere Prompt Engineering and Azure Data Pipelines.",
      "Built ML classification models for student performance prediction with 85% accuracy.",
      "Won KSCST project award for innovative application of AI in education technology.",
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold, rootMargin: "0px 0px -5% 0px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ── Experience card ───────────────────────────────────────────────────────

function ExperienceCard({ exp, delay }: { exp: Experience; delay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const [expanded, setExpanded] = useState(false)
  const PREVIEW_COUNT = 3

  return (
    <div
      ref={ref}
      className="relative flex gap-4 sm:gap-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(-20px)", transitionDelay: `${delay}ms` }}
    >
      {/* Timeline dot + line */}
      <div className="flex flex-col items-center">
        <div
          className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#111118]"
          style={{ boxShadow: "0 0 0 4px rgba(255,255,255,0.05)" }}
        >
          <div
            className="h-3 w-3 rounded-full"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(160,185,255,0.9))" }}
          />
        </div>
        <div className="mt-2 w-px flex-1 bg-gradient-to-b from-white/15 to-transparent" />
      </div>

      {/* Card */}
      <div className="mb-8 min-w-0 flex-1 pb-2">
        {/* Accent strip + header */}
        <div className="relative overflow-hidden rounded-xl border border-white/5 bg-[#111118]">
          {/* Left accent gradient */}
          <div className={["absolute left-0 top-0 h-full w-[3px] rounded-l-xl bg-gradient-to-b", exp.accent].join(" ")} />

          <div className="px-5 py-4 pl-6">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight">{exp.title}</h3>
                <p className="mt-0.5 text-sm font-medium text-white/55">{exp.company}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-white/40 font-mono">{exp.period}</span>
                <span className={[
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                  exp.type === "full-time"
                    ? "bg-white/8 text-white/60"
                    : "bg-white/5 text-white/40"
                ].join(" ")}>
                  {exp.type === "full-time" ? "Full-time" : "Internship"}
                </span>
              </div>
            </div>

            {/* Achievements */}
            <ul className="mt-3 space-y-2">
              {exp.achievements.slice(0, expanded ? undefined : PREVIEW_COUNT).map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/55 leading-relaxed">
                  <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/25" aria-hidden="true" />
                  {a}
                </li>
              ))}
            </ul>

            {exp.achievements.length > PREVIEW_COUNT && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-2 text-xs font-medium text-white/35 hover:text-white/70 transition-colors"
              >
                {expanded ? "Show less" : `+${exp.achievements.length - PREVIEW_COUNT} more`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────

export interface ExperienceSectionProps { className?: string }

export default function ExperienceSection({ className }: ExperienceSectionProps) {
  const { ref: headRef, inView: headInView } = useInView<HTMLDivElement>()

  return (
    <section className={["w-full", className].filter(Boolean).join(" ")} aria-labelledby="experience-heading">
      {/* Header */}
      <div
        ref={headRef}
        className="mb-10 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ opacity: headInView ? 1 : 0, transform: headInView ? "translateY(0)" : "translateY(20px)" }}
      >
        <span className="section-label">
          <Briefcase className="h-3 w-3" />
          Work History
        </span>
        <h2 id="experience-heading" className="mt-4 text-2xl sm:text-3xl font-bold text-white">
          Experience
        </h2>
        <p className="mt-2 text-sm sm:text-base text-white/45 max-w-xl">
          Roles where I shipped real AI systems to real users.
        </p>
      </div>

      {/* Timeline */}
      <div>
        {EXPERIENCES.map((exp, i) => (
          <ExperienceCard key={`${exp.company}-${exp.title}`} exp={exp} delay={i * 100} />
        ))}
      </div>
    </section>
  )
}
