"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { portfolio } from "@/data/content";
import { ProcessArtifact } from "./process-artifact";
import { useReadingStage } from "./use-reading-stage";

export function Process() {
  const root = useRef<HTMLElement>(null);
  const hold = useRef(0);
  const [active, setActive] = useState(0);
  const steps = portfolio.process;
  useReadingStage(root, ".process-mobile-step", setActive);
  useEffect(() => {
    const desktop = matchMedia("(min-width: 761px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let visible = false;
    function update() {
      frame = 0;
      if (!desktop.matches || !visible || !root.current || Date.now() < hold.current) return;
      const rect = root.current.getBoundingClientRect();
      // Hold the complete panel on arrival; Ship is in the final 18% of travel.
      const travel = rect.height - innerHeight + 100;
      const progress = Math.max(0, Math.min(1, (100 - rect.top) / travel));
      const index = progress < .18 ? 0 : progress < .4 ? 1 : progress < .62 ? 2 : progress < .82 ? 3 : 4;
      setActive(Math.min(index, steps.length - 1));
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); });
    if (root.current) observer.observe(root.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [steps.length]);
  function select(index: number) { hold.current = Date.now() + 2000; setActive(index); }
  return <section ref={root} id="process" className="making-process wrap" data-active-stage={active}>
    <div className="process-sticky">
      <div className="making-intro"><div><span className="eyebrow">HOW I WORK</span><h2>How I turn an idea<br/>into something real.</h2></div><p>A clear direction.<br/>Built step by step.</p></div>
      <div className="process-desktop">
        <ol className="making-line" style={{ "--process-progress": `${active / Math.max(1, steps.length - 1) * 100}%` } as CSSProperties}>{steps.map((step, i) => <li key={step.title} className={i === active ? "is-active" : ""}><button onClick={() => select(i)} aria-pressed={i === active} aria-controls="process-explanation"><span className="making-dot" aria-hidden="true"/><span>0{i + 1}</span><strong>{step.title}</strong></button></li>)}</ol>
        <div className="process-shared"><div id="process-explanation" className="process-explanation" role="region" aria-labelledby="process-stage-title"><span className="micro">0{active + 1} / THE PROCESS</span><h3 id="process-stage-title">{steps[active].title}.</h3><p>{steps[active].description}</p><span className="process-reading-hint">Scroll to follow, or choose a step.</span></div><ProcessArtifact stage={active}/></div>
      </div>
      <ol className="process-mobile">{steps.map((step, i) => <li className={`process-mobile-step ${i === active ? "is-active" : ""} ${i < active ? "is-past" : ""}`} key={step.title}><span className="mobile-process-number">0{i + 1}</span><h3>{step.title}</h3><p>{step.description}</p><ProcessArtifact stage={i}/></li>)}</ol>
      <div className="process-handoff"><span aria-hidden="true"/><span>THE PROCESS, IN MINIATURE.</span><span aria-hidden="true">↓</span></div>
    </div>
  </section>;
}
