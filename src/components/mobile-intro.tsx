"use client";

import { useEffect, useId, useRef } from "react";
import { profile } from "@/data/content";

const SESSION_KEY = "cc-portfolio-mobile-entered";
let enteredThisVisit = false;

/** A first-visit touch introduction. The portfolio itself always scrolls natively. */
export function MobileIntro() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLButtonElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const hintId = useId();
  const nameParts = profile.name.trim().split(/\s+/);
  const firstLine = nameParts[0];
  const secondLine = nameParts.slice(1).join(" ");

  useEffect(() => {
    const dialog = dialogRef.current;
    const sheet = sheetRef.current;
    const enterButton = enterRef.current;
    const skipButton = skipRef.current;
    const phone = window.matchMedia("(max-width: 680px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Only consider the initial viewport, never interrupt a desktop visit on resize.
    if (!dialog || !sheet || !enterButton || !skipButton || !phone.matches || enteredThisVisit) return;
    try { if (window.sessionStorage.getItem(SESSION_KEY) === "1") return; } catch { /* The page-local fallback still prevents repeats. */ }
    if (typeof dialog.showModal !== "function") return;

    const html = document.documentElement;
    const body = document.body;
    const htmlOverflow = html.style.overflow;
    const bodyOverflow = body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    let active = true;
    let exiting = false;
    let unlocked = false;
    let frame = 0;
    let offset = 0;
    let height = window.innerHeight;
    let pointer: number | null = null;
    let startY = 0;
    let startOffset = 0;
    let pendingOffset = 0;

    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      html.style.overflow = htmlOverflow;
      body.style.overflow = bodyOverflow;
    };

    const paint = (next: number) => {
      offset = next;
      sheet.style.transform = `translate3d(0, ${-next}px, 0)`;
      sheet.style.setProperty("--intro-pull", String(Math.min(1, next / Math.max(1, height))));
    };

    const focusPage = () => {
      const main = document.getElementById("main");
      const target = main?.querySelector<HTMLElement>("h1") || main || (previousFocus !== body ? previousFocus : null);
      if (!target?.isConnected) return;
      const originalTabIndex = target.getAttribute("tabindex");
      if (originalTabIndex === null) {
        target.setAttribute("tabindex", "-1");
        target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
      }
      target.focus({ preventScroll: true });
    };

    const finish = () => {
      if (!active) return;
      active = false;
      exiting = false;
      cancelAnimationFrame(frame);
      frame = 0;
      pointer = null;
      enteredThisVisit = true;
      try { window.sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* Storage is optional. */ }
      if (dialog.open) dialog.close();
      unlock();
      focusPage();
    };

    const animateTo = (destination: number, duration: number, done?: () => void) => {
      cancelAnimationFrame(frame);
      const origin = offset;
      const started = performance.now();
      const tick = (now: number) => {
        if (!active) return;
        const elapsed = Math.min(1, (now - started) / duration);
        const eased = 1 - Math.pow(1 - elapsed, 4);
        paint(origin + (destination - origin) * eased);
        if (elapsed < 1) frame = requestAnimationFrame(tick);
        else { frame = 0; done?.(); }
      };
      frame = requestAnimationFrame(tick);
    };

    const enter = (immediate = false) => {
      if (!active || exiting) return;
      exiting = true;
      pointer = null;
      sheet.dataset.interacted = "true";
      sheet.dataset.dragging = "false";
      if (immediate || motion.matches) { finish(); return; }
      animateTo(height + 2, 460, finish);
    };

    const settle = () => {
      sheet.dataset.dragging = "false";
      if (motion.matches) paint(0);
      else animateTo(0, 380);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!active || exiting || motion.matches || !event.isPrimary || event.button !== 0) return;
      if (event.target instanceof Element && event.target.closest("button, a, input, select, textarea")) return;
      cancelAnimationFrame(frame);
      frame = 0;
      pointer = event.pointerId;
      startY = event.clientY;
      startOffset = offset;
      pendingOffset = offset;
      sheet.dataset.interacted = "true";
      sheet.dataset.dragging = "true";
      sheet.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (pointer !== event.pointerId || exiting || !active) return;
      pendingOffset = Math.max(0, Math.min(height, startOffset + startY - event.clientY));
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; paint(pendingOffset); });
    };

    const onPointerUp = (event: PointerEvent) => {
      if (pointer !== event.pointerId) return;
      pointer = null;
      cancelAnimationFrame(frame);
      frame = 0;
      paint(pendingOffset);
      if (sheet.hasPointerCapture(event.pointerId)) sheet.releasePointerCapture(event.pointerId);
      if (offset >= Math.min(160, height * 0.23)) enter();
      else settle();
    };

    const onPointerCancel = (event: PointerEvent) => {
      if (pointer !== event.pointerId) return;
      pointer = null;
      cancelAnimationFrame(frame);
      frame = 0;
      settle();
    };

    const onCancel = (event: Event) => { event.preventDefault(); enter(true); };
    const onEnter = () => enter();
    const onSkip = () => enter(true);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || event.defaultPrevented || event.target instanceof HTMLButtonElement) return;
      event.preventDefault();
      enter();
    };
    const onViewportChange = () => {
      if (!active) return;
      if (!phone.matches) { finish(); return; }
      height = sheet.getBoundingClientRect().height;
      if (exiting) { finish(); return; }
      pointer = null;
      cancelAnimationFrame(frame);
      frame = 0;
      paint(0);
      sheet.dataset.dragging = "false";
    };
    const onMotionChange = () => {
      if (!active) return;
      if (exiting) { finish(); return; }
      pointer = null;
      cancelAnimationFrame(frame);
      frame = 0;
      paint(0);
      sheet.dataset.dragging = "false";
    };

    paint(0);
    sheet.dataset.interacted = "false";
    sheet.dataset.dragging = "false";
    dialog.showModal();
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    height = sheet.getBoundingClientRect().height;
    enterButton.focus({ preventScroll: true });
    sheet.addEventListener("pointerdown", onPointerDown);
    sheet.addEventListener("pointermove", onPointerMove);
    sheet.addEventListener("pointerup", onPointerUp);
    sheet.addEventListener("pointercancel", onPointerCancel);
    sheet.addEventListener("lostpointercapture", onPointerCancel);
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("keydown", onKeyDown);
    enterButton.addEventListener("click", onEnter);
    skipButton.addEventListener("click", onSkip);
    phone.addEventListener("change", onViewportChange);
    motion.addEventListener("change", onMotionChange);
    window.addEventListener("resize", onViewportChange, { passive: true });

    return () => {
      active = false;
      cancelAnimationFrame(frame);
      sheet.removeEventListener("pointerdown", onPointerDown);
      sheet.removeEventListener("pointermove", onPointerMove);
      sheet.removeEventListener("pointerup", onPointerUp);
      sheet.removeEventListener("pointercancel", onPointerCancel);
      sheet.removeEventListener("lostpointercapture", onPointerCancel);
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("keydown", onKeyDown);
      enterButton.removeEventListener("click", onEnter);
      skipButton.removeEventListener("click", onSkip);
      phone.removeEventListener("change", onViewportChange);
      motion.removeEventListener("change", onMotionChange);
      window.removeEventListener("resize", onViewportChange);
      if (dialog.open) dialog.close();
      unlock();
    };
  }, []);

  return <dialog ref={dialogRef} className="mobile-intro-dialog" aria-labelledby={titleId} aria-describedby={hintId} data-cursor="native">
    <div ref={sheetRef} className="mobile-intro-sheet">
      <header className="mobile-intro-masthead">
        <span className="mobile-intro-monogram" aria-hidden="true">cc</span>
        <button ref={skipRef} type="button" className="mobile-intro-skip">Skip</button>
      </header>
      <div className="mobile-intro-center">
        <div className="mobile-intro-identity">
          <span className="mobile-intro-rule" aria-hidden="true" />
          <h2 id={titleId} className="mobile-intro-name" aria-label={profile.name}>
            <span className="mobile-intro-mask"><span className="mobile-intro-first" aria-hidden="true">{firstLine}</span></span>
            {secondLine && <span className="mobile-intro-mask"><span className="mobile-intro-last" aria-hidden="true">{secondLine}</span></span>}
          </h2>
        </div>
      </div>
      <footer className="mobile-intro-entry">
        <p id={hintId} className="mobile-intro-hint"><span className="mobile-intro-swipe">Swipe to enter</span><span className="mobile-intro-tap">Tap to enter</span></p>
        <button ref={enterRef} type="button" className="mobile-intro-enter">Enter site</button>
      </footer>
    </div>
  </dialog>;
}