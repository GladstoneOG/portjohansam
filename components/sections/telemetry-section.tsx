"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { stats } from "@/lib/data";
import { Barcode, SectionLabel } from "@/components/ui/primitives";

export default function TelemetrySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      const counters = el.querySelectorAll<HTMLElement>("[data-counter]");
      counters.forEach((node) => {
        const target = Number(node.dataset.target ?? "0");
        const pad = Number(node.dataset.pad ?? "2");
        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
            once: true,
          },
          onUpdate: () => {
            node.textContent = String(Math.round(obj.val)).padStart(pad, "0");
          },
        });
      });

      gsap.from("[data-stat-cell]", {
        y: 36,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "glide",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="telemetry"
      ref={sectionRef}
      className="relative border-t-4 border-signal bg-paper py-24 text-ink md:py-36 gutter"
    >
      {/* Top Industrial Hazard Rule */}
      <div className="hazard mb-10 h-2.5 w-full" aria-hidden />

      <SectionLabel
        index="04"
        label="SYSTEM TELEMETRY"
        meta="VERIFIED OPERATIONAL METRICS // SAP IS-H"
      />

      <div className="mt-10 flex flex-col justify-between gap-6 border-b border-ink/20 pb-8 lg:flex-row lg:items-end">
        <h2 className="font-cond font-display text-5xl font-black uppercase leading-[0.86] tracking-tightest sm:text-7xl">
          PRODUCTION-GRADE <br />
          <span className="bg-ink px-3 text-signal">TELEMETRY</span> READOUT.
        </h2>
        <div className="hud max-w-sm space-y-2 text-ink/70">
          <p>
            CONTINUOUS HOSPITAL ERP OPERATIONS COMBINED WITH AGENTIC AI TOOLING
            AND CERTIFIED SAP CORE COMPETENCY.
          </p>
          <Barcode
            value="TELEMETRY-VERIFIED-2026"
            className="h-5 w-44 text-ink/75"
          />
        </div>
      </div>

      {/* 4-Cell Swiss Metric Grid */}
      <div className="mt-12 grid grid-cols-1 border-l border-t border-ink/25 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            data-stat-cell
            data-cursor="METRIC"
            className="group relative flex flex-col justify-between border-b border-r border-ink/25 bg-paper p-7 transition-colors duration-300 hover:bg-ink hover:text-paper md:p-9"
          >
            <div className="flex items-center justify-between">
              <span className="hud opacity-60">METRIC // 0{idx + 1}</span>
              <span className="hud bg-ink px-2 py-1 text-paper transition-colors group-hover:bg-signal group-hover:text-ink">
                {stat.note}
              </span>
            </div>

            <div className="my-10 flex items-baseline font-cond font-display text-7xl font-black leading-none tracking-tightest md:text-8xl">
              <span
                data-counter
                data-target={stat.value}
                data-pad={stat.pad}
              >
                00
              </span>
              {stat.suffix ? (
                <span className="ml-1 text-5xl text-alert transition-colors group-hover:text-signal md:text-6xl">
                  {stat.suffix}
                </span>
              ) : null}
            </div>

            <div className="flex items-end justify-between border-t border-current/15 pt-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider md:text-sm">
                {stat.label}
              </span>
              <span className="hud opacity-40">+</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
