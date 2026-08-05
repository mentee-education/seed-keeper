/*
  DESIGN: "Living Earth" — Regenerative Design
  Home: Full-bleed hero with desert garden imagery, category cards, featured resources
  Typography: DM Serif Display headings, DM Sans body
  Colors: Earth strata — terracotta, sage, turquoise, golden, soil
*/
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Search, BookOpen, Droplets, Sun, Star, Leaf, FileText, BookOpenText, Users, SlidersHorizontal, Library } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResourceCard from "@/components/ResourceCard";
import { resources, CATEGORIES, getFeaturedResources } from "@/data/resources";
import { IMAGES } from "@/lib/assets";

const categoryIcons: Record<string, React.ReactNode> = {
  "Food Systems": <Leaf className="w-6 h-6" />,
  "Water Systems": <Droplets className="w-6 h-6" />,
  "Energy Systems": <Sun className="w-6 h-6" />,
  "Astronomy and Sky Knowledge": <Star className="w-6 h-6" />,
  "Indigenous Pedagogy": <BookOpen className="w-6 h-6" />,
  "Curriculum and Standards": <FileText className="w-6 h-6" />,
  "Learning Through Literature": <BookOpenText className="w-6 h-6" />,
};

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

export default function Home() {
  const [, navigate] = useLocation();
  const [heroQuery, setHeroQuery] = useState("");
  const featured = getFeaturedResources();

  const lessonCount = resources.filter(
    (r) => r.resourceType === "Lesson Plan" || r.resourceType === "Curriculum Guide"
  ).length;
  const videoCount = resources.filter((r) => r.resourceType === "Video").length;

  const submitHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = heroQuery.trim();
    navigate(q ? `/resources?q=${encodeURIComponent(q)}` : "/resources");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={IMAGES.heroMain}
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Heavy scrim behind the copy (left), image left bright on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-soil/95 via-soil/65 to-transparent" />
          <div className="grain" />
        </div>

        <div className="relative container py-24 md:py-36 lg:py-44">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-terracotta-light text-sm font-semibold uppercase tracking-[0.2em] mb-4"
            >
              Indigenous Resilience Center &middot; University of Arizona
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream leading-[1.1] mb-6 drop-shadow-md"
            >
              Cultivating Seeds{" "}
              <span className="text-golden">of Knowledge</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-cream/85 text-lg md:text-xl leading-relaxed mb-8 max-w-xl drop-shadow"
            >
              A free, searchable library of lesson plans, videos, articles, and curriculum
              guides for K-12 educators — organized around Food, Energy, and Water Systems
              through Indigenous knowledge and land-based learning.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Live search — lands on the library pre-filtered */}
              <form onSubmit={submitHeroSearch} className="relative max-w-lg mb-5">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  placeholder="Search lessons, topics, organizations…"
                  aria-label="Search the resource library"
                  className="w-full pl-11 pr-32 py-3.5 rounded-xl bg-cream text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-golden/70 shadow-xl"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-terracotta text-white rounded-lg text-sm font-medium hover:bg-terracotta/90 transition-colors"
                >
                  Search
                </button>
              </form>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6">
                <Link
                  href="/resources"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-golden hover:text-golden-light transition-colors no-underline"
                >
                  Browse all resources <ArrowRight size={14} />
                </Link>
                <Link
                  href="/about"
                  className="text-sm text-cream/60 hover:text-cream transition-colors no-underline"
                >
                  About the workshop
                </Link>
              </div>
              {/* Library at a glance */}
              <div className="flex gap-8">
                {[
                  { n: resources.length, label: "Curated Resources" },
                  { n: lessonCount, label: "Lessons & Guides" },
                  { n: videoCount, label: "Videos" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-serif text-2xl text-cream leading-none">{s.n}</p>
                    <p className="text-[0.65rem] font-semibold text-cream/50 uppercase tracking-wide mt-1">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
            <path d="M0 80V40C240 65 480 20 720 35C960 50 1200 15 1440 40V80H0Z" fill="oklch(0.98 0.008 85)" />
          </svg>
        </div>
      </section>

      {/* ===== CATEGORY CARDS ===== */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-terracotta text-sm font-semibold uppercase tracking-[0.15em] mb-3">
              Resource Library
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Seven Pillars of Knowledge
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Resources organized across seven interconnected domains — from traditional
              agriculture and water stewardship to Indigenous astronomy and culturally
              responsive pedagogy.
            </p>
          </motion.div>

          {/* 7 cards: 4 on the first row, 3 on the second — never an orphan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-5">
            {CATEGORIES.map((cat, i) => {
              const count = resources.filter(r => r.category === cat.name).length;
              return (
                <motion.div
                  key={cat.name}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className={`${i === 6 ? "sm:col-span-2 lg:col-span-4" : i < 4 ? "lg:col-span-3" : "lg:col-span-4"}`}
                >
                  <Link
                    href={`/resources/${slugify(cat.name)}`}
                    className="no-underline block group"
                  >
                    <div className="relative rounded-xl overflow-hidden h-48 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-soil/95 via-soil/40 to-soil/5" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <div className="text-golden mb-2 [&>svg]:w-5 [&>svg]:h-5">
                          {categoryIcons[cat.name]}
                        </div>
                        <h3 className="font-serif text-lg text-cream leading-tight mb-0.5">
                          {cat.name}
                        </h3>
                        <p className="text-cream/60 text-xs font-medium">
                          {count} resources
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          
        </div>
      </section>

      {/* ===== START HERE — EDUCATOR PICKS ===== */}
      <section className="py-16 md:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-1 h-6 bg-golden rounded-full" />
              <h2 className="font-serif text-2xl md:text-3xl text-foreground">Start Here</h2>
            </div>
            <div className="flex-1 h-px bg-border" />
            <p className="text-sm text-muted-foreground hidden md:block shrink-0">
              One strong entry point for each knowledge domain
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {featured.map((resource, i) => (
              <motion.div
                key={resource.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <ResourceCard resource={resource} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOR EDUCATORS EXPLAINER ===== */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-sage text-sm font-semibold uppercase tracking-[0.15em] mb-3">
              For Educators
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Your Guide to This Resource
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              SeedKeeper is designed to make it easy for you to find and use high-quality
              educational materials in your classroom. Here's what you need to know.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Library className="w-6 h-6" />,
                title: "What Is This?",
                description: `A curated collection of ${resources.length} educational resources from trusted organizations — lesson plans, videos, articles, curriculum guides, and more — all vetted and ready for classroom use.`,
                accent: "bg-terracotta",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Who Is It For?",
                description: "K-12 educators looking to integrate Indigenous knowledge, food sovereignty, water stewardship, and land-based learning into their teaching across any subject area.",
                accent: "bg-sage",
              },
              {
                icon: <SlidersHorizontal className="w-6 h-6" />,
                title: "How Does It Work?",
                description: "Browse by knowledge domain, then filter by grade level, subject area, and resource type. Each resource links directly to its source — no account needed, no paywall.",
                accent: "bg-turquoise",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-card rounded-xl border border-border p-6 md:p-8"
              >
                <div className={`${item.accent} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-5`}>
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SEEDS IMAGE SECTION ===== */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative h-64 lg:h-auto">
            <img
              src={IMAGES.indigenousGarden}
              alt="A thriving Three Sisters garden with corn, beans, and squash among red sandstone mesas at golden hour"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-sand flex items-center">
            <div className="px-8 md:px-12 lg:px-16 py-12 md:py-16 max-w-xl">
              <p className="text-sage text-sm font-semibold uppercase tracking-[0.15em] mb-3">
                Rooted in Tradition
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-5 leading-tight">
                Preserving Knowledge for Future Generations
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Like seed keepers who carefully steward heritage varieties from one
                generation to the next, this resource library preserves and shares
                the knowledge that sustains communities — connecting traditional
                ecological wisdom with modern educational practice.
              </p>
              <div className="flex items-center gap-6 mb-8">
                <div>
                  <p className="font-serif text-3xl text-terracotta">{resources.length}</p>
                  <p className="text-xs text-muted-foreground font-medium">Curated Resources</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <p className="font-serif text-3xl text-terracotta">7</p>
                  <p className="text-xs text-muted-foreground font-medium">Knowledge Domains</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <p className="font-serif text-3xl text-terracotta">K-12</p>
                  <p className="text-xs text-muted-foreground font-medium">Grade Levels</p>
                </div>
              </div>
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta text-white rounded-lg font-medium text-sm hover:bg-terracotta/90 transition-colors no-underline"
              >
                Browse the Library <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
