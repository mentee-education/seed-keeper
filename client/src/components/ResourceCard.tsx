/*
  DESIGN: "Living Earth" — Regenerative Design
  ResourceCard: Two modes — full card (grid) and compact row (list)
  Compact mode: single-row on desktop, tight two-line on mobile
*/
import { type Resource, getCategoryColor, getResourceTypeIcon } from "@/data/resources";
import { ExternalLink, Calendar } from "lucide-react";

interface ResourceCardProps {
  resource: Resource;
  compact?: boolean;
}

const borderMap: Record<string, string> = {
  "Food Systems": "border-l-[oklch(0.55_0.13_40)]",
  "Water Systems": "border-l-[oklch(0.48_0.09_225)]",
  "Energy Systems": "border-l-[oklch(0.78_0.13_85)]",
  "Astronomy & Sky Knowledge": "border-l-[oklch(0.30_0.04_55)]",
  "Indigenous Pedagogy": "border-l-[oklch(0.65_0.06_155)]",
  "Curriculum & Standards": "border-l-[oklch(0.72_0.08_40)]",
  "Learning Through Literature": "border-l-[oklch(0.90_0.06_85)]",
};

export default function ResourceCard({ resource, compact = false }: ResourceCardProps) {
  const hasLink = resource.url && resource.url !== "#" && resource.url.startsWith("http");
  const stripe = borderMap[resource.category] || "border-l-border";

  if (compact) {
    return (
      <article
        className={`group bg-card rounded-lg border border-border/60 ${stripe} border-l-[3px] transition-all duration-200 hover:shadow-md hover:shadow-soil/5 px-3 py-2.5 sm:px-4 sm:py-2.5`}
      >
        {/* Desktop: single row layout */}
        <div className="hidden md:flex items-center gap-3">
          {/* Category badge — fixed width */}
          <span className={`text-[0.6rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${getCategoryColor(resource.category)}`}>
            {resource.category}
          </span>

          {/* Title + Org — takes remaining space */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <h3 className="font-serif text-sm text-foreground leading-tight truncate group-hover:text-terracotta transition-colors">
                {resource.title}
              </h3>
              <span className="text-[0.65rem] text-terracotta/60 shrink-0 hidden lg:inline">
                {resource.organization}
              </span>
            </div>
          </div>

          {/* Tags — inline */}
          <div className="flex items-center gap-1.5 shrink-0">
            {resource.gradeLevel && resource.gradeLevel !== "All" && (
              <span className="text-[0.6rem] px-1.5 py-px rounded-full bg-sand text-soil font-medium">
                {resource.gradeLevel}
              </span>
            )}
            {resource.subject && resource.subject !== "All" && (
              <span className="text-[0.6rem] px-1.5 py-px rounded-full bg-sage-light/50 text-sage font-medium hidden lg:inline-flex">
                {resource.subject}
              </span>
            )}
          </div>

          {/* Type icon */}
          <span className="text-xs text-muted-foreground shrink-0" title={resource.resourceType}>
            {getResourceTypeIcon(resource.resourceType)}
          </span>

          {/* Link */}
          {hasLink ? (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-terracotta hover:text-terracotta-light transition-colors shrink-0"
              title="View Resource"
            >
              <ExternalLink size={14} />
            </a>
          ) : (
            <span className="text-[0.6rem] text-muted-foreground/50 italic shrink-0">
              Partners only
            </span>
          )}
        </div>

        {/* Mobile: compact two-line layout */}
        <div className="md:hidden">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className={`text-[0.55rem] font-semibold uppercase tracking-wider px-1.5 py-px rounded-full shrink-0 ${getCategoryColor(resource.category)}`}>
              {resource.category}
            </span>
            <span className="text-[0.65rem] text-muted-foreground shrink-0">
              {getResourceTypeIcon(resource.resourceType)}
            </span>
          </div>
          <h3 className="font-serif text-sm text-foreground leading-tight mb-1 group-hover:text-terracotta transition-colors">
            {resource.title}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[0.6rem] text-terracotta/70">{resource.organization}</span>
              {resource.gradeLevel && resource.gradeLevel !== "All" && (
                <span className="text-[0.55rem] px-1.5 py-px rounded-full bg-sand text-soil font-medium">
                  {resource.gradeLevel}
                </span>
              )}
            </div>
            {hasLink ? (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-terracotta hover:text-terracotta-light transition-colors shrink-0"
              >
                <ExternalLink size={13} />
              </a>
            ) : (
              <span className="text-[0.55rem] text-muted-foreground/50 italic shrink-0">
                Partners
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  // Full card mode (grid view)
  return (
    <article
      className={`group bg-card rounded-lg border border-border/60 ${stripe} border-l-[3px] transition-all duration-300 hover:shadow-lg hover:shadow-soil/5 hover:-translate-y-0.5 p-5 md:p-6`}
    >
      {/* Top row: category badge + type */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className={`text-[0.65rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${getCategoryColor(resource.category)}`}>
          {resource.category}
        </span>
        <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
          <span>{getResourceTypeIcon(resource.resourceType)}</span>
          <span className="hidden sm:inline">{resource.resourceType}</span>
        </span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-lg text-foreground leading-snug mb-2 group-hover:text-terracotta transition-colors">
        {resource.title}
      </h3>

      {/* Organization */}
      <p className="text-xs font-medium text-terracotta/80 mb-2">
        {resource.organization}
      </p>

      {/* Summary */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
        {resource.summary}
      </p>

      {/* Tags row */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {resource.gradeLevel && resource.gradeLevel !== "All" && (
          <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-sand text-soil font-medium">
            Grades {resource.gradeLevel}
          </span>
        )}
        {resource.subject && resource.subject !== "All" && (
          <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-sage-light/50 text-sage font-medium">
            {resource.subject}
          </span>
        )}
        {resource.audience && resource.audience !== "Both" && (
          <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-golden-light/50 text-soil font-medium">
            {resource.audience}
          </span>
        )}
        {resource.focusArea && (
          <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-turquoise-light/30 text-turquoise font-medium hidden sm:inline-flex">
            {resource.focusArea}
          </span>
        )}
      </div>

      {/* Seasonal note */}
      {resource.seasonal && (
        <div className="flex items-center gap-1.5 text-xs text-turquoise mb-3">
          <Calendar size={12} />
          <span>{resource.seasonal}</span>
        </div>
      )}

      {/* Link */}
      {hasLink ? (
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-terracotta hover:text-terracotta-light transition-colors no-underline group/link"
        >
          View Resource
          <ExternalLink size={13} className="transition-transform group-hover/link:translate-x-0.5" />
        </a>
      ) : (
        <span className="text-xs text-muted-foreground/60 italic">
          Available through workshop partners
        </span>
      )}
    </article>
  );
}
