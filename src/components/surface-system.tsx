"use client";

import { useId, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { Project } from "@/data/content";
import { ProductPreview } from "./product-preview";
import { HotelProjectPreview } from "./hotel-project-preview";
import { ProjectScreenshot } from "./project-screenshot";

export function useSwipe(next: () => void, previous: () => void) {
  const origin = useRef<{x:number;y:number}|null>(null);
  const [drag, setDrag] = useState(0);
  const finish = (event: PointerEvent<HTMLElement>) => {
    if (origin.current) {
      const dx = event.clientX - origin.current.x;
      const dy = event.clientY - origin.current.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) dx < 0 ? next() : previous();
    }
    origin.current = null;
    setDrag(0);
  };
  return {
    style: {"--drag": `${Math.max(-12, Math.min(12, drag * .07))}px`} as CSSProperties,
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      if ((event.target as HTMLElement).closest("button,a,input,summary")) return;
      origin.current = {x:event.clientX,y:event.clientY};
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      if (origin.current && Math.abs(event.clientX-origin.current.x)>Math.abs(event.clientY-origin.current.y)) setDrag(event.clientX-origin.current.x);
    },
    onPointerUp: finish,
    onPointerCancel: () => {origin.current=null;setDrag(0);},
  };
}

const defaultLayers = [
  {title:"Interface",detail:"React / Next.js"},
  {title:"Application",detail:"Rules / permissions"},
  {title:"API",detail:"Validation / integrations"},
  {title:"Database",detail:"A shared source of truth"},
];

export function Architecture({ project, expanded = false }: {project?:Project; expanded?:boolean}) {
  return <div className={`architecture ${expanded ? "architecture-expanded" : ""}`}>
    <div className="architecture-heading"><p>Under the surface.</p></div>
    <ol className="architecture-layers">{(project?.architecture || defaultLayers).map((layer,i)=><li key={layer.title} style={{"--layer":i} as CSSProperties}><span className="architecture-index">0{i+1}</span><strong>{layer.title}</strong><small>{layer.detail}</small><span className="architecture-joint" aria-hidden="true" /></li>)}</ol>

  </div>;
}

function BookingDetail({ stage }: {stage:number}) {
  const calendar = stage % 3 === 2;
  return <div className="booking-window story-screen">
    <div className="browser-bar"><span className="browser-dots" aria-hidden="true"><i/><i/><i/></span><span>one workflow, from arrival to checkout</span><span>↗</span></div>
    <div className="story-screen-masthead"><span className="stay-logo">stāy.</span><span className="micro">{calendar ? "AVAILABILITY" : "RESERVATIONS"}</span><span className="avatar">A</span></div>
    <div className="story-screen-body"><div className="story-screen-title"><div><span className="micro">{calendar ? "THE WHOLE PICTURE" : "EVERY DETAIL, TOGETHER"}</span><p>{calendar ? "Room for what’s next." : "A welcome, well organised."}</p></div><span className="story-date">SEP 2026</span></div>
      {calendar ? <div className="availability-grid"><div className="availability-dates"><span>PROPERTY</span>{[21,22,23,24,25].map(day=><span key={day}>{day}</span>)}</div>{["Garden suite","Studio loft","Courtyard room","Terrace suite"].map((room,i)=><div className="availability-room" key={room}><strong>{room}</strong><div className="availability-track"><span style={{left:`${[0,20,40,0][i]}%`,width:`${[56,75,40,36][i]}%`}}>{["Emma L.","James T.","Alex W.","Jamie C."][i]}</span></div></div>)}<div className="calendar-key"><span><i/> Reserved</span><span><i/> Available</span></div></div> : <><div className="reservation-summary"><span>All reservations <b>12</b></span><span>Arriving today <b>04</b></span><span>Needs attention <b>01</b></span></div><div className="reservation-table"><div className="reservation-labels"><span>GUEST / PROPERTY</span><span>DATES</span><span>STATUS</span></div>{["Emma Lewis","James Taylor","Alex Wong"].map((name,i)=><div className="reservation-row" key={name}><div><span className="guest-initial">{name.split(' ').map(n=>n[0]).join('')}</span><div><strong>{name}</strong><small>{["Garden suite","Studio loft","Courtyard room"][i]}</small></div></div><span>23 — {25+i} Sep</span><span className={i===2 ? "pending-status" : "confirmed"}>{i===2 ? "Pending" : "Confirmed"}</span></div>)}</div><div className="reservation-footnote"><span className="micro">ONE RESERVATION. ONE SOURCE OF TRUTH.</span><span>Details →</span></div></>}
    </div>
  </div>;
}

export function SurfaceSystem({project,stage=0,onNext,onPrevious,hero=false}:{project?:Project;stage?:number;onNext?:()=>void;onPrevious?:()=>void;hero?:boolean}) {
  const [mode,setMode]=useState<"surface"|"system">("surface");
  const id=useId();
  const swipe=useSwipe(()=>onNext && mode==="surface" ? onNext() : setMode("system"),()=>onPrevious && mode==="surface" ? onPrevious() : setMode("surface"));
  const screenshot=project?.story?.[stage]?.image || project?.image;
  const alt=project?.story?.[stage]?.imageAlt || project?.imageAlt || project?.name;
  const imageCaption=project?.story?.[stage]?.imageCaption || project?.imageCaption || (project?.isExample ? "Project image" : "Actual project screen");
  return <div className={`surface-system calm-perspective ${hero ? "hero-study" : "flagship-study"} mode-${mode} ${screenshot ? "has-project-screenshot" : ""}`}>
    <div className="perspective-toolbar"><div className="perspective-switch" role="group" aria-label={hero ? "Hero perspective" : "Project perspective"}>{(["surface","system"] as const).map(value=><button key={value} aria-pressed={mode===value} aria-controls={id} onClick={()=>setMode(value)}>{value}</button>)}</div></div>
    <div id={id} className="perspective-stage" {...swipe} data-cursor={onNext && mode === "surface" ? "Drag" : undefined}>
      <div className="surface-layer" inert={mode!=="surface"} aria-hidden={mode!=="surface"}><div className="surface-screen" key={stage}>{screenshot ? <ProjectScreenshot image={screenshot} alt={alt || "Project interface"} /> : project?.preview==="hotel" ? <HotelProjectPreview stage={stage}/> : !project || project.visual==="booking" ? stage%3===0 ? <ProductPreview /> : <BookingDetail stage={stage} /> : <ProductPreview variant={project.visual} />}</div></div>
      <div className="system-layer" inert={mode!=="system"} aria-hidden={mode!=="system"}><Architecture project={project} expanded={!hero}/></div>
    </div>
    {mode === "surface" && <p className="perspective-caption">{screenshot ? imageCaption : project?.isExample !== false ? "Illustrative interface" : project?.name}</p>}
  </div>;
}
