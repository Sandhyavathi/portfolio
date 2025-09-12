"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { BrainCog, Code, ChartColumnStacked, Grid3x3 } from "lucide-react"

type SkillCategory = {
  key: string
  title: string
  icon?: React.ReactNode
  tone: "programming" | "aiml" | "bi" | "analytics"
  skills: string[]
  description?: string
}

export type SkillsSectionProps = {
  className?: string
  style?: React.CSSProperties
  heading?: string
  subheading?: string
  categories?: SkillCategory[]
  /**
   * Base delay in ms for staggered appearance.
   * Each pill index multiplies this value.
   */
  stagger?: number
}

const defaultCategories: SkillCategory[] = [
  {
    key: "programming",
    title: "Programming",
    icon: <Code className="size-5 text-primary" aria-hidden="true" />,
    tone: "programming",
    skills: ["Python", "R", "MySQL"],
    description: "Languages and core tooling for data and backend work.",
  },
  {
    key: "aiml",
    title: "AI & Machine Learning",
    icon: <BrainCog className="size-5 text-primary" aria-hidden="true" />,
    tone: "aiml",
    skills: [
      "Agentic AI",
      "Generative AI",
      "LLMs",
      "MCP",
      "Voice AI",
      "Prompt Engineering",
      "RAG",
      "Vector DBs",
      "Fine-tuning",
      "Model Evaluation",
    ],
    description: "Practical AI systems, model operations, and applied ML techniques.",
  },
  {
    key: "bi",
    title: "Business Intelligence",
    icon: <ChartColumnStacked className="size-5 text-primary" aria-hidden="true" />,
    tone: "bi",
    skills: ["Tableau", "Power BI", "Excel"],
    description: "Dashboards, reporting, and data visualization for decision-making.",
  },
  {
    key: "analytics",
    title: "Analytical Techniques",
    icon: <Grid3x3 className="size-5 text-primary" aria-hidden="true" />,
    tone: "analytics",
    skills: [
      "A/B Testing",
      "Time Series",
      "Forecasting",
      "Clustering",
      "Classification",
      "Feature Engineering",
      "Statistical Inference",
      "Data Wrangling",
      "Data Storytelling",
    ],
    description: "Structured approaches to derive insights and drive outcomes.",
  },
]

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ")
}

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    if (typeof window === "undefined") return

    const el = ref.current
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        root: options?.root ?? null,
        rootMargin: options?.rootMargin ?? "0px 0px -10% 0px",
        threshold: options?.threshold ?? 0.15,
      }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [options?.root, options?.rootMargin, options?.threshold])

  return { ref, inView }
}

function getToneClasses(tone: SkillCategory["tone"]) {
  // Using earth-toned tokens defined in globals.css
  // bg-* are opaque surfaces; text colors maintain contrast.
  switch (tone) {
    case "programming":
      return {
        surface: "bg-secondary", // warm soft beige
        badge: "bg-muted text-foreground", // slightly deeper beige
        badgeHover: "hover:bg-secondary focus-visible:bg-secondary",
        ring: "focus-visible:ring-ring",
      }
    case "aiml":
      return {
        surface: "bg-chart-4", // cfe7d7 muted green
        badge: "bg-card text-foreground", // card on green surface
        badgeHover: "hover:bg-muted focus-visible:bg-muted",
        ring: "focus-visible:ring-ring",
      }
    case "bi":
      return {
        surface: "bg-muted", // f2ede5 soft neutral
        badge: "bg-card text-foreground",
        badgeHover: "hover:bg-secondary focus-visible:bg-secondary",
        ring: "focus-visible:ring-ring",
      }
    case "analytics":
      return {
        surface: "bg-secondary", // keep calm surface
        badge: "bg-chart-2 text-foreground", // f0b27a warm sand
        badgeHover: "hover:opacity-90 focus-visible:opacity-95",
        ring: "focus-visible:ring-ring",
      }
    default:
      return {
        surface: "bg-secondary",
        badge: "bg-card text-foreground",
        badgeHover: "hover:bg-muted",
        ring: "focus-visible:ring-ring",
      }
  }
}

