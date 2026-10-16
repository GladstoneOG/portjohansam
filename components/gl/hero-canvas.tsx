"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { TerrainScene } from "./terrain-scene";

type Props = {
  onReady?: (scene: TerrainScene) => void;
  reduced?: boolean;
  className?: string;
};

export default function HeroCanvas({ onReady, reduced, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let scene: TerrainScene;
    try {
      scene = new TerrainScene(canvas, { reduced });
    } catch {
      return; // WebGL unavailable → static gradient fallback stays visible
    }
    readyRef.current?.(scene);

    let visible = true;
    const tick = () => {
      if (visible && !document.hidden) scene.render();
    };
    gsap.ticker.add(tick);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(canvas);
    const ro = new ResizeObserver(() => scene.resize());
    ro.observe(canvas.parentElement ?? canvas);

    const onMove = (e: PointerEvent) => {
      scene.setPointer((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      scene.dispose();
    };
  }, [reduced]);

  return (
    <div className={className}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,#1a1b1e_0%,#0a0a0b_70%)]" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
