"use client"

import * as React from "react"
import { motion } from "motion/react"
import { GitCommitVertical, Dot, Milestone, Ribbon } from "lucide-react"

type ExperienceItem = {
  company: string
  title: string
  period: string
  achievements: string[]
  logoLabel?: string
}

export interface ExperienceSectionProps {
  className?: string
  items?: ExperienceItem[]
  heading?: string
  subheading?: string
}

const DEFAULT_ITEMS: ExperienceItem[] = [
  {
    company: "Space Marvel AI",
    title: "AI Engineer",
    period: "Mar 2024 — Present",
    achievements: [
      "Designed and deployed generative AI pipelines improving content throughput by 35%",
      "Built retrieval-augmented generation (RAG) with vector search to reduce hallucinations",
      "Created evaluation harnesses and prompt tooling enabling rapid iteration and A/B testing",
      "Built and deployed AI agents for automating customer onboarding and support workflows using n8n, Langchain, crewai.",
      "Designed intelligent backend APIs for AI-powered recommendation systems and integrating models into the pipeline",
      "Integrated GPT-powered chatbots with frontend(Streamlit) using LangChain and FastAPI.",
      "Automated repetitive decision workflows using LLMs and vector databases.",
      "Implemented cloud-native backend architecture using Azure & Docker.",
    ],
    logoLabel: "SM",
  },
  {
    company: "VMSCOUT",
    title: "Network Analyst",
    period: "Aug 2023 — Feb 2024",
    achievements: [
      "Managed email domains and enhanced team collaboration via SharePoint",
      "Configured and maintained network cameras, ensuring security and functionality.",
      "Provided remote and on-site support, minimizing user downtime.",
    ],
    logoLabel: "VM",
  },
  {
    company: "Value Point Systems",
    title: "Cloud Associate",
    period: "Jan 2023 — Jul 2023",
    achievements: [
      "Implemented IaC modules (Terraform) to standardize VPC and IAM baselines",
      "Led infrastructure setup and managed seamless mail migrations for clients.",
      "Implemented hybrid cloud setups and VDI solutions, improving scalability",
    ],
    logoLabel: "VP",
  },
  {
    company: "Cloud Enabled",
    title: "Cloud DevOps Intern",
    period: "Jun 2022 — Dec 2022",
    achievements: [
      "Built CI workflows with caching to reduce pipeline time by 25%",
      "Streamlined operations through task automation and DevOps optimizations.",
    ],
    logoLabel: "CE",
  },
]

function CompanyAvatar({ label }: { label?: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground ring-1 ring-border"
    >
      <span className="text-sm font-semibold tracking-wide">{label ?? "—"}</span>
    </div>
  )
}

function AchievementItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="relative flex items-start gap-3">
      <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted ring-1 ring-border">
        <Dot className="h-3 w-3 text-primary" aria-hidden="true" />
      </span>
      <p className="text-sm leading-relaxed text-foreground/90 break-words">
        {children}
      </p>
    </li>
  )
}

export default function ExperienceSection({
  className,
  items = DEFAULT_ITEMS,
  heading = "Experience",
  subheading = "A concise timeline of roles, responsibilities, and impact.",
}: ExperienceSectionProps) {
  return (
    <section
      className={["w-full max-w-full", className].filter(Boolean).join(" ")}
      aria-labelledby="experience-heading"
    >
      <div className="mb-6">
        <div className="flex items-center gap-2 text-primary">
          <Ribbon className="h-5 w-5" aria-hidden="true" />
          <span className="text-xs font-medium uppercase tracking-wide">Work History</span>
        </div>
        <h2
          id="experience-heading"
          className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-foreground"
        >
          {heading}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{subheading}</p>
      </div>

      <ol
        role="list"
        className="relative pl-7 sm:pl-9"
        aria-label="Professional timeline"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 sm:left-4 top-0 h-full w-px bg-border"
        />
        {items.map((item, idx) => (
          <motion.li
            key={`${item.company}-${item.title}-${idx}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
            className="relative mb-6 last:mb-0"
          >
            <span
              aria-hidden="true"
              className="absolute -left-[23px] sm:-left-[26px] top-2.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-card text-primary ring-2 ring-border shadow-sm"
            >
              <GitCommitVertical className="h-3.5 w-3.5" />
            </span>

            <article
              className="w-full max-w-full rounded-lg bg-card ring-1 ring-border shadow-sm hover:shadow transition-shadow duration-300"
              aria-label={`${item.title} at ${item.company}`}
            >
              <div className="flex flex-col gap-4 p-4 sm:p-5">
                <div className="flex items-start gap-4 min-w-0">
                  <CompanyAvatar label={item.logoLabel ?? item.company.slice(0, 2).toUpperCase()} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground break-words">
                        {item.title}
                      </h3>
                      <div className="inline-flex items-center gap-1 text-xs sm:text-sm text-primary">
                        <Milestone className="h-4 w-4" aria-hidden="true" />
                        <span className="font-medium">{item.company}</span>
                      </div>
                    </div>
                    <div className="mt-1 text-xs sm:text-sm text-muted-foreground">
                      {item.period}
                    </div>
                  </div>
                </div>

                <ul className="mt-1 grid gap-2">
                  {item.achievements.map((ach, i) => (
                    <AchievementItem key={i}>{ach}</AchievementItem>
                  ))}
                </ul>
              </div>
            </article>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}
