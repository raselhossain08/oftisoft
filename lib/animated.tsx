"use client";

import { useRef, useEffect, useState, useMemo, createContext, useContext, type ReactNode, type HTMLAttributes } from "react";

// ─── Global CSS injection ───

let injected = false;
const keyframeCache = new Map<string, true>();

const BASE_CSS = `\
[data-oa]{will-change:transform,opacity;backface-visibility:hidden}\
@keyframes oa-gen{from{opacity:var(--oa-fo,0);transform:translateY(var(--oa-fy,0px))translateX(var(--oa-fx,0px))scale(var(--oa-fs,1))}to{opacity:var(--oa-to,1);transform:translateY(var(--oa-ty,0px))translateX(var(--oa-tx,0px))scale(var(--oa-ts,1))}}\
@keyframes oa-spin{to{transform:rotate(360deg)}}\
@keyframes oa-spin-r{to{transform:rotate(-360deg)}}\
@keyframes oa-bounce-y{0%,100%{transform:translateY(0)}50%{transform:translateY(var(--oa-by,-15px))}}\
@keyframes oa-bounce-x{0%,100%{transform:translateX(0)}50%{transform:translateX(var(--oa-bx,15px))}}\
@keyframes oa-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:var(--oa-po,1);transform:scale(var(--oa-ps,1.03))}}\
[data-oa-hov]{transition:transform var(--oa-ht,.2s)var(--oa-he,ease-out),opacity var(--oa-ht,.2s)var(--oa-he,ease-out)}\
[data-oa-hov]:hover{transform:translateY(var(--oa-hy,0px))translateX(var(--oa-hx,0px))scale(var(--oa-hs,1));opacity:var(--oa-ho,1)}\
`;

function injectCSS() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.id = "__oa";
  el.textContent = BASE_CSS;
  document.head.appendChild(el);
}

function addKeyframe(name: string, css: string) {
  if (typeof document === "undefined") return;
  if (keyframeCache.has(name)) return;
  keyframeCache.set(name, true);
  const el = document.createElement("style");
  el.textContent = `@keyframes ${name}{${css}}`;
  document.head.appendChild(el);
}

// ─── Spring → CSS cubic-bezier approximation ───

function springBezier(stiffness: number, damping: number): string {
  const s = Math.max(0.1, stiffness / 300);
  const d = Math.max(0.1, damping / 30);
  const x1 = Math.min(1, 0.5 / s);
  const y1 = Math.min(1, 1.2 / d);
  const x2 = Math.min(1, 2 / s);
  const y2 = Math.min(1, 3 / d);
  return `${x1},${y1},${x2},${y2}`;
}

function springDuration(stiffness: number, damping: number): number {
  return Math.min(Math.sqrt(1 / Math.max(stiffness, 1)) * 3, 1);
}

// ─── Utility ───

type AnimValue = number | number[] | string | undefined;
const isNum = (v: any): v is number => typeof v === "number" && !isNaN(v);
const last = (v: AnimValue): number | string | undefined => Array.isArray(v) ? v[v.length - 1] : v;
const first = (v: AnimValue): number | string | undefined => Array.isArray(v) ? v[0] : v;

// ─── Intersection Observer hook ───

export function useInView(options?: IntersectionObserverInit & { once?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const { once = true, ...observerOptions } = options || {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (once && inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: 0.1, ...observerOptions }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, inView]);

  return { ref, inView };
}

// ─── Props type ───

type AnimProps = {
  initial?: Record<string, any> | false;
  animate?: Record<string, any>;
  whileInView?: Record<string, any>;
  whileHover?: Record<string, any>;
  whileTap?: Record<string, any>;
  viewport?: { once?: boolean; amount?: number; margin?: string };
  transition?: Record<string, any>;
  layoutId?: string;
  layout?: boolean | string;
  exit?: Record<string, any>;
  variants?: Record<string, any>;
  onViewportEnter?: () => void;
  onViewportLeave?: () => void;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
  className?: string;
  children?: ReactNode;
  as?: React.ElementType;
} & HTMLAttributes<HTMLElement>;

