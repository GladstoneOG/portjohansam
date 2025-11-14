"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "../ui/section-heading";
import { featuredProjects } from "../../lib/data";

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-project-card]");

      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            delay: index * 0.05,
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section-padding relative py-32"
    >
      <SectionHeading
        eyebrow="Projects"
        title="Cinematic Systems"
        description="Selected explorations engineered with choreographed motion, layered storytelling, and technically rigorous builds."
      />

      <div className="grid gap-12 md:gap-16">
        {featuredProjects.map((project) => (
          <article
            key={project.title}
            data-project-card
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-lg transition-colors duration-500 hover:border-cyan/40 hover:bg-white/10 md:p-14"
          >
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl space-y-6">
                <p className="text-sm uppercase tracking-[0.3em] text-white/50">
                  {project.subtitle}
                </p>
                <h3 className="text-3xl font-semibold uppercase tracking-[0.2em] text-white md:text-4xl">
                  {project.title}
                </h3>
                <p className="text-base text-white/70">{project.description}</p>
                <ul className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-white/40">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-white/10 px-4 py-1 backdrop-blur-xs transition-colors duration-300 group-hover:border-cyan/40 group-hover:text-white"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-end gap-6 text-sm uppercase tracking-[0.3em] text-cyan">
                <span>{project.cta}</span>
                <span className="text-3xl">&gt;</span>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan/15 via-transparent to-magenta/20" />
              <div className="absolute -right-10 top-10 h-44 w-44 rounded-full bg-yellow/20 blur-3xl" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
