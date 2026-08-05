/*
  DESIGN: "Living Earth" — Regenerative Design
  Footer: light sand ground, dark soil text — same logo mark as the navbar.
  Ends with the civicfirm-style "Developed by Mentee" band, color-matched.
*/
import { Link } from "wouter";
import { IMAGES } from "@/lib/assets";

export default function Footer() {
  return (
    <footer className="relative bg-sand border-t border-border">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand Column — same logo as the navbar */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3.5 mb-4">
              <img
                src={IMAGES.logo}
                alt="SeedKeeper logo"
                className="h-12 w-auto object-contain rounded-full ring-1 ring-border/60"
              />
              <div>
                <span className="font-serif text-xl text-soil tracking-tight block">
                  SeedKeeper
                </span>
                <span className="text-[0.62rem] tracking-[0.18em] uppercase text-soil-light/80">
                  Cultivating Seeds of Knowledge
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mt-4">
              A curated resource library bridging Indigenous knowledge systems
              with K-12 education. Developed in partnership with the Indigenous
              Resilience Center at the University of Arizona.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <h4 className="font-serif text-base text-terracotta mb-4">Navigate</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-soil/80 hover:text-terracotta transition-colors no-underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-sm text-soil/80 hover:text-terracotta transition-colors no-underline">
                  Resource Library
                </Link>
              </li>
              <li>
                <Link href="/videos" className="text-sm text-soil/80 hover:text-terracotta transition-colors no-underline">
                  Video Library
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-soil/80 hover:text-terracotta transition-colors no-underline">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div className="md:col-span-4">
            <h4 className="font-serif text-base text-terracotta mb-4">Partners</h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://resilience.arizona.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-soil/80 hover:text-terracotta transition-colors no-underline"
                >
                  Indigenous Resilience Center
                </a>
              </li>
              <li>
                <a
                  href="https://www.arizona.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-soil/80 hover:text-terracotta transition-colors no-underline"
                >
                  University of Arizona
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SeedKeeper. Built with respect for the land and its peoples.
          </p>
          <p className="text-xs text-muted-foreground/70">
            seedkeeper.org
          </p>
        </div>
      </div>

      {/* Developed by Mentee — civicfirm pattern, color-matched */}
      <div className="bg-cream border-t border-border">
        <div className="container py-6 flex items-center justify-center gap-4">
          <span className="text-sm uppercase font-medium tracking-[0.25em] text-soil/70">
            Developed by
          </span>
          <a href="https://mentee.ca" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            <img src="/mentee-logo.svg" alt="Mentee" className="h-9 w-auto brightness-0 opacity-75" />
          </a>
        </div>
      </div>
    </footer>
  );
}