// ─── Build CSS animation from props ───

function buildAnim(
  initial: Record<string, any> | false | undefined,
  animate: Record<string, any> | undefined,
  whileInView: Record<string, any> | undefined,
  transition: Record<string, any> | undefined,
  inView: boolean
): {
  cssVars: Record<string, string>;
  animStyle: Record<string, string>;
  hiddenStyle: Record<string, string>;
  isHidden: boolean;
} {
  const cssVars: Record<string, string> = {};
  const hiddenStyle: Record<string, string> = {};
  const animStyle: Record<string, string> = {};
  const hasMount = animate != null;
  const hasScroll = whileInView != null;
  const triggerAnim = hasMount || (hasScroll && inView);
  const noInit = initial === false;

  // Determine from/to states
  let from: Record<string, any> = {};
  let to: Record<string, any> = {};

  if (hasMount) {
    from = (initial && typeof initial === "object") ? { ...initial } : {};
    to = { ...animate };
  } else if (hasScroll) {
    to = { ...whileInView };
    if (inView) {
      from = (initial && typeof initial === "object") ? { ...initial } : {};
      if (!initial || typeof initial !== "object") {
        if (isNum(to.opacity)) from.opacity = 0;
        if (isNum(to.y)) from.y = -(to.y as number) || 24;
        if (isNum(to.x)) from.x = -(to.x as number) || 24;
        if (isNum(to.scale)) from.scale = (to.scale as number) * 0.9;
      }
    }
  }

  // ── Handle rotate ──
  if (isNum(to.rotate)) {
    const r = to.rotate as number;
    const isRev = r < 0;
    const dur = transition?.duration ?? 4;
    const del = transition?.delay ?? 0;
    const ease = transition?.ease ?? "linear";
    const cnt = transition?.repeat === Infinity ? "infinite" : "1";
    const name = isRev ? "oa-spin-r" : "oa-spin";
    animStyle.animation = `${name} ${dur}s ${ease} ${del}s ${cnt}`;
    return { cssVars: {}, animStyle, hiddenStyle: {}, isHidden: false };
  }

  // ── Handle bounce/pulse array patterns ──
  const checkArray = (key: string, singleKeyframe: string, varName: string) => {
    const v = to[key];
    if (Array.isArray(v) && v.length === 3 && v[0] === v[2] && transition?.repeat === Infinity) {
      cssVars[varName] = String(v[1]);
      const dur = transition?.duration ?? 4;
      const del = transition?.delay ?? 0;
      const ease = transition?.ease ?? "ease-in-out";
      animStyle.animation = `${singleKeyframe} ${dur}s ${ease} ${del}s infinite`;
      return true;
    }
    return false;
  };

  if (checkArray("y", "oa-bounce-y", "--oa-by")) return { cssVars, animStyle, hiddenStyle: {}, isHidden: false };
  if (checkArray("x", "oa-bounce-x", "--oa-bx")) return { cssVars, animStyle, hiddenStyle: {}, isHidden: false };
  if (checkArray("scale", "oa-pulse", "--oa-ps")) return { cssVars, animStyle, hiddenStyle: {}, isHidden: false };

  // ── Handle arbitrary array values (e.g., y: ['-100%', '200%']) ──
  for (const key of ["y", "x"] as const) {
    const v = to[key];
    if (Array.isArray(v) && v.length >= 2) {
      const fromVal = v[0];
      const toVal = v[v.length - 1];
      const hash = `${key}:${fromVal}-${toVal}`;
      addKeyframe(`oa-arr-${hash}`, `from{transform:${key === "y" ? "translateY" : "translateX"}(${fromVal})}to{transform:${key === "y" ? "translateY" : "translateX"}(${toVal})}`);
      const dur = transition?.duration ?? 0.5;
      const del = transition?.delay ?? 0;
      const ease = transition?.ease ?? "linear";
      const cnt = transition?.repeat === Infinity ? "infinite" : "1";
      animStyle.animation = `oa-arr-${hash} ${dur}s ${ease} ${del}s ${cnt}`;
      return { cssVars: {}, animStyle, hiddenStyle: {}, isHidden: false };
    }
  }

  // ── Handle scroll-hidden state (not in view) ──
  if (hasScroll && !inView && !hasMount) {
    if (isNum(from.opacity)) hiddenStyle.opacity = String(from.opacity);
    const parts: string[] = [];
    if (isNum(from.y)) parts.push(`translateY(${from.y}px)`);
    if (isNum(from.x)) parts.push(`translateX(${from.x}px)`);
    if (isNum(from.scale)) parts.push(`scale(${from.scale})`);
    if (parts.length) hiddenStyle.transform = parts.join(" ");
    return { cssVars: {}, animStyle, hiddenStyle, isHidden: true };
  }

  // ── Handle hidden state for mount (initial without animate yet) ──
  if (hasMount && !triggerAnim && !noInit) {
    if (isNum(from.opacity)) hiddenStyle.opacity = String(from.opacity);
    const parts: string[] = [];
    if (isNum(from.y)) parts.push(`translateY(${from.y}px)`);
    if (isNum(from.x)) parts.push(`translateX(${from.x}px)`);
    if (isNum(from.scale)) parts.push(`scale(${from.scale})`);
    if (parts.length) hiddenStyle.transform = parts.join(" ");
    return { cssVars: {}, animStyle, hiddenStyle, isHidden: true };
  }

  // ── Handle no animation at all (initial={false} or no anim props) ──
  if (noInit || (!triggerAnim && !hasScroll)) {
    return { cssVars: {}, animStyle, hiddenStyle: {}, isHidden: false };
  }

  // ── Default: use generic keyframe ──
  if (isNum(from.opacity)) cssVars["--oa-fo"] = String(from.opacity);
  if (isNum(to.opacity)) cssVars["--oa-to"] = String(to.opacity);
  if (isNum(from.y)) cssVars["--oa-fy"] = from.y + "px";
  if (isNum(to.y)) cssVars["--oa-ty"] = to.y + "px";
  if (isNum(from.x)) cssVars["--oa-fx"] = from.x + "px";
  if (isNum(to.x)) cssVars["--oa-tx"] = to.x + "px";
  if (isNum(from.scale)) cssVars["--oa-fs"] = String(from.scale);
  if (isNum(to.scale)) cssVars["--oa-ts"] = String(to.scale);

  let easing = "ease-out";
  if (transition?.ease) {
    easing = transition.ease;
  } else if (transition?.type === "spring") {
    easing = `cubic-bezier(${springBezier(transition.stiffness ?? 300, transition.damping ?? 30)})`;
  }

  const dur = transition?.type === "spring"
    ? springDuration(transition.stiffness ?? 300, transition.damping ?? 30)
    : (transition?.duration ?? 0.35);
  const del = transition?.delay ?? 0;
  const cnt = transition?.repeat === Infinity ? "infinite" : "1";
  const dir = transition?.repeat === Infinity ? "alternate" : "normal";

  animStyle.animation = `oa-gen ${dur}s ${easing} ${del}s ${cnt} ${dir} both`;

  return { cssVars, animStyle, hiddenStyle, isHidden: false };
}

