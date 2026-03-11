"use client"

import * as React from "react"
import { Github, Linkedin, Mail, FileText, Award, Shield } from "lucide-react"

// ── Data ──────────────────────────────────────────────────────────────────

const CERTS = [
  { id: "az-ai", title: "Azure AI Engineer Associate", org: "Microsoft", year: "2026", hot: true },
  { id: "az-900", title: "Azure Fundamentals (AZ-900)", org: "Microsoft", year: "2025" },
  { id: "dl-voice", title: "AI Voice Agents for Production", org: "DeepLearning.AI", year: "2025" },
  { id: "db", title: "IT Specialist: Databases", org: "Microsoft", year: "2024" },
  { id: "da", title: "IT Specialist: Data Analytics", org: "Microsoft", year: "2024" },
  { id: "pp", title: "Power Platform Fundamentals", org: "Microsoft", year: "2024" },
  { id: "net", title: "Networking Fundamentals", org: "Microsoft", year: "2024" },
]

const ACHIEVEMENTS = [
  { icon: "📄", label: "IEEE Published", sub: "Quiz-Based Study Plan Generator" },
  { icon: "🏆", label: "KSCST Award", sub: "State-level tech competition" },
  { icon: "🎓", label: "7 Certifications", sub: "Microsoft + DeepLearning.AI" },
]

// ── Helpers ───────────────────────────────────────────────────────────────

function useInView<T extends HTMLElement>(threshold = 0.1) {
  const ref = React.useRef<T | null>(null)
  const [inView, setInView] = React.useState(false)
  React.useEffect(() => {
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

function OrgDot({ org }: { org: string }) {
  if (org === "DeepLearning.AI") {
    return <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
  }
  return <span className="flex h-2 w-2 rounded-full bg-blue-300/60" />
}

// ── Section ───────────────────────────────────────────────────────────────

export type CertificationsFooterProps = {
  className?: string
  resumeUrl?: string
}

export default function CertificationsFooter({ className, resumeUrl }: CertificationsFooterProps) {
  const { ref: headRef, inView: headInView } = useInView<HTMLDivElement>()
  const { ref: certRef, inView: certInView } = useInView<HTMLDivElement>()

  return (
    <section
      className={["w-full overflow-hidden rounded-2xl border border-white/5 bg-[#0d0d1a]", className].filter(Boolean).join(" ")}
      aria-label="Certifications and contact"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(100,130,255,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 p-6 sm:p-8">

        {/* Achievements row */}
        <div
          ref={headRef}
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ opacity: headInView ? 1 : 0, transform: headInView ? "translateY(0)" : "translateY(20px)" }}
        >
          {ACHIEVEMENTS.map((a, i) => (
            <div
              key={a.label}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/3 px-4 py-3"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="text-2xl">{a.icon}</span>
              <div>
                <p className="text-sm font-bold text-white">{a.label}</p>
                <p className="text-xs text-white/40">{a.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Certs header */}
        <div className="mb-5">
          <span className="section-label">
            <Award className="h-3 w-3" />
            Certifications
          </span>
          <h2 className="mt-3 text-xl sm:text-2xl font-bold text-white">Validated skills</h2>
        </div>

        {/* Cert list */}
        <div ref={certRef} className="grid gap-2 sm:grid-cols-2">
          {CERTS.map((c, i) => (
            <div
              key={c.id}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#111118] px-4 py-3 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                opacity: certInView ? 1 : 0,
                transform: certInView ? "translateX(0)" : "translateX(-12px)",
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <OrgDot org={c.org} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white/80 truncate">
                  {c.title}
                  {c.hot && (
                    <span className="ml-2 rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold text-white/65 uppercase">Active</span>
                  )}
                </p>
                <p className="text-xs text-white/35">{c.org} · {c.year}</p>
              </div>
              <Shield className="h-3.5 w-3.5 shrink-0 text-white/20" />
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Footer */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Sandhyavathi G</p>
            <p className="text-xs text-white/40 mt-0.5">AI Engineer · Open to opportunities</p>
            <a
              href="mailto:sandhyavathi.g890@gmail.com"
              className="mt-1 inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
            >
              <Mail className="h-3 w-3" />
              sandhyavathi.g890@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/sandhyavathi/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/Sandhyavathi"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <Github className="h-4 w-4" />
            </a>
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white px-4 py-2.5 text-xs font-semibold text-black hover:bg-white/90 transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                Resume
              </a>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/20">
          © {new Date().getFullYear()} Sandhyavathi G · All rights reserved
        </p>
      </div>
    </section>
  )
}
