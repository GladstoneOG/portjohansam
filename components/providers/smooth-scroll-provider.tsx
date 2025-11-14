"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const lenisOptions = {
  lerp: 0.1,
  duration: 1.1,
  smoothWheel: true,
  smoothTouch: false,
  wheelMultiplier: 0.9,
};

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isMobile || prefersReduced) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis(lenisOptions);
    const resizeLenis = () => lenis.resize();

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    lenis.on("scroll", ScrollTrigger.update);
    ScrollTrigger.addEventListener("refresh", resizeLenis);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      ScrollTrigger.removeEventListener("refresh", resizeLenis);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
