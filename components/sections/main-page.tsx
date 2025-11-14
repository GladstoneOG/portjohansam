"use client";

import { useEffect, useState } from "react";
import HeroSection from "./hero-section";
import AboutSection from "./about-section";
import ExperienceSection from "./experience-section";
import ProjectsSection from "./projects-section";
import ContactSection from "./contact-section";

const navLinks = [
  { href: "#experience", label: "Experience", accent: "text-cyan" },
  { href: "#projects", label: "Projects", accent: "text-magenta" },
  { href: "#contact", label: "Contact", accent: "text-yellow" },
];

export default function MainPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setMenuOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="relative">
      <header className="section-padding fixed top-0 z-40 hidden w-full items-center justify-between border-b border-white/5 bg-black/50 py-8 backdrop-blur-2xl md:flex">
        <a
          className="text-lg font-semibold uppercase tracking-[0.45em] text-white transition-colors duration-200 hover:text-cyan"
          href="#hero"
        >
          Johan Sam
        </a>
        <nav className="flex items-center gap-10 text-base font-semibold uppercase tracking-[0.4em]">
          <a
            className="text-cyan transition-colors duration-200 hover:text-white"
            href="#experience"
          >
            Experience
          </a>
          <a
            className="text-magenta transition-colors duration-200 hover:text-white"
            href="#projects"
          >
            Projects
          </a>
          <a
            className="text-yellow transition-colors duration-200 hover:text-white"
            href="#contact"
          >
            Contact
          </a>
        </nav>
      </header>
      <header className="section-padding fixed top-0 z-40 flex w-full items-center justify-between border-b border-white/5 bg-black/60 py-6 backdrop-blur-xl md:hidden">
        <a
          className="text-base font-semibold uppercase tracking-[0.4em] text-white"
          href="#hero"
          onClick={closeMenu}
        >
          Johan Sam
        </a>
        <button
          type="button"
          onClick={() => setMenuOpen((prev: boolean) => !prev)}
          className="relative h-11 w-11 rounded-full border border-white/15 bg-white/5 transition-colors duration-300 hover:border-white/40 hover:bg-white/10"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
        >
          <span
            className={`absolute left-1/2 top-1/2 h-0.5 w-6 -translate-x-1/2 -translate-y-2 transition-transform duration-300 ${
              menuOpen ? "translate-y-0 rotate-45 bg-white" : "bg-white"
            }`}
          />
          <span
            className={`absolute left-1/2 top-1/2 h-0.5 w-6 -translate-x-1/2 transition-opacity duration-300 ${
              menuOpen ? "opacity-0" : "opacity-100 bg-white"
            }`}
          />
          <span
            className={`absolute left-1/2 top-1/2 h-0.5 w-6 -translate-x-1/2 translate-y-2 transition-transform duration-300 ${
              menuOpen ? "-translate-y-0 -rotate-45 bg-white" : "bg-white"
            }`}
          />
        </button>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-black/90 px-8 text-center backdrop-blur-3xl md:hidden">
          <nav className="flex w-full flex-col items-center gap-8 text-lg font-semibold uppercase tracking-[0.4em]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`${link.accent} transition-colors duration-200 hover:text-white`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={closeMenu}
            className="text-xs uppercase tracking-[0.4em] text-white/50 transition-colors duration-200 hover:text-white"
          >
            Close
          </button>
        </div>
      ) : null}

      <div className="pt-20 md:pt-24">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <ContactSection />
      </div>
    </main>
  );
}
