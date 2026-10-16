"use client";

import { ReactNode, useRef } from "react";
import clsx from "clsx";
import { gsap, useGSAP } from "@/lib/gsap";
import { useSite } from "@/components/providers/site-provider";

/**
 * Infinite marquee that accelerates, reverses and skews with scroll velocity —
 * the "momentum ticker" seen on award-winning sites.
 */
export default function Marquee({
  children,
  speed = 1,
  reverse = false,
  className,
  skew = true,
}: {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
  skew?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const { lenisRef, reducedMotion } = useSite();

  useGSAP(
    () => {
      const el = track.current;
      if (!el) return;
      const half = () => el.scrollWidth / 2;
      let x = 0;
      let dir = reverse ? 1 : -1;
      let boost = 0;
      const skewTo = gsap.quickTo(el, "skewX", { duration: 0.5, ease: "power3" });
      const tick = (_t: number, dt: number) => {
        if (reducedMotion) return;
        const v = lenisRef.current?.velocity ?? 0;
        if (Math.abs(v) > 0.4) dir = (v > 0 ? -1 : 1) * (reverse ? -1 : 1);
        boost += (Math.min(Math.abs(v), 60) * 0.12 - boost) * 0.1;
        x += dir * (0.045 * speed + boost * 0.02) * dt;
        const w = half();
        if (w > 0) x = gsap.utils.wrap(-w, 0, x);
        gsap.set(el, { x });
        if (skew) skewTo(gsap.utils.clamp(-12, 12, -v * 0.35));
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root, dependencies: [reducedMotion] }
  );

  return (
    <div ref={root} className={clsx("relative flex overflow-hidden", className)}>
      <div ref={track} className="flex w-max shrink-0 will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
