"use client";

import { useEffect, useRef } from "react";

const SPACING = 60;
const RADIUS = 1.4;
const INFLUENCE = 220;
const BASE_ALPHA = 0.05;
const SCROLL_FACTOR = 0.05;
const PARALLAX_STRENGTH_X = 48;
const PARALLAX_STRENGTH_Y = 32;
const DEPTH_LAYERS = 5;
const DEPTH_INTENSITY_BOOST = 0.35;
const LINE_THRESHOLD = 0.55;
const MAX_LINES = 18;
const LINE_STYLES = ["solid", "dashed", "dotted", "glitch"] as const;
const LINE_STAGGER_DELAY = 0.05;
const DISAPPEAR_DURATION_RANGE = [0.2, 0.4] as const;
const DASH_SCROLL_SPEED = 90; // pixels per second for dashed/dotted
const MAX_DELTA = 0.06; // seconds

type DotPoint = {
  x: number;
  y: number;
  closeness: number;
  gridX: number;
  gridY: number;
};

type LineStyle = (typeof LINE_STYLES)[number];

type LineConnection = {
  startKey: string;
  endKey: string;
  dash: number[];
  dashSpeed: number;
  dashOffset: number;
  width: number;
  opacity: number;
  offsetX: number;
  offsetY: number;
  progress: number;
  disappearDuration: number;
  state: "pending" | "steady" | "disappearing";
  activationDelay: number;
};

function interpolate(current: number, target: number, factor: number) {
  return current + (target - current) * factor;
}

export default function MatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouse = useRef({ x: 0, y: 0, active: false });
  const drift = useRef({ x: 0, y: 0 });
  const scrollOffset = useRef(0);
  const rafRef = useRef<number>();
  const activeLinesRef = useRef<LineConnection[]>([]);
  const lastCellRef = useRef<{ x: number; y: number } | null>(null);
  const timestampRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(max-width: 640px)");
    if (mediaQuery.matches) {
      canvas.style.display = "none";
      return undefined;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return undefined;
    }

    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);

    const resize = () => {
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    timestampRef.current = performance.now();

    let time = 0;
    const pointer = mouse.current;
    pointer.x = window.innerWidth / 2;
    pointer.y = window.innerHeight / 2;

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handleScroll = () => {
      scrollOffset.current = window.scrollY * SCROLL_FACTOR;
    };

    const render = () => {
      time += 0.01;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const now = performance.now();
      const deltaSeconds = Math.min(
        Math.max((now - timestampRef.current) / 1000, 0),
        MAX_DELTA
      );
      timestampRef.current = now;
      ctx.clearRect(0, 0, width, height);

      const waveX = Math.sin(time * 0.8) * 12;
      const waveY = Math.cos(time * 0.6) * 12;

      const driftVector = drift.current;
      driftVector.x = interpolate(driftVector.x, waveX, 0.025);
      driftVector.y = interpolate(driftVector.y, waveY, 0.025);

      const cols = Math.ceil(width / SPACING) + 2;
      const rows = Math.ceil(height / SPACING) + 2;
      const pointerNormX = width > 0 ? pointer.x / width - 0.5 : 0;
      const pointerNormY = height > 0 ? pointer.y / height - 0.5 : 0;
      const nearbyDots: DotPoint[] = [];
      const dotMap = new Map<string, DotPoint>();

      for (let y = -1; y < rows; y += 1) {
        for (let x = -1; x < cols; x += 1) {
          const depthSeed = Math.abs(x) + Math.abs(y);
          const depth =
            DEPTH_LAYERS > 1
              ? (depthSeed % DEPTH_LAYERS) / (DEPTH_LAYERS - 1)
              : 0;
          const closeness = 1 - depth;
          const parallaxScale = 0.35 + closeness * 0.65;
          const depthWave =
            Math.sin(time * 0.6 + depthSeed * 0.35) * 6 * (depth - 0.5);

          const dotX =
            x * SPACING +
            driftVector.x +
            parallaxScale * pointerNormX * PARALLAX_STRENGTH_X;
          const dotY =
            y * SPACING +
            driftVector.y +
            scrollOffset.current +
            parallaxScale * pointerNormY * PARALLAX_STRENGTH_Y +
            depthWave;

          const dx = pointer.x - dotX;
          const dy = pointer.y - dotY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const falloff = Math.max(0, 1 - distance / INFLUENCE);
          const depthIntensity = BASE_ALPHA + closeness * DEPTH_INTENSITY_BOOST;
          const intensity =
            depthIntensity + falloff * falloff * (0.9 - depthIntensity);

          const dotPoint: DotPoint = {
            x: dotX,
            y: dotY,
            closeness,
            gridX: x,
            gridY: y,
          };

          dotMap.set(`${x}:${y}`, dotPoint);

          if (falloff > LINE_THRESHOLD) {
            nearbyDots.push(dotPoint);
          }

          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
          ctx.arc(
            dotX,
            dotY,
            RADIUS + closeness * 0.9 + falloff * 1.4,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }

      if (pointer.active && nearbyDots.length > 1) {
        const cellX = Math.floor(pointer.x / SPACING);
        const cellY = Math.floor(pointer.y / SPACING);
        const movedCells =
          !lastCellRef.current ||
          lastCellRef.current.x !== cellX ||
          lastCellRef.current.y !== cellY;

        if (movedCells) {
          markLinesDisappearing(activeLinesRef.current);
          const newLines = generateLines(nearbyDots);
          activeLinesRef.current = [...activeLinesRef.current, ...newLines];
          lastCellRef.current = { x: cellX, y: cellY };
        } else if (
          !activeLinesRef.current.some((line) => line.state !== "disappearing")
        ) {
          activeLinesRef.current.push(...generateLines(nearbyDots));
        }
      } else {
        if (activeLinesRef.current.length) {
          markLinesDisappearing(activeLinesRef.current);
        }
        lastCellRef.current = null;
      }

      activeLinesRef.current = stepLines(activeLinesRef.current, deltaSeconds);
      drawStoredLines(ctx, activeLinesRef.current, dotMap);

      if (!pointer.active) {
        pointer.x = interpolate(pointer.x, width / 2, 0.02);
        pointer.y = interpolate(pointer.y, height / 2, 0.02);
      }

      rafRef.current = requestAnimationFrame(render);
    };

    let resizeTimeout: number | undefined;
    const onResize = () => {
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout);
      }
      resizeTimeout = window.setTimeout(() => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
        resize();
        rafRef.current = requestAnimationFrame(render);
      }, 120);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", handleScroll);
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 h-full w-full bg-black pointer-events-none"
      aria-hidden
    />
  );
}

