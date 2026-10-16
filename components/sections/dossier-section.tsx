"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { experience, profile } from "@/lib/data";
import { Barcode, SectionLabel, SplitReveal } from "@/components/ui/primitives";

export default function DossierSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      if (spineRef.current) {
        gsap.fromTo(
          spineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 60%",
              end: "bottom 70%",
              scrub: true,
            },
          }
        );
      }

      gsap.from("[data-exp-card]", {
        y: 48,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "glide",
        scrollTrigger: {
          trigger: "[data-exp-list]",
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="dossier"
      ref={sectionRef}
      className="relative border-t border-ink/20 bg-paper-2 py-24 text-ink md:py-36 gutter"
    >
      <SectionLabel
        index="05"
        label="OPERATOR DOSSIER"
        meta="SERVICE RECORD // 2020 — PRESENT"
      />

      <div className="mt-12 grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
        {/* Left Sticky Operator Identification Card */}
        <div className="lg:sticky lg:top-24 lg:col-span-4">
          <div className="border-2 border-ink bg-paper p-6 shadow-[8px_8px_0px_#0A0A0B] md:p-8">
            <div className="flex items-center justify-between border-b-2 border-ink pb-4">
              <div>
                <div className="hud text-ink/60">IDENTIFICATION FILE</div>
                <div className="mt-1 font-cond font-display text-3xl font-black uppercase tracking-tight">
                  {profile.first} {profile.last}
                </div>
              </div>
              <span className="bg-signal px-2.5 py-1 font-mono text-xs font-bold text-ink border border-ink">
                JS-01
              </span>
            </div>

            <div className="my-5 space-y-2.5 font-mono text-xs">
              {profile.spec.map((s) => (
                <div
                  key={s.k}
                  className="flex items-center justify-between border-b border-ink/15 pb-2"
                >
                  <span className="text-ink/60">{s.k}</span>
                  <span className="font-bold text-ink">{s.v}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-1">
                <span className="text-ink/60">STATUS</span>
                <span className="bg-ink px-2 py-0.5 text-[10px] font-bold text-signal">
                  {profile.status}
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-ink/80 md:text-sm">
              {profile.summary}
            </p>

            <div className="mt-6 border-t border-ink/20 pt-4">
              <Barcode
                value="OPERATOR-JOHAN-SAMSUDIN-ISH"
                className="h-7 w-full text-ink"
              />
              <div className="hud mt-2 flex justify-between text-[9px] text-ink/55">
                <span>CLEARANCE: LEVEL-4</span>
                <span>SAP ECC 6.0 // IS-H</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Experience Timeline */}
        <div
          data-exp-list
          className="relative space-y-10 pl-6 md:pl-10 lg:col-span-8"
        >
          {/* Scroll-Scrubbed Progress Spine */}
          <div className="absolute bottom-0 left-0 top-0 w-[2px] bg-ink/15">
            <div
              ref={spineRef}
              className="h-full w-full origin-top bg-ink"
            />
          </div>

          <SplitReveal
            as="h2"
            type="lines"
            className="font-cond font-display text-4xl font-black uppercase leading-[0.88] tracking-tightest sm:text-6xl"
          >
            FIELD DEPLOYMENTS &amp; ENTERPRISE ENGINEERING.
          </SplitReveal>

          {experience.map((item, idx) => (
            <article
              key={item.role}
              data-exp-card
              className="relative border-2 border-ink bg-paper p-6 transition-transform duration-300 hover:-translate-y-1 md:p-9"
            >
              {/* Timeline Spine Node Marker */}
              <div className="absolute -left-[31px] top-8 flex h-4 w-4 items-center justify-center border-2 border-ink bg-signal md:-left-[47px]" />

              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/20 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="hud bg-ink px-2.5 py-1 font-bold text-signal">
                    {item.period}
                  </span>
                  <span className="hud border border-ink/40 px-2.5 py-1 text-ink">
                    {item.tag}
                  </span>
                </div>
                <span className="hud text-ink/50">LOG // 0{idx + 1}</span>
              </div>

              <h3 className="mt-5 font-cond font-display text-3xl font-black uppercase tracking-tight text-ink md:text-5xl">
                {item.role}
              </h3>
              <div className="mt-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-alert md:text-sm">
                @ {item.company}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-ink/85 md:text-base">
                {item.description}
              </p>

              <ul className="mt-6 grid grid-cols-1 gap-2.5 border-t border-ink/15 pt-5 font-mono text-xs md:grid-cols-2">
                {item.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-ink/85">
                    <span className="mt-0.5 font-bold text-alert">▸</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
