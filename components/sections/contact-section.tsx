"use client";

import { motion } from "framer-motion";
import SectionHeading from "../ui/section-heading";
import { socialLinks } from "../../lib/data";

export default function ContactSection() {
  return (
    <section id="contact" className="section-padding relative py-32">
      <SectionHeading
        eyebrow="Contact"
        title="Build Together"
        description="Let's craft experiences that feel inevitable - calm, cinematic, and measurable."
      />

      <div className="flex flex-col gap-10 text-sm uppercase tracking-[0.3em] text-white/60 md:flex-row md:items-center md:justify-between">
        <motion.a
          href="mailto:hello@johansam.com"
          className="inline-flex items-center gap-4 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-white/90 shadow-[0_0_35px_rgba(255,255,255,0.08)] backdrop-blur-md transition-colors duration-300 hover:border-cyan/50 hover:text-cyan"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          hello@johansam.com
        </motion.a>

        <div className="flex flex-wrap gap-6">
          {socialLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              className="group relative text-white/50 transition-colors duration-300 hover:text-cyan"
              whileHover={{ y: -4 }}
            >
              <span className="relative inline-block">
                {link.label}
                <span className="absolute inset-x-0 -bottom-2 h-px bg-gradient-to-r from-transparent via-cyan to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>

      <p className="mt-24 text-xs uppercase tracking-[0.4em] text-white/40">
        Crafted with precision (c) 2025
      </p>
    </section>
  );
}
