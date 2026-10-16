"use client";

import { useRef } from "react";
import clsx from "clsx";
import { gsap, useGSAP } from "@/lib/gsap";
import { manifesto, marqueeTerms } from "@/lib/data";
import Marquee from "@/components/ui/marquee";
import { Barcode, SectionLabel } from "@/components/ui/primitives";

const PILLARS = [
  {
    code: "PIL-01",
    tag: "SEMANTIC GROUNDING",
    title: "Context Engineering over Raw Prompting",
    body: "Generic LLMs hallucinate SAP table fields. I feed structured DDIC schemas (NPAT, NFAL, NBEW), enterprise naming rules, and Clean ABAP constraints into the context window so every generated token is grounded in actual ECC 6.0 metadata.",
    metric: "128K CTX // DDIC-BOUND",
  },
  {
    code: "PIL-02",
    tag: "AGENTIC VELOCITY",
    title: "Vibe Coding with an Enterprise Flight Plan",
    body: "Instead of typing boilerplate ALV field catalogs or BDC recording loops by hand, I direct autonomous coding agents through layered prompt specifications — synthesizing RICEFW reports, BAPIs, and BADIs at machine speed.",
    metric: "10× SYNTHESIS SPEED",
  },
  {
    code: "PIL-03",
    tag: "ZERO-TRUST GOVERNANCE",
    title: "MCP Loop + Human-in-the-Loop Audit",
    body: "Hospital systems run 24/7 and never tolerate 'vibes-only' bugs. Every AI-synthesized program runs through an MCP syntax/ATC verification bridge and my manual line-by-line review for FOR ALL ENTRIES guards, index usage, and authority checks.",
    metric: "0 UNVERIFIED TRANSPORTS",
  },
];

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);

  const words = manifesto.text.split(" ");

  useGSAP(
    () => {
      const quote = quoteRef.current;
      if (!quote) return;
      const wordEls = quote.querySelectorAll("[data-word]");

      gsap.fromTo(
        wordEls,
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: quote,
            start: "top 80%",
            end: "bottom 45%",
            scrub: true,
          },
        }
      );

      gsap.from("[data-pillar]", {
        y: 36,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "glide",
        scrollTrigger: {
          trigger: "[data-pillar-grid]",
          start: "top 82%",
          once: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative bg-ink text-paper"
    >
      {/* High-Contrast Signal-Yellow Velocity Marquee */}
      <div className="border-y border-ink bg-signal py-3.5 text-ink">
        <Marquee speed={1.15}>
          {marqueeTerms.map((term, idx) => (
            <div key={idx} className="flex items-center">
              <span className="px-6 font-cond font-display text-2xl font-black uppercase tracking-tight md:text-3xl">
                {term}
              </span>
              <span className="hud bg-ink px-2 py-0.5 text-[10px] font-bold text-signal">
                JS//0{idx + 1}
              </span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* Scrubbed Word-by-Word Manifesto */}
      <div className="gutter py-28 md:py-40">
        <SectionLabel
          index="02"
          label="OPERATIONAL MANIFESTO"
          meta="PARADIGM // VIBE-TO-PRODUCTION ABAP"
        />

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="hud space-y-3 text-paper/55 lg:col-span-3">
            <div className="inline-block border border-signal/40 bg-signal/10 px-2.5 py-1 text-signal">
              THESIS // 2026
            </div>
            <p className="leading-relaxed">
              SYNTHESIZING ENTERPRISE SAP RELIABILITY WITH AGENTIC AI SPEED.
            </p>
            <Barcode
              value="VIBE-CODING-ABAP-ARCHITECT"
              className="h-6 w-36 text-paper/35"
            />
          </div>

          <p
            ref={quoteRef}
            className="font-display text-3xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:col-span-9 lg:text-6xl"
          >
            {words.map((w, i) => {
              const clean = w.replace(/[—,.]/g, "");
              const isHighlight = manifesto.highlights.some(
                (h) => h.replace(/[—,.]/g, "").toLowerCase() === clean.toLowerCase()
              );
              return (
                <span
                  key={i}
                  data-word
                  className={clsx(
                    "mr-[0.26em] inline-block transition-colors",
                    isHighlight ? "text-signal" : "text-paper"
                  )}
                >
                  {w}
                </span>
              );
            })}
          </p>
        </div>

        {/* 3 Architectural Pillars of Enterprise Vibe Coding */}
        <div
          data-pillar-grid
          className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {PILLARS.map((p) => (
            <article
              key={p.code}
              data-pillar
              className="brackets group flex flex-col justify-between border border-paper/15 bg-ink-2 p-7 transition-colors hover:border-signal/60"
            >
              <div>
                <div className="flex items-center justify-between border-b border-paper/10 pb-4">
                  <span className="hud text-signal">{p.code}</span>
                  <span className="hud text-paper/50">{p.tag}</span>
                </div>
                <h3 className="mt-6 font-cond font-display text-2xl font-black uppercase tracking-tight text-paper group-hover:text-signal md:text-3xl">
                  {p.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-paper/70">
                  {p.body}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-paper/10 pt-4 hud">
                <span className="text-paper/45">BENCHMARK</span>
                <span className="bg-paper/10 px-2 py-1 text-signal">
                  {p.metric}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
