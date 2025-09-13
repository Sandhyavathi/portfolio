"use client";

import * as React from "react";
import { LayoutGrid, Tags, Github } from "lucide-react";

type Project = {
  title: string;
  subtitle?: string;
  description: string;
  details?: string;
  tech: string[];
  image: string;
  imageAlt: string;
  accentClass: string;
  repoUrl?: string;
};

export interface ProjectsSectionProps {
  className?: string;
  projects?: Project[];
}

const DEFAULT_PROJECTS: Project[] = [
  {
    title: "AI Voice Agent",
    subtitle: "Real-time conversational AI",
    description:
      "Built real-time conversational AI using LiveKit and OpenAI APIs with WebRTC for low-latency audio streaming.",
    details:
      "Implemented Speech-to-Text → LLM → Text-to-Speech pipeline with voice activity detection and interruption handling. Optimized for sub-200ms response times and deployed on cloud infrastructure for concurrent users. ",
    tech: ["WebRTC", "VAD", "Whisper", "LiveKit", "OpenAI Realtime", "AI Agent", "Voice Agent"],
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=60",
    imageAlt: "Headphones and microphone representing voice technology",
    accentClass: "bg-[color:var(--chart-1)]", // deep green
    repoUrl: "https://github.com",
  },
  {
    title: "Lead Generation API",
    subtitle: "",
    description:
      "Developed FastAPI backend system using Search API for automated B2B lead discovery and company intelligence. Built async processing pipeline with SQLite database, automated company data extraction, and CSV/JSON export functionality. Implemented company information parsing with confidence scoring and location/industry detection algorithms.  ",
    details:
      "Features smart rate-limiting, multi-provider fallbacks, and batched scoring for cost-optimal throughput.",
    tech: ["LLM", "API Automation", "MySQL"],
    image:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1600&q=60",
    imageAlt: "Code on screen with terminal and editor",
    accentClass: "bg-[color:var(--chart-3)]", // forest
    repoUrl: "https://github.com",
  },
  {
    title: "YouTube Script Assistant",
    subtitle: "Research → outline → script",
    description:
      "AI-based tool to generate YouTube scripts using Cohere API, FastAPI for backend, and Streamlit for a user-friendly interface. ",
    details:"",
    tech: ["Streamlit", "Cohere API", "LLM", "Prompt Engineering", "FastAPI"],
    image:
      "https://images.unsplash.com/photo-1517059224940-d4af9eec41e5?auto=format&fit=crop&w=1600&q=60",
    imageAlt: "Creative workstation with camera and laptop",
    accentClass: "bg-[color:var(--chart-5)]", // warm orange
    repoUrl: "https://github.com",
  },
  {
    title: "E‑Commerce Analysis",
    subtitle: "Behavior + cohort analytics",
    description:
      "Analyzed sales trends, product performance, and customer segmentation using Python. Performed data cleaning, transformation, and visualization with Pandas and Matplotlib. ",
    details:
      "Warehouse-native modeling, BI-ready metrics, and automated weekly insights with deltas.",
    tech: ["Pandas", "Python", "Matplotlib", "Data Analysis"],
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=60",
    imageAlt: "Analytics dashboard on display with charts",
    accentClass: "bg-[color:var(--chart-2)]", // sandy orange
    repoUrl: "https://github.com",
  },
  {
    title: "Sales Forecasting",
    subtitle: "Time-series forecasting",
    description:
      "Used ARIMA for time series analysis and forecasted sales trends to aid business decisions on inventory and marketing strategies.",
    details:"",
    tech: ["ARIMA", "Time series analysis"],
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1600&q=60",
    imageAlt: "Close-up of graphs and data visualizations",
    accentClass: "bg-[color:var(--primary)]", // earthy primary
    repoUrl: "https://github.com",
  },
];

