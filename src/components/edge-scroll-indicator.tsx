"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

/** A quiet progress rule. Browser-owned scrolling is only observed, never changed. */
export function EdgeScrollIndicator({ scope = "page" }: { scope?: "page" | "project" }) {
  const edge = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const edgeNode = edge.current;
    const fillNode = fill.current;
    if (!edgeNode || !fillNode) return;
    const modal = scope === "project" ? edgeNode.closest("dialog") : null;
    const viewport = modal?.querySelector<HTMLElement>(".project-dialog-scroll") ?? null;
    if (scope === "project" && !viewport) return;

    const surface = viewport ?? document.documentElement;
    const scrollEvents: HTMLElement | Window = viewport ?? window;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const forcedColors = matchMedia("(forced-colors: active)");
    const readPosition = () => viewport ? viewport.scrollTop : window.scrollY;
    let frame = 0;
    let idleTimer = 0;
    let maximum = 0;
    let progress = 0;
    let previousTime = 0;
    let previousScroll = readPosition();
    let needsMeasure = true;
    let active = false;
    let initialized = false;
    let observedContent: Element | null = null;

    function measure() {
      const height = viewport ? viewport.clientHeight : window.innerHeight;
      maximum = Math.max(0, surface.scrollHeight - height);
      active = !forcedColors.matches && maximum > 1 && height > 0 && (!modal || modal.open);
      if (active) {
        surface.setAttribute("data-scroll-progress", "true");
        edgeNode!.dataset.ready = "true";
      } else {
        surface.removeAttribute("data-scroll-progress");
        delete edgeNode!.dataset.ready;
        initialized = false;
      }
      needsMeasure = false;
    }

    function paint(now: number) {
      frame = 0;
      if (document.hidden) return;
      if (needsMeasure) measure();
      if (!active) return;
      const target = clamp(readPosition() / maximum, 0, 1);
      const elapsed = clamp(previousTime ? now - previousTime : 16.67, 1, 64);
      previousTime = now;
      if (!initialized || reducedMotion.matches) {
        progress = target;
        initialized = true;
      } else {
        progress += (target - progress) * (1 - Math.exp(-elapsed / 62));
      }
      const settled = Math.abs(target - progress) < .00005;
      if (settled) progress = target;
      fillNode!.style.transform = `scaleY(${progress})`;
      if (!settled) frame = requestAnimationFrame(paint);
      else previousTime = 0;
    }

    function schedule() {
      if (!frame && !document.hidden) frame = requestAnimationFrame(paint);
    }
    function resize() { needsMeasure = true; schedule(); }
    function onScroll() {
      const position = readPosition();
      if (Math.abs(position - previousScroll) > .1) {
        previousScroll = position;
        edgeNode!.dataset.scrolling = "true";
        window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(() => { delete edgeNode!.dataset.scrolling; }, 180);
      }
      schedule();
    }
    function resume() {
      cancelAnimationFrame(frame);
      window.clearTimeout(idleTimer);
      frame = 0;
      previousTime = 0;
      initialized = false;
      previousScroll = readPosition();
      delete edgeNode!.dataset.scrolling;
      if (!document.hidden) resize();
    }

    // Range measurements are cached between content/viewport changes.
    const observer = new ResizeObserver(resize);
    observer.observe(surface);
    if (!viewport) observer.observe(document.body);
    function observeContent() {
      const nextContent = viewport?.firstElementChild ?? null;
      if (observedContent !== nextContent) {
        if (observedContent) observer.unobserve(observedContent);
        observedContent = nextContent;
        if (observedContent) observer.observe(observedContent);
      }
      resize();
    }
    const contents = new MutationObserver(observeContent);
    if (modal) contents.observe(modal, { attributes: true, attributeFilter: ["open"], childList: true, subtree: true });
    scrollEvents.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", resume);
    reducedMotion.addEventListener("change", resume);
    forcedColors.addEventListener("change", resume);
    observeContent();

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(idleTimer);
      observer.disconnect();
      contents.disconnect();
      surface.removeAttribute("data-scroll-progress");
      delete edgeNode.dataset.ready;
      delete edgeNode.dataset.scrolling;
      scrollEvents.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", resume);
      reducedMotion.removeEventListener("change", resume);
      forcedColors.removeEventListener("change", resume);
    };
  }, [scope, pathname]);

  return <div ref={edge} className={`scroll-progress scroll-progress--${scope}`} aria-hidden="true">
    <span ref={fill}/>
  </div>;
}