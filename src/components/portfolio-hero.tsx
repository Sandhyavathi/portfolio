"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { Github, Linkedin, Mail, FileText, ArrowDown } from "lucide-react"
import Image from "next/image"

export interface PortfolioHeroProps {
  className?: string
  name?: string
  title?: string
  summary?: string
  photoUrl?: string
  email?: string
  linkedinUrl?: string
  githubUrl?: string
  resumeUrl?: string
  scrollToId?: string
}

// ── Particle network canvas ───────────────────────────────────────────────
// Soft white dots + connecting lines — monochrome, no colour

type Particle = { x: number; y: number; vx: number; vy: number; r: number }

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<number>(0)
  const particles = useRef<Particle[]>([])

  const initParticles = useCallback((w: number, h: number) => {
    const count = Math.floor((w * h) / 15000)
    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.2 + 0.4,
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      initParticles(canvas.width, canvas.height)
    }
    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      const { width: w, height: h } = canvas
      ctx.clearRect(0, 0, w, h)
      for (const p of particles.current) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255,255,255,0.35)"
        ctx.fill()
      }
      const pts = particles.current
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 110) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / 110) * 0.12})`
            ctx.lineWidth = 0.7
            ctx.stroke()
          }
        }
      }
      animRef.current = requestAnimationFrame(draw)
    }
    animRef.current = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize) }
  }, [initParticles])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
}

// ── Cycling typewriter ────────────────────────────────────────────────────

const ROLES = [
  "LLM Applications",
  "Agentic AI Systems",
  "RAG Pipelines",
  "Voice AI Platforms",
  "Production ML APIs",
]

function CyclingTypewriter() {
  const [roleIdx, setRoleIdx]   = useState(0)
  const [display, setDisplay]   = useState("")
  const [deleting, setDeleting] = useState(false)
  const [paused, setPaused]     = useState(false)

  useEffect(() => {
    const target = ROLES[roleIdx]
    if (paused) {
      const t = setTimeout(() => { setPaused(false); setDeleting(true) }, 2200)
      return () => clearTimeout(t)
    }
    if (!deleting) {
      if (display.length < target.length) {
        const t = setTimeout(() => setDisplay(target.slice(0, display.length + 1)), 60)
        return () => clearTimeout(t)
      }
      setPaused(true)
    } else {
      if (display.length > 0) {
        const t = setTimeout(() => setDisplay(display.slice(0, -1)), 35)
        return () => clearTimeout(t)
      }
      setDeleting(false)
      setRoleIdx((i) => (i + 1) % ROLES.length)
    }
  }, [display, deleting, paused, roleIdx])

  return (
    <span className="text-white font-semibold">
      {display}
      <span
        className="ml-0.5 inline-block w-[2px] h-[1em] align-middle bg-white/70 animate-pulse"
        aria-hidden="true"
      />
    </span>
  )
}

// ── Main hero ─────────────────────────────────────────────────────────────

export default function PortfolioHero({
  name        = "Sandhyavathi G",
  title       = "AI Engineer",
  summary     = "I build production-ready AI systems — RAG pipelines, agentic workflows, and voice AI platforms — that solve real business problems at scale.",
  photoUrl    = "https://raw.githubusercontent.com/Sandhyavathi/portfolio/main/src/app/Generated%20Image%20September%2013%2C%202025%20-%202_46PM.png",
  email       = "sandhyavathi.g890@gmail.com",
  linkedinUrl = "https://www.linkedin.com/in/sandhyavathi/",
  githubUrl   = "https://github.com/Sandhyavathi",
  resumeUrl,
  scrollToId,
}: PortfolioHeroProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const id = setTimeout(() => setMounted(true), 60); return () => clearTimeout(id) }, [])

  const handleScroll = () => {
    if (!scrollToId) return
    document.getElementById(scrollToId)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const ease = "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"

  return (
    <section
      aria-label="Introduction"
      className="relative w-full overflow-hidden rounded-2xl border border-white/5"
      style={{ minHeight: "clamp(520px,80vh,760px)" }}
    >
      {/* ── Layer 1: abstract neural/wave background image ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1800&q=40")`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          filter: "brightness(0.18) saturate(0.5)",
        }}
      />

      {/* ── Layer 2: dark gradient overlay ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(8,8,13,0.95) 0%, rgba(8,8,13,0.6) 50%, rgba(8,8,13,0.4) 100%)",
        }}
      />

      {/* ── Layer 3: particle canvas ── */}
      <ParticleCanvas />

      {/* ── Layer 4: subtle top vignette ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 90% 50% at 20% 50%, rgba(90,143,255,0.06) 0%, transparent 65%)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex h-full w-full flex-col justify-center px-6 py-16 sm:px-10 sm:py-20 md:px-14">
        <div className="flex flex-col-reverse gap-10 sm:flex-row sm:items-center sm:justify-between">

          {/* Left: text */}
          <div className="min-w-0 flex-1 max-w-2xl">

            {/* Badge */}
            <div
              className={[ease, mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"].join(" ")}
              style={{ transitionDelay: "50ms" }}
            >
              <span className="section-label">
                <span className="h-1.5 w-1.5 rounded-full bg-white/60 inline-block" />
                Open to opportunities
              </span>
            </div>

            {/* Name */}
            <div
              className={[ease, mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"].join(" ")}
              style={{ transitionDelay: "150ms" }}
            >
              <h1 className="mt-5 text-4xl sm:text-5xl md:text-[3.75rem] font-extrabold tracking-tight leading-[1.05] text-white">
                {name}
              </h1>
            </div>

            {/* Title + cycling role */}
            <div
              className={[ease, mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"].join(" ")}
              style={{ transitionDelay: "250ms" }}
            >
              <p className="mt-3 text-lg sm:text-xl md:text-2xl text-white/50 font-medium">
                {title} — <CyclingTypewriter />
              </p>
            </div>

            {/* Summary */}
            <div
              className={[ease, mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"].join(" ")}
              style={{ transitionDelay: "350ms" }}
            >
              <p className="mt-5 text-base sm:text-lg text-white/45 leading-relaxed max-w-xl">
                {summary}
              </p>
            </div>

            {/* Social links */}
            <div
              className={["mt-7 flex flex-wrap items-center gap-3", ease,
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"].join(" ")}
              style={{ transitionDelay: "450ms" }}
            >
              <SocialLink href={`mailto:${email}`}  icon={<Mail     className="h-4 w-4" />} label={email}    />
              {linkedinUrl && <SocialLink href={linkedinUrl} icon={<Linkedin className="h-4 w-4" />} label="LinkedIn" external />}
              {githubUrl   && <SocialLink href={githubUrl}   icon={<Github   className="h-4 w-4" />} label="GitHub"   external />}
            </div>

            {/* CTAs */}
            <div
              className={["mt-6 flex flex-wrap items-center gap-3", ease,
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"].join(" ")}
              style={{ transitionDelay: "550ms" }}
            >
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white text-black px-5 py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  View Resume
                </a>
              )}
              {scrollToId && (
                <button
                  type="button"
                  onClick={handleScroll}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors backdrop-blur-sm"
                >
                  Explore work
                  <ArrowDown className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right: photo */}
          <div
            className={["shrink-0", ease,
              mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"].join(" ")}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="relative mx-auto w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60">
              {/* Spinning conic ring — white/blue, no loud purple */}
              <div
                className="ring-spin absolute inset-[-2px] rounded-full"
                aria-hidden="true"
                style={{
                  background: "conic-gradient(from 0deg, rgba(255,255,255,0.6), rgba(120,160,255,0.4), rgba(255,255,255,0.6))",
                  borderRadius: "50%",
                  padding: "2px",
                }}
              >
                <div
                  className="w-full h-full rounded-full"
                  style={{ background: "#08080d" }}
                />
              </div>
              {/* Photo */}
              <div className="absolute inset-[3px] rounded-full overflow-hidden ring-1 ring-white/10">
                <Image
                  src={photoUrl}
                  alt="Sandhyavathi G"
                  fill
                  sizes="(max-width:640px) 11rem,(max-width:768px) 13rem, 15rem"
                  priority
                  className="object-cover"
                />
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-emerald-400 ring-2 ring-[#08080d]" />
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        {scrollToId && (
          <button
            type="button"
            onClick={handleScroll}
            aria-label="Scroll down"
            className={[
              "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/20 hover:text-white/50 transition-colors",
              ease, mounted ? "opacity-100" : "opacity-0",
            ].join(" ")}
            style={{ transitionDelay: "800ms" }}
          >
            <span className="text-[10px] uppercase tracking-widest">scroll</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </button>
        )}
      </div>
    </section>
  )
}

// ── Social link chip ──────────────────────────────────────────────────────

function SocialLink({
  href, icon, label, external,
}: { href: string; icon: React.ReactNode; label: string; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs sm:text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
    >
      {icon}
      {label}
    </a>
  )
}
