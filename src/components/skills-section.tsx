"use client"

import React, { useEffect, useRef, useState } from "react"
import { Code2, BrainCog, BarChart3, FlaskConical } from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────

type Category = {
  key: string
  title: string
  icon: React.ReactNode
  accent: string        // tailwind bg class for icon area
  skills: { name: string; level: number }[]
}

// ── Data ──────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  {
    key: "programming",
    title: "Languages & Frameworks",
    icon: <Code2 className="h-4 w-4" />,
    accent: "bg-white/8 text-white/70",
    skills: [
      { name: "Python", level: 95 },
      { name: "FastAPI", level: 90 },
      { name: "SQL / MySQL", level: 80 },
      { name: "R", level: 65 },
    ],
  },
  {
    key: "aiml",
    title: "AI & Machine Learning",
    icon: <BrainCog className="h-4 w-4" />,
    accent: "bg-white/8 text-white/70",
    skills: [
      { name: "LLMs & Prompt Engineering", level: 95 },
      { name: "RAG Systems", level: 92 },
      { name: "Agentic AI (LangChain, CrewAI)", level: 88 },
      { name: "Voice AI (STT/TTS/WebRTC)", level: 85 },
      { name: "Fine-tuning & Evaluation", level: 75 },
      { name: "Vector DBs (FAISS, Pinecone)", level: 88 },
    ],
  },
  {
    key: "cloud",
    title: "Cloud & DevOps",
    icon: <FlaskConical className="h-4 w-4" />,
    accent: "bg-white/8 text-white/70",
    skills: [
      { name: "Azure (AI Engineer Certified)", level: 90 },
      { name: "Docker & Containerisation", level: 82 },
      { name: "n8n Workflow Automation", level: 78 },
      { name: "Git & CI/CD", level: 80 },
    ],
  },
  {
    key: "bi",
    title: "Data & Analytics",
    icon: <BarChart3 className="h-4 w-4" />,
    accent: "bg-white/8 text-white/70",
    skills: [
      { name: "Tableau / Power BI", level: 80 },
      { name: "Time Series & Forecasting", level: 75 },
      { name: "Feature Engineering", level: 82 },
      { name: "Statistical Inference", level: 73 },
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────

function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ── Bar ───────────────────────────────────────────────────────────────────

function SkillBar({ name, level, inView, delay }: { name: string; level: number; inView: boolean; delay: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-white/80">{name}</span>
        <span className="text-xs font-mono text-white/35">{level}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full transition-[width] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: inView ? `${level}%` : "0%",
            transitionDelay: `${delay}ms`,
            background: "linear-gradient(90deg, rgba(255,255,255,0.7), rgba(160,180,255,0.9))",
          }}
        />
      </div>
    </div>
  )
}

// ── Category card ─────────────────────────────────────────────────────────

function CategoryCard({ cat, cardDelay }: { cat: Category; cardDelay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className="gradient-border rounded-2xl p-5 bg-[#111118] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${cardDelay}ms`,
      }}
    >
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <span className={["flex h-8 w-8 items-center justify-center rounded-lg", cat.accent].join(" ")}>
          {cat.icon}
        </span>
        <h3 className="text-sm font-semibold text-white/90">{cat.title}</h3>
      </div>

      {/* Bars */}
      <div className="flex flex-col gap-3.5">
        {cat.skills.map((s, i) => (
          <SkillBar
            key={s.name}
            name={s.name}
            level={s.level}
            inView={inView}
            delay={cardDelay + i * 80}
          />
        ))}
      </div>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────

export type SkillsSectionProps = { className?: string }

export default function SkillsSection({ className }: SkillsSectionProps) {
  const { ref: headRef, inView: headInView } = useInView<HTMLDivElement>()

  return (
    <section className={["w-full", className].filter(Boolean).join(" ")} aria-labelledby="skills-heading">
      {/* Header */}
      <div
        ref={headRef}
        className="mb-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ opacity: headInView ? 1 : 0, transform: headInView ? "translateY(0)" : "translateY(20px)" }}
      >
        <span className="section-label">
          <BrainCog className="h-3 w-3" />
          Technical Skills
        </span>
        <h2 id="skills-heading" className="mt-4 text-2xl sm:text-3xl font-bold text-white">
          What I build with
        </h2>
        <p className="mt-2 text-sm sm:text-base text-white/45 max-w-xl">
          Production-grade tools across AI engineering, cloud, and data science.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {CATEGORIES.map((cat, i) => (
          <CategoryCard key={cat.key} cat={cat} cardDelay={i * 80} />
        ))}
      </div>
    </section>
  )
}
