"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { profile } from "@/data/content";
import { withBasePath } from "@/lib/site-path";

const links = [["Work", "work"], ["About", "about"], ["Career", "career"], ["Contact", "contact"]];
const mobileLinks = [
  { label: "Work", id: "work", detail: "Selected systems" },
  { label: "Landing pages", id: "landing-pages", detail: "Interface concepts" },
  { label: "About", id: "about", detail: "A little background" },
  { label: "Career", id: "career", detail: "The road so far" },
  { label: "Contact", id: "contact", detail: "Start a conversation" },
];

function MenuGlyph({ close = false }: { close?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {close
      ? <path d="m6 6 12 12M18 6 6 18" />
      : <path d="M3 8h18M9 16h12" />}
  </svg>;
}

function MenuArrow() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>;
}

function SecondaryLinks({ onNavigate }: { onNavigate?: () => void }) {
  return <>
    {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" onClick={onNavigate}>LinkedIn</a>}
    {profile.resumeUrl && <a href={withBasePath(profile.resumeUrl)} download="Wong-Chee-Chun-Resume.pdf" onClick={onNavigate}>Download résumé</a>}
  </>;
}

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [dark, setDark] = useState(false);
  const [activeId, setActiveId] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const releaseScrollLock = useRef<(() => void) | null>(null);
  const pathname = usePathname();

  const finishClose = useCallback((restoreFocus = true) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
    if (dialog.current?.open) dialog.current.close();
    releaseScrollLock.current?.();
    releaseScrollLock.current = null;
    setOpen(false);
    if (restoreFocus) trigger.current?.focus({ preventScroll: true });
  }, []);

  const closeImmediately = useCallback(() => finishClose(), [finishClose]);

  const closeMenu = useCallback(() => {
    setOpen(false);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishClose();
      return;
    }
    closeTimer.current = setTimeout(() => finishClose(), 220);
  }, [finishClose]);

  function openMenu() {
    const menu = dialog.current;
    if (!menu) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
    if (!menu.open) menu.showModal();
    if (!releaseScrollLock.current) {
      const bodyOverflow = document.body.style.overflow;
      const rootOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      releaseScrollLock.current = () => {
        document.body.style.overflow = bodyOverflow;
        document.documentElement.style.overflow = rootOverflow;
      };
    }
    setOpen(true);
  }

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) > 5) setCompact(y > 100 && y > last);
      if (y < 50) setCompact(false);
      last = y;
      const about = document.getElementById("about")?.getBoundingClientRect();
      setDark(!!about && about.top < 70 && about.bottom > 70);
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, [pathname]);

  useEffect(() => {
    const screen = matchMedia("(min-width: 681px)");
    const closeOnDesktop = () => { if (screen.matches) finishClose(false); };
    screen.addEventListener("change", closeOnDesktop);
    return () => screen.removeEventListener("change", closeOnDesktop);
  }, [finishClose]);

  useEffect(() => {
    finishClose(false);
    const updateHash = () => setActiveId(window.location.hash.slice(1));
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname, finishClose]);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    releaseScrollLock.current?.();
    releaseScrollLock.current = null;
    if (dialog.current?.open) dialog.current.close();
  }, []);

  return <>
    <header className={`header refined-header calm-header ${compact ? "is-compact" : ""} ${dark ? "over-dark" : ""}`}>
      <div className="header-inner">
        <Link href="/" className="wordmark" aria-label={`${profile.name} home`}>cc</Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          {links.map(([label, id]) => <Link className="direction-link" key={id} href={`/#${id}`}>{label}</Link>)}
        </nav>
        <div className="nav-professional"><SecondaryLinks/></div>
        <button ref={trigger} className="menu-toggle custom-menu-toggle" aria-expanded={open} aria-controls="mobile-menu" aria-haspopup="dialog" onClick={openMenu}>Menu <MenuGlyph /></button>
      </div>
    </header>
    <div className="header-reserve" aria-hidden="true"/>
    <dialog
      ref={dialog}
      id="mobile-menu"
      className="editorial-menu calm-menu custom-mobile-menu"
      data-state={open ? "open" : "closing"}
      aria-label="Navigation menu"
      onCancel={(event) => { event.preventDefault(); closeMenu(); }}
      onClose={() => {
        if (dialog.current?.open) return;
        releaseScrollLock.current?.();
        releaseScrollLock.current = null;
        setOpen(false);
      }}
      onClick={(event) => { if (event.target === event.currentTarget) closeMenu(); }}
    >
      <div className="custom-menu-sheet">
        <div className="menu-masthead custom-menu-masthead">
          <span className="wordmark" aria-hidden="true">cc</span>
          <button type="button" autoFocus onClick={closeMenu} aria-label="Close navigation menu">Close <MenuGlyph close /></button>
        </div>
        <div className="custom-menu-lead"><span>Explore</span><span>{profile.shortName}&apos;s portfolio</span></div>
        <nav className="custom-menu-links" aria-label="Mobile navigation">
          {mobileLinks.map(({ label, id, detail }) => <Link
            key={id}
            href={`/#${id}`}
            aria-current={activeId === id ? "location" : undefined}
            onClick={() => { setActiveId(id); closeImmediately(); }}
          >
            <span className="custom-menu-link-copy"><span className="custom-menu-link-label">{label}</span><span className="custom-menu-link-detail">{detail}</span></span>
            <MenuArrow />
          </Link>)}
        </nav>
        <div className="custom-menu-contact">
          <p className="custom-menu-availability"><i aria-hidden="true" />{profile.availability}</p>
          <p className="custom-menu-invitation">Let&apos;s make something useful.</p>
          <div className="custom-menu-primary">
            <a href={`mailto:${profile.email}`} onClick={closeImmediately}><span>Email me</span><MenuArrow /></a>
            <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" onClick={closeImmediately}><span>WhatsApp</span><MenuArrow /></a>
          </div>
          <div className="menu-professional custom-menu-secondary">
            <SecondaryLinks onNavigate={closeImmediately} />
            {profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" onClick={closeImmediately}>GitHub</a>}
          </div>
        </div>
      </div>
    </dialog>
  </>;
}
