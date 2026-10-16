"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { certifications, education, languages } from "@/lib/data";
import { Barcode, SectionLabel } from "@/components/ui/primitives";

export default function CredentialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      gsap.from("[data-cert-row]", {
        y: 28,
        opacity: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: "glide",
        scrollTrigger: {
          trigger: "[data-cert-list]",
          start: "top 82%",
          once: true,
        },
      });

      gsap.from("[data-lang-bar]", {
        scaleX: 0,
        transformOrigin: "left",
        duration: 1.3,
        stagger: 0.15,
        ease: "expo.out",
        scrollTrigger: {
          trigger: "[data-edu-grid]",
          start: "top 82%",
          once: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="credentials"
      ref={sectionRef}
      className="relative border-t-4 border-signal bg-paper py-24 text-ink md:py-36 gutter"
    >
      <SectionLabel
        index="08"
        label="VERIFIED CREDENTIALS"
        meta="SAP LICENSES // ACADEMIC FOUNDATION // LANGUAGES"
      />

      {/* Top Grid: Academic Degree & Language Telemetry */}
      <div
        data-edu-grid
        className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12"
      >
        {education.map((ed) => (
          <div
            key={ed.institution}
            className="flex flex-col justify-between border-2 border-ink bg-paper-2 p-7 shadow-[6px_6px_0px_#0A0A0B] md:p-9 lg:col-span-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/20 pb-4">
              <span className="hud bg-ink px-2.5 py-1 font-bold text-signal">
                ACADEMIC FOUNDATION
              </span>
              <span className="hud text-ink/60">CLASS OF {ed.year}</span>
            </div>

            <div className="my-6">
              <h3 className="font-cond font-display text-4xl font-black uppercase tracking-tight text-ink sm:text-5xl">
                {ed.institution}
              </h3>
              <p className="mt-2 font-mono text-sm font-semibold text-ink/80 md:text-base">
                {ed.degree}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-ink/20 pt-4">
              <span className="hud text-ink/60">JAKARTA, INDONESIA</span>
              <Barcode
                value="BINUS-CS-IS-2021"
                className="h-5 w-36 text-ink"
              />
            </div>
          </div>
        ))}

        {/* Language Telemetry Meters */}
        <div className="flex flex-col justify-between border-2 border-ink bg-paper p-7 md:p-9 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-ink/20 pb-4">
            <span className="hud font-bold text-ink">
              COMMUNICATION PROTOCOLS
            </span>
            <span className="hud text-ink/60">BILINGUAL</span>
          </div>

          <div className="my-6 space-y-6">
            {languages.map((lang) => (
              <div key={lang.name} className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs font-bold uppercase">
                  <span>{lang.name}</span>
                  <span className="bg-ink px-2 py-0.5 text-signal">
                    {lang.level} ({lang.pct}%)
                  </span>
                </div>
                <div className="h-3 w-full border border-ink bg-paper-2 p-0.5">
                  <div
                    data-lang-bar
                    style={{ width: `${lang.pct}%` }}
                    className="h-full bg-ink"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="hud border-t border-ink/20 pt-4 text-ink/60">
            TECHNICAL DOCUMENTATION · UAT FACILITATION · STAKEHOLDER BRIEFING
          </div>
        </div>
      </div>

      {/* SAP Certifications Registry Ledger */}
      <div className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-4">
          <h3 className="font-cond font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
            OFFICIAL <span className="bg-ink px-2.5 text-signal">SAP</span>{" "}
            CERTIFICATION LEDGER
          </h3>
          <span className="hud text-ink/60">
            05 VERIFIED CREDENTIALS // FI · HCM · CORE
          </span>
        </div>

        <div data-cert-list className="divide-y divide-ink/25 border-b-2 border-ink">
          {certifications.map((cert, idx) => (
            <div
              key={cert.id}
              data-cert-row
              data-cursor="VERIFIED"
              className="group grid grid-cols-1 items-center gap-3 px-4 py-5 transition-colors duration-200 hover:bg-ink hover:text-paper md:grid-cols-12"
            >
              <div className="flex items-center gap-3 md:col-span-2">
                <span className="hud opacity-50">0{idx + 1}</span>
                <span className="hud bg-ink px-2.5 py-1 font-bold text-signal group-hover:bg-signal group-hover:text-ink">
                  {cert.code}
                </span>
              </div>

              <div className="font-cond font-display text-2xl font-black uppercase tracking-tight md:col-span-6 md:text-3xl">
                {cert.name}
              </div>

              <div className="font-mono text-xs opacity-75 md:col-span-2">
                ID // {cert.id}
              </div>

              <div className="flex items-center justify-between gap-2 md:col-span-2 md:justify-end">
                <span className="hud opacity-70">{cert.issued}</span>
                <span className="hud border border-current px-2 py-0.5 text-[9px] group-hover:border-signal group-hover:text-signal">
                  ✓ VALID
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
