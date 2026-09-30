"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useSwipe } from "./surface-system";
import { makingStages as stages } from "@/data/making-study";

function StudyAtmosphere() {
  return <div className="study-atmosphere" aria-hidden="true">
    <div className="study-background bg-idea"><svg viewBox="0 0 700 400"><path d="M80 100 Q220 35 310 110 T570 110 M130 250 Q260 200 350 260 T650 210"/><ellipse cx="330" cy="175" rx="190" ry="100"/></svg></div>
    <div className="study-background bg-interface"><svg viewBox="0 0 700 400"><path d="M30 70H670M30 140H670M160 20V380M540 20V380M30 340H670"/><rect x="200" y="180" width="130" height="110"/><rect x="370" y="180" width="130" height="110"/></svg></div>
    <div className="study-background bg-system"><svg viewBox="0 0 700 400"><path d="M70 70L350 170L620 50M350 170L100 330M350 170L590 320M70 70L100 330L590 320L620 50"/>{[[70,70],[350,170],[620,50],[100,330],[590,320]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="5"/>)}</svg></div>
    <div className="study-background bg-product"><span/><span/><span/></div>
  </div>;
}

function StudyComposition() {
  return <div className="study-composition" aria-hidden="true">
    <div className="study-thought"><p>Make room for<br/><em>something simpler.</em></p></div>
    <div className="study-product">
      <div className="study-product-nav"><strong>STAY /</strong><span>↗</span></div>
      <div className="study-product-main">
        <h3>Somewhere quieter.</h3>
        <div className="study-product-image"><div className="study-window"/><div className="study-landscape"/></div>
        <div className="study-product-fields"><span>Arrival <b>24 Oct</b></span><span>Departure <b>27 Oct</b></span><span>Guests <b>02</b></span></div>
        <div className="study-product-action">Find a room <span>→</span></div>
      </div>
    </div>
    <div className="study-system-labels">{["Interface", "Application", "Logic", "Database"].map(label => <span key={label}><strong>{label}</strong></span>)}</div>
  </div>;
}

export function Experiment() {
  const [stage, setStage] = useState(0);
  const root = useRef<HTMLElement>(null);
  const background = useRef<HTMLDivElement>(null);
  const swipe = useSwipe(
    () => setStage(value => Math.min(stages.length - 1, value + 1)),
    () => setStage(value => Math.max(0, value - 1)),
  );

  function chooseWithKeyboard(event: KeyboardEvent<HTMLDivElement>) {
    const button = event.target instanceof HTMLButtonElement ? event.target : null;
    if (!button) return;
    const index = Number(button.dataset.stage);
    const destination = event.key === "ArrowRight" ? Math.min(stages.length - 1, index + 1)
      : event.key === "ArrowLeft" ? Math.max(0, index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? stages.length - 1 : null;
    if (destination === null) return;
    event.preventDefault();
    setStage(destination);
    event.currentTarget.querySelector<HTMLButtonElement>(`[data-stage="${destination}"]`)?.focus();
  }

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = matchMedia("(min-width: 761px) and (pointer: fine)");
    let frame = 0;
    let visible = false;
    function update() {
      frame = 0;
      if (!root.current || !background.current) return;
      if (reduced.matches || !visible) { background.current.style.transform = "none"; return; }
      const rect = root.current.getBoundingClientRect();
      const progress = (innerHeight / 2 - rect.top - rect.height / 2) / innerHeight;
      const offset = Math.max(-1, Math.min(1, progress)) * (desktop.matches ? 16 : 3);
      background.current.style.transform = `translate3d(0,${offset}px,0)`;
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); });
    if (root.current) observer.observe(root.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    reduced.addEventListener("change", schedule);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, []);

  return <section ref={root} id="study" className={`making-study calm-study wrap study-stage-${stage}`} aria-labelledby="study-title">
    <div className="making-study-caption">
      <span className="eyebrow">A small study in making</span>
      <h2 id="study-title">Move an idea <em>a little further.</em></h2>
    </div>
    <div className="study-workbench">
      <div className="study-stage-nav" role="group" aria-label="Choose a stage in this interactive sketch" aria-describedby="study-instructions" onKeyDown={chooseWithKeyboard}>
        {stages.map((item, index) => <button key={item.name} type="button" data-stage={index} aria-pressed={stage === index} aria-controls="study-scene" onClick={() => setStage(index)}>{item.name}</button>)}
      </div>
      <div id="study-scene" className="study-scene" {...swipe} data-cursor="Drag" role="img" aria-label={`Booking concept sketch: ${stages[stage].name}`} aria-describedby="study-description">
        <div ref={background} className="study-parallax"><StudyAtmosphere/></div>
        <StudyComposition/>
      </div>
      <div className="calm-study-footer">
        <p id="study-description">{stages[stage].detail}</p>
        <span id="study-instructions">Tap a stage or swipe.<span className="study-key-hint"> Use ← → on the stage buttons.</span></span>
      </div>
    </div>
  </section>;
}