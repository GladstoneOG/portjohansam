"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "../ui/section-heading";
import { experienceTimeline } from "../../lib/data";

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const items = section.querySelectorAll("[data-animate='item']");
      gsap.fromTo(
        items,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="section-padding relative py-32"
    >
      <SectionHeading
        eyebrow="Experience"
        title="Professional Roles"
        description="Core positions contributing to hospital information systems, SAP IS-H optimization, and structured business analysis."
      />

      <div className="relative border-l border-white/10 pl-10">
        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-cyan via-white/40 to-magenta opacity-50" />
        <div className="space-y-16">
          {experienceTimeline.map((item) => (
            <div key={item.role} className="relative" data-animate="item">
              <div className="absolute -left-12 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-black">
                <span className="h-3 w-3 rounded-full bg-cyan" />
              </div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                {item.year}
              </p>
              <h4 className="mt-2 text-2xl font-semibold uppercase tracking-[0.2em] text-white">
                {item.role}
              </h4>
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">
                {item.company}
              </p>
              <p className="mt-4 max-w-2xl text-base text-white/60">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