export default function ProjectsSection({
  className,
  projects = DEFAULT_PROJECTS,
}: ProjectsSectionProps) {
  const [visibleMap, setVisibleMap] = React.useState<Record<number, boolean>>({});

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const elements = document.querySelectorAll<HTMLDivElement>("[data-project-card]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const indexAttr = entry.target.getAttribute("data-index");
          if (!indexAttr) return;
          const index = parseInt(indexAttr, 10);
          if (entry.isIntersecting) {
            setVisibleMap((prev) => (prev[index] ? prev : { ...prev, [index]: true }));
          }
        });
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );

    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [projects.length]);

  return (
    <section
      className={[
        "relative w-full rounded-[var(--radius)] bg-secondary",
        "ring-1 ring-[color:var(--border)]",
        "overflow-hidden",
        className || "",
      ].join(" ")}
      aria-label="Featured projects"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(46,107,74,0.08) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="relative p-6 sm:p-8">
        <header className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-[color:var(--hero)]">
            <LayoutGrid className="h-5 w-5" aria-hidden="true" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Featured Projects
            </h2>
          </div>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-prose">
            A selection of applied AI and data projects with concise tech stacks. Hover or focus cards to reveal more.
          </p>
        </header>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {projects.map((p, i) => {
            const isVisible = !!visibleMap[i];
            return (
              <div
                key={p.title + i}
                data-project-card
                data-index={i}
                className={[
                  "group relative mb-6 break-inside-avoid",
                  "rounded-[calc(var(--radius))] bg-card text-card-foreground",
                  "border border-[color:var(--border)] shadow-sm",
                  "outline-none focus-within:ring-2 focus-within:ring-[color:var(--ring)]",
                  "transition-transform duration-300 ease-out",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6",
                ].join(" ")}
                style={{
                  transitionDelay: isVisible ? `${i * 80}ms` : "0ms",
                }}
              >
                <div className={["absolute top-0 left-0 h-1 w-full", p.accentClass].join(" ")} />
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none"
                />
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3
                        className="text-base sm:text-lg font-semibold tracking-tight truncate"
                        title={p.title}
                      >
                        {p.title}
                      </h3>
                      {p.subtitle ? (
                        <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground truncate">
                          {p.subtitle}
                        </p>
                      ) : null}
                    </div>

                    {p.repoUrl ? (
                      <a
                        href={p.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${p.title} repository on GitHub`}
                        className={[
                          "shrink-0 inline-flex items-center justify-center rounded-md",
                          "h-8 w-8 border border-[color:var(--border)] bg-muted/60",
                          "text-foreground/70 hover:text-foreground",
                          "hover:bg-muted focus-visible:outline-none",
                          "focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]",
                          "transition-colors",
                        ].join(" ")}
                      >
                        <Github className="h-4 w-4" aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>

                  <p className="mt-3 text-sm text-foreground/80 leading-relaxed line-clamp-3 group-focus-within:line-clamp-none transition-[line-clamp]">
                    {p.description}
                  </p>

                  {p.details ? (
                    <div
                      className={[
                        "relative",
                        "max-h-0 overflow-hidden",
                        "group-focus-within:max-h-40",
                        "transition-[max-height] duration-300 ease-in-out",
                      ].join(" ")}
                    >
                      <div className="mt-3 text-sm text-foreground/80">
                        <p className="leading-relaxed">{p.details}</p>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-4">
                    <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                      <Tags className="h-4 w-4" aria-hidden="true" />
                      <span className="text-xs font-medium">Tech</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {p.tech.map((t) => (
                        <span
                          key={t}
                          className={[
                            "inline-flex items-center rounded-full",
                            "px-2.5 py-1 text-[11px] font-medium",
                            "bg-muted text-muted-foreground",
                            "ring-1 ring-[color:var(--border)]",
                          ].join(" ")}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className={[
                    "pointer-events-none absolute inset-x-0 bottom-0 h-10",
                    "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
                    "transition-opacity",
                  ].join(" ")}
                  aria-hidden="true"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(243,239,231,0.8), rgba(243,239,231,0))",
                  }}
                />
                <div
                  className={[
                    "absolute inset-0 rounded-[calc(var(--radius))]",
                    "ring-0 group-hover:ring-1 group-focus-within:ring-1",
                    "ring-[color:var(--ring)]/30 transition-shadow",
                    "shadow-none group-hover:shadow-[0_8px_24px_rgba(18,21,18,0.08)]",
                  ].join(" ")}
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
