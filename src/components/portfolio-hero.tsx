"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Github, Linkedin, Phone, Contact, Pointer } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export interface PortfolioHeroProps {
  className?: string
  name?: string
  title?: string
  summary?: string
  photoUrl?: string
  email?: string
  phone?: string
  linkedinUrl?: string
  githubUrl?: string
  resumeUrl?: string
  onDownloadResume?: () => void
  scrollToId?: string
}

const DEFAULT_PHOTO =
  "https://drive.google.com/file/d/1lXlwYTXUiwCNj-3wV11HrLQ4imRJU5ZP/view?usp=sharing"

export default function PortfolioHero({
  className,
  name = "Sandhyavathi G",
  title = "AI Engineer",
  summary = "AI engineer specializing in building robust ML systems, LLM applications, and production-grade MLOps pipelines with a focus on reliability, performance, and elegant user experiences.",
  photoUrl = DEFAULT_PHOTO,
  email,
  phone,
  linkedinUrl,
  githubUrl,
  resumeUrl,
  onDownloadResume,
  scrollToId,
}: PortfolioHeroProps) {
  // Typewriter effect
  const [typed, setTyped] = useState("")
  const [isTypingDone, setIsTypingDone] = useState(false)
  const text = useMemo(() => summary, [summary])
  useEffect(() => {
    setTyped("")
    setIsTypingDone(false)
    if (!text) return
    let i = 0
    const delay = 16 // ms per character for a smooth but quick type
    const timer = setInterval(() => {
      i++
      setTyped(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(timer)
        setIsTypingDone(true)
      }
    }, delay)
    return () => clearInterval(timer)
  }, [text])

  // Entrance animations coordination
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Smooth scroll
  const handleScroll = () => {
    if (!scrollToId) return
    if (typeof window !== "undefined") {
      const el = document.getElementById(scrollToId)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  const handleResume = (e: React.MouseEvent) => {
    if (onDownloadResume) {
      onDownloadResume()
      return
    }
    if (resumeUrl) {
      // link handles it via asChild
      return
    }
    e.preventDefault()
    toast.info("Resume not available yet", {
      description: "Please check back soon or contact me directly.",
    })
  }

  // Accessibility labels
  const emailLabel = email ? `Email ${email}` : "Email not provided"
  const phoneLabel = phone ? `Call ${phone}` : "Phone not provided"
  const linkedinLabel = linkedinUrl ? "Open LinkedIn profile" : "LinkedIn not provided"
  const githubLabel = githubUrl ? "Open GitHub profile" : "GitHub not provided"

  return (
    <section
      aria-label="Introduction"
      className={[
        "w-full max-w-full bg-secondary text-foreground",
        "rounded-[var(--radius)] border border-[--border] shadow-sm",
        "px-6 py-10 sm:px-8 sm:py-12 md:px-10 md:py-14",
        "relative overflow-hidden",
        className || "",
      ].join(" ")}
    >
      {/* Decorative soft vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(1200px 400px at 100% -10%, rgba(47,170,123,0.08), rgba(255,255,255,0)), radial-gradient(900px 300px at -10% 110%, rgba(242,106,58,0.06), rgba(255,255,255,0))",
        }}
      />

      <div className="relative z-[1] flex w-full max-w-full flex-col items-stretch gap-8 sm:gap-10">
        {/* Top content row */}
        <div className="flex w-full flex-col-reverse items-stretch gap-8 sm:flex-row sm:items-center sm:justify-between">
          {/* Textual intro */}
          <div className="min-w-0 flex-1">
            <div
              className={[
                "transition-all duration-700 ease-out",
                entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
              ].join(" ")}
            >
              <h1 className="text-[1.75rem] leading-tight sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground break-words">
                {name}
              </h1>
              <p className="mt-2 text-base sm:text-lg md:text-xl font-medium text-[--hero]">
                {title}
              </p>
            </div>

            {/* Summary with typewriter */}
            <p
              className={[
                "mt-4 sm:mt-5 md:mt-6 text-sm sm:text-base md:text-lg text-foreground/90 max-w-prose break-words",
                "transition-opacity duration-700 ease-out",
                entered ? "opacity-100" : "opacity-0",
              ].join(" ")}
              aria-live="polite"
            >
              {typed}
              <span
                className={[
                  "ml-0.5 inline-block w-[1px] align-baseline bg-foreground",
                  isTypingDone ? "animate-pulse opacity-40 h-[1em]" : "opacity-80 h-[1em]",
                ].join(" ")}
                aria-hidden="true"
              />
            </p>

            {/* Contact row */}
            <ul
              className={[
                "mt-6 sm:mt-7 md:mt-8 flex flex-wrap items-center gap-x-5 gap-y-3",
                "transition-all duration-700 ease-out",
                entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
              ].join(" ")}
            >
              <ContactItem
                icon={<Contact className="h-4 w-4" aria-hidden="true" />}
                label={email || "Email"}
                href={email ? `mailto:${email}` : undefined}
                ariaLabel={emailLabel}
              />
              <ContactItem
                icon={<Phone className="h-4 w-4" aria-hidden="true" />}
                label={phone || "Phone"}
                href={phone ? `tel:${phone.replace(/\s+/g, "")}` : undefined}
                ariaLabel={phoneLabel}
              />
              <ContactItem
                icon={<Linkedin className="h-4 w-4" aria-hidden="true" />}
                label="LinkedIn"
                href={linkedinUrl}
                ariaLabel={linkedinLabel}
              />
              <ContactItem
                icon={<Github className="h-4 w-4" aria-hidden="true" />}
                label="GitHub"
                href={githubUrl}
                ariaLabel={githubLabel}
              />
            </ul>

            {/* Actions */}
            <div
              className={[
                "mt-6 sm:mt-7 flex items-center gap-3",
                "transition-all duration-700 ease-out",
                entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
              ].join(" ")}
            >
              {resumeUrl ? (
                <Button
                  asChild
                  className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-[--ring]"
                >
                  <a href={resumeUrl} onClick={handleResume} download>
                    Download Resume
                  </a>
                </Button>
              ) : (
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-[--ring]"
                  onClick={handleResume}
                >
                  Download Resume
                </Button>
              )}

              {scrollToId && (
                <button
                  type="button"
                  onClick={handleScroll}
                  className="inline-flex items-center gap-2 rounded-[calc(var(--radius)-4px)] border border-[--border] bg-card px-3.5 py-2 text-sm font-medium text-foreground/90 shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ring]"
                  aria-label="Scroll to next section"
                >
                  Explore more
                  <Pointer className="h-4 w-4 text-[--hero]" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {/* Photo */}
          <div
            className={[
              "mx-auto w-40 h-40 sm:w-44 sm:h-44 md:w-52 md:h-52",
              "relative rounded-full bg-muted shadow-lg ring-1 ring-[--border] overflow-hidden",
              "transition-all duration-700 ease-out",
              entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
            ].join(" ")}
          >
            <Image
              src={photoUrl}
              alt="Professional headshot of Sandhyavathi G"
              fill
              sizes="(max-width: 640px) 10rem, (max-width: 768px) 11rem, 13rem"
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* Subtle scroll indicator at bottom for mobile if no scrollToId provided */}
        {!scrollToId && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-[--warning] animate-pulse" aria-hidden="true" />
            <span>Scroll to see more</span>
          </div>
        )}
      </div>
    </section>
  )
}

function ContactItem({
  icon,
  label,
  href,
  ariaLabel,
}: {
  icon: React.ReactNode
  label: string
  href?: string
  ariaLabel: string
}) {
  const content = (
    <span className="min-w-0 truncate">{label}</span>
  )

  if (!href) {
    return (
      <li>
        <span
          aria-label={ariaLabel}
          aria-disabled="true"
          className="inline-flex items-center gap-2 rounded-[calc(var(--radius)-6px)] border border-dashed border-[--border] bg-muted px-3 py-2 text-sm text-muted-foreground"
        >
          {icon}
          {content}
        </span>
      </li>
    )
  }

  return (
    <li>
      <Link
        href={href}
        aria-label={ariaLabel}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className={[
          "inline-flex items-center gap-2 rounded-[calc(var(--radius)-6px)] border border-[--border] bg-card px-3 py-2 text-sm text-foreground/90 shadow-sm",
          "transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ring]",
        ].join(" ")}
      >
        {icon}
        {content}
      </Link>
    </li>
  )
}
