"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { projects, type Project } from "@/data/content";
import { ProjectGallery } from "./project-gallery";
import { Arrow } from "./icons";
import { EdgeScrollIndicator } from "./edge-scroll-indicator";

type ProjectDialogContextValue = { openProject: (slug: string, initialImage?: number) => void };
const ProjectDialogContext = createContext<ProjectDialogContextValue | null>(null);

export function useProjectDialog() {
  const context = useContext(ProjectDialogContext);
  if (!context) throw new Error("Project controls must be inside ProjectDialogProvider.");
  return context;
}

export function ProjectDialogProvider({ children }: { children: ReactNode }) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const scrollArea = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const lastSlug = useRef("");
  const closeTimer = useRef<number | null>(null);
  const closing = useRef(false);
  const backdropPressed = useRef(false);
  const [project, setProject] = useState<Project | null>(null);
  const [initialImage, setInitialImage] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const isOpen = project !== null;

  const finishClose = useCallback(() => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
    closing.current = false;
    if (dialog.current?.open) dialog.current.close();
    setProject(null);
    setIsClosing(false);
  }, []);

  const closeProject = useCallback(() => {
    if (closing.current || !dialog.current?.open) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { finishClose(); return; }
    closing.current = true;
    setIsClosing(true);
    closeTimer.current = window.setTimeout(finishClose, 220);
  }, [finishClose]);

  const openProject = useCallback((slug: string, imageIndex = 0) => {
    const selected = projects.find(item => item.slug === slug);
    if (!selected) return;
    if (!dialog.current?.open) returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
    closing.current = false;
    lastSlug.current = slug;
    setIsClosing(false);
    setInitialImage(imageIndex);
    setProject(selected);
  }, []);

  useEffect(() => {
    if (!isOpen || !dialog.current) return;
    const html = document.documentElement;
    const body = document.body;
    const htmlOverflow = html.style.overflow;
    const bodyOverflow = body.style.overflow;
    if (!dialog.current.open) dialog.current.showModal();
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    closeButton.current?.focus({ preventScroll: true });
    return () => {
      html.style.overflow = htmlOverflow;
      body.style.overflow = bodyOverflow;
      const opener = returnFocus.current;
      if (opener?.isConnected && opener.getClientRects().length) opener.focus({ preventScroll: true });
      else document.querySelector<HTMLElement>(`[data-project-trigger="${CSS.escape(lastSlug.current)}"]`)?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  useEffect(() => { if (project && scrollArea.current) scrollArea.current.scrollTop = 0; }, [project]);
  useEffect(() => () => { if (closeTimer.current !== null) window.clearTimeout(closeTimer.current); }, []);

  // Saved project links in the companion and legacy case pages use the same dialog.
  useEffect(() => {
    const handleProjectLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const match = url.pathname.match(/^\/work\/([^/]+)\/?$/);
      if (!match) return;
      let slug: string;
      try { slug = decodeURIComponent(match[1]); } catch { return; }
      if (!projects.some(item => item.slug === slug)) return;
      event.preventDefault();
      openProject(slug);
    };
    document.addEventListener("click", handleProjectLink, true);
    return () => document.removeEventListener("click", handleProjectLink, true);
  }, [openProject]);

  return <ProjectDialogContext.Provider value={{ openProject }}>
    {children}
    <dialog ref={dialog} className="project-dialog" data-closing={isClosing} data-cursor="native" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} onCancel={event => { event.preventDefault(); closeProject(); }} onClose={() => { if (!dialog.current?.open) finishClose(); }} onPointerDown={event => { backdropPressed.current = event.target === event.currentTarget; }} onClick={event => { if (backdropPressed.current && event.target === event.currentTarget) closeProject(); backdropPressed.current = false; }}>
      <div className="project-dialog-toolbar"><span>Selected work</span><button ref={closeButton} type="button" onClick={closeProject} aria-label="Close project details">Close <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div>
      <div ref={scrollArea} className="project-dialog-scroll" tabIndex={0} aria-label="Project details">
        {project && <article className="project-dialog-content">
          <header className="project-dialog-heading"><h2 id={`${id}-title`}>{project.name}</h2><p id={`${id}-description`}>{project.homepageSummary || project.summary}</p><span className="project-dialog-role">{project.isExample ? "Illustrative study" : project.role}</span></header>
          <ProjectGallery key={`${project.slug}-${initialImage}`} project={project} initialIndex={initialImage} variant="dialog"/>
          <div className="project-dialog-story">
            <section className="project-dialog-chapter"><h3>The problem.</h3><p>{project.problem}</p></section>
            {project.contribution && <section className="project-dialog-chapter"><h3>My contribution.</h3><p>{project.contribution}</p></section>}
            {!!project.engineering.length && <details className="project-dialog-detail"><summary>Key decisions <span aria-hidden="true">+</span></summary><div className="project-dialog-decisions">{project.engineering.map(item => <section key={item.title}><h4>{item.title}</h4><p>{item.body}</p></section>)}</div></details>}
            <details className="project-dialog-detail"><summary>Implementation <span aria-hidden="true">+</span></summary><div className="project-dialog-implementation"><p>{project.solution}</p>{!!project.features.length && <ul>{project.features.map(item => <li key={item}>{item}</li>)}</ul>}<p className="project-dialog-stack">{project.stack.join(" / ")}</p></div></details>
            {(project.outcome || project.learning) && <section className="project-dialog-chapter"><h3>The outcome.</h3><div>{project.outcome && <p>{project.outcome}</p>}{project.learning && <p>{project.learning}</p>}</div></section>}
          </div>
          {(project.liveUrl || project.sourceUrl) && <div className="project-dialog-links">{project.liveUrl && <a className="text-link" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live project <Arrow diagonal/></a>}{project.sourceUrl && <a className="text-link" href={project.sourceUrl} target="_blank" rel="noopener noreferrer">Source code <Arrow diagonal/></a>}</div>}
        </article>}
      </div>
      <EdgeScrollIndicator scope="project"/>
    </dialog>
  </ProjectDialogContext.Provider>;
}
