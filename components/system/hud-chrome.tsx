"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useSite } from "@/components/providers/site-provider";
import { profile, sections } from "@/lib/data";
import { Scramble } from "@/components/ui/primitives";

const NAV_ITEMS = [
  { id: "protocol", label: "PROTOCOL" },
  { id: "dossier", label: "DOSSIER" },
  { id: "modules", label: "MODULES" },
  { id: "arsenal", label: "ARSENAL" },
  { id: "credentials", label: "CREDENTIALS" },
  { id: "contact", label: "CONTACT" },
];

export default function HudChrome() {
  const {
    loaded,
    scrollTo,
    gridOn,
    toggleGrid,
    terminalOpen,
    setTerminalOpen,
  } = useSite();

  const [active, setActive] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [clock, setClock] = useState("00:00:00 WIB");
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  // Live Jakarta WIB clock
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: profile.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const updateClock = () => setClock(`${fmt.format(new Date())} WIB`);
    updateClock();
    const id = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Keyboard shortcuts: [G] for Swiss grid overlay, [~] or [Ctrl/Cmd+K] for CLI
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") {
        if (e.key === "Escape" && terminalOpen) {
          setTerminalOpen(false);
        }
        return;
      }
      if (e.key === "g" || e.key === "G") {
        e.preventDefault();
        toggleGrid();
      } else if (
        e.key === "`" ||
        e.key === "~" ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")
      ) {
        e.preventDefault();
        setTerminalOpen(!terminalOpen);
      } else if (e.key === "Escape") {
        if (terminalOpen) setTerminalOpen(false);
        if (menuOpen) setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleGrid, terminalOpen, setTerminalOpen, menuOpen]);

  // Section tracking & global scroll progress bar
  useGSAP(
    () => {
      if (!loaded) return;

      const triggers: ScrollTrigger[] = [];

      sections.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (!el) return;
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top 52%",
            end: "bottom 52%",
            onToggle: (self) => {
              if (self.isActive) setActive(sec.id);
            },
          })
        );
      });

      triggers.push(
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            if (barRef.current) {
              gsap.set(barRef.current, { scaleX: self.progress });
            }
            if (pctRef.current) {
              pctRef.current.textContent = `${String(
                Math.round(self.progress * 100)
              ).padStart(3, "0")}%`;
            }
          },
        })
      );

      return () => {
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: rootRef, dependencies: [loaded] }
  );

  const jump = (id: string) => {
    setMenuOpen(false);
    scrollTo(`#${id}`);
  };

  return (
    <div ref={rootRef}>
      {/* Animated film/industrial grain */}
      <div className="grain" aria-hidden />

      {/* 12-Column Swiss Architectural Blueprint Grid Overlay */}
      {gridOn ? (
        <div
          className="pointer-events-none fixed inset-0 z-[80] gutter"
          aria-hidden
        >
          <div className="grid h-full grid-cols-4 gap-4 md:grid-cols-12">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={clsx(
                  "relative h-full border-x border-signal/20 bg-signal/[0.02]",
                  i >= 4 && "hidden md:block"
                )}
              >
                <span className="hud absolute left-1.5 top-16 text-[9px] text-signal/60">
                  C{String(i + 1).padStart(2, "0")}
                </span>
                <span className="hud absolute bottom-12 left-1.5 text-[9px] text-signal/40">
                  +
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Top Tactical Header */}
      <header className="fixed inset-x-0 top-0 z-[95] border-b border-paper/10 bg-ink/85 text-paper backdrop-blur-md">
        <div className="h-[2px] w-full bg-paper/10">
          <div
            ref={barRef}
            className="h-full w-full origin-left scale-x-0 bg-signal"
          />
        </div>

        <div className="gutter flex h-14 items-center justify-between gap-4">
          {/* Brand & Callsign */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => jump("hero")}
              data-cursor="HOME"
              className="flex items-center gap-2.5 text-left"
            >
              <span className="bg-signal px-2 py-1 font-mono text-[11px] font-bold tracking-[0.18em] text-ink">
                JS//SYS
              </span>
              <span className="hud hidden text-paper/80 sm:inline">
                <Scramble text={profile.callsign} />
              </span>
            </button>

            <span className="hidden h-3 w-px bg-paper/15 md:inline-block" />

            <div className="hud hidden items-center gap-2 text-paper/60 md:flex">
              <span className="h-1.5 w-1.5 bg-signal blink" />
              <span>ECC 6.0 · AI AGENT READY</span>
            </div>
          </div>

          {/* Center Navigation */}
          <nav
            className="hidden items-center gap-1 xl:flex"
            aria-label="Primary sections"
          >
            {NAV_ITEMS.map((item, idx) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => jump(item.id)}
                  data-cursor="JUMP"
                  className={clsx(
                    "hud relative px-3 py-2 transition-colors duration-200",
                    isActive
                      ? "text-signal"
                      : "text-paper/65 hover:text-paper"
                  )}
                >
                  <span className="mr-1 text-[9px] opacity-45">
                    0{idx + 3}
                  </span>
                  <Scramble text={item.label} />
                  {isActive ? (
                    <span className="absolute inset-x-3 bottom-0.5 h-[2px] bg-signal" />
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Grid Toggle + CLI Shell + Mobile Trigger */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleGrid}
              data-cursor="GRID"
              className={clsx(
                "hud hidden items-center gap-2 border px-2.5 py-1.5 transition-colors sm:inline-flex",
                gridOn
                  ? "border-signal bg-signal text-ink font-bold"
                  : "border-paper/20 bg-ink-2 text-paper/70 hover:border-paper/50 hover:text-paper"
              )}
              title="Toggle 12-column Swiss Grid (G)"
            >
              <span>GRID</span>
              <span className="opacity-60">[G]</span>
            </button>

            <button
              type="button"
              onClick={() => setTerminalOpen(!terminalOpen)}
              data-cursor="CLI"
              className={clsx(
                "hud inline-flex items-center gap-2 border px-3 py-1.5 transition-colors",
                terminalOpen
                  ? "border-signal bg-signal text-ink font-bold"
                  : "border-signal/50 bg-signal/10 text-signal hover:bg-signal hover:text-ink"
              )}
              title="Launch ABAP Vibe Shell (~)"
            >
              <span className="h-1.5 w-1.5 bg-current" />
              <span>SHELL</span>
              <span className="hidden opacity-75 sm:inline">[~]</span>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle navigation drawer"
              className="hud inline-flex h-8 items-center border border-paper/20 bg-ink-2 px-2.5 text-paper xl:hidden"
            >
              {menuOpen ? "CLOSE [X]" : "INDEX [+]"}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Tactical Index Drawer */}
      {menuOpen ? (
        <div className="fixed inset-0 z-[94] flex flex-col justify-between bg-ink/95 pt-20 pb-8 gutter backdrop-blur-xl xl:hidden">
          <div className="space-y-2">
            <div className="hud mb-4 text-signal">
              NAVIGATION MATRIX // SELECT SECTOR
            </div>
            {sections.map((sec, idx) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => jump(sec.id)}
                className={clsx(
                  "flex w-full items-center justify-between border-b border-paper/10 py-3.5 text-left font-cond font-display text-3xl font-black uppercase tracking-tight",
                  active === sec.id ? "text-signal" : "text-paper"
                )}
              >
                <span>{sec.label}</span>
                <span className="hud text-paper/50">
                  §0{idx + 1}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-paper/15 pt-4 hud text-paper/60">
            <button
              type="button"
              onClick={toggleGrid}
              className="border border-paper/20 px-3 py-2 text-paper"
            >
              {gridOn ? "GRID: ON" : "GRID: OFF"}
            </button>
            <span>{clock}</span>
          </div>
        </div>
      ) : null}

      {/* Right-Edge Vertical Section Rail */}
      <aside
        className="fixed right-3 top-1/2 z-[92] hidden -translate-y-1/2 flex-col items-end gap-2.5 lg:flex"
        aria-label="Section progress rail"
      >
        {sections.map((sec, idx) => {
          const isActive = active === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => jump(sec.id)}
              data-cursor={sec.label}
              className="group flex items-center gap-2 py-0.5 text-right"
              aria-label={`Jump to ${sec.label}`}
            >
              <span
                className={clsx(
                  "hud transition-all duration-200",
                  isActive
                    ? "translate-x-0 text-signal opacity-100"
                    : "translate-x-2 text-paper/60 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                )}
              >
                0{idx + 1} {sec.label}
              </span>
              <span
                className={clsx(
                  "block h-[2px] transition-all duration-300",
                  isActive
                    ? "w-6 bg-signal"
                    : "w-2.5 bg-paper/35 group-hover:w-4 group-hover:bg-paper"
                )}
              />
            </button>
          );
        })}
      </aside>

      {/* Bottom Telemetry Strip */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[92] hidden border-t border-paper/10 bg-ink/80 text-paper/65 backdrop-blur-md md:block"
        aria-hidden
      >
        <div className="gutter flex h-8 items-center justify-between hud text-[10px]">
          <div className="flex items-center gap-4">
            <span>
              LOC // {profile.location} ({profile.coords})
            </span>
            <span className="text-paper/30">|</span>
            <span className="text-paper/90">{clock}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-signal">
              SEC // {active.toUpperCase()}
            </span>
            <span className="text-paper/30">|</span>
            <span>PRESS [~] SHELL · [G] SWISS GRID</span>
          </div>

          <div className="flex items-center gap-2">
            <span>SCROLL //</span>
            <span ref={pctRef} className="w-9 text-right text-signal font-bold">
              000%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
