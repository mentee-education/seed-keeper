/*
  DESIGN: "Living Earth" — Regenerative Design
  Home: Full-bleed hero with desert garden imagery, category cards, featured resources
  Typography: DM Serif Display headings, DM Sans body
  Colors: Earth strata — terracotta, sage, turquoise, golden, soil
*/
import { Link } from "wouter";
import { ArrowRight, BookOpen, Droplets, Sun, Star, Leaf, FileText, BookOpenText, Users, Compass, SlidersHorizontal, ExternalLink, FileVideo, BookMarked, GraduationCap, Globe, ClipboardList, Library } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { resources, CATEGORIES, type ResourceType } from "@/data/resources";

const categoryIcons: Record<string, React.ReactNode> = {
  "Food Systems": <Leaf className="w-6 h-6" />,
  "Water Systems": <Droplets className="w-6 h-6" />,
  "Energy Systems": <Sun className="w-6 h-6" />,
  "Astronomy & Sky Knowledge": <Star className="w-6 h-6" />,
  "Indigenous Pedagogy": <BookOpen className="w-6 h-6" />,
  "Curriculum & Standards": <FileText className="w-6 h-6" />,
  "Learning Through Literature": <BookOpenText className="w-6 h-6" />,
};

const categoryColorMap: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
  "Food Systems": { bg: "bg-[oklch(0.97_0.02_40)]", text: "text-[oklch(0.40_0.10_40)]", border: "border-[oklch(0.85_0.06_40)]", iconBg: "bg-[oklch(0.55_0.13_40)]" },
  "Water Systems": { bg: "bg-[oklch(0.96_0.02_225)]", text: "text-[oklch(0.35_0.07_225)]", border: "border-[oklch(0.82_0.05_225)]", iconBg: "bg-[oklch(0.48_0.09_225)]" },
  "Energy Systems": { bg: "bg-[oklch(0.97_0.02_85)]", text: "text-[oklch(0.45_0.08_85)]", border: "border-[oklch(0.88_0.06_85)]", iconBg: "bg-[oklch(0.78_0.13_85)]" },
  "Astronomy & Sky Knowledge": { bg: "bg-[oklch(0.95_0.01_55)]", text: "text-[oklch(0.30_0.04_55)]", border: "border-[oklch(0.82_0.02_55)]", iconBg: "bg-[oklch(0.30_0.04_55)]" },
  "Indigenous Pedagogy": { bg: "bg-[oklch(0.96_0.02_155)]", text: "text-[oklch(0.40_0.05_155)]", border: "border-[oklch(0.82_0.04_155)]", iconBg: "bg-[oklch(0.65_0.06_155)]" },
  "Curriculum & Standards": { bg: "bg-[oklch(0.97_0.015_40)]", text: "text-[oklch(0.45_0.06_40)]", border: "border-[oklch(0.88_0.04_40)]", iconBg: "bg-[oklch(0.72_0.08_40)]" },
  "Learning Through Literature": { bg: "bg-[oklch(0.97_0.015_85)]", text: "text-[oklch(0.45_0.06_85)]", border: "border-[oklch(0.90_0.04_85)]", iconBg: "bg-[oklch(0.90_0.06_85)]" },
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
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663407421710/GJEDwPAUKshiXegbpvTbbn/hero-main-9SyDjU9RaqT4pZCmuWqXZW.webp"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-soil/85 via-soil/60 to-soil/30" />
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
              className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream leading-[1.1] mb-6"
            >
              Cultivating Seeds{" "}
              <span className="text-golden">of Knowledge</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-cream/70 text-lg md:text-xl leading-relaxed mb-8 max-w-xl"
            >
              A free, searchable library of lesson plans, videos, articles, and curriculum
              guides for K-12 educators — organized around Food, Energy, and Water Systems
              through Indigenous knowledge and land-based learning.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta text-white rounded-lg font-medium text-sm hover:bg-terracotta/90 transition-colors no-underline"
              >
                Explore Resources <ArrowRight size={16} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cream/10 text-cream border border-cream/20 rounded-lg font-medium text-sm hover:bg-cream/20 transition-colors no-underline"
              >
                About the Workshop
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
            <path d="M0 80V40C240 65 480 20 720 35C960 50 1200 15 1440 40V80H0Z" fill="oklch(0.97 0.01 85)" />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {CATEGORIES.map((cat, i) => {
              const colors = categoryColorMap[cat.name] || { bg: "bg-muted", text: "text-foreground", border: "border-border", iconBg: "bg-muted" };
              const count = resources.filter(r => r.category === cat.name).length;
              return (
                <motion.div
                  key={cat.name}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <Link
                    href={`/resources/${slugify(cat.name)}`}
                    className="no-underline block"
                  >
                    <div className={`${colors.bg} border ${colors.border} rounded-xl p-5 md:p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 h-full`}>
                      <div className={`${colors.iconBg} w-11 h-11 rounded-lg flex items-center justify-center text-white mb-4`}>
                        {categoryIcons[cat.name]}
                      </div>
                      <h3 className={`font-serif text-lg ${colors.text} mb-2`}>
                        {cat.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                        {cat.description}
                      </p>
                      <span className="text-xs font-medium text-muted-foreground">
                        {count} resources
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Quick-start examples */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 md:mt-14 bg-sand/60 border border-border rounded-xl p-6 md:p-8 max-w-3xl mx-auto"
          >
            <p className="font-serif text-lg text-foreground mb-4">
              Not sure where to start?
            </p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-terracotta mt-0.5 shrink-0">&#8594;</span>
                <span>Teaching a <strong className="text-foreground">water quality unit</strong>? Try <strong className="text-foreground">Water Systems</strong>, filtered for grades 7-8</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terracotta mt-0.5 shrink-0">&#8594;</span>
                <span>Looking for <strong className="text-foreground">garden-based STEM activities</strong>? Browse <strong className="text-foreground">Food Systems</strong> &rarr; Lesson Plans</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terracotta mt-0.5 shrink-0">&#8594;</span>
                <span>Need <strong className="text-foreground">culturally responsive teaching strategies</strong>? Start with <strong className="text-foreground">Indigenous Pedagogy</strong></span>
              </li>
            </ul>
          </motion.div>
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
                description: `A curated collection of ${resources.length}+ educational resources from trusted organizations — lesson plans, videos, articles, curriculum guides, and more — all vetted and ready for classroom use.`,
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
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663407421710/GJEDwPAUKshiXegbpvTbbn/indigenous-garden-ckcQVhmhicunuwk7tcy3aE.webp"
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
              <div className="flex items-center gap-6">
                <div>
                  <p className="font-serif text-3xl text-terracotta">{resources.length}+</p>
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
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-turquoise text-sm font-semibold uppercase tracking-[0.15em] mb-3">
              For Educators
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              How to Use This Library
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Whether you're building a lesson plan or deepening your own understanding,
              here's how to get the most from these resources.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Choose a Knowledge Domain",
                desc: "Start with one of seven domains like Food Systems or Water Systems. Each contains curated resources from organizations like the National Science Teaching Association, Smithsonian, and tribal education programs.",
                icon: <Compass className="w-7 h-7" />,
              },
              {
                step: "02",
                title: "Filter for Your Classroom",
                desc: "Use filters to narrow by grade level (Pre-K through 12), subject area (Science, Social Studies, ELA, Math, Art, Garden/TEK), and resource type (lesson plans, videos, articles, books, and more).",
                icon: <SlidersHorizontal className="w-7 h-7" />,
              },
              {
                step: "03",
                title: "Access & Teach",
                desc: "Each resource links directly to its source — open it, bookmark it, or integrate it into your existing lesson plans. No account needed, no paywall, no barriers.",
                icon: <ExternalLink className="w-7 h-7" />,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-full bg-turquoise/10 text-turquoise flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <p className="text-terracotta text-xs font-bold uppercase tracking-[0.2em] mb-2">
                  Step {item.step}
                </p>
                <h3 className="font-serif text-xl text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta text-white rounded-lg font-medium text-sm hover:bg-terracotta/90 transition-colors no-underline"
            >
              Start Browsing <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== TYPES OF RESOURCES ===== */}
      <section className="bg-sand py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-terracotta text-sm font-semibold uppercase tracking-[0.15em] mb-3">
              What You'll Find
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Types of Resources
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From ready-to-teach lesson plans to in-depth academic articles — every resource
              links directly to its source so you can access it immediately.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto mb-14">
            {(() => {
              const typeCounts = resources.reduce<Record<string, number>>((acc, r) => {
                acc[r.resourceType] = (acc[r.resourceType] || 0) + 1;
                return acc;
              }, {});
              const typeIcons: Record<string, React.ReactNode> = {
                "Lesson Plan": <ClipboardList className="w-4 h-4" />,
                "Academic Article": <FileText className="w-4 h-4" />,
                "Book/Literature": <BookMarked className="w-4 h-4" />,
                "Video": <FileVideo className="w-4 h-4" />,
                "Curriculum Guide": <BookOpen className="w-4 h-4" />,
                "Standards Document": <FileText className="w-4 h-4" />,
                "Student Resource": <GraduationCap className="w-4 h-4" />,
                "Educator Resource": <Users className="w-4 h-4" />,
                "Website/Database": <Globe className="w-4 h-4" />,
              };
              return Object.entries(typeCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count], i) => (
                  <motion.div
                    key={type}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-full text-sm"
                  >
                    <span className="text-terracotta">{typeIcons[type]}</span>
                    <span className="font-medium text-foreground">{type}</span>
                    <span className="text-muted-foreground text-xs bg-sand rounded-full px-2 py-0.5">{count}</span>
                  </motion.div>
                ));
            })()}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-terracotta text-white rounded-lg font-medium hover:bg-terracotta/90 transition-colors no-underline"
            >
              Browse the Library <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
