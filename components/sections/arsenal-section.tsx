"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { gsap, useGSAP } from "@/lib/gsap";
import { arsenal } from "@/lib/data";
import { Barcode, Scramble, SectionLabel } from "@/components/ui/primitives";

const NODE_NOTES: Record<string, string> = {
  "Prompt Engineering":
    "Layered system/task/constraint prompt specifications tailored for enterprise ABAP & IS-H logic.",
  "Context Engineering":
    "Injecting DDIC table structures (NPAT, NFAL, NBEW), domain values, and Clean ABAP rules into LLM context.",
  "Agentic Workflows":
    "Autonomous multi-step coding agents that plan, draft, check syntax, and iterate on RICEFW objects.",
  "LLM Orchestration":
    "Routing tasks between reasoning models for architecture and fast code-synthesis models for boilerplate.",
  "MCP Tool Integration":
    "Direct Model Context Protocol bindings to SAP GUI / SE38 for syntax verification and table inspection.",
  "Retrieval-Augmented ABAP":
    "Indexing custom Z-programs, function modules, and BAPI signatures for zero-hallucination code reuse.",
  "Human-in-the-Loop QA":
    "Strict operator verification of database index usage, authority checks, and runtime performance.",
  "SAP ABAP":
    "5+ years of production ABAP report, module pool, function module, and OO-ABAP development on ECC 6.0.",
  "SAP IS-H":
    "Hospital patient management, inpatient/outpatient case flows, movement tracking, and clinical billing.",
  RICEFW:
    "Full-lifecycle delivery of Reports, Interfaces, Conversions, Enhancements, Forms, and Workflows.",
  "BAPIs & BADIs":
    "Standard SAP business object extensions, user exits, enhancement spots, and RFC-enabled function modules.",
  SmartForms:
    "Clinical print forms, invoices, discharge summaries, and regulatory hospital documentation.",
  "ALV Grids":
    "High-volume interactive operational dashboards using SALV and OO ALV grid controls.",
  BDC: "Batch Data Communication sessions and call-transaction migrations for legacy data loads.",
  PHP: "Backend integration services, REST/JSON bridges, and high-availability fallback web applications.",
  JavaScript:
    "Real-time queueing displays, clinical dashboards, and interactive browser-based ERP frontends.",
  "SQL Server":
    "Relational schema design, staging tables, stored procedures, and bidirectional sync buffers.",
  "Interface Design":
    "Fault-tolerant data pipelines connecting SAP IS-H with external EMR, WhatsApp, and KPI platforms.",
  "ERP Systems":
    "End-to-end enterprise resource planning architecture, transport management (STMS), and authorization roles.",
  "Performance Tuning":
    "SQL trace (ST05) analysis, runtime analysis (SE30/SAT), and optimizing heavy healthcare queries.",
};

export default function ArsenalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<{
    layer: string;
    item: string;
  }>({
    layer: arsenal[0].title,
    item: arsenal[0].items[0],
  });

  useGSAP(
    () => {
      gsap.from("[data-rack]", {
        y: 44,
        opacity: 0,
        duration: 0.95,
        stagger: 0.14,
        ease: "glide",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="arsenal"
      ref={sectionRef}
      className="relative border-t border-paper/15 bg-ink-2 py-24 text-paper md:py-36 gutter"
    >
      <SectionLabel
        index="07"
        label="TECHNICAL ARSENAL"
        meta="3-TIER STACK // NEURAL · SAP CORE · INTEGRATION"
      />

      <div className="mt-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <h2 className="font-cond font-display text-5xl font-black uppercase leading-[0.86] tracking-tightest sm:text-7xl">
          CAPABILITY <span className="text-signal">MATRIX</span>.
        </h2>

        {/* Live Node Inspector Banner */}
        <div className="w-full max-w-xl border border-signal/50 bg-ink p-4 chamfer-sm">
          <div className="flex items-center justify-between hud text-signal">
            <span>NODE INSPECTOR // {selected.layer.toUpperCase()}</span>
            <span>[ACTIVE]</span>
          </div>
          <div className="mt-1.5 font-mono text-sm font-bold text-paper">
            {selected.item}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-paper/70">
            {NODE_NOTES[selected.item] ??
              "Production-verified enterprise capability."}
          </p>
        </div>
      </div>

      {/* 3-Layer Stack Columns */}
      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {arsenal.map((layer, lIdx) => (
          <div
            key={layer.code}
            data-rack
            className="brackets flex flex-col justify-between border border-paper/15 bg-ink p-6 md:p-8"
          >
            <div>
              <div className="flex items-center justify-between border-b border-paper/15 pb-4">
                <span
                  className={clsx(
                    "hud px-2.5 py-1 font-bold",
                    lIdx === 0
                      ? "bg-signal text-ink"
                      : "border border-paper/30 text-signal"
                  )}
                >
                  LAYER {layer.code}
                </span>
                <span className="hud text-paper/50">{layer.caption}</span>
              </div>

              <h3 className="mt-5 font-cond font-display text-3xl font-black uppercase tracking-tight text-paper md:text-4xl">
                {layer.title}
              </h3>

              <div className="mt-6 space-y-2">
                {layer.items.map((item, iIdx) => {
                  const isCurrent = selected.item === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onPointerEnter={() =>
                        setSelected({ layer: layer.title, item })
                      }
                      onClick={() =>
                        setSelected({ layer: layer.title, item })
                      }
                      data-cursor="INSPECT"
                      className={clsx(
                        "flex w-full items-center justify-between border px-4 py-3 text-left font-mono text-xs transition-all md:text-sm",
                        isCurrent
                          ? "border-signal bg-signal text-ink font-bold"
                          : "border-paper/10 bg-ink-2 text-paper/85 hover:border-signal/60 hover:text-signal"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={clsx(
                            "text-[10px]",
                            isCurrent ? "text-ink/70" : "text-paper/40"
                          )}
                        >
                          {layer.code}.0{iIdx + 1}
                        </span>
                        <Scramble text={item} />
                      </div>
                      <span
                        className={clsx(
                          "h-1.5 w-1.5",
                          isCurrent ? "bg-ink" : "bg-signal"
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-paper/10 pt-4 hud text-paper/45">
              <span>NODES: 0{layer.items.length}</span>
              <Barcode
                value={`ARSENAL-${layer.code}`}
                className="h-4 w-24 text-paper/35"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
