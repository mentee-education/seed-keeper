/*
  DESIGN: "Living Earth" — Regenerative Design
  ResourceCard: Two modes — full card (grid, with photographic thumbnail)
  and compact row (list, with small thumb on desktop).
  Thumbnails come from R2 (thumbs/<id>.webp); until one exists the card
  shows category-tinted fallback art, so missing images never break layout.
*/
import { useState } from "react";
import { type Resource, type ResourceType, getCategoryColor } from "@/data/resources";
import { getThumbUrl } from "@/lib/assets";
import {
  ExternalLink,
  Calendar,
  ClipboardList,
  FileText,
  BookMarked,
  Play,
  BookOpen,
  ScrollText,
  GraduationCap,
  Users,
  Globe,
} from "lucide-react";

interface ResourceCardProps {
  resource: Resource;
  compact?: boolean;
}

// Type badges: earth-palette tints keyed to what the resource *is* —
// growth greens for teachables, water blues for media, soil tones for reference
const typeStyle: Record<ResourceType, { icon: React.ReactNode; badge: string }> = {
  "Lesson Plan": { icon: <ClipboardList size={11} />, badge: "bg-[oklch(0.93_0.035_155)] text-[oklch(0.35_0.07_155)] border border-[oklch(0.80_0.05_155)]/50" },
  "Curriculum Guide": { icon: <BookOpen size={11} />, badge: "bg-[oklch(0.95_0.03_40)] text-[oklch(0.42_0.11_40)] border border-[oklch(0.82_0.07_40)]/50" },
  "Academic Article": { icon: <FileText size={11} />, badge: "bg-[oklch(0.94_0.01_55)] text-[oklch(0.35_0.04_55)] border border-[oklch(0.82_0.02_55)]/60" },
  "Book/Literature": { icon: <BookMarked size={11} />, badge: "bg-[oklch(0.95_0.045_85)] text-[oklch(0.45_0.09_85)] border border-[oklch(0.85_0.07_85)]/60" },
  "Video": { icon: <Play size={11} />, badge: "bg-[oklch(0.94_0.03_225)] text-[oklch(0.38_0.08_225)] border border-[oklch(0.80_0.05_225)]/50" },
  "Standards Document": { icon: <ScrollText size={11} />, badge: "bg-[oklch(0.94_0.01_55)] text-[oklch(0.35_0.04_55)] border border-[oklch(0.82_0.02_55)]/60" },
  "Student Resource": { icon: <GraduationCap size={11} />, badge: "bg-[oklch(0.95_0.045_85)] text-[oklch(0.45_0.09_85)] border border-[oklch(0.85_0.07_85)]/60" },
  "Educator Resource": { icon: <Users size={11} />, badge: "bg-[oklch(0.93_0.035_155)] text-[oklch(0.35_0.07_155)] border border-[oklch(0.80_0.05_155)]/50" },
  "Website/Database": { icon: <Globe size={11} />, badge: "bg-[oklch(0.94_0.03_225)] text-[oklch(0.38_0.08_225)] border border-[oklch(0.80_0.05_225)]/50" },
};

const borderMap: Record<string, string> = {
  "Food Systems": "border-l-[oklch(0.55_0.13_40)]",
  "Water Systems": "border-l-[oklch(0.48_0.09_225)]",
  "Energy Systems": "border-l-[oklch(0.78_0.13_85)]",
  "Astronomy and Sky Knowledge": "border-l-[oklch(0.30_0.04_55)]",
  "Indigenous Pedagogy": "border-l-[oklch(0.65_0.06_155)]",
  "Curriculum and Standards": "border-l-[oklch(0.72_0.08_40)]",
  "Learning Through Literature": "border-l-[oklch(0.90_0.06_85)]",
};

// Thumbnails whose subject would be cut by a centred crop: keep heads in frame
// (top) or show the whole picture (contain) for book covers and artwork.
const thumbFit: Record<string, string> = {
  "ltl-18": "object-contain bg-soil",
  "ip-8": "object-contain bg-soil",
  "ltl-20": "object-cover object-[50%_30%]",
  "fs-8": "object-cover object-top",
  "es-17": "object-cover object-top",
  "ask-32": "object-cover object-top",
  "ask-29": "object-cover object-top",
  "ltl-12": "object-cover object-top",
};

