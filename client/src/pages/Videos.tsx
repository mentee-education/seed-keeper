/*
  DESIGN: "Living Earth" — Regenerative Design
  Videos: Filterable library with real embedded YouTube players.
  Titles without a YouTube source (PBS LearningMedia etc.) show their
  photographic card and open directly in the source's own player.
*/
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { resources, getCategoryColor, GRADE_LEVELS, type Resource } from "@/data/resources";
import { getThumbUrl } from "@/lib/assets";

function getYouTubeId(r: Resource): string | null {
  if (r.youtubeId) return r.youtubeId;
  const m = r.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return m ? m[1] : null;
}

function sourceLabel(url: string): string {
  if (url.includes("pbslearningmedia.org")) return "Watch on PBS LearningMedia";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "Open on YouTube";
  try {
    return `Watch at ${new URL(url).hostname.replace("www.", "")}`;
  } catch {
    return "Watch";
  }
}

function VideoCard({ resource, index }: { resource: Resource; index: number }) {
  const ytId = getYouTubeId(resource);
  const [imgOk, setImgOk] = useState(true);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.25) }}
      className="group bg-card rounded-xl border border-border/60 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-soil/10 transition-all duration-300 flex flex-col"
    >
      {/* Real embedded player when the video lives on YouTube */}
      <div className="relative bg-soil" style={{ aspectRatio: "16/9" }}>
        {ytId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0`}
            title={resource.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 block group/play"
            aria-label={`${sourceLabel(resource.url)}: ${resource.title}`}
          >
            {imgOk && (
              <img
                src={getThumbUrl(resource.id)}
                alt=""
                loading="lazy"
                onError={() => setImgOk(false)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-soil/70 via-soil/10 to-transparent" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-16 h-16 rounded-full bg-cream/95 flex items-center justify-center shadow-xl transition-all group-hover/play:scale-110">
                <Play size={24} className="text-terracotta ml-1" fill="currentColor" />
              </span>
            </span>
          </a>
        )}
        {/* Category badge */}
        {!ytId && (
          <span className={`absolute top-3 left-3 text-[0.6rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm pointer-events-none ${getCategoryColor(resource.category)}`}>
            {resource.category}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 md:p-5 flex flex-col gap-2 flex-1">
        {ytId && (
          <span className={`self-start text-[0.6rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${getCategoryColor(resource.category)}`}>
            {resource.category}
          </span>
        )}
        <h3 className="font-serif text-lg text-foreground leading-snug">
          {resource.title}
        </h3>
        <p className="text-xs font-medium text-terracotta/90">{resource.organization}</p>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {resource.summary}
        </p>
        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-turquoise hover:text-terracotta transition-colors no-underline"
          >
            {sourceLabel(resource.url)}
            <ExternalLink size={13} />
          </a>
          {resource.gradeLevel && resource.gradeLevel !== "All" && (
            <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-sand text-soil font-medium shrink-0">
              Grades {resource.gradeLevel}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function Videos() {
  const allVideos = useMemo(() => resources.filter((r) => r.resourceType === "Video"), []);
  const [category, setCategory] = useState<string>("All");
  const [grade, setGrade] = useState<string>("All");
  const [source, setSource] = useState<string>("All");

  const categories = useMemo(
    () => Array.from(new Set(allVideos.map((v) => v.category))),
    [allVideos]
  );
  const grades = useMemo(
    () => GRADE_LEVELS.filter((g) => g !== "All" && allVideos.some((v) => v.gradeLevel === g)),
    [allVideos]
  );

  const videos = allVideos.filter((v) => {
    if (category !== "All" && v.category !== category) return false;
    if (grade !== "All" && v.gradeLevel !== grade && v.gradeLevel !== "All") return false;
    if (source === "Plays here" && !getYouTubeId(v)) return false;
    if (source === "External" && getYouTubeId(v)) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header — light, consistent with the rest of the site */}
      <section className="relative overflow-hidden bg-sand border-b border-border">
        <div className="grain" />
        <div className="relative container py-12 md:py-16">
          <p className="text-terracotta text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            Video Library
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground mb-3">
            Watch &amp; Learn
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed text-sm md:text-base">
            {allVideos.length} classroom-ready films and series on Indigenous foodways,
            water, energy, sky knowledge, and storytelling — most play right here.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-[72px] md:top-[92px] z-40 bg-cream/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container py-3 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCategory("All")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              category === "All"
                ? "bg-terracotta text-white shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-terracotta/40"
            }`}
          >
            All ({allVideos.length})
          </button>
          {categories.map((c) => {
            const n = allVideos.filter((v) => v.category === c).length;
            return (
              <button
                key={c}
                onClick={() => setCategory(category === c ? "All" : c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  category === c
                    ? "bg-terracotta text-white shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-terracotta/40"
                }`}
              >
                {c} ({n})
              </button>
            );
          })}
          <div className="ml-auto flex items-center gap-2">
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className={`appearance-none border rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-terracotta/30 ${
                grade !== "All" ? "bg-terracotta/5 border-terracotta/30 text-terracotta" : "bg-card border-border text-foreground"
              }`}
            >
              <option value="All">All Grades</option>
              {grades.map((g) => (
                <option key={g} value={g}>Grades {g}</option>
              ))}
            </select>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className={`appearance-none border rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-terracotta/30 ${
                source !== "All" ? "bg-terracotta/5 border-terracotta/30 text-terracotta" : "bg-card border-border text-foreground"
              }`}
            >
              <option value="All">All Sources</option>
              <option value="Plays here">Plays here</option>
              <option value="External">External site</option>
            </select>
          </div>
        </div>
      </div>

      {/* Video grid */}
      <section className="flex-1 py-8 md:py-12">
        <div className="container">
          {videos.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-foreground mb-2">No videos match those filters</p>
              <button
                onClick={() => { setCategory("All"); setGrade("All"); setSource("All"); }}
                className="mt-2 px-5 py-2.5 bg-terracotta text-white rounded-lg text-sm font-medium hover:bg-terracotta/90 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {videos.map((v, i) => (
                <VideoCard key={v.id} resource={v} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
