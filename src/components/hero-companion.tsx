"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { CompanionArtwork } from "./companion-artwork";
import { profile } from "@/data/content";
import { assistantConfig, answerPortfolioQuestion, type PortfolioAnswer } from "@/lib/portfolio-assistant";

type Message = PortfolioAnswer & { id: number; role: "assistant" | "visitor" };

const expressions = [
  { name: "Curious", key: "curious" },
  { name: "Happy", key: "happy" },
  { name: "Focused", key: "focused" },
] as const;

export function HeroCompanion() {
  const id = useId().replace(/:/g, "");
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [face, setFace] = useState(0);
  const [draft, setDraft] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "assistant", text: assistantConfig.greeting },
  ]);
  const home = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const traveler = useRef<HTMLDivElement>(null);
  const dock = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const history = useRef<HTMLDivElement>(null);
  const chat = useRef<HTMLElement>(null);
  const dockedRef = useRef(false);
  const sequence = useRef(1);
  const chatOpen = open && isDocked;
  const expression = chatOpen ? (draft ? "focused" : "happy") : expressions[face].key;
  const nextFace = expressions[(face + 1) % expressions.length];

  useEffect(() => { setPortalTarget(document.body); }, []);

  useEffect(() => {
    if (!portalTarget) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const viewport = window.visualViewport;
    let frame = 0;
    function update() {
      frame = 0;
      if (!home.current || !traveler.current || !dock.current || !layer.current) return;
      const visibleHeight = viewport?.height ?? window.innerHeight;
      const keyboardOffset = Math.max(0, window.innerHeight - visibleHeight - (viewport?.offsetTop ?? 0));
      layer.current.style.setProperty("--companion-viewport-height", `${visibleHeight}px`);
      layer.current.style.setProperty("--companion-keyboard-offset", `${keyboardOffset}px`);
      layer.current.dataset.compact = String(visibleHeight < 600);
      const origin = home.current.getBoundingClientRect();
      const destination = dock.current.getBoundingClientRect();
      const start = Math.max(0, origin.top + window.scrollY - 110);
      const distance = Math.min(300, window.innerHeight * .45);
      const raw = Math.max(0, Math.min(1, (window.scrollY - start) / Math.max(1, distance)));
      const progress = reduced.matches ? Number(raw >= .5) : raw * raw * (3 - 2 * raw);
      const width = origin.width + (destination.width - origin.width) * progress;
      const x = origin.left + (destination.left - origin.left) * progress;
      const y = origin.top + (destination.top - origin.top) * progress;
      traveler.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${width / 336})`;
      traveler.current.dataset.ready = "true";
      const atDock = progress === 1;
      layer.current.dataset.docked = String(atDock);
      if (dockedRef.current !== atDock) {
        dockedRef.current = atDock;
        setIsDocked(atDock);
        if (!atDock) {
          setOpen(false);
          if (chat.current?.contains(document.activeElement)) launcher.current?.focus({ preventScroll: true });
        }
      }
    }
    function queue() { if (!frame) frame = requestAnimationFrame(update); }
    update();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    viewport?.addEventListener("resize", queue);
    viewport?.addEventListener("scroll", queue);
    reduced.addEventListener("change", queue);
    const observer = new ResizeObserver(queue);
    if (home.current) observer.observe(home.current);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      viewport?.removeEventListener("resize", queue);
      viewport?.removeEventListener("scroll", queue);
      reduced.removeEventListener("change", queue);
    };
  }, [portalTarget]);

  useEffect(() => {
    if (!chatOpen) return;
    const frame = requestAnimationFrame(() => input.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [chatOpen]);

  useEffect(() => {
    if (chatOpen && history.current) history.current.scrollTop = history.current.scrollHeight;
  }, [messages, chatOpen]);

  useEffect(() => {
    if (!portalTarget) return;
    const eligible = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let x = 0;
    let y = 0;
    function reset() {
      cancelAnimationFrame(frame);
      frame = 0;
      traveler.current?.style.setProperty("--companion-look-x", "0px");
      traveler.current?.style.setProperty("--companion-look-y", "0px");
    }
    function move(event: PointerEvent) {
      if (!eligible.matches || event.pointerType !== "mouse") { reset(); return; }
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!traveler.current) return;
        const rect = traveler.current.getBoundingClientRect();
        const horizontal = Math.max(-1, Math.min(1, (x - rect.left - rect.width / 2) / Math.max(rect.width, 1)));
        const vertical = Math.max(-1, Math.min(1, (y - rect.top - rect.height * .35) / Math.max(rect.height, 1)));
        traveler.current.style.setProperty("--companion-look-x", `${horizontal * 7}px`);
        traveler.current.style.setProperty("--companion-look-y", `${vertical * 5}px`);
      });
    }
    function leave(event: PointerEvent) { if (!event.relatedTarget) reset(); }
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", reset);
    document.addEventListener("pointerout", leave);
    eligible.addEventListener("change", reset);
    return () => {
      reset();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", reset);
      document.removeEventListener("pointerout", leave);
      eligible.removeEventListener("change", reset);
    };
  }, [portalTarget]);

  function closeChat() {
    setOpen(false);
    requestAnimationFrame(() => launcher.current?.focus({ preventScroll: true }));
  }

  function activateRobot() {
    if (dockedRef.current) {
      if (open) closeChat();
      else setOpen(true);
    } else {
      setFace(previous => (previous + 1) % expressions.length);
    }
  }

  function ask(question: string) {
    if (!dockedRef.current) return;
    const text = question.trim().slice(0, 500);
    if (!text) return;
    const answer = answerPortfolioQuestion(text);
    const visitor: Message = { id: sequence.current++, role: "visitor", text };
    const reply: Message = { ...answer, id: sequence.current++, role: "assistant" };
    setMessages(previous => [...previous.slice(-22), visitor, reply]);
    setAnnouncement(answer.text);
    setDraft("");
    input.current?.focus({ preventScroll: true });
  }

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); ask(draft); }

  return <div className="hero-companion">
    <div ref={home} className="companion-home-slot" aria-hidden="true">
      {!portalTarget && <div data-expression={expressions[face].key}><CompanionArtwork id={`${id}-static`}/></div>}
    </div>
    <div className="companion-introduction"><div className="companion-expression-picker"><button type="button" onClick={() => setFace(previous => (previous + 1) % expressions.length)} aria-label={`Change expression. Current: ${expressions[face].name}. Next: ${nextFace.name}.`}>Change expression <span aria-hidden="true">↻</span></button></div></div>

    {portalTarget && createPortal(<div ref={layer} className="companion-layer" data-open={chatOpen} data-cursor="native">
      <div ref={dock} className="companion-dock-target" aria-hidden="true"/>
      <div ref={traveler} className="companion-traveler" data-expression={expression}>
        <button ref={launcher} className="companion-robot-button" type="button" aria-label={isDocked ? (chatOpen ? "Close portfolio chat" : "Ask the portfolio companion") : `Companion expression: ${expressions[face].name}. Change to ${nextFace.name}.`} aria-haspopup={isDocked ? "dialog" : undefined} aria-expanded={isDocked ? chatOpen : undefined} aria-controls={isDocked ? `${id}-chat` : undefined} onClick={activateRobot}>
          <CompanionArtwork id={id}/>
        </button>
      </div>
      <span className="companion-dock-label" aria-hidden="true">{chatOpen ? "Here to help" : "Ask me"}</span>

      <section ref={chat} id={`${id}-chat`} className="companion-chat" hidden={!chatOpen} role="dialog" aria-labelledby={`${id}-chat-title`} aria-describedby={`${id}-chat-description`} onKeyDown={event => {
        if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); closeChat(); }
      }}>
        <header className="companion-chat-header">
          <div><span className="companion-chat-kicker">A QUICK INTRODUCTION</span><h2 id={`${id}-chat-title`}>{assistantConfig.name}</h2></div>
          <button className="companion-close" type="button" aria-label="Close portfolio chat" onClick={closeChat}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
          </button>
        </header>
        <p className="companion-chat-description" id={`${id}-chat-description`}>Answers from {profile.shortName}’s saved portfolio.</p>
        <div ref={history} className="companion-chat-history" tabIndex={0} aria-label="Conversation">
          <ol>
            {messages.map(message => <li key={message.id} className={`companion-message companion-message-${message.role}`}>
              <span className="companion-speaker">{message.role === "assistant" ? "Companion" : "You"}</span>
              <p>{message.text}</p>
              {!!message.links?.length && <div className="companion-answer-links">{message.links.map(link => <a key={`${link.label}-${link.href}`} href={link.href} target={/^https?:\/\//i.test(link.href) ? "_blank" : undefined} rel={/^https?:\/\//i.test(link.href) ? "noopener noreferrer" : undefined} onClick={() => { if (link.href.startsWith("/") || link.href.startsWith("#")) setOpen(false); }}>{link.label}<span aria-hidden="true">↗</span></a>)}</div>}
            </li>)}
          </ol>
        </div>
        <div className="companion-questions" aria-label="Suggested questions">
          {assistantConfig.suggestedQuestions.map(question => <button key={question} type="button" onClick={() => ask(question)}>{question}</button>)}
        </div>
        <form className="companion-chat-form" onSubmit={submit}>
          <label htmlFor={`${id}-question`}>Your question</label>
          <div className="companion-input-row"><input ref={input} id={`${id}-question`} value={draft} onChange={event => setDraft(event.target.value)} maxLength={500} placeholder="Ask about work or studies…" autoComplete="off" enterKeyHint="send"/><button type="submit" disabled={!draft.trim()} aria-label="Send question"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"/></svg></button></div>
          <div className="companion-chat-footnote"><span>Saved answers · No live AI</span><button type="button" onClick={() => {
            setMessages([{ id: sequence.current++, role: "assistant", text: assistantConfig.greeting }]);
            setAnnouncement("Conversation cleared.");
            setDraft("");
            input.current?.focus({ preventScroll: true });
          }}>Clear chat</button></div>
        </form>
        <p className="companion-sr-only" role="status">{announcement}</p>
      </section>
    </div>, portalTarget)}
  </div>;
}