// ─── Build hover CSS vars ───

function buildHover(whileHover?: Record<string, any>, transition?: Record<string, any>): Record<string, string> {
  if (!whileHover) return {};
  const vars: Record<string, string> = {};
  if (isNum(whileHover.y)) vars["--oa-hy"] = whileHover.y + "px";
  if (isNum(whileHover.x)) vars["--oa-hx"] = whileHover.x + "px";
  if (isNum(whileHover.scale)) vars["--oa-hs"] = String(whileHover.scale);
  if (isNum(whileHover.opacity)) vars["--oa-ho"] = String(whileHover.opacity);
  if (transition?.duration) vars["--oa-ht"] = transition.duration + "s";
  if (transition?.ease) vars["--oa-he"] = transition.ease;
  return vars;
}

// ─── Animated component ───

const MOTION_PROPS = new Set([
  "layoutId", "whileFocus", "whileDrag",
  "whileTap", "exit", "variants", "layout", "positionTransition",
  "onAnimationStart", "onAnimationComplete",
  "onViewportEnter", "onViewportLeave",
]);

export function Animated({
  as = "div",
  initial: _initial,
  animate,
  whileInView,
  whileHover,
  viewport,
  transition,
  className = "",
  style: extStyle,
  children,
  ...rest
}: AnimProps) {
  injectCSS();

  const Tag = as;
  const { ref: viewRef, inView } = useInView({
    once: viewport?.once !== false,
    threshold: viewport?.amount || 0.1,
    rootMargin: (viewport as any)?.margin || "0px",
  });

  const { cssVars, animStyle, hiddenStyle, isHidden } = buildAnim(
    _initial, animate, whileInView, transition, inView
  );

  const hoverVars = buildHover(whileHover, transition);

  const combinedStyle = {
    ...(isHidden ? hiddenStyle : animStyle),
    ...cssVars,
    ...hoverVars,
    ...extStyle,
  } as React.CSSProperties;

  const attrs: Record<string, any> = {};
  attrs["data-oa"] = "";
  if (whileHover) attrs["data-oa-hov"] = "";

  const domProps = Object.fromEntries(
    Object.entries(rest).filter(([k]) => !MOTION_PROPS.has(k))
  );

  return (
    <Tag
      ref={viewRef as any}
      className={className}
      style={combinedStyle}
      {...attrs}
      {...(domProps as any)}
    >
      {children}
    </Tag>
  );
}

