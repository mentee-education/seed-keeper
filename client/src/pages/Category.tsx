/*
  DESIGN: "Living Earth" — Regenerative Design
  Category: Individual category page with hero image, filtered resources
*/
import { useMemo } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResourceCard from "@/components/ResourceCard";
import { resources, CATEGORIES } from "@/data/resources";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function Category() {
  const params = useParams<{ category: string }>();
  const categorySlug = params.category || "";

  const category = useMemo(
    () => CATEGORIES.find((c) => slugify(c.name) === categorySlug),
    [categorySlug]
  );

  const categoryResources = useMemo(
    () => (category ? resources.filter((r) => r.category === category.name) : []),
    [category]
  );

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl text-foreground mb-4">Category Not Found</h1>
            <Link href="/resources" className="text-terracotta font-medium no-underline">
              Back to Resources
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden h-64 md:h-80">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-soil/90 via-soil/50 to-soil/20" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container pb-8 md:pb-10">
            <Link
              href="/resources"
              className="inline-flex items-center gap-1.5 text-cream/60 text-sm mb-3 hover:text-cream transition-colors no-underline"
            >
              <ArrowLeft size={14} /> All Resources
            </Link>
            <h1 className="font-serif text-3xl md:text-4xl text-cream mb-2 drop-shadow-md">
              {category.name}
            </h1>
            <p className="text-cream/70 max-w-xl drop-shadow">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-10 md:py-14">
        <div className="container">
          <p className="text-sm text-muted-foreground mb-6">
            <span className="font-medium text-foreground">{categoryResources.length}</span>{" "}
            {categoryResources.length === 1 ? "resource" : "resources"} in this category
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categoryResources.map((resource, i) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.4), duration: 0.3 }}
              >
                <ResourceCard resource={resource} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
