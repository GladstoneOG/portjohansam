"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll("[data-animate='text'] > *"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        section.querySelector("[data-animate='panel']"),
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
          },
        }
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-padding relative py-32"
    >
      <div className="grid gap-16 md:grid-cols-2 md:items-center">
        <div className="space-y-6" data-animate="text">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">
            About
          </p>
          <h3 className="text-3xl font-semibold uppercase tracking-[0.2em] text-white md:text-4xl">
            Engineering calm, cinematic experiences.
          </h3>
          <p className="text-base text-white/60">
            I architect immersive products from UX strategy through delivery -
            fusing systems thinking, rigorous prototyping, and motion design.
            Every detail is tuned for legibility, flow, and measurable outcomes.
          </p>
          <p className="text-base text-white/60">
            With roots in creative technology and high-availability
            applications, I partner with teams to craft visual-first systems
            that move as elegantly as they perform.
          </p>
        </div>

        <div
          className="relative h-80 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-panel"
          data-animate="panel"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,255,0.4),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,0,255,0.35),transparent_60%)]" />
          <div className="absolute inset-0 backdrop-blur-md" />
          <div className="absolute inset-0 flex items-center justify-center text-7xl font-semibold tracking-[0.4em] text-white/15">
            JS
          </div>
        </div>
      </div>
    </section>
  );
}
