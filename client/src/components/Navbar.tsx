/*
  DESIGN: "Living Earth" — Regenerative Design
  Navbar: Custom woodcut logo, warm sand background, DM Serif Display wordmark
  Sticky with backdrop blur and subtle border
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
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/95 backdrop-blur-lg shadow-sm"
          : "bg-cream/80 backdrop-blur-md"
      } border-b border-border/60`}
    >
      <div className="container flex items-center justify-between h-16 md:h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <img
            src={LOGO_URL}
            alt="SeedKeeper logo"
            className="w-10 h-10 md:w-11 md:h-11 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-serif text-xl md:text-[1.4rem] text-soil tracking-tight leading-tight">
              SeedKeeper
            </span>
            <span className="text-[0.6rem] tracking-[0.2em] uppercase text-soil-light/70 hidden sm:block">
              Cultivating Seeds of Knowledge
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location === link.href || 
              (link.href === "/resources" && location.startsWith("/resources"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors no-underline rounded-lg ${
                  isActive
                    ? "text-terracotta bg-terracotta/8"
                    : "text-soil-light hover:text-terracotta hover:bg-terracotta/5"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-terracotta rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </Link>
            );
          })}
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
              {navLinks.map((link) => {
                const isActive = location === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block py-3.5 text-base font-medium no-underline border-b border-border/30 last:border-0 transition-colors ${
                      isActive
                        ? "text-terracotta"
                        : "text-soil-light"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
