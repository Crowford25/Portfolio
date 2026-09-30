"use client";
import { useEffect, useRef } from "react";
import { withoutBasePath } from "@/lib/site-path";

export function CustomCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const eligible = matchMedia("(min-width: 761px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const html = document.documentElement;
    let frame = 0, x = 0, y = 0;
    let label = "", kind = "default";
    function hide() {
      cancelAnimationFrame(frame);
      frame = 0;
      html.classList.remove("has-custom-cursor");
      cursor.current?.classList.remove("is-visible");
    }
    function preserveSelection() {
      if (window.getSelection()?.isCollapsed === false) hide();
    }
    function move(event: PointerEvent) {
      if (!eligible.matches || event.pointerType !== "mouse") { hide(); return; }
      const target = event.target instanceof Element ? event.target : null;
      const native = target?.closest("input:not([type=range]),textarea,select,[contenteditable]:not([contenteditable=false]),iframe,video,audio,[disabled],[data-cursor=native]");
      const interactive = target?.closest("a,button,summary,input,[data-cursor]");
      // Retain the text-selection I-beam and all native editing controls.
      const text = !interactive && target?.closest("p,h1,h2,h3,h4,h5,h6,small,span,strong,em,b,li,dt,dd,td,th,label,blockquote,figcaption,pre,code");
      if (native || text || window.getSelection()?.isCollapsed === false || (event.buttons && !interactive)) { hide(); return; }
      const requested = target?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor?.toLowerCase();
      label = requested === "drag" ? "Drag" : requested === "view" ? "View" : "";
      const link = target?.closest<HTMLAnchorElement>("a");
      if (!label && link) label = withoutBasePath(link.pathname).startsWith("/work/") && link.origin === location.origin ? "View" : link.target === "_blank" ? "↗" : "";
      kind = label ? "label" : interactive ? "link" : "default";
      x = event.clientX; y = event.clientY;
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0;
        if (!cursor.current) return;
        cursor.current.style.transform = `translate3d(${x}px,${y}px,0)`;
        cursor.current.dataset.kind = kind;
        const caption = cursor.current.querySelector("span");
        if (caption && caption.textContent !== label) caption.textContent = label;
        cursor.current.classList.add("is-visible");
        html.classList.add("has-custom-cursor");
      });
    }
    function pointerDown(event: PointerEvent) { if (event.pointerType !== "mouse") hide(); }
    function leave(event: PointerEvent) { if (!event.relatedTarget) hide(); }
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", pointerDown, { passive: true });
    document.addEventListener("pointerout", leave);
    document.addEventListener("selectionchange", preserveSelection);
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("blur", hide);
    window.addEventListener("keydown", hide);
    eligible.addEventListener("change", hide);
    return () => { hide(); window.removeEventListener("pointermove", move); window.removeEventListener("pointerdown", pointerDown); document.removeEventListener("pointerout", leave); document.removeEventListener("selectionchange", preserveSelection); document.removeEventListener("visibilitychange", hide); window.removeEventListener("blur", hide); window.removeEventListener("keydown", hide); eligible.removeEventListener("change", hide); };
  }, []);
  return <div ref={cursor} className="custom-cursor" aria-hidden="true"><i/><span/></div>;
}
