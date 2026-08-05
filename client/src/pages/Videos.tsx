/*
  DESIGN: "Living Earth" — Regenerative Design
  Videos: every title on this page plays right here in an embedded player.
  Video-type resources without an embeddable source live in the Resource
  Library instead, so this page is 100% watchable.
*/
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { resources, getCategoryColor, GRADE_LEVELS, type Resource } from "@/data/resources";

function getYouTubeId(r: Resource): string | null {
  if (r.youtubeId) return r.youtubeId;
  const m = r.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return m ? m[1] : null;
}

function VideoCard({ resource, index }: { resource: Resource; index: number }) {
  const ytId = getYouTubeId(resource)!;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.25) }}
      className="bg-card rounded-xl border border-border/60 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-soil/10 transition-all duration-300 flex flex-col"
    >
      {/* Embedded player */}
      <div className="relative bg-soil" style={{ aspectRatio: "16/9" }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0`}
          title={resource.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Body */}
      <div className="p-4 md:p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[0.6rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${getCategoryColor(resource.category)}`}>
            {resource.category}
          </span>
          {resource.gradeLevel && resource.gradeLevel !== "All" && (
            <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-sand text-soil font-medium shrink-0">
              Grades {resource.gradeLevel}
            </span>
          )}
        </div>
        <h3 className="font-serif text-lg text-foreground leading-snug">
          {resource.title}
        </h3>
        <p className="text-xs font-medium text-terracotta/90">{resource.organization}</p>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {resource.summary}
        </p>
        <div className="mt-auto pt-2">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-turquoise hover:text-terracotta transition-colors no-underline"
          >
            Open on YouTube
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export default function Videos() {
  const allVideos = useMemo(
    () => resources.filter((r) => r.resourceType === "Video" && getYouTubeId(r)),
    []
  );
  const [category, setCategory] = useState<string>("All");
  const [grade, setGrade] = useState<string>("All");

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
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden bg-sand border-b border-border">
        <div className="grain" />
        <div className="relative container py-12 md:py-16">
          <p className="text-terracotta text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            Video Library
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground mb-3">
            Watch and Learn
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed text-sm md:text-base">
            {allVideos.length} classroom-ready films on Indigenous foodways, water,
            energy, sky knowledge, and storytelling — every one plays right here.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-[72px] md:top-[92px] z-40 bg-cream/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container py-3.5 flex flex-wrap items-end gap-x-6 gap-y-3">
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground/80 mb-1.5">
              Topic
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setCategory("All")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  category === "All"
                    ? "bg-terracotta text-white shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-terracotta/40 hover:bg-terracotta/5"
                }`}
              >
                All
                <span className={`ml-1.5 ${category === "All" ? "text-white/70" : "text-muted-foreground/50"}`}>
                  {allVideos.length}
                </span>
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
                        : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-terracotta/40 hover:bg-terracotta/5"
                    }`}
                  >
                    {c}
                    <span className={`ml-1.5 ${category === c ? "text-white/70" : "text-muted-foreground/50"}`}>
                      {n}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="ml-auto">
            <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground/80 mb-1.5">
              Grade Level
            </p>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className={`appearance-none border rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-terracotta/30 ${
                grade !== "All" ? "bg-terracotta/5 border-terracotta/30 text-terracotta" : "bg-card border-border text-foreground"
              }`}
            >
              <option value="All">All Grades</option>
              {grades.map((g) => (
                <option key={g} value={g}>Grades {g}</option>
              ))}
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
                onClick={() => { setCategory("All"); setGrade("All"); }}
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
