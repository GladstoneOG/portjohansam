"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useSite } from "@/components/providers/site-provider";
import { Barcode } from "@/components/ui/primitives";

const LOGS = [
  ["BOOT", "JS//SYS kernel v2026.10", "OK"],
  ["LOAD", "abap.runtime · ECC 6.0", "OK"],
  ["LOAD", "is-h.domain.model", "OK"],
  ["BIND", "llm.context[128k]", "OK"],
  ["LINK", "mcp://sap-dev bridge", "ONLINE"],
  ["SYNC", "operator JS-01", "READY"],
];

export default function Preloader() {
  const { setLoaded, reducedMotion } = useSite();
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const dur = reducedMotion ? 0.4 : 2.6;
      const c = { v: 0 };
      const tl = gsap.timeline({ onComplete: () => setDone(true) });

      tl.from("[data-pl-fade]", { opacity: 0, y: 10, stagger: 0.06, duration: 0.6 })
        .to(
          c,
          {
            v: 100,
            duration: dur,
            ease: "power3.inOut",
            onUpdate: () => {
              if (num.current) num.current.textContent = String(Math.round(c.v)).padStart(3, "0");
            },
          },
          0.1
        )
        .to("[data-pl-bar]", { scaleX: 1, duration: dur, ease: "power3.inOut" }, 0.1)
        .from(
          "[data-pl-log]",
          { opacity: 0, x: -12, stagger: dur / LOGS.length, duration: 0.25, ease: "power2.out" },
          0.2
        )
        .to("[data-pl-status]", { opacity: 1, duration: 0.01, repeat: 5, yoyo: true }, `>-0.2`)
        .addLabel("open")
        .to("[data-pl-content]", { opacity: 0, duration: 0.35, ease: "power2.in" }, "open")
        .to("[data-pl-seam]", { scaleX: 0, transformOrigin: "right", duration: 0.5, ease: "snap" }, "open")
        .call(() => setLoaded(true), undefined, "open+=0.25")
        .to("[data-pl-top]", { yPercent: -100, duration: 1.2, ease: "expo.inOut" }, "open+=0.2")
        .to("[data-pl-bot]", { yPercent: 100, duration: 1.2, ease: "expo.inOut" }, "open+=0.2");
    },
    { scope: root }
  );

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[200] text-paper" aria-hidden>
      <div data-pl-top className="absolute inset-x-0 top-0 h-1/2 bg-ink" />
      <div data-pl-bot className="absolute inset-x-0 bottom-0 h-1/2 bg-ink" />
      <div data-pl-seam className="absolute inset-x-0 top-1/2 h-px bg-paper/15" />

      <div data-pl-content className="gutter absolute inset-0 flex flex-col justify-between py-6 md:py-8">
        <div className="flex items-start justify-between">
          <div data-pl-fade className="hud space-y-2">
            <div className="text-signal">JS//SYS</div>
            <div className="opacity-50">OPERATOR TERMINAL</div>
          </div>
          <div data-pl-fade className="hud text-right opacity-50">
            <div>06°12′S 106°50′E</div>
            <div className="mt-2">BUILD 2026.10</div>
          </div>
        </div>

        <div className="hud space-y-2.5 md:max-w-md">
          {LOGS.map(([a, b, c]) => (
            <div data-pl-log key={b} className="flex gap-4">
              <span className="w-10 text-signal">{a}</span>
              <span className="flex-1 truncate opacity-70">{b}</span>
              <span className={c === "OK" ? "opacity-50" : "text-signal"}>[{c}]</span>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-end justify-between gap-6">
            <span
              ref={num}
              className="font-cond font-display text-[28vw] font-black leading-[0.78] tracking-tightest md:text-[18vw]"
            >
              000
            </span>
            <div data-pl-fade className="hud mb-3 hidden space-y-3 text-right md:block">
              <Barcode value="JOHANSAMSUDIN" className="ml-auto h-6 w-40 text-paper/60" />
              <div data-pl-status className="text-signal">
                ▲ INITIALISING NEURAL LAYER
              </div>
            </div>
          </div>
          <div className="mt-5 flex h-1.5 gap-px bg-paper/10">
            <div data-pl-bar className="h-full w-full origin-left scale-x-0 bg-signal" />
          </div>
        </div>
      </div>
    </div>
  );
}
