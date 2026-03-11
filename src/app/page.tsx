"use client"

import * as React from "react"
import PortfolioHero from "@/components/portfolio-hero"
import EducationSection from "@/components/education-section"
import SkillsSection from "@/components/skills-section"
import ExperienceSection from "@/components/experience-section"
import ProjectsSection from "@/components/projects-section"
import CertificationsFooter from "@/components/certifications-footer"

// ── Stats strip ───────────────────────────────────────────────────────────

const STATS = [
  { value: "3+", label: "Production AI systems" },
  { value: "1", label: "IEEE Publication" },
  { value: "7", label: "Certifications" },
  { value: "<500ms", label: "Voice agent latency" },
]

function StatsStrip() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [inView, setInView] = React.useState(false)
  React.useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#0d0d1a] px-6 py-8"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(100,130,255,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className="text-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(16px)",
              transitionDelay: `${i * 80}ms`,
            }}
          >
            <p
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{
                background: "linear-gradient(135deg, #ffffff, #a0b8ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {s.value}
            </p>
            <p className="mt-1 text-xs sm:text-sm text-white/40">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Background "moment" image divider ─────────────────────────────────────

function ImageMoment({
  src,
  quote,
  attribution,
}: { src: string; quote: string; attribution: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [inView, setInView] = React.useState(false)
  React.useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-white/5 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        height: "220px",
        opacity: inView ? 1 : 0,
        transform: inView ? "scale(1)" : "scale(0.97)",
      }}
    >
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "brightness(0.25) saturate(0.6)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(100,130,255,0.15) 0%, rgba(120,160,255,0.08) 100%)",
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
        <p className="max-w-xl text-base sm:text-xl font-semibold italic text-white/75 leading-relaxed">
          "{quote}"
        </p>
        <p className="mt-3 text-xs text-white/35 uppercase tracking-widest">{attribution}</p>
      </div>
    </div>
  )
}

// ── Sticky nav ────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "education",       label: "Education" },
  { id: "skills",         label: "Skills" },
  { id: "experience",     label: "Experience" },
  { id: "projects",       label: "Projects" },
  { id: "certifications", label: "Certs" },
]

function StickyNav() {
  const [active, setActive] = React.useState("")
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80)
      for (const item of [...NAV_ITEMS].reverse()) {
        const el = document.getElementById(item.id)
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(item.id)
          break
        }
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <nav
      className="sticky top-4 z-50 mx-auto flex w-fit items-center gap-1 rounded-full border border-white/8 bg-[#0d0d1a]/80 px-2 py-1.5 backdrop-blur-xl shadow-xl transition-all duration-300"
      style={{ boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.5)" : "none" }}
      aria-label="Section navigation"
    >
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => scrollTo(item.id)}
          className={[
            "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
            active === item.id
              ? "bg-white/15 text-white"
              : "text-white/45 hover:text-white hover:bg-white/8",
          ].join(" ")}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <main className="min-h-dvh w-full bg-[#09090e] text-foreground">
      {/* ── Hero (full width, no max-w constraint) ── */}
      <div className="px-4 pt-4 sm:px-6 sm:pt-6">
        <PortfolioHero
          name="Sandhyavathi G"
          title="AI Engineer"
          summary="I build production-ready AI systems — RAG pipelines, agentic workflows, and voice AI platforms — that solve real business problems at scale."
          photoUrl="https://raw.githubusercontent.com/Sandhyavathi/portfolio/main/src/app/Generated%20Image%20September%2013%2C%202025%20-%202_46PM.png"
          email="sandhyavathi.g890@gmail.com"
          linkedinUrl="https://www.linkedin.com/in/sandhyavathi/"
          githubUrl="https://github.com/Sandhyavathi"
          resumeUrl="https://drive.google.com/file/d/1HVBaUjGxnbEGaTF9HST3MQp6iAaNTsUo/view?usp=sharing"
          scrollToId="education"
        />
      </div>

      {/* ── Sticky nav ── */}
      <div className="px-4 py-4 sm:px-6">
        <StickyNav />
      </div>

      {/* ── Stats strip ── */}
      <div className="mx-auto max-w-5xl px-4 pb-6 sm:px-6">
        <StatsStrip />
      </div>

      {/* ── Sections ── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col gap-16 pb-16">

          <section id="education" className="scroll-mt-24">
            <EducationSection />
          </section>

          {/* Moment: AI research image */}
          <ImageMoment
            src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=40"
            quote="Building systems that understand, reason, and act — not just predict."
            attribution="AI Engineering Philosophy"
          />

          <section id="skills" className="scroll-mt-24">
            <SkillsSection />
          </section>

          <section id="experience" className="scroll-mt-24">
            <ExperienceSection />
          </section>

          {/* Moment: code / terminal image */}
          <ImageMoment
            src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1600&q=40"
            quote="Good engineering is invisible. You only notice it when it's missing."
            attribution="Production Systems Mindset"
          />

          <section id="projects" className="scroll-mt-24">
            <ProjectsSection />
          </section>

          <section id="certifications" className="scroll-mt-24">
            <CertificationsFooter
              resumeUrl="https://drive.google.com/file/d/1HVBaUjGxnbEGaTF9HST3MQp6iAaNTsUo/view?usp=sharing"
            />
          </section>
        </div>
      </div>
    </main>
  )
}
