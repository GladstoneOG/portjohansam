"use client";

import { motion } from "framer-motion";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mb-12 space-y-3">
      {eyebrow ? (
        <motion.span
          className="inline-flex rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-[0.4em] text-white/60"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {eyebrow}
        </motion.span>
      ) : null}

      <motion.h2
        className="text-4xl font-semibold uppercase tracking-[0.3em] md:text-5xl"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {title}
      </motion.h2>

      {description ? (
        <motion.p
          className="max-w-2xl text-base text-white/60"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          viewport={{ once: true }}
        >
          {description}
        </motion.p>
      ) : null}
    </div>
  );
}
