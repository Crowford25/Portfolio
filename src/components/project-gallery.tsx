"use client";

import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Project } from "@/data/content";
import { getProjectScreens } from "@/lib/project-screens";
import { Architecture } from "./surface-system";
import { ProductPreview } from "./product-preview";
import { FypProjectPreview } from "./fyp-project-preview";

export function ProjectGallery({ project, initialIndex = 0, variant = "inline", onExpand }: {
  project: Project;
  initialIndex?: number;
  variant?: "inline" | "dialog";
  onExpand?: (index: number) => void;
}) {
  const id = useId();
  const screens = getProjectScreens(project);
  const [index, setIndex] = useState(() => Math.max(0, Math.min(initialIndex, screens.length - 1)));
  const [mode, setMode] = useState<"surface" | "system">("surface");
  const [direction, setDirection] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const origin = useRef<{x: number; y: number; pointerId: number} | null>(null);
  const lastSwipe = useRef(0);
  const screen = screens[index] || screens[0];
  const hasSystem = project.visual === "booking" && !!project.architecture?.length;
  const canMove = mode === "surface" && screens.length > 1;

  function move(amount: number) {
    if (!canMove) return;
    setZoomed(false);
    setDirection(amount);
    setIndex(current => (current + amount + screens.length) % screens.length);
  }
  function keyboard(event: KeyboardEvent<HTMLElement>) {
    if (!canMove || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    }
  }
  function beginSwipe(event: PointerEvent<HTMLDivElement>) {
    if (!canMove || zoomed || !event.isPrimary || event.button !== 0) return;
    origin.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
  }
  function trackSwipe(event: PointerEvent<HTMLDivElement>) {
    if (!origin.current || origin.current.pointerId !== event.pointerId) return;
    const dx = event.clientX - origin.current.x;
    const dy = event.clientY - origin.current.y;
    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.5) event.currentTarget.setPointerCapture(event.pointerId);
  }
  function endSwipe(event: PointerEvent<HTMLDivElement>) {
    const start = origin.current;
    origin.current = null;
    if (!start || start.pointerId !== event.pointerId) return;
    const dx = event.clientX - start.x;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(event.clientY - start.y) * 1.5) {
      lastSwipe.current = Date.now();
      move(dx < 0 ? 1 : -1);
    }
  }
  function expand() {
    if (Date.now() - lastSwipe.current > 350) onExpand?.(index);
  }

  const image = screen && <img key={screen.image} src={screen.image} alt={screen.imageAlt} className="project-gallery-image" draggable={false} loading={variant === "dialog" ? "eager" : "lazy"} decoding="async"/>;
  return <section className={`project-gallery project-gallery-${variant} mode-${mode} ${zoomed ? "is-zoomed" : ""}`} aria-label={`${project.name} images`} onKeyDown={keyboard}>
    {hasSystem && <div className="project-gallery-perspective" role="group" aria-label="Project perspective">{(["surface", "system"] as const).map(value => <button key={value} type="button" aria-pressed={mode === value} aria-controls={`${id}-frame`} onClick={() => { setMode(value); setZoomed(false); }}>{value}</button>)}</div>}
    <div id={`${id}-frame`} className="project-gallery-frame" data-direction={direction > 0 ? "next" : "previous"} onPointerDown={beginSwipe} onPointerMove={trackSwipe} onPointerUp={endSwipe} onPointerCancel={() => { origin.current = null; }}>
      {mode === "system" ? <div className="calm-perspective mode-system"><Architecture project={project} expanded/></div> : screen ? onExpand ? <button type="button" className="project-gallery-expand" aria-label={`Expand ${project.name}: ${screen.caption}`} aria-haspopup="dialog" onClick={expand} data-cursor="View">{image}</button> : image : <div className="project-gallery-illustration">{project.preview === "fyp" ? <FypProjectPreview/> : <ProductPreview variant={project.visual}/>}</div>}
    </div>
    {mode === "surface" && screen && <div className="project-gallery-footer">
      <span className="project-gallery-caption">{screen.caption}</span>
      <div className="project-gallery-controls">
        {variant === "dialog" && <button className="project-gallery-zoom" type="button" aria-pressed={zoomed} onClick={() => setZoomed(value => !value)}>{zoomed ? "Fit image" : "Zoom"}</button>}
        {screens.length > 1 && <><button type="button" className="project-gallery-arrow" aria-label="Previous project image" aria-controls={`${id}-frame`} onClick={() => move(-1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6"/></svg></button><span className="project-gallery-counter" role="status" aria-atomic="true"><span className="gallery-sr-only">Image </span>{String(index + 1).padStart(2, "0")}<span aria-hidden="true"> / </span><span className="gallery-sr-only"> of </span>{String(screens.length).padStart(2, "0")}</span><button type="button" className="project-gallery-arrow" aria-label="Next project image" aria-controls={`${id}-frame`} onClick={() => move(1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button></>}
      </div>
    </div>}
  </section>;
}
