"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Project, projects } from "@/lib/data";
import { Barcode, SectionLabel } from "@/components/ui/primitives";

function ModuleSchematic({ variant }: { variant: Project["variant"] }) {
  switch (variant) {
    case "mesh":
      return (
        <svg
          viewBox="0 0 360 180"
          className="h-44 w-full border border-paper/15 bg-ink p-3"
          aria-hidden
        >
          {/* Grid crosshairs */}
          <line x1="0" y1="90" x2="360" y2="90" stroke="#ECECE6" strokeOpacity="0.08" />
          <line x1="180" y1="0" x2="180" y2="180" stroke="#ECECE6" strokeOpacity="0.08" />
          {/* Spokes from central MCP hub */}
          {[
            [60, 35, "SE38"],
            [60, 145, "SYNTAX"],
            [180, 22, "LLM AGENT"],
            [300, 35, "DDIC"],
            [300, 145, "ACTIVATE"],
            [180, 158, "T-CODE"],
          ].map(([x, y, lbl], i) => (
            <g key={i}>
              <line
                x1="180"
                y1="90"
                x2={Number(x)}
                y2={Number(y)}
                stroke="#FFE100"
                strokeOpacity="0.55"
                strokeDasharray="3 3"
              />
              <rect
                x={Number(x) - 32}
                y={Number(y) - 11}
                width="64"
                height="22"
                fill="#111113"
                stroke="#ECECE6"
                strokeOpacity="0.35"
              />
              <text
                x={Number(x)}
                y={Number(y) + 3}
                textAnchor="middle"
                fill="#ECECE6"
                fontSize="8"
                fontFamily="monospace"
              >
                {lbl}
              </text>
            </g>
          ))}
          {/* Center MCP Hub */}
          <rect
            x="132"
            y="68"
            width="96"
            height="44"
            fill="#FFE100"
            stroke="#0A0A0B"
            strokeWidth="2"
          />
          <text
            x="180"
            y="88"
            textAnchor="middle"
            fill="#0A0A0B"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
          >
            SAP-DEV MCP
          </text>
          <text
            x="180"
            y="101"
            textAnchor="middle"
            fill="#0A0A0B"
            fontSize="7"
            fontFamily="monospace"
          >
            7 TOOLS // ACTIVE
          </text>
        </svg>
      );

    case "bridge":
      return (
        <svg
          viewBox="0 0 360 180"
          className="h-44 w-full border border-paper/15 bg-ink p-3"
          aria-hidden
        >
          <rect
            x="18"
            y="32"
            width="92"
            height="116"
            fill="#111113"
            stroke="#FFE100"
            strokeOpacity="0.7"
          />
          <text x="64" y="58" textAnchor="middle" fill="#FFE100" fontSize="9" fontFamily="monospace">
            SAP IS-H
          </text>
          <text x="64" y="76" textAnchor="middle" fill="#ECECE6" fontSize="8" fontFamily="monospace">
            NPAT · NFAL
          </text>
          <text x="64" y="92" textAnchor="middle" fill="#ECECE6" fontSize="8" fontFamily="monospace">
            BAPI / RFC
          </text>

          <rect
            x="250"
            y="32"
            width="92"
            height="116"
            fill="#111113"
            stroke="#ECECE6"
            strokeOpacity="0.45"
          />
          <text x="296" y="58" textAnchor="middle" fill="#ECECE6" fontSize="9" fontFamily="monospace">
            HOSPITAL EMR
          </text>
          <text x="296" y="76" textAnchor="middle" fill="#86898F" fontSize="8" fontFamily="monospace">
            PHP · JS · SQL
          </text>
          <text x="296" y="92" textAnchor="middle" fill="#86898F" fontSize="8" fontFamily="monospace">
            CLINICAL UI
          </text>

          {[
            [56, "PATIENT SYNC"],
            [90, "CASE STREAM"],
            [124, "FI BILLING"],
          ].map(([y, label], i) => (
            <g key={i}>
              <line
                x1="110"
                y1={Number(y)}
                x2="250"
                y2={Number(y)}
                stroke="#FFE100"
                strokeOpacity="0.6"
                strokeDasharray="4 2"
              />
              <rect
                x="140"
                y={Number(y) - 9}
                width="80"
                height="18"
                fill="#0A0A0B"
                stroke="#FFE100"
                strokeOpacity="0.5"
              />
              <text
                x="180"
                y={Number(y) + 3}
                textAnchor="middle"
                fill="#FFE100"
                fontSize="7.5"
                fontFamily="monospace"
              >
                {label}
              </text>
            </g>
          ))}
        </svg>
      );

    case "queue":
      return (
        <svg
          viewBox="0 0 360 180"
          className="h-44 w-full border border-paper/15 bg-ink p-3"
          aria-hidden
        >
          {["BOOKING", "TRIAGE", "ROOM TV", "WHATSAPP"].map((stage, i) => {
            const x = 22 + i * 84;
            return (
              <g key={stage}>
                <rect
                  x={x}
                  y="36"
                  width="68"
                  height="52"
                  fill={i === 2 ? "#FFE100" : "#111113"}
                  stroke="#FFE100"
                  strokeOpacity={i === 2 ? "1" : "0.45"}
                />
                <text
                  x={x + 34}
                  y="58"
                  textAnchor="middle"
                  fill={i === 2 ? "#0A0A0B" : "#ECECE6"}
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {stage}
                </text>
                <text
                  x={x + 34}
                  y="74"
                  textAnchor="middle"
                  fill={i === 2 ? "#0A0A0B" : "#86898F"}
                  fontSize="7"
                  fontFamily="monospace"
                >
                  Q-0{i + 1}
                </text>
                {i < 3 ? (
                  <line
                    x1={x + 68}
                    y1="62"
                    x2={x + 84}
                    y2="62"
                    stroke="#FFE100"
                    strokeWidth="1.5"
                  />
                ) : null}
              </g>
            );
          })}
          {/* Live Telemetry Waveform */}
          <polyline
            fill="none"
            stroke="#FFE100"
            strokeWidth="1.5"
            points="22,138 65,138 82,114 98,152 115,126 145,138 210,138 230,118 248,148 268,138 338,138"
          />
          <text x="22" y="164" fill="#86898F" fontSize="7.5" fontFamily="monospace">
            EST. WAIT TELEMETRY // REAL-TIME STREAM
          </text>
        </svg>
      );

    case "fallback":
      return (
        <svg
          viewBox="0 0 360 180"
          className="h-44 w-full border border-paper/15 bg-ink p-3"
          aria-hidden
        >
          <rect
            x="24"
            y="26"
            width="124"
            height="52"
            fill="#111113"
            stroke="#ECECE6"
            strokeOpacity="0.35"
          />
          <text x="86" y="49" textAnchor="middle" fill="#ECECE6" fontSize="8.5" fontFamily="monospace">
            SAP ECC PRIMARY
          </text>
          <text x="86" y="64" textAnchor="middle" fill="#FF4A1C" fontSize="7.5" fontFamily="monospace">
            MAINTENANCE WINDOW
          </text>

          <rect
            x="24"
            y="102"
            width="124"
            height="52"
            fill="#FFE100"
            stroke="#0A0A0B"
          />
          <text
            x="86"
            y="125"
            textAnchor="middle"
            fill="#0A0A0B"
            fontSize="8.5"
            fontWeight="bold"
            fontFamily="monospace"
          >
            WEB ERP FALLBACK
          </text>
          <text x="86" y="140" textAnchor="middle" fill="#0A0A0B" fontSize="7.5" fontFamily="monospace">
            ACTIVE // FAILOVER ON
          </text>

          <path
            d="M 148 52 L 195 52 L 195 90 L 235 90"
            fill="none"
            stroke="#ECECE6"
            strokeOpacity="0.25"
            strokeDasharray="3 3"
          />
          <path
            d="M 148 128 L 195 128 L 195 90 L 235 90"
            fill="none"
            stroke="#FFE100"
            strokeWidth="2"
          />

          <rect
            x="235"
            y="56"
            width="102"
            height="68"
            fill="#111113"
            stroke="#FFE100"
          />
          <text x="286" y="84" textAnchor="middle" fill="#FFE100" fontSize="9" fontFamily="monospace">
            24/7 OPS
          </text>
          <text x="286" y="101" textAnchor="middle" fill="#ECECE6" fontSize="7.5" fontFamily="monospace">
            RECONCILE BUFFER
          </text>
        </svg>
      );

    case "kpi":
      return (
        <svg
          viewBox="0 0 360 180"
          className="h-44 w-full border border-paper/15 bg-ink p-3"
          aria-hidden
        >
          <line
            x1="24"
            y1="44"
            x2="336"
            y2="44"
            stroke="#FF4A1C"
            strokeDasharray="4 3"
            strokeOpacity="0.7"
          />
          <text x="334" y="38" textAnchor="end" fill="#FF4A1C" fontSize="7" fontFamily="monospace">
            TARGET THRESHOLD 95%
          </text>
          {[68, 92, 84, 108, 102, 114].map((h, i) => {
            const x = 34 + i * 50;
            const y = 152 - h;
            const top = h >= 100;
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width="30"
                  height={h}
                  fill={top ? "#FFE100" : "#1A1B1E"}
                  stroke="#FFE100"
                  strokeOpacity={top ? "1" : "0.45"}
                />
                <text
                  x={x + 15}
                  y="168"
                  textAnchor="middle"
                  fill="#86898F"
                  fontSize="7.5"
                  fontFamily="monospace"
                >
                  KPI-0{i + 1}
                </text>
              </g>
            );
          })}
        </svg>
      );
  }
}