export default function ResourceCard({ resource, compact = false }: ResourceCardProps) {
  const hasLink = resource.url && resource.url !== "#" && resource.url.startsWith("http");
  const stripe = borderMap[resource.category] || "border-l-border";
  const type = typeStyle[resource.resourceType];
  // YouTube videos use their real YouTube thumbnail; everything else uses the
  // per-resource photo. RULE: a photo appears once on the site — if a resource
  // has no photo of its own we show a quiet gradient, never a repeated image.
  const [src] = useState(
    resource.youtubeId
      ? `https://i.ytimg.com/vi/${resource.youtubeId}/hqdefault.jpg`
      : getThumbUrl(resource.id)
  );
  const [hidden, setHidden] = useState(false);
  const handleImgError = () => setHidden(true);

  if (compact) {
    return (
      <article
        className={`group bg-card rounded-lg border border-border/60 ${stripe} border-l-[3px] transition-all duration-200 hover:shadow-md hover:shadow-soil/5 px-3 py-2.5 sm:px-4 sm:py-2.5`}
      >
        {/* Desktop: single row layout */}
        <div className="hidden md:flex items-center gap-3">
          {/* Thumb */}
          {!hidden && (
            <img
              src={src}
              alt=""
              loading="lazy"
              onError={handleImgError}
              className={`w-16 h-11 rounded-md shrink-0 ${thumbFit[resource.id] || "object-cover"}`}
            />
          )}

          {/* Category badge — fixed width */}
          <span className={`text-[0.6875rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${getCategoryColor(resource.category)}`}>
            {resource.category}
          </span>

          {/* Title + Org — takes remaining space */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <h3 className="font-serif text-sm text-foreground leading-tight truncate group-hover:text-terracotta transition-colors">
                {resource.title}
              </h3>
              <span className="text-[0.6875rem] text-terracotta/60 shrink-0 hidden lg:inline">
                {resource.organization}
              </span>
            </div>
          </div>

          {/* Tags — inline */}
          <div className="flex items-center gap-1.5 shrink-0">
            {resource.gradeLevel && resource.gradeLevel !== "All" && (
              <span className="text-[0.6875rem] px-1.5 py-px rounded-full bg-sand text-soil font-medium">
                {resource.gradeLevel}
              </span>
            )}
            {resource.subject && resource.subject !== "All" && (
              <span className="text-[0.6875rem] px-1.5 py-px rounded-full bg-sage-light/50 text-sage font-medium hidden lg:inline-flex">
                {resource.subject}
              </span>
            )}
          </div>

          {/* Type badge */}
          <span
            className={`inline-flex items-center gap-1 text-[0.6875rem] font-semibold px-2 py-0.5 rounded-full shrink-0 ${type.badge}`}
            title={resource.resourceType}
          >
            {type.icon}
            <span className="hidden xl:inline">{resource.resourceType}</span>
          </span>

          {/* Link */}
          {hasLink ? (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex p-[5px] -m-[5px] text-terracotta hover:text-terracotta-light transition-colors shrink-0"
              title="View Resource"
            >
              <ExternalLink size={14} />
            </a>
          ) : (
            <span className="text-[0.6875rem] text-muted-foreground/50 italic shrink-0">
              Partners only
            </span>
          )}
        </div>

        {/* Mobile: compact two-line layout */}
        <div className="md:hidden">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className={`text-[0.6875rem] font-semibold uppercase tracking-wider px-1.5 py-px rounded-full shrink-0 ${getCategoryColor(resource.category)}`}>
              {resource.category}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[0.6875rem] font-semibold px-1.5 py-px rounded-full shrink-0 ${type.badge}`}
              title={resource.resourceType}
            >
              {type.icon}
            </span>
          </div>
          <h3 className="font-serif text-sm text-foreground leading-tight mb-1 group-hover:text-terracotta transition-colors">
            {resource.title}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[0.6875rem] text-terracotta/70">{resource.organization}</span>
              {resource.gradeLevel && resource.gradeLevel !== "All" && (
                <span className="text-[0.6875rem] px-1.5 py-px rounded-full bg-sand text-soil font-medium">
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
              <span className="text-[0.6875rem] text-muted-foreground/50 italic shrink-0">
                Partners
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  // Full card mode (grid view) — photographic thumbnail on top, civix-style
  return (
    <article
      className={`group bg-card rounded-xl border border-border/60 ${stripe} border-l-[3px] overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-soil/10 hover:-translate-y-0.5 flex flex-col h-full`}
    >
      {/* Thumbnail */}
      <div className="relative h-40 overflow-hidden shrink-0">
        {!hidden ? (
          <img
            src={src}
            alt=""
            loading="lazy"
            onError={handleImgError}
            className={`w-full h-full ${thumbFit[resource.id] || "object-cover"} transition-transform duration-500 group-hover:scale-105`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sand to-secondary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-soil/60 via-transparent to-transparent" />
        {/* Category badge overlaid */}
        <span className={`absolute bottom-2 left-3 text-[0.6875rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm ${getCategoryColor(resource.category)}`}>
          {resource.category}
        </span>
        {resource.gradeLevel && resource.gradeLevel !== "All" && (
          <span className="absolute bottom-2 right-3 text-[0.6875rem] px-2 py-0.5 rounded-full bg-cream/90 text-soil font-semibold shadow-sm">
            Grades {resource.gradeLevel}
          </span>
        )}
      </div>

      <div className="p-4 md:p-5 flex flex-col gap-2 flex-1">
        {/* Type badge row */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold px-2 py-0.5 rounded-full ${type.badge}`}
          >
            {type.icon}
            {resource.resourceType}
          </span>
          {resource.audience && resource.audience !== "Both" && (
            <span className="text-[0.6875rem] text-muted-foreground shrink-0">{resource.audience}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg text-foreground leading-snug group-hover:text-terracotta transition-colors">
          {resource.title}
        </h3>

        {/* Organization */}
        <p className="text-xs font-medium text-terracotta/80">
          {resource.organization}
        </p>

        {/* Summary */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {resource.summary}
        </p>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5">
          {resource.subject && resource.subject !== "All" && (
            <span className="text-[0.6875rem] px-2 py-0.5 rounded-full bg-sage-light/50 text-sage font-medium">
              {resource.subject}
            </span>
          )}
          {resource.focusArea && (
            <span className="text-[0.6875rem] px-2 py-0.5 rounded-full bg-turquoise-light/30 text-turquoise font-medium">
              {resource.focusArea}
            </span>
          )}
        </div>

        {/* Seasonal note */}
        {resource.seasonal && (
          <div className="flex items-center gap-1.5 text-xs text-turquoise">
            <Calendar size={12} />
            <span>{resource.seasonal}</span>
          </div>
        )}

        {/* Link — pinned to card bottom */}
        <div className="mt-auto pt-2">
          {hasLink ? (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 py-0.5 -my-0.5 text-sm font-medium text-terracotta hover:text-terracotta-light transition-colors no-underline group/link"
            >
              View Resource
              <ExternalLink size={13} className="transition-transform group-hover/link:translate-x-0.5" />
            </a>
          ) : (
            <span className="text-xs text-muted-foreground/60 italic">
              Available through workshop partners
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
