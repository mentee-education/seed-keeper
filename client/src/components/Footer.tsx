/*
  DESIGN: "Living Earth" — Regenerative Design
  Footer: Dark soil background, warm cream text, woodcut logo
  Updated branding: Indigenous Resilience Center at University of Arizona
*/
import { Link } from "wouter";

const LOGO_DARK_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663407421710/GJEDwPAUKshiXegbpvTbbn/seedkeeper-logo-dark-oAGxFJDuNNQ2fVZMzAXMHZ.webp";

export default function Footer() {
  return (
    <footer className="bg-soil text-cream/90">
      {/* Top wave divider */}
      <div className="w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="w-full h-8 md:h-12">
          <path
            d="M0,60 L0,30 Q150,0 300,30 Q450,60 600,30 Q750,0 900,30 Q1050,60 1200,30 L1200,60 Z"
            fill="oklch(0.30 0.04 55)"
          />
        </svg>
      </div>

      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={LOGO_DARK_URL}
                alt="SeedKeeper logo"
                className="w-11 h-11 object-contain"
              />
              <div>
                <span className="font-serif text-xl text-cream tracking-tight block">
                  SeedKeeper
                </span>
                <span className="text-[0.6rem] tracking-[0.2em] uppercase text-cream/50">
                  Cultivating Seeds of Knowledge
                </span>
              </div>
            </div>
            <p className="text-sm text-cream/60 leading-relaxed max-w-sm mt-4">
              A curated resource library bridging Indigenous knowledge systems
              with K-12 education. Developed in partnership with the Indigenous
              Resilience Center at the University of Arizona.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <h4 className="font-serif text-base text-golden mb-4">Navigate</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-cream/60 hover:text-golden transition-colors no-underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-sm text-cream/60 hover:text-golden transition-colors no-underline">
                  Resource Library
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-cream/60 hover:text-golden transition-colors no-underline">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div className="md:col-span-4">
            <h4 className="font-serif text-base text-golden mb-4">Partners</h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://irec.arizona.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cream/60 hover:text-golden transition-colors no-underline"
                >
                  Indigenous Resilience Center
                </a>
              </li>
              <li>
                <a
                  href="https://www.arizona.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cream/60 hover:text-golden transition-colors no-underline"
                >
                  University of Arizona
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream/40">
            &copy; {new Date().getFullYear()} SeedKeeper. Built with respect for the land and its peoples.
          </p>
          <p className="text-xs text-cream/30">
            seedkeeper.org
          </p>
        </div>
      </div>
    </footer>
  );
}
