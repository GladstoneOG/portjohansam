"use client";

import { ElementType, ReactNode, useRef } from "react";
import clsx from "clsx";
import { gsap, SCRAMBLE_CHARS, SplitText, useGSAP } from "@/lib/gsap";

/* ───────────── ScrambleText: decodes on hover ───────────── */
export function Scramble({
  text,
  className,
  as: Tag = "span",
  trigger = "hover",
}: {
  text: string;
  className?: string;
  as?: ElementType;
  trigger?: "hover" | "parent";
}) {
  const ref = useRef<HTMLElement>(null);
  const { contextSafe } = useGSAP({ scope: ref });
  const run = contextSafe(() => {
    gsap.to(ref.current, {
      duration: 0.6,
      ease: "none",
      scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 0.6, revealDelay: 0.1 },
      overwrite: true,
    });
  });
  return (
    <Tag
      ref={ref}
      className={className}
      onPointerEnter={trigger === "hover" ? run : undefined}
      data-scramble={trigger === "parent" ? "" : undefined}
      aria-label={text}
    >
      {text}
    </Tag>
  );
}

/* ───────────── Magnetic: element leans toward the cursor ───────────── */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !window.matchMedia("(pointer: fine)").matches) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref }
  );
  return (
    <div ref={ref} className={clsx("inline-block will-change-transform", className)}>
      {children}
    </div>
  );
}

/* ───────────── SplitReveal: masked line/char reveal on scroll ───────────── */
export function SplitReveal({
  children,
  as: Tag = "div",
  className,
  type = "lines",
  stagger,
  delay = 0,
  start = "top 85%",
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  type?: "lines" | "chars" | "words";
  stagger?: number;
  delay?: number;
  start?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      SplitText.create(el, {
        type: type === "lines" ? "lines" : type === "words" ? "words,lines" : "chars,words,lines",
        mask: type === "lines" ? "lines" : type === "words" ? "words" : "lines",
        linesClass: "split-mask",
        autoSplit: true,
        onSplit(self) {
          const targets = type === "lines" ? self.lines : type === "words" ? self.words : self.chars;
          return gsap.from(targets, {
            yPercent: 110,
            rotate: type === "chars" ? 6 : 0,
            duration: type === "chars" ? 1 : 1.2,
            stagger: stagger ?? (type === "chars" ? 0.025 : type === "words" ? 0.04 : 0.1),
            delay,
            ease: "glide",
            scrollTrigger: { trigger: el, start, once: true },
          });
        },
      });
    },
    { scope: ref }
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/* ───────────── Barcode: deterministic, from any string ───────────── */
export function Barcode({ value, className, height = 22 }: { value: string; className?: string; height?: number }) {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (let i = 0; i < value.length * 3; i++) {
    const c = value.charCodeAt(i % value.length) * (i + 7);
    const w = (c % 3) + 1;
    if (i % 2 === 0) bars.push({ x, w });
    x += w + ((c >> 2) % 2) + 1;
  }
  return (
    <svg className={className} viewBox={`0 0 ${x} ${height}`} height={height} preserveAspectRatio="none" aria-hidden>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={height} fill="currentColor" />
      ))}
    </svg>
  );
}

/* ───────────── SectionLabel: Swiss header row with drawing rule ───────────── */
export function SectionLabel({
  index,
  label,
  meta,
  className,
}: {
  index: string;
  label: string;
  meta?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 90%", once: true } });
      tl.from("[data-rule]", { scaleX: 0, transformOrigin: "left", duration: 1.4, ease: "glide" })
        .from("[data-idx]", { yPercent: 100, duration: 0.8 }, 0.1)
        .to("[data-lbl]", { duration: 1, scrambleText: { text: label, chars: SCRAMBLE_CHARS, speed: 0.5 } }, 0.15)
        .from("[data-meta]", { opacity: 0, duration: 0.6 }, 0.5);
    },
    { scope: ref }
  );
  return (
    <div ref={ref} className={clsx("hud flex items-center gap-4", className)}>
      <span className="overflow-hidden">
        <span data-idx className="inline-block bg-signal px-1.5 py-1 text-ink">
          §{index}
        </span>
      </span>
      <span data-lbl className="whitespace-nowrap">
        {label}
      </span>
      <span data-rule className="h-px flex-1 bg-current opacity-30" />
      {meta ? (
        <span data-meta className="hidden whitespace-nowrap opacity-50 sm:inline">
          {meta}
        </span>
      ) : null}
    </div>
  );
}
