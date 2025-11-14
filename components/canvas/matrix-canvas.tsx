"use client";

import { MutableRefObject, useEffect, useRef } from "react";

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
const AMBIENT_SPAWN_INTERVAL = [1.1, 2.5] as const;
const AMBIENT_LIFESPAN = [3.5, 6] as const;
const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1024;

type DotPoint = {
  x: number;
  y: number;
  closeness: number;
  gridX: number;
  gridY: number;
};

type LineStyle = (typeof LINE_STYLES)[number];
type LineSource = "pointer" | "ambient";

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
  source: LineSource;
  lifespan: number;
  age: number;
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
  const ambientSpawnRef = useRef({
    elapsed: 0,
    next: randomInRange(AMBIENT_SPAWN_INTERVAL),
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
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
      const config = getResponsiveConfig(width);
      const spacing = config.spacing;
      const influence = config.influence;
      const radius = config.radius;
      const pointerLineCap = config.pointerLines;
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

      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;
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
            x * spacing +
            driftVector.x +
            parallaxScale * pointerNormX * PARALLAX_STRENGTH_X;
          const dotY =
            y * spacing +
            driftVector.y +
            scrollOffset.current +
            parallaxScale * pointerNormY * PARALLAX_STRENGTH_Y +
            depthWave;

          const dx = pointer.x - dotX;
          const dy = pointer.y - dotY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const falloff = Math.max(0, 1 - distance / influence);
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
            radius + closeness * 0.9 + falloff * 1.4,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }

      const dotList = Array.from(dotMap.values());
      const pointerHasInfluence = pointer.active && nearbyDots.length > 1;

      if (pointerHasInfluence) {
        const cellX = Math.floor(pointer.x / spacing);
        const cellY = Math.floor(pointer.y / spacing);
        const movedCells =
          !lastCellRef.current ||
          lastCellRef.current.x !== cellX ||
          lastCellRef.current.y !== cellY;

        if (movedCells) {
          markLinesDisappearing(activeLinesRef.current, "pointer");
          const pointerLineCount = activeLinesRef.current.filter(
            (line) => line.source === "pointer"
          ).length;
          const remaining = Math.max(pointerLineCap - pointerLineCount, 0);
          const newLines = generateLines(nearbyDots, {
            maxLines: remaining || pointerLineCap,
            source: "pointer",
          });
          activeLinesRef.current = [...activeLinesRef.current, ...newLines];
          lastCellRef.current = { x: cellX, y: cellY };
        } else {
          const hasActivePointerLine = activeLinesRef.current.some(
            (line) => line.source === "pointer" && line.state !== "disappearing"
          );
          if (!hasActivePointerLine) {
            activeLinesRef.current.push(
              ...generateLines(nearbyDots, {
                maxLines: pointerLineCap,
                source: "pointer",
              })
            );
          }
        }
      } else {
        if (activeLinesRef.current.length) {
          markLinesDisappearing(activeLinesRef.current, "pointer");
        }
        lastCellRef.current = null;
      }

      spawnAmbientLines(
        dotList,
        activeLinesRef,
        ambientSpawnRef,
        config,
        deltaSeconds
      );

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

function markLinesDisappearing(lines: LineConnection[], source?: LineSource) {
  lines.forEach((line) => {
    if (source && line.source !== source) {
      return;
    }
    if (line.state !== "disappearing") {
      line.state = "disappearing";
    }
  });
}

type GenerateLineOptions = {
  maxLines?: number;
  source?: LineSource;
  baseOpacity?: number;
  widthRange?: readonly [number, number];
  stagger?: number;
  disappearRange?: readonly [number, number];
  lifespanRange?: readonly [number, number];
};

function generateLines(
  dots: DotPoint[],
  options?: GenerateLineOptions
): LineConnection[] {
  const lines: LineConnection[] = [];
  const usable = [...dots];
  const maxLines = options?.maxLines ?? MAX_LINES;
  const max = Math.min(maxLines, Math.floor(usable.length / 2));
  if (max <= 0) {
    return lines;
  }
  const usedPairs = new Set<string>();
  const baseOpacity = options?.baseOpacity ?? 0.45;
  const [widthMin, widthMax] = options?.widthRange ?? [1, 1.8];
  const stagger = options?.stagger ?? LINE_STAGGER_DELAY;
  const disappearRange = options?.disappearRange ?? DISAPPEAR_DURATION_RANGE;
  const lifespanRange = options?.lifespanRange ?? [3, 4.5];
  const source = options?.source ?? "pointer";

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
    const disappearDuration = randomInRange(disappearRange);
    const connection: LineConnection = {
      startKey: `${start.gridX}:${start.gridY}`,
      endKey: `${end.gridX}:${end.gridY}`,
      dash: [],
      dashSpeed: 0,
      dashOffset: 0,
      width: widthMin + Math.random() * (widthMax - widthMin),
      opacity: baseOpacity + start.closeness * 0.35 + Math.random() * 0.1,
      offsetX: 0,
      offsetY: 0,
      progress: 0,
      disappearDuration,
      state: "pending",
      activationDelay: lines.length * stagger,
      source,
      lifespan: randomInRange(lifespanRange),
      age: 0,
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
    line.age += deltaSeconds;
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

    if (line.state === "steady" && line.age >= line.lifespan) {
      line.state = "disappearing";
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

type ResponsiveConfig = {
  spacing: number;
  influence: number;
  radius: number;
  pointerLines: number;
  ambientBurst: number;
  ambientTotal: number;
};

const responsiveConfigs: ResponsiveConfig[] = [
  {
    spacing: 42,
    influence: 170,
    radius: 1.1,
    pointerLines: 8,
    ambientBurst: 2,
    ambientTotal: 8,
  },
  {
    spacing: 52,
    influence: 200,
    radius: 1.25,
    pointerLines: 12,
    ambientBurst: 2,
    ambientTotal: 10,
  },
  {
    spacing: SPACING,
    influence: INFLUENCE,
    radius: RADIUS,
    pointerLines: MAX_LINES,
    ambientBurst: 3,
    ambientTotal: 12,
  },
];

function getResponsiveConfig(width: number): ResponsiveConfig {
  if (width <= MOBILE_BREAKPOINT) {
    return responsiveConfigs[0];
  }
  if (width <= TABLET_BREAKPOINT) {
    return responsiveConfigs[1];
  }
  return responsiveConfigs[2];
}

function spawnAmbientLines(
  dots: DotPoint[],
  activeLinesRef: MutableRefObject<LineConnection[]>,
  ambientSpawnRef: MutableRefObject<{ elapsed: number; next: number }>,
  config: ResponsiveConfig,
  deltaSeconds: number
) {
  if (dots.length < 2) {
    return;
  }

  ambientSpawnRef.current.elapsed += deltaSeconds;
  if (ambientSpawnRef.current.elapsed < ambientSpawnRef.current.next) {
    return;
  }

  ambientSpawnRef.current.elapsed = 0;
  ambientSpawnRef.current.next = randomInRange(AMBIENT_SPAWN_INTERVAL);

  const ambientLines = activeLinesRef.current.filter(
    (line) => line.source === "ambient"
  );

  if (ambientLines.length >= config.ambientTotal) {
    return;
  }

  const availableSlots = config.ambientTotal - ambientLines.length;
  const spawnCount = Math.min(config.ambientBurst, availableSlots);
  if (spawnCount <= 0) {
    return;
  }

  const newLines = generateLines(dots, {
    maxLines: spawnCount,
    source: "ambient",
    baseOpacity: 0.35,
    widthRange: [0.8, 1.4],
    stagger: 0.08,
    disappearRange: [0.5, 0.9],
    lifespanRange: AMBIENT_LIFESPAN,
  });

  activeLinesRef.current = [...activeLinesRef.current, ...newLines];
}
