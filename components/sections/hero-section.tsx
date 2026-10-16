"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  gsap,
  SCRAMBLE_CHARS,
  ScrollTrigger,
  SplitText,
  useGSAP,
} from "@/lib/gsap";
import { useSite } from "@/components/providers/site-provider";
import HeroCanvas from "@/components/gl/hero-canvas";
import { TerrainScene } from "@/components/gl/terrain-scene";
import { profile } from "@/lib/data";
import { Barcode, Magnetic, Scramble } from "@/components/ui/primitives";

export default function HeroSection() {
  const { loaded, reducedMotion, scrollTo, setTerminalOpen } = useSite();
  const sectionRef = useRef<HTMLElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const sceneRef = useRef<TerrainScene | null>(null);
  const introPlayed = useRef(false);

  const playSceneIntro = useCallback(() => {
    if (!sceneRef.current || introPlayed.current) return;
    introPlayed.current = true;
    gsap.to(sceneRef.current.intro, {
      value: 1,
      duration: reducedMotion ? 0.4 : 2.3,
      ease: "expo.out",
    });
  }, [reducedMotion]);

  const handleSceneReady = useCallback(
    (scene: TerrainScene) => {
      sceneRef.current = scene;
      if (loaded) playSceneIntro();
    },
    [loaded, playSceneIntro]
  );

  // Trigger 3D column rise + hero SplitText choreography when preloader opens
  useGSAP(
    () => {
      if (!loaded || !sectionRef.current) return;
      playSceneIntro();

      const tl = gsap.timeline({ defaults: { ease: "glide" } });

      SplitText.create("[data-hero-title]", {
        type: "chars,lines",
        mask: "lines",
        linesClass: "split-mask",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.chars, {
            yPercent: 115,
            rotateZ: 4,
            duration: 1.15,
            stagger: 0.022,
            ease: "glide",
          });
        },
      });

      tl.from(
        "[data-hero-hud]",
        {
          y: 18,
          opacity: 0,
          duration: 0.85,
          stagger: 0.07,
        },
        0.2
      ).from(
        "[data-hero-spec]",
        {
          y: 24,
          opacity: 0,
          duration: 0.9,
          stagger: 0.06,
        },
        0.35
      );
    },
    { scope: sectionRef, dependencies: [loaded] }
  );

  // Scramble role cycling loop
  useEffect(() => {
    if (!loaded || !roleRef.current) return;
    let idx = 0;
    const id = window.setInterval(() => {
      idx = (idx + 1) % profile.roles.length;
      if (!roleRef.current) return;
      gsap.to(roleRef.current, {
        duration: 0.85,
        ease: "none",
        scrambleText: {
          text: profile.roles[idx],
          chars: SCRAMBLE_CHARS,
          speed: 0.55,
        },
      });
    }, 2800);
    return () => window.clearInterval(id);
  }, [loaded]);

  // Camera dive & typography parallax on scroll
  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          if (sceneRef.current) {
            sceneRef.current.scroll = self.progress;
          }
        },
      });

      gsap.to("[data-hero-stage]", {
        yPercent: -18,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative isolate flex min-h-[104vh] w-full flex-col justify-between overflow-hidden pt-20 pb-12 md:pb-16 gutter"
    >
      {/* WebGL Instanced Data-City Terrain */}
      <HeroCanvas
        onReady={handleSceneReady}
        reduced={reducedMotion}
        className="pointer-events-none absolute inset-0 z-0"
      />

      {/* Subtle architectural vignette & top/bottom gradient */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_45%,transparent_35%,rgba(10,10,11,0.55)_95%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-t from-ink to-transparent"
        aria-hidden
      />

      {/* Top Tactical Telemetry Row */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-paper/15 pb-4">
        <div
          data-hero-hud
          className="flex items-center gap-3 border border-paper/15 bg-ink/85 px-3 py-1.5 backdrop-blur-md shadow-lg"
        >
          <span className="hud bg-signal px-2 py-0.5 font-bold text-ink">
            §01 // INIT
          </span>
          <span className="hud text-paper">{profile.callsign}</span>
          <span className="hidden h-3 w-px bg-paper/25 sm:inline-block" />
          <span className="hud hidden text-paper/75 sm:inline">
            SAP ECC 6.0 · IS-H · NEURAL ORCHESTRATION
          </span>
        </div>

        <div data-hero-hud className="flex items-center gap-4">
          <div className="hud flex items-center gap-2 border border-signal/50 bg-ink/90 px-3.5 py-1.5 backdrop-blur-md shadow-lg">
            <span className="h-1.5 w-1.5 bg-signal blink" />
            <span className="text-paper/75">DESIGNATION //</span>
            <span
              ref={roleRef}
              className="font-bold text-signal"
            >
              {profile.roles[0]}
            </span>
          </div>
          <Barcode
            value="JS-01-VIBE-ABAP"
            className="hidden h-5 w-28 text-paper/60 lg:block"
          />
        </div>
      </div>

      {/* Centerpiece Ultra-Condensed Swiss Display Headline */}
      <div data-hero-stage className="relative z-10 my-auto py-10 md:py-14">
        <div
          data-hero-hud
          className="hud mb-4 inline-flex flex-wrap items-center gap-3 border border-paper/20 bg-ink/85 px-3.5 py-2 text-signal backdrop-blur-md shadow-[0_12px_32px_rgba(0,0,0,0.85)]"
        >
          <span className="font-bold">[VIBE CODING IN ENTERPRISE ABAP]</span>
          <span className="h-px w-12 bg-signal/60" />
          <span className="text-paper/85">PROMPT → MCP → TRANSPORT</span>
        </div>

        <h1 className="select-none font-cond font-display uppercase leading-[0.81] tracking-tightest [text-shadow:0_10px_34px_rgba(10,10,11,0.95),0_2px_8px_rgba(10,10,11,0.95)]">
          <span
            data-hero-title
            className="block text-[18.5vw] font-black text-paper sm:text-[15.5vw] lg:text-[13.8vw]"
          >
            {profile.first}
          </span>
          <span className="flex flex-wrap items-baseline gap-x-6">
            <span
              data-hero-title
              className="block text-[18.5vw] font-black text-paper sm:text-[15.5vw] lg:text-[13.8vw]"
            >
              {profile.last}
            </span>
            <span
              data-hero-hud
              className="hud mb-3 hidden border border-signal bg-ink/90 px-3.5 py-2 font-bold text-signal backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.9)] xl:inline-flex"
            >
              AI-AUGMENTED ABAP ARCHITECT // IS-H
            </span>
          </span>
        </h1>
      </div>

      {/* Bottom Swiss Specification Grid & Actions */}
      <div className="relative z-10 grid grid-cols-1 items-end gap-6 border-t border-paper/15 pt-6 lg:grid-cols-12">
        <div
          data-hero-hud
          className="space-y-5 border border-paper/20 border-l-2 border-l-signal bg-ink/85 p-5 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.9)] md:p-6 lg:col-span-5"
        >
          <div className="hud flex items-center justify-between border-b border-paper/15 pb-2.5 text-[10px] text-paper/65">
            <span className="flex items-center gap-2 text-signal">
              <span className="h-1.5 w-1.5 bg-signal" />
              OPERATOR BRIEF // SYS-SUMMARY
            </span>
            <span>READOUT // HIGH-CONTRAST</span>
          </div>

          <p className="max-w-xl text-sm font-medium leading-relaxed text-paper md:text-base">
            {profile.summary}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Magnetic strength={0.25}>
              <button
                type="button"
                onClick={() => scrollTo("#protocol")}
                data-cursor="PROTOCOL"
                className="hud bg-signal px-6 py-4 text-xs font-bold text-ink transition-transform hover:scale-[1.02] chamfer-sm"
              >
                <Scramble text="INSPECT AI PROTOCOL →" />
              </button>
            </Magnetic>

            <Magnetic strength={0.25}>
              <button
                type="button"
                onClick={() => setTerminalOpen(true)}
                data-cursor="CLI"
                className="hud border border-paper/30 bg-ink/90 px-5 py-4 text-xs text-paper backdrop-blur-md transition-colors hover:border-signal hover:text-signal"
              >
                LAUNCH VIBE SHELL [~]
              </button>
            </Magnetic>

            <Magnetic strength={0.25}>
              <button
                type="button"
                onClick={() => scrollTo("#modules")}
                data-cursor="MODULES"
                className="hud border border-paper/25 bg-ink/85 px-4 py-4 text-xs text-paper/85 transition-colors hover:border-signal hover:text-signal"
              >
                MODULES [08]
              </button>
            </Magnetic>
          </div>
        </div>

        {/* 4-Cell Spec Readout */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-7">
          {profile.spec.map((item, idx) => (
            <div
              key={item.k}
              data-hero-spec
              className="brackets border border-paper/20 bg-ink/85 p-4 backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.85)] transition-colors hover:border-signal/60"
            >
              <div className="hud flex items-center justify-between text-paper/65">
                <span>{item.k}</span>
                <span className="font-bold text-signal">0{idx + 1}</span>
              </div>
              <div className="mt-3 font-mono text-xs font-semibold text-paper md:text-sm">
                {item.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
