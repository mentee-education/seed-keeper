/*
  DESIGN: "Living Earth" — Regenerative Design
  Navbar: mentee.ca-matched proportions — tall bar, large logo mark with
  wordmark + tagline context, pill-style nav links with filled active state.
*/
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IMAGES } from "@/lib/assets";

const LOGO_URL = IMAGES.logo;

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/resources", label: "Resources" },
  { href: "/videos", label: "Videos" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/"
      ? location === "/"
      : location.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/95 shadow-[0_4px_33px_rgba(0,0,0,0.08)]"
          : "bg-cream/85"
      } backdrop-blur-xl backdrop-saturate-150 border-b border-border/50`}
    >
      <div className="container flex items-center justify-between py-[14px] md:py-[18px]">
        {/* Logo + wordmark + tagline */}
        <Link href="/" className="flex items-center gap-3.5 no-underline group shrink-0">
          <img
            src={LOGO_URL}
            alt="SeedKeeper logo"
            className="h-11 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-serif text-[1.35rem] md:text-[1.6rem] text-soil tracking-tight leading-tight">
              SeedKeeper
            </span>
            <span className="text-[0.62rem] md:text-[0.68rem] tracking-[0.18em] uppercase text-soil-light/80 leading-snug">
              Cultivating Seeds of Knowledge
            </span>
          </div>
        </Link>

        {/* Desktop Nav — pill links, filled active state */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-1.5 rounded-full text-base transition-all duration-300 no-underline ${
                isActive(link.href)
                  ? "bg-terracotta text-white font-semibold shadow-sm"
                  : "text-soil hover:text-terracotta hover:bg-terracotta/8"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-soil rounded-lg hover:bg-sand transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-cream border-b border-border/60 overflow-hidden"
          >
            <div className="px-4 py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-3.5 text-base font-medium no-underline border-b border-border/30 last:border-0 transition-colors ${
                    isActive(link.href) ? "text-terracotta" : "text-soil-light"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