export default function SkillsSection({
  className,
  style,
  heading = "Skills",
  subheading = "A curated snapshot of tools and techniques I use to build AI-powered, insight-driven solutions.",
  categories = defaultCategories,
  stagger = 50,
}: SkillsSectionProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  // For staggered delays, generate a flat index map across all skills
  const cumulativeIndexes = useMemo(() => {
    const map: Record<string, number> = {}
    let idx = 0
    for (const cat of categories) {
      for (const skill of cat.skills) {
        map[`${cat.key}:${skill}`] = idx++
      }
    }
    return map
  }, [categories])

  return (
    <section
      ref={ref}
      className={cx(
        "w-full max-w-full rounded-[var(--radius)] bg-background",
        "transition-colors",
        className
      )}
      style={style}
      aria-labelledby="skills-heading"
    >
      <div className="w-full max-w-full">
        <header className="mb-6 sm:mb-8">
          <h2
            id="skills-heading"
            className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground"
          >
            {heading}
          </h2>
          {subheading ? (
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-prose">
              {subheading}
            </p>
          ) : null}
        </header>

        <div
          role="list"
          className={cx(
            "grid gap-4 sm:gap-5",
            "grid-cols-1"
          )}
        >
          {categories.map((cat) => {
            const tone = getToneClasses(cat.tone)
            return (
              <article
                key={cat.key}
                role="listitem"
                className={cx(
                  "relative rounded-[var(--radius)]",
                  "p-4 sm:p-5 md:p-6",
                  tone.surface,
                  "border border-border/60",
                  "shadow-[0_1px_0_rgba(0,0,0,0.02)]"
                )}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className={cx(
                      "inline-flex size-9 sm:size-10 items-center justify-center rounded-full",
                      "bg-card shadow-sm border border-border/60 shrink-0"
                    )}
                    aria-hidden="true"
                  >
                    {cat.icon ?? <Grid3x3 className="size-5 text-primary" aria-hidden="true" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground leading-6">
                      {cat.title}
                    </h3>
                    {cat.description ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {cat.description}
                      </p>
                    ) : null}
                  </div>
                </div>

                <ul
                  role="list"
                  className="mt-4 sm:mt-5 flex flex-wrap gap-2.5 sm:gap-3"
                >
                  {cat.skills.map((skill) => {
                    const i = cumulativeIndexes[`${cat.key}:${skill}`] ?? 0
                    const delay = `${Math.min(i * stagger, 900)}ms`
                    return (
                      <li key={skill}>
                        <SkillPill
                          label={skill}
                          toneClass={tone.badge}
                          hoverClass={tone.badgeHover}
                          ringClass={tone.ring}
                          inView={inView}
                          delay={delay}
                        />
                      </li>
                    )
                  })}
                </ul>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function SkillPill(props: {
  label: string
  toneClass: string
  hoverClass: string
  ringClass: string
  inView: boolean
  delay?: string
}) {
  const { label, toneClass, hoverClass, ringClass, inView, delay } = props
  return (
    <span
      role="listitem"
      aria-label={label}
      tabIndex={0}
      className={cx(
        "inline-flex items-center max-w-full truncate",
        "rounded-full px-3.5 py-1.5",
        "text-xs sm:text-sm font-medium",
        toneClass,
        "border border-border/60",
        "shadow-[0_1px_0_rgba(0,0,0,0.02)]",
        "transition-all duration-300 ease-out",
        hoverClass,
        "hover:shadow-md hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2",
        ringClass,
        "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "select-none"
      )}
      style={{
        transitionDelay: delay,
        transform: inView ? "translateY(0)" : "translateY(8px)",
        opacity: inView ? 1 : 0,
      }}
    >
      <span className="min-w-0 truncate">{label}</span>
    </span>
  )
}