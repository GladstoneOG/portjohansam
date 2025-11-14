"use client";

import { motion } from "framer-motion";

const heroVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0 },
};

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="section-padding relative flex min-h-screen flex-col justify-center overflow-hidden"
    >
      <motion.div
        className="relative z-10 max-w-4xl space-y-10"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.span
          className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 px-5 py-2 text-xs uppercase tracking-[0.45em] text-white/60 backdrop-blur-xs"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Precision First
        </motion.span>

        <motion.h1
          className="text-5xl font-semibold uppercase tracking-[0.4em] text-white md:text-7xl"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          Hi, I&rsquo;m Johan Sam - crafting digital precision.
        </motion.h1>

        <motion.p
          className="max-w-2xl text-lg text-white/70"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: "easeOut" }}
        >
          A creative technologist engineering cinematic web systems for
          high-performing teams - where motion, clarity, and code converge.
        </motion.p>

        <motion.a
          href="#about"
          className="group relative inline-flex w-fit items-center gap-6 overflow-hidden rounded-full border border-white/15 bg-white/5 px-6 py-4 text-left text-white/90 shadow-[0_0_35px_rgba(255,255,255,0.08)] backdrop-blur-md transition duration-300"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Explore next section"
        >
          <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
            <span className="absolute inset-0 bg-gradient-to-r from-white/5 via-cyan/15 to-magenta/20" />
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" />
          </span>

          <span className="relative flex flex-col text-xs uppercase tracking-[0.35em] text-white/80">
            <span className="text-white">Explore</span>
            <span className="text-[0.55rem] text-white/55">
              Scroll to next chapter
            </span>
          </span>

          <span className="relative flex items-center gap-3 pr-1">
            <span className="relative block h-px w-14 overflow-hidden rounded-full bg-white/10">
              <span className="absolute inset-0 origin-left scale-x-75 bg-white/50 transition duration-300 group-hover:scale-x-100" />
            </span>
            <motion.span
              className="relative flex h-12 w-12 items-center justify-center rounded-full bg-black/30 text-white ring-1 ring-inset ring-white/30 transition duration-300 group-hover:bg-black/70 group-hover:ring-white/60"
              animate={{ rotate: [0, 6, -6, 0] }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14" />
                <path d="M7 14l5 5 5-5" />
              </svg>
            </motion.span>
          </span>
        </motion.a>
      </motion.div>

      <motion.div
        className="absolute inset-0 -z-10 opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2, delay: 0.4 }}
      >
        <div className="absolute -left-32 top-10 h-64 w-64 rounded-full bg-cyan/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-magenta/20 blur-3xl" />
      </motion.div>
    </section>
  );
}
