"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { profile } from "@/data/content";
import { withBasePath } from "@/lib/site-path";

const links = [["Work", "work"], ["About", "about"], ["Career", "career"], ["Contact", "contact"]];

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
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

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
    const menu = dialog.current;
    if (!menu) return;
    if (open) {
      menu.showModal();
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = previous; menu.close(); };
    }
    menu.close();
  }, [open]);

  useEffect(() => {
    const screen = matchMedia("(min-width: 681px)");
    const closeOnDesktop = () => { if (screen.matches) setOpen(false); };
    screen.addEventListener("change", closeOnDesktop);
    return () => screen.removeEventListener("change", closeOnDesktop);
  }, []);

  function closeMenu() { setOpen(false); trigger.current?.focus(); }

  return <>
    <header className={`header refined-header calm-header ${compact ? "is-compact" : ""} ${dark ? "over-dark" : ""}`}>
      <div className="header-inner">
        <Link href="/" className="wordmark" aria-label={`${profile.name} home`}>cc</Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          {links.map(([label, id]) => <Link className="direction-link" key={id} href={`/#${id}`}>{label}</Link>)}
        </nav>
        <div className="nav-professional"><SecondaryLinks/></div>
        <button ref={trigger} className="menu-toggle" aria-expanded={open} aria-controls="mobile-menu" aria-haspopup="dialog" onClick={() => setOpen(true)}>Menu <span aria-hidden="true">+</span></button>
      </div>
    </header>
    <div className="header-reserve" aria-hidden="true"/>
    <dialog ref={dialog} id="mobile-menu" className="editorial-menu calm-menu" aria-label="Navigation menu" onCancel={() => setOpen(false)} onClose={() => setOpen(false)}>
      <div className="menu-masthead"><span className="wordmark" aria-hidden="true">cc</span><button onClick={closeMenu} aria-label="Close menu">Close <span aria-hidden="true">×</span></button></div>
      <nav aria-label="Mobile navigation">{links.map(([label,id]) => <Link key={id} href={`/#${id}`} onClick={closeMenu}>{label}</Link>)}</nav>
      <div className="menu-professional"><SecondaryLinks onNavigate={closeMenu}/></div>
    </dialog>
  </>;
}
