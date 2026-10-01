"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { landingProjects, type LandingProject } from "@/data/landing-projects";
import { withBasePath } from "@/lib/site-path";

const orbitProjects = [...landingProjects, ...landingProjects];
const step = (Math.PI * 2) / orbitProjects.length;
const modulo = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor;

function Arrow({ reverse = false }: { reverse?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: reverse ? "rotate(180deg)" : undefined }}><path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function LandingShowcase() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const wake = useRef<() => void>(() => {});
  const motion = useRef({ phase: 0, target: null as number | null, width: 1000, inView: false, hover: false, focus: false, paused: false, reduced: false, modal: false, dragging: false });
  const drag = useRef({ id: -1, x: 0, y: 0, lastX: 0, lastTime: 0, velocity: 0, moved: false, suppressUntil: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [selected, setSelected] = useState<LandingProject | null>(null);
  const [closing, setClosing] = useState(false);
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [frameReady, setFrameReady] = useState(false);
  const [phonePreview, setPhonePreview] = useState(false);
  const [previewHeight, setPreviewHeight] = useState(0);
  const previewFrame = useRef<HTMLIFrameElement>(null);
  const previewScroll = useRef<HTMLDivElement>(null);
  const synchronizePreview = useRef<() => void>(() => {});
  const dialog = useRef<HTMLDialogElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const backdropDown = useRef(false);
  const activeProject = landingProjects[activeIndex];
  const isOpen = selected !== null;

  useEffect(() => {
    const host = stage.current;
    if (!host || !section.current) return;
    const state = motion.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastStamp = 0;
    let lastActive = -1;
    let disposed = false;

    function paint() {
      const mobile = state.width < 650;
      const radius = Math.min(state.width * (mobile ? 0.65 : 0.40), 530);
      cards.current.forEach((card, index) => {
        if (!card) return;
        const angle = index * step - state.phase;
        const depth = Math.cos(angle);
        const side = Math.sin(angle);
        const visible = depth > (mobile ? 0.12 : -0.2);
        const scale = (mobile ? 0.73 : 0.70) + (mobile ? 0.27 : 0.30) * ((depth + 1) / 2);
        card.style.transform = `translate(-50%, -50%) translate3d(${side * radius}px, ${depth * (mobile ? 12 : 28)}px, ${depth * (mobile ? 10 : 45)}px) rotateY(${-side * (mobile ? 9 : 24)}deg) rotateZ(${side * (mobile ? 1 : 3)}deg) scale(${scale})`;
        card.style.opacity = visible ? String(0.36 + Math.max(0, depth) * 0.64) : "0";
        card.style.visibility = visible ? "visible" : "hidden";
        card.style.zIndex = String(Math.round((depth + 1) * 100));
        card.setAttribute("aria-hidden", String(!visible));
      });
      const active = modulo(Math.round(state.phase / step), landingProjects.length);
      if (lastActive !== active) { lastActive = active; setActiveIndex(active); }
    }

    function animate(stamp: number) {
      frame = 0;
      const dt = Math.min(lastStamp ? stamp - lastStamp : 16, 40);
      lastStamp = stamp;
      if (document.hidden || !state.inView) return;
      const canPlay = !state.paused && !state.reduced && !state.hover && !state.focus && !state.modal && !state.dragging;
      if (state.target !== null && !state.dragging) {
        const distance = state.target - state.phase;
        state.phase = state.reduced ? state.target : state.phase + distance * (1 - Math.exp(-dt / 115));
        if (Math.abs(state.target - state.phase) < 0.0004) { state.phase = state.target; state.target = null; }
      } else if (canPlay) state.phase += dt * 0.000055;
      paint();
      if (canPlay || state.target !== null) frame = requestAnimationFrame(animate);
    }

    function requestFrame() {
      if (!disposed && !frame) { lastStamp = 0; frame = requestAnimationFrame(animate); }
    }
    wake.current = requestFrame;
    const onPreference = () => {
      state.reduced = preference.matches;
      setReduced(preference.matches);
      if (state.reduced) state.target = Math.round(state.phase / step) * step;
      requestFrame();
    };
    onPreference();
    preference.addEventListener("change", onPreference);
    const resize = new ResizeObserver(([entry]) => { state.width = entry.contentRect.width; paint(); requestFrame(); });
    resize.observe(host);
    const intersection = new IntersectionObserver(([entry]) => { state.inView = entry.isIntersecting; requestFrame(); }, { threshold: 0.08 });
    intersection.observe(section.current);
    document.addEventListener("visibilitychange", requestFrame);
    paint();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      wake.current = () => {};
      resize.disconnect(); intersection.disconnect();
      preference.removeEventListener("change", onPreference);
      document.removeEventListener("visibilitychange", requestFrame);
    };
  }, []);

  useEffect(() => {
    motion.current.modal = isOpen;
    wake.current();
    if (!isOpen || !dialog.current) return;
    const element = dialog.current;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (!element.open) element.showModal();
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      returnFocus.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  useEffect(() => {
    if (!isOpen) return;
    const phone = window.matchMedia("(max-width: 650px)");
    const scroll = previewScroll.current;
    let geometryFrame = 0;
    const visibleArea = () => {
      const frame = previewFrame.current;
      if (!scroll || !frame) return { visibleTop: 0, visibleHeight: window.innerHeight };
      return {
        visibleTop: Math.max(0, scroll.getBoundingClientRect().top - frame.getBoundingClientRect().top),
        visibleHeight: scroll.clientHeight,
      };
    };
    const synchronize = () => {
      setPhonePreview(phone.matches);
      if (!phone.matches) setPreviewHeight(0);
      previewFrame.current?.contentWindow?.postMessage({
        type: "portfolio:preview-mode",
        expanded: phone.matches,
        viewportHeight: window.innerHeight,
        ...visibleArea(),
      }, "*");
    };
    const trackVisibleArea = () => {
      if (!phone.matches || geometryFrame) return;
      geometryFrame = requestAnimationFrame(() => {
        geometryFrame = 0;
        previewFrame.current?.contentWindow?.postMessage({ type: "portfolio:preview-viewport", ...visibleArea() }, "*");
      });
    };
    const receive = (event: MessageEvent) => {
      if (!phone.matches || event.source !== previewFrame.current?.contentWindow) return;
      const message = event.data;
      if (!message || typeof message !== "object") return;
      if (message.type === "portfolio:preview-size" && typeof message.height === "number" && Number.isFinite(message.height) && message.height > 0 && message.height <= 60000) {
        setPreviewHeight(Math.ceil(message.height));
      }
      if (message.type === "portfolio:preview-anchor" && typeof message.top === "number" && Number.isFinite(message.top) && message.top >= 0 && message.top <= 60000) {
        const scroll = previewScroll.current;
        const frame = previewFrame.current;
        if (!scroll || !frame) return;
        const top = frame.getBoundingClientRect().top - scroll.getBoundingClientRect().top + scroll.scrollTop + message.top - 12;
        scroll.scrollTo({ top, behavior: motion.current.reduced ? "instant" : "smooth" });
      }
    };
    synchronizePreview.current = synchronize;
    synchronize();
    window.addEventListener("message", receive);
    window.addEventListener("resize", synchronize, { passive: true });
    scroll?.addEventListener("scroll", trackVisibleArea, { passive: true });
    phone.addEventListener("change", synchronize);
    return () => {
      synchronizePreview.current = () => {};
      window.removeEventListener("message", receive);
      window.removeEventListener("resize", synchronize);
      scroll?.removeEventListener("scroll", trackVisibleArea);
      cancelAnimationFrame(geometryFrame);
      phone.removeEventListener("change", synchronize);
    };
  }, [isOpen, selected?.slug]);

  const closePreview = useCallback(() => {
    if (closeTimer.current) return;
    const finish = () => { closeTimer.current = null; dialog.current?.close(); setSelected(null); setClosing(false); };
    if (motion.current.reduced) { finish(); return; }
    setClosing(true);
    closeTimer.current = setTimeout(finish, 200);
  }, []);

  function openPreview(project: LandingProject) {
    if (performance.now() < drag.current.suppressUntil) return;
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setClosing(false); setFrameReady(false); setPreviewHeight(0);
    setPhonePreview(window.matchMedia("(max-width: 650px)").matches);
    setViewport("desktop"); setSelected(project);
  }

  function move(direction: number) {
    const state = motion.current;
    state.target = (Math.round((state.target ?? state.phase) / step) + direction) * step;
    wake.current();
  }

  function selectProject(index: number) {
    const state = motion.current;
    const current = Math.round(state.phase / step);
    let distance = modulo(index - current, landingProjects.length);
    if (distance > landingProjects.length / 2) distance -= landingProjects.length;
    state.target = (current + distance) * step;
    wake.current();
  }

  function pointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    drag.current = { ...drag.current, id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, lastTime: event.timeStamp, velocity: 0, moved: false };
  }

  function pointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const gesture = drag.current;
    if (gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (!gesture.moved) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { gesture.id = -1; return; }
      if (Math.abs(dx) < 9) return;
      gesture.moved = true; motion.current.dragging = true; motion.current.target = null;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const sensitivity = Math.max(180, motion.current.width * 0.38);
    const shift = -(event.clientX - gesture.lastX) / sensitivity;
    gesture.velocity = shift / Math.max(8, event.timeStamp - gesture.lastTime);
    motion.current.phase += shift;
    gesture.lastX = event.clientX; gesture.lastTime = event.timeStamp;
    wake.current();
  }

  function pointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    const gesture = drag.current;
    if (gesture.id !== event.pointerId) return;
    gesture.id = -1;
    if (!gesture.moved) return;
    gesture.suppressUntil = performance.now() + 400;
    motion.current.dragging = false;
    const momentum = motion.current.reduced ? 0 : Math.max(-step * 1.5, Math.min(step * 1.5, gesture.velocity * 160));
    motion.current.target = Math.round((motion.current.phase + momentum) / step) * step;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    wake.current();
  }

  return (
    <section className="landing-showcase" ref={section} aria-labelledby="landing-showcase-title" id="landing-pages">
      <div className="landing-showcase-heading">
        <p className="eyebrow">LANDING PAGES</p>
        <h2 id="landing-showcase-title">Different worlds.<br /><em>One approach.</em></h2>
        <p>A collection of landing page projects, each with its own visual language. Choose a cover to explore the page.</p>
      </div>
      <div className="landing-orbit-shell" role="region" aria-roledescription="carousel" aria-label="Landing page projects"
        onFocusCapture={() => { motion.current.focus = true; }}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) { motion.current.focus = false; wake.current(); } }}
        onKeyDown={(event) => { if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return; if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); } }}>
        <div className="landing-orbit" ref={stage} data-cursor="native"
          onPointerEnter={(event) => { if (event.pointerType === "mouse") motion.current.hover = true; }}
          onPointerLeave={() => { motion.current.hover = false; wake.current(); }}
          onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd}
          onClickCapture={(event) => { if (performance.now() < drag.current.suppressUntil) { event.preventDefault(); event.stopPropagation(); } }}>
          <div className="landing-orbit-line landing-orbit-line-one" aria-hidden="true" />
          <div className="landing-orbit-line landing-orbit-line-two" aria-hidden="true" />
          {orbitProjects.map((project, index) => (
            <button type="button" className="landing-orbit-card" key={`${project.slug}-${index}`} ref={(element) => { cards.current[index] = element; }}
              tabIndex={-1} onClick={() => openPreview(project)} aria-haspopup="dialog" aria-label={`Explore ${project.name}`}>
              <img src={withBasePath(project.cover)} alt={project.coverAlt} loading="lazy" decoding="async" draggable={false} />
              <span className="landing-orbit-card-label"><span>{project.category}</span><strong>{project.name}</strong></span>
              <span className="landing-orbit-card-open" aria-hidden="true"><Arrow /></span>
            </button>
          ))}
        </div>
        <div className="landing-orbit-footer">
          <div className="landing-orbit-controls">
            <button type="button" onClick={() => move(-1)} aria-label="Previous landing page"><Arrow reverse /></button>
            <button type="button" onClick={() => move(1)} aria-label="Next landing page"><Arrow /></button>
            {!reduced && <button type="button" className="landing-orbit-pause" aria-pressed={paused} onClick={() => { const next = !paused; setPaused(next); motion.current.paused = next; wake.current(); }}>{paused ? "Play orbit" : "Pause orbit"}</button>}
          </div>
          <div className="landing-orbit-current"><span>{activeProject.category}</span><button type="button" onClick={() => openPreview(activeProject)} aria-haspopup="dialog">Explore {activeProject.name}<Arrow /></button></div>
          <p className="landing-orbit-hint">Drag to turn. Select to explore.</p>
        </div>
        <div className="landing-project-picker" aria-label="Choose a landing page">{landingProjects.map((project, index) => <button type="button" key={project.slug} onClick={() => selectProject(index)} aria-pressed={activeIndex === index}>{project.name}</button>)}</div>
      </div>

      <dialog className={`landing-preview-dialog${closing ? " is-closing" : ""}`} ref={dialog} aria-labelledby="landing-preview-title" aria-describedby="landing-preview-note" data-cursor="native"
        onCancel={(event) => { event.preventDefault(); closePreview(); }}
        onClose={() => { if (!dialog.current?.open) { setSelected(null); setClosing(false); } }}
        onPointerDown={(event) => { backdropDown.current = event.target === event.currentTarget; }}
        onClick={(event) => { if (backdropDown.current && event.target === event.currentTarget) closePreview(); backdropDown.current = false; }}>
        {selected && <>
          <header className="landing-preview-toolbar">
            <div><span>{selected.category}</span><h2 id="landing-preview-title">{selected.name}</h2></div>
            <div className="landing-preview-viewport" aria-label="Preview width"><button type="button" aria-pressed={viewport === "desktop"} onClick={() => setViewport("desktop")}>Desktop</button><button type="button" aria-pressed={viewport === "mobile"} onClick={() => setViewport("mobile")}>Mobile</button></div>
            <button type="button" className="landing-preview-close" onClick={closePreview} autoFocus aria-label={`Close ${selected.name} preview`}>Close <span aria-hidden="true">×</span></button>
          </header>
          <div className="landing-preview-scroll" ref={previewScroll}>
            <div className={`landing-preview-canvas is-${viewport}`}>
              {!frameReady && <p className="landing-preview-loading" role="status">Opening the page…</p>}
              <iframe ref={previewFrame} key={selected.slug} src={withBasePath(selected.previewUrl)} title={`${selected.name} — interactive landing page preview`} sandbox="allow-scripts" referrerPolicy="no-referrer"
                data-expanded={phonePreview && previewHeight > 0 ? "true" : undefined}
                style={phonePreview && previewHeight > 0 ? { height: previewHeight } : undefined}
                onLoad={() => { setFrameReady(true); synchronizePreview.current(); }} />
            </div>
            <div className="landing-preview-details">
              <div className="landing-preview-summary"><p>{selected.summary}</p><p id="landing-preview-note" className="landing-preview-note">{selected.previewNote}</p>{selected.liveUrl && <a href={selected.liveUrl} target="_blank" rel="noreferrer noopener">Visit live project <Arrow /></a>}</div>
              <div className="landing-preview-facts"><ul>{selected.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul><div className="landing-preview-stack" aria-label="Built with">{selected.stack.map((item) => <span key={item}>{item}</span>)}</div></div>
            </div>
          </div>
        </>}
      </dialog>
    </section>
  );
}