function markLinesDisappearing(lines: LineConnection[]) {
  lines.forEach((line) => {
    if (line.state !== "disappearing") {
      line.state = "disappearing";
    }
  });
}

function generateLines(dots: DotPoint[]): LineConnection[] {
  const lines: LineConnection[] = [];
  const usable = [...dots];
  const max = Math.min(MAX_LINES, Math.floor(usable.length / 2));
  const usedPairs = new Set<string>();

  const pickStyle = (): LineStyle =>
    LINE_STYLES[Math.floor(Math.random() * LINE_STYLES.length)];

  let safety = 0;
  while (lines.length < max && safety < max * 8) {
    safety += 1;
    const start = usable[Math.floor(Math.random() * usable.length)];
    let end = usable[Math.floor(Math.random() * usable.length)];
    let guard = 0;
    while ((start === end || !end) && guard < 5) {
      end = usable[Math.floor(Math.random() * usable.length)];
      guard += 1;
    }
    if (!start || !end || start === end) {
      continue;
    }

    const key = createPairKey(start, end);
    if (usedPairs.has(key)) {
      continue;
    }
    usedPairs.add(key);

    const style = pickStyle();
    const disappearDuration = randomInRange(DISAPPEAR_DURATION_RANGE);
    const connection: LineConnection = {
      startKey: `${start.gridX}:${start.gridY}`,
      endKey: `${end.gridX}:${end.gridY}`,
      dash: [],
      dashSpeed: 0,
      dashOffset: 0,
      width: 1 + Math.random() * 0.8,
      opacity: 0.45 + start.closeness * 0.35 + Math.random() * 0.1,
      offsetX: 0,
      offsetY: 0,
      progress: 0,
      disappearDuration,
      state: "pending",
      activationDelay: lines.length * LINE_STAGGER_DELAY,
    };

    if (style === "dashed") {
      connection.dash = [8, 6];
      connection.dashSpeed = DASH_SCROLL_SPEED * (0.8 + Math.random() * 0.4);
    } else if (style === "dotted") {
      connection.dash = [2, 5];
      connection.dashSpeed =
        DASH_SCROLL_SPEED * 0.6 * (0.8 + Math.random() * 0.4);
    } else if (style === "glitch") {
      connection.dash = [Math.random() * 6 + 2, Math.random() * 8 + 4];
      connection.offsetX = (Math.random() - 0.5) * 4;
      connection.offsetY = (Math.random() - 0.5) * 4;
      connection.opacity *= 0.9;
    }

    lines.push(connection);
  }

  return lines;
}

function stepLines(lines: LineConnection[], deltaSeconds: number) {
  return lines.filter((line) => {
    if (line.state === "pending") {
      line.activationDelay -= deltaSeconds;
      if (line.activationDelay <= 0) {
        line.state = "steady";
        line.progress = 1;
      } else {
        line.progress = 0;
      }
    } else if (line.state === "disappearing") {
      const rate =
        line.disappearDuration > 0 ? deltaSeconds / line.disappearDuration : 1;
      line.progress = Math.max(0, line.progress - rate);
      if (line.progress <= 0.001) {
        return false;
      }
    } else {
      line.progress = 1;
    }

    if (line.dash.length && line.dashSpeed !== 0) {
      line.dashOffset -= line.dashSpeed * deltaSeconds;
    } else {
      line.dashOffset = 0;
    }

    return true;
  });
}

function drawStoredLines(
  ctx: CanvasRenderingContext2D,
  lines: LineConnection[],
  dotMap: Map<string, DotPoint>
) {
  if (!lines.length) {
    return;
  }

  ctx.save();
  lines.forEach((line) => {
    if (line.state === "pending") {
      return;
    }
    const start = dotMap.get(line.startKey);
    const end = dotMap.get(line.endKey);
    if (!start || !end) {
      return;
    }
    const opacity = line.opacity * Math.min(1, Math.max(0, line.progress));
    ctx.lineWidth = line.width;
    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.setLineDash(line.dash);
    ctx.lineDashOffset = line.dashOffset;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    const dx = end.x + line.offsetX - start.x;
    const dy = end.y + line.offsetY - start.y;
    const progress = Math.min(1, Math.max(0, line.progress));
    ctx.lineTo(start.x + dx * progress, start.y + dy * progress);
    ctx.stroke();
  });
  ctx.restore();
}

function createPairKey(a: DotPoint, b: DotPoint) {
  const aKey = `${a.gridX}:${a.gridY}`;
  const bKey = `${b.gridX}:${b.gridY}`;
  return aKey < bKey ? `${aKey}|${bKey}` : `${bKey}|${aKey}`;
}

function randomInRange(range: readonly [number, number]) {
  const [min, max] = range;
  return min + Math.random() * (max - min);
}
