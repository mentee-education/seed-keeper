/*
  DESIGN: "Living Earth" — Regenerative Design
  Home: Full-bleed hero with desert garden imagery, category cards, featured resources
  Typography: DM Serif Display headings, DM Sans body
  Colors: Earth strata — terracotta, sage, turquoise, golden, soil
*/
import { Link } from "wouter";
import { ArrowRight, BookOpen, Droplets, Sun, Star, Leaf, FileText, BookOpenText } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { resources, CATEGORIES } from "@/data/resources";

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
              A curated resource library for educators teaching Food, Energy, and Water
              Systems through Indigenous knowledge and land-based learning.
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Browse by Domain",
                desc: "Start with one of seven knowledge domains — from Food Systems to Indigenous Astronomy — and discover resources organized by theme.",
                icon: "🌱",
              },
              {
                step: "02",
                title: "Filter by Your Needs",
                desc: "Narrow results by grade level, subject area, resource type, and audience to find exactly what fits your classroom.",
                icon: "🔍",
              },
              {
                step: "03",
                title: "Integrate & Teach",
                desc: "Access lesson plans, curriculum guides, videos, and literature ready to weave Indigenous knowledge into your teaching practice.",
                icon: "📚",
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
                <div className="text-4xl mb-4">{item.icon}</div>
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

      {/* ===== CTA SECTION ===== */}
      <section className="bg-sand py-20 md:py-28">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-terracotta text-sm font-semibold uppercase tracking-[0.2em] mb-4">
              Start Your Journey
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-soil mb-6 max-w-3xl mx-auto leading-tight">
              Ready to Explore?
            </h2>
            <p className="text-soil/70 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Dive into our curated collection of resources and find the materials
              that will enrich your classroom and honor Indigenous knowledge.
            </p>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-terracotta text-white rounded-lg font-medium hover:bg-terracotta-light transition-colors no-underline"
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
