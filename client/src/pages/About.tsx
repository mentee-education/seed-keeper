/*
  DESIGN: "Living Earth" — Regenerative Design
  About: Workshop information, Indigenous Resilience Center, mission
  Updated: No FEWS/STAR School references
*/
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IMAGES } from "@/lib/assets";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={IMAGES.aboutHero}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-soil/95 via-soil/65 to-transparent" />
          <div className="grain" />
        </div>
        <div className="relative container py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <p className="text-golden text-sm font-semibold uppercase tracking-[0.2em] mb-4">
              About the Workshop
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-cream leading-tight mb-6">
              Cultivating Seeds of Knowledge
            </h1>
            <p className="text-cream/70 text-lg leading-relaxed">
              A collaborative initiative bringing together Indigenous knowledge keepers,
              educators, and researchers to nurture food, energy, and water literacy
              through culturally grounded, land-based learning.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-terracotta text-sm font-semibold uppercase tracking-[0.15em] mb-3">
                  Our Mission
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6 leading-tight">
                  Bridging Indigenous Knowledge and K-12 Education
                </h2>
                <div className="space-y-5 text-muted-foreground leading-relaxed">
                  <p>
                    The <strong className="text-foreground">Cultivating Seeds of Knowledge</strong> workshop
                    is developed in partnership with the Indigenous Resilience Center at the University
                    of Arizona. Together, we are building a bridge between Indigenous knowledge systems
                    and contemporary K-12 education, creating resources that honor traditional
                    ecological wisdom while meeting modern educational standards.
                  </p>
                  <p>
                    Our resource library serves as a living repository — a digital seed bank of
                    educational materials that educators can draw from to create meaningful,
                    culturally grounded learning experiences. From traditional agriculture and
                    water stewardship to Indigenous astronomy and food sovereignty, these resources
                    span the full spectrum of interconnected food, energy, and water systems.
                  </p>
                  <p>
                    We believe that the most powerful education happens when students can see
                    themselves in the curriculum — when the knowledge of their ancestors is honored
                    alongside Western scientific frameworks, and when learning is rooted in the
                    land, water, and sky that sustain their communities.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Key Values */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-5"
              >
                <ValueCard
                  title="Land-Based Learning"
                  description="Education rooted in place — the desert, the garden, the night sky. Learning happens when we are connected to the land."
                  accent="bg-sage"
                />
                <ValueCard
                  title="Food Sovereignty"
                  description="Supporting communities in reclaiming traditional food systems, from heritage seed varieties to sustainable growing practices."
                  accent="bg-terracotta"
                />
                <ValueCard
                  title="Water Stewardship"
                  description="Understanding water as a living relative — honoring traditional water knowledge while addressing contemporary water quality challenges."
                  accent="bg-turquoise"
                />
                <ValueCard
                  title="Energy Independence"
                  description="Exploring agrivoltaics and renewable energy as pathways to energy sovereignty on tribal lands."
                  accent="bg-golden"
                />
                <ValueCard
                  title="Cultural Preservation"
                  description="Weaving Indigenous language, stories, and pedagogical traditions into every aspect of the curriculum."
                  accent="bg-soil"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Spotlight */}
      <section className="bg-sand py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-sage text-sm font-semibold uppercase tracking-[0.15em] mb-3">
              Our Partner
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Indigenous Resilience Center
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Housed at the University of Arizona, the Indigenous Resilience Center brings
              together researchers, educators, and community partners to support Indigenous
              communities through collaborative, strengths-based approaches.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-card rounded-xl border border-border p-6 md:p-8"
            >
              <h3 className="font-serif text-xl text-foreground mb-3">Indigenous Resilience Center</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                The IRC focuses on community-driven research and education that honors
                Indigenous knowledge systems. Their work spans environmental science,
                cultural preservation, language revitalization, and educational innovation
                across tribal communities.
              </p>
              <a
                href="https://resilience.arizona.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-terracotta hover:text-terracotta/80 transition-colors no-underline"
              >
                Visit Website
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-card rounded-xl border border-border p-6 md:p-8"
            >
              <h3 className="font-serif text-xl text-foreground mb-3">University of Arizona</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                As a land-grant institution with deep ties to the Southwest, the University
                of Arizona supports research and education that serves the diverse communities
                of the region, including over 20 tribal nations across Arizona.
              </p>
              <a
                href="https://www.arizona.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-terracotta hover:text-terracotta/80 transition-colors no-underline"
              >
                Visit Website
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Knowledge Domains */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-turquoise text-sm font-semibold uppercase tracking-[0.15em] mb-3">
              Knowledge Domains
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Interconnected Systems
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Our resources are organized around interconnected knowledge domains that reflect
              the holistic way Indigenous communities understand and steward the natural world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <DomainCard
              icon="🌽"
              title="Food"
              description="Traditional agriculture, heritage seeds, garden-based learning, and food sovereignty movements."
              color="bg-terracotta"
            />
            <DomainCard
              icon="☀️"
              title="Energy"
              description="Agrivoltaics, solar energy, weather monitoring, and pathways to energy independence."
              color="bg-golden"
            />
            <DomainCard
              icon="💧"
              title="Water"
              description="Water quality science, traditional water knowledge, water rights, and environmental justice."
              color="bg-turquoise"
            />
            <DomainCard
              icon="⭐"
              title="Sky"
              description="Indigenous star knowledge, seasonal calendars, archaeoastronomy, and celestial navigation."
              color="bg-soil"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-soil py-16 md:py-20">
        <div className="container text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-cream mb-4">
            Ready to Explore?
          </h2>
          <p className="text-cream/60 max-w-xl mx-auto mb-8 leading-relaxed">
            Dive into our curated collection of resources and find the materials
            that will enrich your classroom and honor Indigenous knowledge.
          </p>
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-terracotta text-white rounded-lg font-medium hover:bg-terracotta/90 transition-colors no-underline"
          >
            Browse the Library <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ===== Sub-Components ===== */

function ValueCard({ title, description, accent }: { title: string; description: string; accent: string }) {
  return (
    <div className="flex gap-4 p-5 bg-card rounded-lg border border-border">
      <div className={`${accent} w-1 rounded-full shrink-0`} />
      <div>
        <h4 className="font-serif text-base text-foreground mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function DomainCard({ icon, title, description, color }: { icon: string; title: string; description: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-xl border border-border p-6 text-center"
    >
      <div className={`${color} w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="font-serif text-xl text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}
