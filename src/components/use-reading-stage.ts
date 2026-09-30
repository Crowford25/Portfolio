"use client";
import { useEffect, type RefObject } from "react";

export function useReadingStage(root: RefObject<HTMLElement | null>, selector: string, onStage: (index: number) => void) {
  useEffect(() => {
    const mobile = matchMedia("(max-width: 760px)");
    let frame = 0;
    let visible = false;
    function update() {
      frame = 0;
      if (!mobile.matches || !root.current || !visible) return;
      const items = Array.from(root.current.querySelectorAll(selector));
      let active = 0;
      // Only advance when the heading reaches the central reading region.
      items.forEach((item, i) => { if (item.getBoundingClientRect().top <= innerHeight * .46) active = i; });
      onStage(active);
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); });
    if (root.current) observer.observe(root.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [root, selector, onStage]);
}