// ─── AnimatePresence ───

const PresenceContext = createContext<{ isVisible: boolean }>({ isVisible: true });

type AnimatePresenceProps = {
  children: ReactNode;
  mode?: "wait" | "popLayout" | "sync";
  custom?: any;
  initial?: boolean;
  onExitComplete?: () => void;
};

export function AnimatePresence({ children, mode, custom, initial, onExitComplete }: AnimatePresenceProps) {
  return <>{children}</>;
}

// ─── Tag-specific convenience wrappers ───

export const AnimatedDiv = (props: Omit<AnimProps, "as">) => <Animated as="div" {...props} />;
export const AnimatedSpan = (props: Omit<AnimProps, "as">) => <Animated as="span" {...props} />;
export const AnimatedH1 = (props: Omit<AnimProps, "as">) => <Animated as="h1" {...props} />;
export const AnimatedH2 = (props: Omit<AnimProps, "as">) => <Animated as="h2" {...props} />;
export const AnimatedH3 = (props: Omit<AnimProps, "as">) => <Animated as="h3" {...props} />;
export const AnimatedP = (props: Omit<AnimProps, "as">) => <Animated as="p" {...props} />;
export const AnimatedSection = (props: Omit<AnimProps, "as">) => <Animated as="section" {...props} />;
export const AnimatedAside = (props: Omit<AnimProps, "as">) => <Animated as="aside" {...props} />;

// ─── Convenience animation components ───

export function SlideUp({ children, delay = 0, duration = 0.35, className = "", ...rest }: { children: ReactNode; delay?: number; duration?: number; className?: string; [key: string]: any }) {
  return (
    <Animated initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration, delay }} className={className} {...rest}>
      {children}
    </Animated>
  );
}

export function FadeIn({ children, delay = 0, duration = 0.3, className = "", ...rest }: { children: ReactNode; delay?: number; duration?: number; className?: string; [key: string]: any }) {
  return (
    <Animated initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration, delay }} className={className} {...rest}>
      {children}
    </Animated>
  );
}

