"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type SiteCtx = {
  loaded: boolean;
  setLoaded: (v: boolean) => void;
  reducedMotion: boolean;
  scrollTo: (
    target: string | number | HTMLElement,
    opts?: { immediate?: boolean }
  ) => void;
  lenisRef: React.MutableRefObject<Lenis | null>;
  terminalOpen: boolean;
  setTerminalOpen: (v: boolean) => void;
};

const Ctx = createContext<SiteCtx | null>(null);

export function useSite() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSite must be used inside <SiteProvider>");
  return c;
}

export default function SiteProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.95,
      smoothWheel: !mq.matches,
      autoRaf: false,
    });
    lenisRef.current = lenis;
    lenis.stop(); // locked until the boot sequence finishes

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    lenisRef.current?.start();
    document.documentElement.classList.add("is-loaded");
    // Fonts + layout settle → recompute every trigger.
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => window.clearTimeout(id);
  }, [loaded]);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis || !loaded) return;
    if (terminalOpen) lenis.stop();
    else lenis.start();
  }, [terminalOpen, loaded]);

  const scrollTo = useCallback<SiteCtx["scrollTo"]>((target, opts) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target as never, {
        immediate: opts?.immediate,
        duration: 1.8,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
    } else if (typeof target === "string") {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const value = useMemo(
    () => ({
      loaded,
      setLoaded,
      reducedMotion,
      scrollTo,
      lenisRef,
      terminalOpen,
      setTerminalOpen,
    }),
    [loaded, reducedMotion, scrollTo, terminalOpen]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
