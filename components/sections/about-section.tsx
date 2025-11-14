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
            Professional Summary
          </h3>
          <p className="text-base text-white/60">
            Experienced ABAP Developer with a strong background in SAP ERP ECC 6.0 and IS-H, specializing in RICEFW developments: reports, BAPIs, BADIs, SmartForms, ALV grids, and BDC programs. Skilled in debugging and performance optimization to ensure efficient, high-quality SAP solutions.
          </p>
          <p className="text-base text-white/60">
            Proven ability to bridge SAP and web technologies (PHP, JavaScript) delivering integration layers, hospital queueing, fallback ERP systems, and KPI compliance platforms that sustain operational continuity.
          </p>
          <div className="space-y-4 pt-2 text-white/70">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-2">Technical Skills</p>
              <ul className="space-y-1 text-sm">
                <li><span className="font-semibold text-white">Programming:</span> SAP ABAP, PHP, JavaScript</li>
                <li><span className="font-semibold text-white">SAP:</span> ECC 6.0, IS-H, RICEFW, BAPIs, BADIs, SmartForms, ALV, BDC</li>
                <li><span className="font-semibold text-white">Systems:</span> ERP Systems</li>
                <li><span className="font-semibold text-white">Databases:</span> SQL Server</li>
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-2">Education</p>
              <p className="text-sm">Bina Nusantara University – Bachelor of Computer Science / Information Systems (2021)</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-2">Certifications</p>
              <ul className="grid grid-cols-1 gap-1 text-xs md:grid-cols-2">
                <li>SAP 01 – SAP Overview (550100830)</li>
                <li>AC010 – Financial Accounting (550106654)</li>
                <li>THR10_1 – HR Admin I (550106874)</li>
                <li>HR050 – HCM Processes (550106726)</li>
                <li>TFIN50_1 – FI Part 1 (550106801)</li>
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-2">Languages</p>
              <p className="text-sm">Bahasa Indonesia (Native), English (Professional)</p>
            </div>
          </div>
        </div>

        <div
          className="relative h-80 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-panel"
          data-animate="panel"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,255,0.4),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,0,255,0.35),transparent_60%)]" />
          <div className="absolute inset-0 backdrop-blur-md" />
          <div className="absolute inset-0 flex items-center justify-center text-6xl font-semibold tracking-[0.4em] text-white/15">
            ABAP
          </div>
        </div>
      </div>
    </section>
  );
}
