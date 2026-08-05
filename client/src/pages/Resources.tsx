/*
  DESIGN: "Living Earth" — Regenerative Design
  Resources: Full-width layout, sticky horizontal category pills,
  always-visible filter dropdowns, list view default, alphabetical sort,
  dynamic filters — options with zero results are hidden
*/
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Search, X, ChevronDown, LayoutList, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import Fuse from "fuse.js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResourceCard from "@/components/ResourceCard";
import {
  resources,
  CATEGORIES,
  GRADE_LEVELS,
  SUBJECTS,
  RESOURCE_TYPES,
  AUDIENCES,
  type Category,
  type ResourceType,
} from "@/data/resources";
import { IMAGES } from "@/lib/assets";

const BATCH_SIZE = 36;

const fuse = new Fuse(resources, {
  keys: [
    { name: "title", weight: 0.35 },
    { name: "summary", weight: 0.25 },
    { name: "organization", weight: 0.2 },
    { name: "focusArea", weight: 0.15 },
    { name: "category", weight: 0.05 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
});

type SortOption = "title-asc" | "title-desc" | "category" | "grade" | "relevance";

export default function Resources() {
  // Accept a search handoff from the home-page hero (/resources?q=…)
  const [searchQuery, setSearchQuery] = useState(
    () => new URLSearchParams(window.location.search).get("q") ?? ""
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedType, setSelectedType] = useState<ResourceType | "All">("All");
  const [selectedAudience, setSelectedAudience] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("title-asc");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Base pool: search + category applied (used to compute what secondary filter options are available)
  const basePool = useMemo(() => {
    let results = searchQuery.trim()
      ? fuse.search(searchQuery).map((r) => r.item)
      : [...resources];
    if (selectedCategory !== "All") {
      results = results.filter((r) => r.category === selectedCategory);
    }
    return results;
  }, [searchQuery, selectedCategory]);

  // Compute available options for each secondary filter based on current OTHER selections
  // For each filter, we apply all filters EXCEPT itself to see what values remain
  const availableGrades = useMemo(() => {
    let pool = basePool;
    if (selectedSubject !== "All") pool = pool.filter((r) => r.subject === selectedSubject || r.subject === "All");
    if (selectedType !== "All") pool = pool.filter((r) => r.resourceType === selectedType);
    if (selectedAudience !== "All") pool = pool.filter((r) => r.audience === selectedAudience || r.audience === "Both");
    const grades = new Set(pool.map((r) => r.gradeLevel));
    return GRADE_LEVELS.filter((g) => g === "All" || grades.has(g));
  }, [basePool, selectedSubject, selectedType, selectedAudience]);

  const availableSubjects = useMemo(() => {
    let pool = basePool;
    if (selectedGrade !== "All") pool = pool.filter((r) => r.gradeLevel === selectedGrade || r.gradeLevel === "All");
    if (selectedType !== "All") pool = pool.filter((r) => r.resourceType === selectedType);
    if (selectedAudience !== "All") pool = pool.filter((r) => r.audience === selectedAudience || r.audience === "Both");
    const subjects = new Set(pool.map((r) => r.subject));
    return SUBJECTS.filter((s) => s === "All" || subjects.has(s));
  }, [basePool, selectedGrade, selectedType, selectedAudience]);

  const availableTypes = useMemo(() => {
    let pool = basePool;
    if (selectedGrade !== "All") pool = pool.filter((r) => r.gradeLevel === selectedGrade || r.gradeLevel === "All");
    if (selectedSubject !== "All") pool = pool.filter((r) => r.subject === selectedSubject || r.subject === "All");
    if (selectedAudience !== "All") pool = pool.filter((r) => r.audience === selectedAudience || r.audience === "Both");
    const types = new Set(pool.map((r) => r.resourceType));
    return RESOURCE_TYPES.filter((t) => types.has(t));
  }, [basePool, selectedGrade, selectedSubject, selectedAudience]);

  const availableAudiences = useMemo(() => {
    let pool = basePool;
    if (selectedGrade !== "All") pool = pool.filter((r) => r.gradeLevel === selectedGrade || r.gradeLevel === "All");
    if (selectedSubject !== "All") pool = pool.filter((r) => r.subject === selectedSubject || r.subject === "All");
    if (selectedType !== "All") pool = pool.filter((r) => r.resourceType === selectedType);
    const audiences = new Set(pool.map((r) => r.audience));
    return AUDIENCES.filter((a) => audiences.has(a));
  }, [basePool, selectedGrade, selectedSubject, selectedType]);

  // Auto-reset a filter if its current value is no longer available
  useEffect(() => {
    if (selectedGrade !== "All" && !availableGrades.includes(selectedGrade)) setSelectedGrade("All");
  }, [availableGrades, selectedGrade]);
  useEffect(() => {
    if (selectedSubject !== "All" && !availableSubjects.includes(selectedSubject)) setSelectedSubject("All");
  }, [availableSubjects, selectedSubject]);
  useEffect(() => {
    if (selectedType !== "All" && !availableTypes.includes(selectedType)) setSelectedType("All" as ResourceType | "All");
  }, [availableTypes, selectedType]);
  useEffect(() => {
    if (selectedAudience !== "All" && !availableAudiences.includes(selectedAudience)) setSelectedAudience("All");
  }, [availableAudiences, selectedAudience]);

  const filteredResources = useMemo(() => {
    let results = [...basePool];

    if (selectedGrade !== "All") {
      results = results.filter((r) => r.gradeLevel === selectedGrade || r.gradeLevel === "All");
    }
    if (selectedSubject !== "All") {
      results = results.filter((r) => r.subject === selectedSubject || r.subject === "All");
    }
    if (selectedType !== "All") {
      results = results.filter((r) => r.resourceType === selectedType);
    }
    if (selectedAudience !== "All") {
      results = results.filter((r) => r.audience === selectedAudience || r.audience === "Both");
    }

    if (sortBy === "title-asc") {
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "title-desc") {
      results.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === "category") {
      results.sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
    } else if (sortBy === "grade") {
      const gradeOrder = ["Pre-K to 3", "4-6", "7-8", "9-12", "Higher Ed", "All"];
      results.sort((a, b) => gradeOrder.indexOf(a.gradeLevel) - gradeOrder.indexOf(b.gradeLevel) || a.title.localeCompare(b.title));
    }
    if (sortBy === "relevance" && !searchQuery.trim()) {
      results.sort((a, b) => a.title.localeCompare(b.title));
    }

    return results;
  }, [basePool, selectedGrade, selectedSubject, selectedType, selectedAudience, sortBy, searchQuery]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [searchQuery, selectedCategory, selectedGrade, selectedSubject, selectedType, selectedAudience, sortBy]);

  // Infinite scroll observer
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredResources.length) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredResources.length));
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filteredResources.length]);

  const visibleResources = filteredResources.slice(0, visibleCount);

  const activeFilterCount = [selectedGrade, selectedSubject, selectedType, selectedAudience].filter(
    (f) => f !== "All"
  ).length;

  const clearFilters = useCallback(() => {
    setSelectedCategory("All");
    setSelectedGrade("All");
    setSelectedSubject("All");
    setSelectedType("All");
    setSelectedAudience("All");
    setSearchQuery("");
    setSortBy("title-asc");
  }, []);

  // Category counts — computed with all secondary filters applied
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    let base = searchQuery.trim()
      ? fuse.search(searchQuery).map((r) => r.item)
      : [...resources];
    if (selectedGrade !== "All") base = base.filter((r) => r.gradeLevel === selectedGrade || r.gradeLevel === "All");
    if (selectedSubject !== "All") base = base.filter((r) => r.subject === selectedSubject || r.subject === "All");
    if (selectedType !== "All") base = base.filter((r) => r.resourceType === selectedType);
    if (selectedAudience !== "All") base = base.filter((r) => r.audience === selectedAudience || r.audience === "Both");

    counts["All"] = base.length;
    CATEGORIES.forEach((cat) => {
      counts[cat.name] = base.filter((r) => r.category === cat.name).length;
    });
    return counts;
  }, [searchQuery, selectedGrade, selectedSubject, selectedType, selectedAudience]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header — photographic band */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.resourcesHeader} alt="" className="w-full h-full object-cover" style={{ objectPosition: "center 40%" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-soil/95 via-soil/65 to-transparent" />
          <div className="grain" />
        </div>
        <div className="relative container py-10 md:py-14">
          <p className="text-golden text-sm font-semibold uppercase tracking-[0.15em] mb-2">
            Resource Library
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-cream mb-2">
            Explore All Resources
          </h1>
          <p className="text-cream/70 max-w-2xl leading-relaxed text-sm md:text-base">
            {resources.length} curated resources spanning food sovereignty,
            water systems, renewable energy, Indigenous astronomy, and culturally responsive pedagogy.
          </p>
        </div>
      </section>

      {/* Category tiles — image cards that filter the library */}
      <section className="bg-cream border-b border-border">
        <div className="container py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`relative rounded-lg overflow-hidden group text-left h-28 transition-all ${
                selectedCategory === "All" ? "ring-2 ring-terracotta shadow-md" : "hover:shadow-md"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-terracotta to-[oklch(0.42_0.12_40)]" />
              <div className="absolute inset-0 p-2.5 flex flex-col justify-end">
                <span className="text-[0.7rem] font-semibold text-cream leading-tight">All Resources</span>
                <span className="text-[0.6rem] text-cream/60">{categoryCounts["All"]} results</span>
              </div>
              {selectedCategory === "All" && <ActiveDot />}
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(selectedCategory === cat.name ? "All" : cat.name)}
                className={`relative rounded-lg overflow-hidden group text-left h-28 transition-all ${
                  selectedCategory === cat.name ? "ring-2 ring-terracotta shadow-md" : "hover:shadow-md"
                } ${(categoryCounts[cat.name] || 0) === 0 ? "opacity-40 pointer-events-none" : ""}`}
              >
                <img
                  src={cat.tile}
                  alt={cat.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-soil/85 via-soil/20 to-transparent" />
                <div className="absolute inset-0 p-2.5 flex flex-col justify-end">
                  <span className="text-[0.7rem] font-semibold text-cream leading-tight">{cat.name}</span>
                  <span className="text-[0.6rem] text-cream/60">{categoryCounts[cat.name] || 0} resources</span>
                </div>
                {selectedCategory === cat.name && <ActiveDot />}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[72px] md:top-[92px] z-40 bg-cream/95 backdrop-blur-sm border-b border-border shadow-sm">
        {/* Search Row */}
        <div className="container py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-card border border-border rounded-lg text-sm md:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Always-Visible Filter Dropdowns — only show filters that have >1 option */}
        <div className="border-t border-border/50">
          <div className="container py-2.5">
            <div className="flex flex-wrap items-end justify-center gap-2 md:gap-3">
              {availableGrades.length > 1 && (
                <CompactSelect
                  label="Grade"
                  value={selectedGrade}
                  onChange={setSelectedGrade}
                  options={["All", ...availableGrades.filter(g => g !== "All")]}
                  allLabel="All Grades"
                />
              )}
              {availableSubjects.length > 1 && (
                <CompactSelect
                  label="Subject"
                  value={selectedSubject}
                  onChange={setSelectedSubject}
                  options={["All", ...availableSubjects.filter(s => s !== "All")]}
                  allLabel="All Subjects"
                />
              )}
              {availableTypes.length > 1 && (
                <CompactSelect
                  label="Type"
                  value={selectedType}
                  onChange={(v) => setSelectedType(v as ResourceType | "All")}
                  options={["All", ...availableTypes]}
                  allLabel="All Types"
                />
              )}
              {availableAudiences.length > 1 && (
                <CompactSelect
                  label="Audience"
                  value={selectedAudience}
                  onChange={setSelectedAudience}
                  options={["All", ...availableAudiences]}
                  allLabel="Everyone"
                />
              )}
              <CompactSelect
                label="Sort"
                value={sortBy}
                onChange={(v) => setSortBy(v as SortOption)}
                options={["title-asc", "title-desc", "category", "grade", "relevance"]}
                allLabel="Title A→Z"
                displayMap={{
                  "title-asc": "Title A→Z",
                  "title-desc": "Title Z→A",
                  category: "Category",
                  grade: "Grade Level",
                  relevance: "Relevance",
                }}
              />
              {/* View Toggle */}
              <div className="flex flex-col gap-0.5">
                <label className="text-[0.55rem] font-semibold uppercase tracking-widest text-muted-foreground/70 text-center">View</label>
                <div className="flex border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-terracotta text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
                    title="List view"
                  >
                    <LayoutList size={14} />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-terracotta text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
                    title="Grid view"
                  >
                    <LayoutGrid size={14} />
                  </button>
                </div>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-terracotta font-medium hover:underline pb-1.5"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Pills */}
      {(activeFilterCount > 0 || searchQuery) && (
        <div className="container pt-4">
          <div className="flex flex-wrap items-center gap-2">
            {searchQuery && (
              <FilterPill label={`"${searchQuery}"`} onRemove={() => setSearchQuery("")} />
            )}
            {selectedGrade !== "All" && (
              <FilterPill label={`Grades ${selectedGrade}`} onRemove={() => setSelectedGrade("All")} />
            )}
            {selectedSubject !== "All" && (
              <FilterPill label={selectedSubject} onRemove={() => setSelectedSubject("All")} />
            )}
            {selectedType !== "All" && (
              <FilterPill label={selectedType} onRemove={() => setSelectedType("All")} />
            )}
            {selectedAudience !== "All" && (
              <FilterPill label={selectedAudience} onRemove={() => setSelectedAudience("All")} />
            )}
          </div>
        </div>
      )}

      {/* Results */}
      <section className="flex-1">
        <div className="container py-5 md:py-6">
          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-5">
            Showing <span className="font-medium text-foreground">{Math.min(visibleCount, filteredResources.length)}</span> of{" "}
            <span className="font-medium text-foreground">{filteredResources.length}</span> resources
          </p>

          {filteredResources.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-sand flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-muted-foreground" />
              </div>
              <p className="font-serif text-2xl text-foreground mb-2">No resources found</p>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Try adjusting your search terms or removing some filters to see more results.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-terracotta text-white rounded-lg text-sm font-medium hover:bg-terracotta/90 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* Resource Display */}
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "flex flex-col gap-3"}>
                {visibleResources.map((resource, i) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.01, 0.1), duration: 0.2 }}
                  >
                    <ResourceCard resource={resource} compact={viewMode === "list"} />
                  </motion.div>
                ))}
              </div>

              {/* Infinite scroll sentinel */}
              {visibleCount < filteredResources.length && (
                <div ref={sentinelRef} className="flex justify-center py-10">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-5 h-5 border-2 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
                    Loading more resources...
                  </div>
                </div>
              )}

              {visibleCount >= filteredResources.length && filteredResources.length > BATCH_SIZE && (
                <p className="text-center text-sm text-muted-foreground py-10">
                  All {filteredResources.length} resources loaded
                </p>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ===== Sub-Components ===== */

function ActiveDot() {
  return (
    <span className="absolute top-2 right-2 bg-terracotta text-white text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide shadow">
      Active
    </span>
  );
}

function CompactSelect({
  label,
  value,
  onChange,
  options,
  allLabel,
  displayMap,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  allLabel: string;
  displayMap?: Record<string, string>;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <label className="text-[0.55rem] font-semibold uppercase tracking-widest text-muted-foreground/70 text-center">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`appearance-none border rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-terracotta/30 transition-colors ${
            value !== "All" && value !== "title-asc"
              ? "bg-terracotta/5 border-terracotta/30 text-terracotta"
              : "bg-card border-border text-foreground"
          }`}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {displayMap ? (displayMap[opt] || opt) : (opt === "All" ? allLabel : opt)}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={12} />
      </div>
    </div>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-terracotta/10 text-terracotta text-xs font-medium rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-terracotta/70">
        <X size={12} />
      </button>
    </span>
  );
}
