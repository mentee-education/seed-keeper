/*
  DESIGN: "Living Earth" — Regenerative Design
  Videos: Cinematic library of every video resource. The one YouTube-hosted
  film plays inline; PBS LearningMedia titles open directly in the PBS player
  (PBS does not permit iframe embedding).
*/
import { useState } from "react";
import { motion } from "framer-motion";
import { Play, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { resources, getCategoryColor, type Resource } from "@/data/resources";
import { getThumbUrl } from "@/lib/assets";

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return m ? m[1] : null;
}

function sourceLabel(url: string): string {
  if (url.includes("pbslearningmedia.org")) return "Watch on PBS LearningMedia";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "Watch on YouTube";
  try {
    return `Watch at ${new URL(url).hostname.replace("www.", "")}`;
  } catch {
    return "Watch";
  }
}

function VideoCard({ resource, index }: { resource: Resource; index: number }) {
  const ytId = getYouTubeId(resource.url);
  const [playing, setPlaying] = useState(false);
  const [imgOk, setImgOk] = useState(true);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="group bg-card rounded-xl border border-border/60 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-soil/10 transition-all duration-300 flex flex-col"
    >
      {/* Player / thumbnail */}
      <div className="relative bg-soil" style={{ aspectRatio: "16/9" }}>
        {playing && ytId ? (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
            title={resource.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <>
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
            <span className={`absolute top-3 left-3 text-[0.6rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm ${getCategoryColor(resource.category)}`}>
              {resource.category}
            </span>
            {ytId ? (
              <button
                onClick={() => setPlaying(true)}
                className="absolute inset-0 flex items-center justify-center group/play"
                aria-label={`Play ${resource.title}`}
              >
                <span className="w-16 h-16 rounded-full bg-cream/95 flex items-center justify-center shadow-xl transition-all group-hover/play:scale-110">
                  <Play size={24} className="text-terracotta ml-1" fill="currentColor" />
                </span>
              </button>
            ) : (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center group/play"
                aria-label={`${sourceLabel(resource.url)}: ${resource.title}`}
              >
                <span className="w-16 h-16 rounded-full bg-cream/95 flex items-center justify-center shadow-xl transition-all group-hover/play:scale-110">
                  <Play size={24} className="text-terracotta ml-1" fill="currentColor" />
                </span>
              </a>
            )}
          </>
        )}
      </div>

      {/* Body */}
      <div className="p-4 md:p-5 flex flex-col gap-2 flex-1">
        <h3 className="font-serif text-lg text-foreground leading-snug group-hover:text-terracotta transition-colors">
          {resource.title}
        </h3>
        <p className="text-xs font-medium text-terracotta/80">{resource.organization}</p>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {resource.summary}
        </p>
        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-terracotta hover:text-terracotta-light transition-colors no-underline"
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
  const videos = resources.filter((r) => r.resourceType === "Video");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Cinematic header — deep soil, no photo, golden accents */}
      <section className="relative overflow-hidden bg-gradient-to-br from-soil via-[oklch(0.26_0.05_50)] to-[oklch(0.22_0.04_60)]">
        <div className="grain" />
        <div className="relative container py-14 md:py-20">
          <p className="text-golden text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            Video Library
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-cream mb-3 drop-shadow-md">
            Watch &amp; Learn
          </h1>
          <p className="text-cream/75 max-w-2xl leading-relaxed text-sm md:text-base">
            {videos.length} classroom-ready films and series on Indigenous foodways,
            water, identity, and storytelling — from PBS LearningMedia and community
            filmmakers.
          </p>
        </div>
      </section>

      {/* Video grid */}
      <section className="flex-1 py-10 md:py-14">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {videos.map((v, i) => (
              <VideoCard key={v.id} resource={v} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
