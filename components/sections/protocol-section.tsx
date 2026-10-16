"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { protocol, TermLine } from "@/lib/data";
import { Barcode, SectionLabel } from "@/components/ui/primitives";

function renderTermPrefix(t: TermLine["t"]) {
  switch (t) {
    case "cmd":
      return <span className="mr-2 font-bold text-signal">$</span>;
    case "ok":
      return <span className="mr-2 font-bold text-emerald-400">✓</span>;
    case "info":
      return <span className="mr-2 font-bold text-sky-400">ℹ</span>;
    case "warn":
      return <span className="mr-2 font-bold text-alert">⚠</span>;
    case "sys":
      return <span className="mr-2 text-paper/45">#</span>;
    case "code":
      return <span className="mr-3 select-none text-paper/30">│</span>;
    default:
      return null;
  }
}

export default function ProtocolSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [simulating, setSimulating] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        stRef.current = ScrollTrigger.create({
          trigger: pinRef.current,
          start: "top top",
          end: "+=280%",
          pin: true,
          scrub: 0.4,
          onUpdate: (self) => {
            const idx = Math.min(
              protocol.length - 1,
              Math.floor(self.progress * protocol.length)
            );
            setActiveIdx(idx);
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  const selectStep = (idx: number) => {
    setActiveIdx(idx);
    const st = stRef.current;
    if (st && window.innerWidth >= 1024) {
      const targetY =
        st.start + ((idx + 0.5) / protocol.length) * (st.end - st.start);
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  const triggerSimulate = () => {
    setSimulating(true);
    window.setTimeout(() => setSimulating(false), 900);
  };

  const active = protocol[activeIdx];

  return (
    <section
      id="protocol"
      ref={sectionRef}
      className="relative border-t border-paper/15 bg-ink-2 text-paper"
    >
      <div
        ref={pinRef}
        className="gutter flex min-h-screen flex-col justify-center py-20 lg:py-16"
      >
        <SectionLabel
          index="03"
          label="PROMPT-TO-TRANSPORT PROTOCOL"
          meta="PINNED WORKBENCH // 6-STAGE AGENTIC ABAP LOOP"
        />

        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left Column: 6-Stage Selector Accordion */}
          <div className="space-y-2.5 lg:col-span-5">
            {protocol.map((step, idx) => {
              const isSelected = idx === activeIdx;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => selectStep(idx)}
                  data-cursor={`STAGE ${step.id}`}
                  className={clsx(
                    "w-full border text-left transition-all duration-300",
                    isSelected
                      ? "border-signal bg-ink p-5"
                      : "border-paper/15 bg-ink/50 px-5 py-3.5 hover:border-paper/35"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={clsx(
                          "hud px-2 py-1 font-bold",
                          isSelected
                            ? "bg-signal text-ink"
                            : "bg-paper/10 text-paper/65"
                        )}
                      >
                        {step.id} {"//"} {step.code}
                      </span>
                      <span className="font-cond font-display text-xl font-black uppercase tracking-tight md:text-2xl">
                        {step.title}
                      </span>
                    </div>
                    <span className="hud hidden text-paper/45 sm:inline">
                      {step.alias}
                    </span>
                  </div>

                  {isSelected ? (
                    <p className="mt-3.5 text-xs leading-relaxed text-paper/75 md:text-sm">
                      {step.desc}
                    </p>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Right Column: Live Simulated SAP SE38 × MCP Agent IDE */}
          <div className="lg:col-span-7">
            <div className="border border-paper/20 bg-ink shadow-2xl chamfer">
              {/* IDE Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-paper/15 bg-ink-3 px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 bg-signal blink" />
                  <span className="hud text-paper">
                    SE38 // AGENT-WORKBENCH · STAGE {active.id} ({active.code})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={triggerSimulate}
                    data-cursor="VERIFY"
                    className="hud border border-signal/50 bg-signal/10 px-2.5 py-1 text-signal hover:bg-signal hover:text-ink"
                  >
                    {simulating ? "RUNNING CTRL+F2..." : "RUN MCP CHECK [CTRL+F2]"}
                  </button>
                  <span className="hud hidden text-emerald-400 sm:inline">
                    ● MCP LINKED
                  </span>
                </div>
              </div>

              {/* 6-Node Pipeline Topological Diagram */}
              <div className="border-b border-paper/10 bg-ink-2/70 px-5 py-4">
                <div className="flex items-center justify-between gap-1">
                  {protocol.map((node, idx) => {
                    const passed = idx <= activeIdx;
                    const current = idx === activeIdx;
                    return (
                      <div
                        key={node.id}
                        className="flex flex-1 items-center last:flex-none"
                      >
                        <button
                          type="button"
                          onClick={() => selectStep(idx)}
                          className={clsx(
                            "hud flex items-center gap-1.5 border px-2.5 py-1.5 transition-all",
                            current
                              ? "border-signal bg-signal text-ink font-bold scale-105"
                              : passed
                              ? "border-signal/50 bg-signal/15 text-signal"
                              : "border-paper/15 bg-ink text-paper/40"
                          )}
                        >
                          <span>{node.id}</span>
                          <span className="hidden sm:inline">{node.code}</span>
                        </button>
                        {idx < protocol.length - 1 ? (
                          <div className="mx-1 h-[2px] flex-1 bg-paper/15">
                            <div
                              className={clsx(
                                "h-full transition-all duration-300",
                                idx < activeIdx ? "w-full bg-signal" : "w-0"
                              )}
                            />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Stage Header Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-paper/10 bg-ink px-6 py-3">
                <div>
                  <span className="hud text-signal">
                    ACTIVE PROTOCOL // {active.alias}
                  </span>
                  <h3 className="mt-1 font-cond font-display text-2xl font-black uppercase tracking-tight text-paper md:text-3xl">
                    {active.title}
                  </h3>
                </div>
                <div className="hud text-right text-paper/50">
                  <div>OBJECT: ZISH_WARD_CASES</div>
                  <div className="mt-1 text-signal">
                    STEP 0{activeIdx + 1} OF 0{protocol.length}
                  </div>
                </div>
              </div>

              {/* Simulated Terminal / ABAP Code Stream */}
              <div className="min-h-[260px] space-y-2.5 bg-ink p-6 font-mono text-xs leading-relaxed md:text-sm">
                {active.term.map((line, i) => (
                  <div
                    key={`${active.id}-${i}`}
                    className={clsx(
                      "flex items-start rounded-sm px-2.5 py-1.5",
                      line.t === "cmd" && "bg-paper/[0.04] text-paper",
                      line.t === "ok" && "bg-emerald-500/10 text-emerald-300",
                      line.t === "info" && "bg-sky-500/10 text-sky-300",
                      line.t === "warn" && "bg-alert/15 text-alert",
                      line.t === "sys" && "bg-signal/10 text-signal",
                      line.t === "code" && "bg-ink-2 text-paper/90"
                    )}
                  >
                    {renderTermPrefix(line.t)}
                    <code className="whitespace-pre-wrap break-all">
                      {line.s}
                    </code>
                  </div>
                ))}

                {simulating ? (
                  <div className="flex items-center gap-2 border border-signal/40 bg-signal/10 px-3 py-2 text-signal">
                    <span className="h-2 w-2 bg-signal blink" />
                    <span>
                      mcp://sap-dev → sap_check_syntax(&quot;ZISH_WARD_CASES&quot;) · 0
                      errors · 0 warnings · ATC CLEAN
                    </span>
                  </div>
                ) : null}
              </div>

              {/* IDE Footer Telemetry */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-paper/15 bg-ink-3 px-6 py-3 hud text-paper/55">
                <div className="flex items-center gap-4">
                  <span>SYSTEM: SAP ECC 6.0 (IS-H)</span>
                  <span>·</span>
                  <span>CONTEXT: 128K TOKENS</span>
                </div>
                <Barcode
                  value={`PROTOCOL-${active.code}`}
                  className="h-4 w-28 text-paper/45"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
