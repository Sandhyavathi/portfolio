"use client";

import * as React from "react";
import { GraduationCap, University, Milestone } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type EducationItem = {
  degree: string;
  duration: string;
  institution: string;
  gradeLabel: string;
  gradeValue: string;
};

type EducationSectionProps = {
  className?: string;
  items?: EducationItem[];
  heading?: string;
  subheading?: string;
};

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;
    let observer: IntersectionObserver | null = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            // Once visible, disconnect to avoid re-triggering
            observer && observer.disconnect();
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.2,
        ...(options || {}),
      }
    );
    observer.observe(ref.current);
    return () => {
      observer && observer.disconnect();
      observer = null;
    };
  }, [options]);

  return { ref, inView };
}

const defaultItems: EducationItem[] = [
  {
    degree: "M.Sc. in Data Science",
    duration: "2023 – 2025",
    institution: "REVA University",
    gradeLabel: "CGPA",
    gradeValue: "8.32",
  },
  {
    degree: "B.Sc. in Cloud Computing & Big Data",
    duration: "2019 – 2022",
    institution: "REVA University",
    gradeLabel: "GPA",
    gradeValue: "7.63",
  },
];

function BadgePill(props: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-chart-1" aria-hidden="true" />
      <span className="text-muted-foreground">{props.label}</span>
      <span className="font-semibold text-foreground">{props.value}</span>
    </div>
  );
}

function TimelineDecor() {
  // Decorative organic vertical curve running behind the markers
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 hidden h-full w-12 text-chart-1/30 md:block"
      viewBox="0 0 48 800"
      preserveAspectRatio="none"
    >
      <path
        d="
          M24,40
          C 16,120 36,180 24,260
          C 12,340 36,420 24,500
          C 12,580 34,660 24,740
        "
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_1px_0_rgba(0,0,0,0.04)]"
      />
    </svg>
  );
}

function TimelineMarker(props: { index: number }) {
  return (
    <div className="relative z-10 flex flex-col items-center">
      <div
        className="relative grid size-4 place-items-center rounded-full border border-border bg-secondary shadow-sm"
        aria-hidden="true"
      >
        <div className="size-2 rounded-full bg-chart-1" />
      </div>
      {props.index === 0 ? (
        <div className="hidden h-6 w-px bg-gradient-to-b from-chart-1/40 to-chart-1/0 md:block" aria-hidden="true" />
      ) : null}
    </div>
  );
}

function EducationCard(props: { item: EducationItem; delay?: number }) {
  const { item, delay = 0 } = props;
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Card
      ref={ref}
      role="article"
      aria-labelledby={`${item.degree}-title`}
      className={[
        "group relative z-10 w-full overflow-hidden rounded-lg bg-card shadow-sm ring-1 ring-border transition-all duration-300",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      ].join(" ")}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-secondary/40 via-transparent to-chart-4/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <CardHeader className="flex flex-col gap-2 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="size-4 text-chart-1" aria-hidden="true" />
              <span className="truncate">{item.duration}</span>
            </div>
            <h3
              id={`${item.degree}-title`}
              className="mt-1 text-base font-semibold leading-snug text-foreground sm:text-lg"
            >
              {item.degree}
            </h3>
          </div>
          <BadgePill label={item.gradeLabel} value={item.gradeValue} />
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="inline-flex size-6 items-center justify-center rounded-md bg-secondary text-primary ring-1 ring-border">
            <University className="size-3.5" aria-hidden="true" />
          </span>
          <p className="font-medium text-foreground">{item.institution}</p>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Milestone className="size-3 text-chart-2" aria-hidden="true" />
          <span className="break-words">
            Academic milestone achieved with focus on analytical rigor and practical projects.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function EducationSection({
  className,
  items = defaultItems,
  heading = "Education",
  subheading = "A focused academic journey grounded in data and cloud foundations",
}: EducationSectionProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const { ref: headerRef, inView: headerInView } = useInView<HTMLDivElement>();

  return (
    <section
      ref={containerRef}
      aria-labelledby="education-heading"
      className={["relative w-full max-w-full", className || ""].join(" ")}
    >
      <div className="mb-6 flex items-end justify-between gap-4">
        <div
          ref={headerRef}
          className={[
            "transition-all duration-500",
            headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
          ].join(" ")}
        >
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <span className="inline-flex size-7 items-center justify-center rounded-md bg-secondary ring-1 ring-border">
              <GraduationCap className="size-4" aria-hidden="true" />
            </span>
            <span>Academic Timeline</span>
          </div>
          <h2 id="education-heading" className="mt-2 text-xl font-bold sm:text-2xl">
            {heading}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">{subheading}</p>
        </div>
      </div>

      <div className="relative grid w-full grid-cols-[3rem_1fr] gap-4 sm:gap-6">
        <div className="relative">
          <TimelineDecor />
        </div>

        <div className="relative" />

        <div className="relative flex flex-col items-center">
          {/* top spacer to align the first marker aesthetically */}
          <div className="hidden h-2 w-px md:block" aria-hidden="true" />
          <TimelineMarker index={0} />
        </div>
        <div className="min-w-0">
          <EducationCard item={items[0]} delay={80} />
        </div>

        <div className="relative flex flex-col items-center">
          {/* connector between markers (subtle line on small screens) */}
          <div className="my-2 h-6 w-px bg-gradient-to-b from-chart-1/25 to-chart-1/40 md:h-10" aria-hidden="true" />
          <TimelineMarker index={1} />
        </div>
        <div className="min-w-0">
          <EducationCard item={items[1]} delay={180} />
        </div>
      </div>
    </section>
  );
}