export function ScaleIn({ children, delay = 0, duration = 0.3, className = "", ...rest }: { children: ReactNode; delay?: number; duration?: number; className?: string; [key: string]: any }) {
  return (
    <Animated initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration, delay }} className={className} {...rest}>
      {children}
    </Animated>
  );
}

export function Reveal({ children, className = "", delay = 0, duration = 0.4, once = true, ...rest }: { children: ReactNode; delay?: number; duration?: number; once?: boolean; className?: string; [key: string]: any }) {
  return (
    <Animated whileInView={{ opacity: 1, y: 0 }} viewport={{ once }} transition={{ duration, delay }} className={className} {...rest}>
      {children}
    </Animated>
  );
}

// ─── Scroll position hooks ───

export function useScrollY() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrollY;
}

export function useScrollProgress(ref?: React.RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      if (ref?.current) {
        const rect = ref.current.getBoundingClientRect();
        const wh = window.innerHeight;
        setProgress(Math.max(0, Math.min(1, (wh - rect.top) / (wh + rect.height))));
      } else {
        const doc = document.documentElement;
        const total = doc.scrollHeight - window.innerHeight;
        setProgress(total > 0 ? window.scrollY / total : 0);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);
  return progress;
}

export function useScrollOffset(ref: React.RefObject<HTMLElement | null>) {
  return useScrollProgress(ref);
}

// ─── useTransform ───

export function useTransform(value: number, input: readonly number[], output: readonly number[]): number;
export function useTransform(value: number, input: readonly number[], output: readonly (number | string)[]): number | string;
export function useTransform(value: number, input: readonly number[], output: readonly (number | string)[]): number | string {
  return useMemo(() => {
    if (input.length <= 1) return output[0] ?? 0;
    const clamped = Math.max(input[0], Math.min(input[input.length - 1], value));
    for (let i = 0; i < input.length - 1; i++) {
      if (clamped >= input[i] && clamped <= input[i + 1]) {
        const t = (clamped - input[i]) / (input[i + 1] - input[i] || 1);
        const a = output[i], b = output[i + 1];
        if (typeof a === "string" || typeof b === "string") {
          return t < 0.5 ? String(a) : String(b);
        }
        return (a as number) + t * ((b as number) - (a as number));
      }
    }
    return output[output.length - 1] ?? 0;
  }, [value, ...input, ...output]);
}

// ─── Spring smoothing (for mouse-driven values) ───

export function useSpring(value: number, config?: { stiffness?: number; damping?: number; restDelta?: number; mass?: number; velocity?: number }) {
  const [smoothed, setSmoothed] = useState(value);
  const ref = useRef(value);
  ref.current = value;
  const stiffness = config?.stiffness ?? 100;
  const damping = config?.damping ?? 20;

  useEffect(() => {
    let frame: number;
    let current = smoothed;
    const animate = () => {
      const target = ref.current;
      const diff = target - current;
      if (Math.abs(diff) < 0.001) {
        current = target;
        setSmoothed(target);
        return;
      }
      current += diff * (stiffness / 100) * (1 / (1 + damping / 20));
      setSmoothed(current);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [stiffness, damping]);

  return smoothed;
}

// ─── useReducedMotion ───

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

// ─── useMotionValue ───

export function useMotionValue(initial: number) {
  const ref = useRef(initial);
  const [state, setState] = useState(initial);
  return {
    get: () => ref.current,
    set: (v: number) => { ref.current = v; setState(v); },
    value: state,
  };
}

// ─── Parallax ───

export function useParallax(ref: React.RefObject<HTMLElement | null>, factor = 0.5) {
  const scrollY = useScrollY();
  if (!ref.current) return 0;
  const rect = ref.current.getBoundingClientRect();
  return (rect.top - scrollY) * factor;
}
