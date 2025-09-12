"use client"

import * as React from "react"
import { Github, Linkedin, Medal, BrainCog, Badge as BadgeIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export type Certification = {
  id: string
  title: string
  org: "Microsoft" | "DeepLearning.AI"
}

export type CertificationsFooterProps = {
  className?: string
  style?: React.CSSProperties
  certifications?: Certification[]
  showClosingStatement?: boolean
  resumeUrl?: string
  email?: string
}

export function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ")
}

const DEFAULT_CERTIFICATIONS: Certification[] = [
  { id: "pp-fundamentals", title: "Power Platform Fundamentals", org: "Microsoft" },
  { id: "python", title: "Python", org: "Microsoft" },
  { id: "az-fundamentals", title: "Azure Fundamentals", org: "Microsoft" },
  { id: "networking", title: "Networking Fundamentals", org: "Microsoft" },
  { id: "databases", title: "Databases", org: "Microsoft" },
  { id: "data-analytics", title: "Data Analytics", org: "Microsoft" },
  { id: "ai-voice-agents", title: "Building AI Voice Agents", org: "DeepLearning.AI" },
]

function OrgEmblem({ org, className }: { org: Certification["org"]; className?: string }) {
  if (org === "DeepLearning.AI") {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#0E7C66]/15 ring-1 ring-[#0E7C66]/30",
          className
        )}
      >
        <BrainCog className="h-3.5 w-3.5 text-[#0E7C66]" />
      </span>
    )
  }
  // Microsoft-inspired quad (abstract, not a logo)
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-grid h-6 w-6 grid-cols-2 grid-rows-2 overflow-hidden rounded-[6px] ring-1 ring-border",
        className
      )}
    >
      <i className="block bg-[#F25022]" />
      <i className="block bg-[#7FBA00]" />
      <i className="block bg-[#00A4EF]" />
      <i className="block bg-[#FFB900]" />
    </span>
  )
}

export default function CertificationsFooter({
  className,
  style,
  certifications = DEFAULT_CERTIFICATIONS,
  showClosingStatement = true,
  resumeUrl,
  email = "mailto:sandhyavathi.g890@gmail.com"
}: CertificationsFooterProps) {
  const onDownloadResume = React.useCallback(() => {
    if (resumeUrl) {
      // Let anchor handle actual download navigation
      return
    }
    toast("Resume download", {
      description: "The resume will be available shortly.",
    })
  }, [resumeUrl])

  return (
    <section
      className={cn(
        "w-full bg-secondary text-foreground",
        "rounded-[calc(var(--radius)+2px)]",
        "border border-border",
        className
      )}
      style={style}
      aria-label="Certifications and site footer"
    >
      <div className="w-full max-w-full p-6 sm:p-8">
        <header className="mb-5 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-foreground">
            Certifications
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Validated skills across Microsoft technologies and modern AI.
          </p>
        </header>

        <ul
          className={cn(
            "flex w-full flex-wrap gap-3 sm:gap-4",
            "min-w-0"
          )}
        >
          {certifications.map((c) => (
            <li key={c.id} className="min-w-0">
              <div
                className={cn(
                  "group inline-flex items-center gap-2 rounded-full",
                  "bg-card text-foreground border border-border",
                  "px-3.5 py-2 sm:px-4 sm:py-2.5",
                  "shadow-sm transition-all duration-200",
                  "hover:-translate-y-0.5 hover:shadow-md focus-within:-translate-y-0.5",
                  "min-w-0"
                )}
              >
                <OrgEmblem org={c.org} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[13px] sm:text-sm font-medium truncate max-w-[14rem] sm:max-w-[18rem]">
                      {c.title}
                    </span>
                    <Badge
                      variant="secondary"
                      className="hidden sm:inline-flex items-center gap-1 bg-muted text-foreground/80 ring-1 ring-border"
                    >
                      <Medal className="h-3.5 w-3.5 text-[#2e6b4a]" aria-hidden="true" />
                      <span className="text-[11px]">Certified</span>
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground">
                    {c.org}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Separator className="my-8 bg-border" />

        <footer className="grid w-full gap-6 sm:gap-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">Get in touch</p>
              <p className="text-sm text-muted-foreground break-words">
                {email}
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="https://www.linkedin.com/in/sandhyavathi/"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn"
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-full",
                  "bg-card text-foreground border border-border",
                  "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/Sandhyavathi"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub"
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-full",
                  "bg-card text-foreground border border-border",
                  "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
              >
                <Github className="h-5 w-5" />
              </a>

              {resumeUrl ? (
                <a
                  href={resumeUrl}
                  download
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full",
                    "bg-primary text-primary-foreground",
                    "px-4 py-2.5 text-sm font-medium",
                    "transition-colors hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                  onClick={onDownloadResume}
                >
                  <BadgeIcon className="h-4 w-4" aria-hidden="true" />
                  <span>Download Resume</span>
                </a>
              ) : (
                <Button
                  type="button"
                  onClick={onDownloadResume}
                  className={cn(
                    "rounded-full px-4 py-2.5 text-sm font-medium",
                    "bg-primary text-primary-foreground hover:opacity-95"
                  )}
                >
                  <BadgeIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                  Download Resume
                </Button>
              )}
            </div>
          </div>

          {showClosingStatement && (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Thank you for visiting.
              </p>
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Sandhyavathi G • All rights reserved
              </p>
            </div>
          )}
        </footer>
      </div>
    </section>
  )
}
