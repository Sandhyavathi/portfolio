"use client";

import * as React from "react";
import { GraduationCap, Award, BookOpen } from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────

const EDUCATION = [
  {
    degree: "M.Sc. Data Science",
    institution: "REVA University",
    period: "2023 – 2025",
    gpa: "8.32 / 10",
    highlights: ["AI & ML specialisation", "IEEE-published research", "KSCST Award recipient"],
    accent: "from-white/30 to-blue-300/40",
  },
  {
    degree: "B.Sc. Cloud Computing & Big Data",
    institution: "REVA University",
    period: "2019 – 2022",
    gpa: "7.63 / 10",
    highlights: ["Cloud infrastructure fundamentals", "Big data processing", "Database systems"],
    accent: "from-white/20 to-blue-200/30",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────

function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Education card ────────────────────────────────────────────────────────

function EducationCard({
  item,
  delay,
}: {
  item: (typeof EDUCATION)[number];
  delay: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#111118] p-5 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Top accent line */}
      <div className={["absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r", item.accent].join(" ")} />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/8">
            <GraduationCap className="h-4.5 w-4.5 text-white/60" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white leading-snug">{item.degree}</h3>
            <p className="mt-0.5 text-xs font-medium text-white/45">{item.institution}</p>
            <p className="mt-0.5 text-xs text-white/35 font-mono">{item.period}</p>
          </div>
        </div>
        <div className="shrink-0 rounded-xl border border-white/8 bg-white/5 px-3 py-1.5 text-center">
          <p className="text-[11px] text-white/40 uppercase tracking-wider">GPA</p>
          <p className="text-sm font-bold text-white/80">{item.gpa}</p>
        </div>
      </div>

      {/* Highlights */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {item.highlights.map((h) => (
          <span
            key={h}
            className="rounded-full border border-white/6 bg-white/4 px-2.5 py-1 text-[11px] text-white/45"
          >
            {h}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────

export default function EducationSection({ className }: { className?: string }) {
  const { ref: headRef, inView: headInView } = useInView<HTMLDivElement>();

  return (
    <section className={["w-full", className].filter(Boolean).join(" ")} aria-labelledby="education-heading">
      {/* Header */}
      <div
        ref={headRef}
        className="mb-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ opacity: headInView ? 1 : 0, transform: headInView ? "translateY(0)" : "translateY(20px)" }}
      >
        <span className="section-label">
          <BookOpen className="h-3 w-3" />
          Education
        </span>
        <h2 id="education-heading" className="mt-4 text-2xl sm:text-3xl font-bold text-white">
          Academic background
        </h2>
        <p className="mt-2 text-sm sm:text-base text-white/45 max-w-xl">
          Built on strong data science and cloud fundamentals at REVA University.
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4">
        {EDUCATION.map((item, i) => (
          <EducationCard key={item.degree} item={item} delay={i * 100} />
        ))}
      </div>
    </section>
  );
}