export default function ModulesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeMod, setActiveMod] = useState(1);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const track = trackRef.current;
        const pin = pinRef.current;
        if (!track || !pin) return;

        const getDistance = () =>
          Math.max(0, track.scrollWidth - window.innerWidth + 96);

        gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) {
                gsap.set(progressRef.current, { scaleX: self.progress });
              }
              const idx = Math.min(
                projects.length,
                Math.floor(self.progress * projects.length) + 1
              );
              setActiveMod(idx);
            },
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="modules"
      ref={sectionRef}
      className="relative border-t border-paper/15 bg-ink text-paper"
    >
      <div
        ref={pinRef}
        className="flex min-h-screen flex-col justify-between overflow-hidden py-20 lg:py-16"
      >
        <div className="gutter">
          <SectionLabel
            index="06"
            label="ENGINEERED MODULES"
            meta="HORIZONTAL SYSTEM REEL // HEALTHCARE & MCP"
          />

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-cond font-display text-5xl font-black uppercase leading-[0.86] tracking-tightest sm:text-7xl">
              PRODUCTION <span className="text-signal">SYSTEMS</span> &amp; MCP
              BRIDGES.
            </h2>

            <div className="hud flex items-center gap-4 text-paper/60">
              <span>
                ACTIVE MODULE // 0{activeMod} OF 0{projects.length}
              </span>
              <div className="hidden h-1.5 w-36 bg-paper/15 lg:block">
                <div
                  ref={progressRef}
                  className="h-full w-full origin-left scale-x-0 bg-signal"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Reel on Desktop / Stack on Mobile */}
        <div className="gutter mt-10">
          <div
            ref={trackRef}
            className="flex flex-col gap-6 lg:flex-row lg:w-max lg:gap-8"
          >
            {projects.map((project) => (
              <article
                key={project.code}
                data-cursor={project.code}
                className="group flex w-full shrink-0 flex-col justify-between border border-paper/20 bg-ink-2 p-7 transition-colors duration-300 hover:border-signal lg:w-[500px] xl:w-[540px] chamfer"
              >
                <div>
                  {/* Card Top Metadata */}
                  <div className="flex items-center justify-between gap-2 border-b border-paper/10 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="hud bg-paper/10 px-2.5 py-1 font-bold text-signal">
                        {project.code}
                      </span>
                      {project.flag ? (
                        <span className="hud bg-signal px-2 py-1 font-bold text-ink">
                          {project.flag}
                        </span>
                      ) : null}
                    </div>
                    <span className="hud text-paper/50">{project.subtitle}</span>
                  </div>

                  {/* Custom SVG Blueprint Schematic */}
                  <div className="mt-5">
                    <ModuleSchematic variant={project.variant} />
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-6 font-cond font-display text-3xl font-black uppercase tracking-tight text-paper transition-colors group-hover:text-signal md:text-4xl">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-paper/75">
                    {project.description}
                  </p>
                </div>

                {/* Metrics & Tags */}
                <div className="mt-7 space-y-4 border-t border-paper/15 pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    {project.metrics.map((m) => (
                      <div
                        key={m.k}
                        className="border border-paper/10 bg-ink px-3 py-2"
                      >
                        <div className="hud text-[9px] text-paper/45">{m.k}</div>
                        <div className="mt-1 font-mono text-xs font-bold text-signal">
                          {m.v}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((t) => (
                        <span
                          key={t}
                          className="hud border border-paper/15 bg-ink px-2.5 py-1 text-[10px] text-paper/75 group-hover:border-signal/40"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <Barcode
                      value={project.code}
                      className="h-4 w-16 text-paper/35"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
