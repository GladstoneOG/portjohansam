"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Tactical crosshair cursor: snapping dot, lagging bracket reticle (difference-
 * blended so it reads on ink AND paper), coordinate readout, and a signal-yellow
 * label badge driven by [data-cursor="LABEL"].
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const coords = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setEnabled(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current || !tag.current) return;
    document.documentElement.classList.add("has-cursor");

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo([ring.current, tag.current], "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo([ring.current, tag.current], "y", { duration: 0.45, ease: "power3" });
    let current: Element | null = null;
    let shown = false;

    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      if (coords.current) {
        coords.current.textContent = `X${String(e.clientX).padStart(4, "0")} Y${String(e.clientY).padStart(4, "0")}`;
      }
      const t = (e.target as Element | null)?.closest?.("a, button, [data-cursor], input") ?? null;
      if (t !== current) {
        current = t;
        const text = t?.getAttribute("data-cursor") ?? "";
        const interactive = !!t;
        gsap.to(ring.current, {
          width: interactive ? 56 : 34,
          height: interactive ? 56 : 34,
          rotate: interactive && !text ? 45 : 0,
          autoAlpha: text ? 0 : 1,
          duration: 0.45,
          ease: "glide",
        });
        gsap.to(dot.current, { scale: interactive ? 0 : 1, duration: 0.25 });
        if (label.current && text) label.current.textContent = text;
        gsap.to(tag.current, { scale: text ? 1 : 0, rotate: text ? 0 : -45, duration: 0.5, ease: "glide" });
      }
    };
    const down = () => gsap.to([ring.current, tag.current], { scale: "-=0.15", duration: 0.12 });
    const up = () => {
      gsap.to(ring.current, { scale: 1, duration: 0.4, ease: "elastic.out(1,0.4)" });
      gsap.to(tag.current, { scale: current?.getAttribute("data-cursor") ? 1 : 0, duration: 0.4 });
    };
    const leave = () => {
      shown = false;
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 });
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[300]" aria-hidden>
      <div
        ref={tag}
        className="fixed left-0 top-0 -ml-[46px] -mt-[46px] flex h-[92px] w-[92px] scale-0 items-center justify-center bg-signal text-ink chamfer"
      >
        <span ref={label} className="hud text-[10px] font-bold" />
      </div>
      <div
        ref={ring}
        className="invisible fixed left-0 top-0 flex h-[34px] w-[34px] -translate-x-1/2 -translate-y-1/2 items-center justify-center text-paper opacity-0 mix-blend-difference"
      >
        <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-current" />
        <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-current" />
        <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-current" />
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-current" />
        <span ref={coords} className="hud absolute left-full top-full ml-2 mt-1 whitespace-nowrap text-[9px] opacity-60" />
      </div>
      <div
        ref={dot}
        className="invisible fixed left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 bg-signal opacity-0"
      />
    </div>
  );
}
