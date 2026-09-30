import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/data/content";
import { SurfaceSystem } from "@/components/surface-system";
import { ProductPreview } from "@/components/product-preview";
import { FypProjectPreview } from "@/components/fyp-project-preview";
import { ProjectScreenshot } from "@/components/project-screenshot";
import { Arrow } from "@/components/icons";
import { Contact } from "@/components/contact";

export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  return { title: project?.name ?? "Project not found", description: project?.summary };
}
export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return <main id="main" className="calm-case">
    <section className="case-header wrap">
      <Link className="text-link" href="/#work">← Selected work</Link>
      <h1>{project.name}</h1><p className="case-intro">{project.homepageSummary || project.summary}</p>
      <p className="case-role">{project.role}</p>
      {project.isExample && <p className="case-sample-label">Illustrative study</p>}
      {(project.liveUrl || project.sourceUrl) && <div className="case-links">{project.liveUrl && <a className="primary-button" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Visit project <Arrow diagonal/></a>}{project.sourceUrl && <a className="text-link" href={project.sourceUrl} target="_blank" rel="noopener noreferrer">View source <Arrow diagonal/></a>}</div>}
    </section>
    <div className={`case-visual visual-${project.visual}`}>{project.visual === "booking" ? <SurfaceSystem project={project}/> : project.image ? <ProjectScreenshot image={project.image} alt={project.imageAlt || project.name}/> : project.preview === "fyp" ? <FypProjectPreview/> : <ProductPreview variant={project.visual}/>}</div>
    {!!project.gallery?.length && <details className="case-gallery-disclosure wrap"><summary>More screens <span aria-hidden="true">+</span></summary><div className="case-gallery">{project.gallery.map(screen=><a className="case-gallery-screen" key={screen.image} href={screen.image} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size: ${screen.imageAlt}`}><ProjectScreenshot image={screen.image} alt={screen.imageAlt} caption={screen.caption} lazy/></a>)}</div></details>}
    <section className="case-body wrap" aria-label="Project details">
      <div className="case-chapter"><h2>The problem.</h2><p>{project.problem}</p></div>
      {project.contribution && <div className="case-chapter"><h2>My contribution.</h2><p>{project.contribution}</p></div>}
      {!!project.engineering.length && <details className="case-disclosure"><summary>Key decisions <span aria-hidden="true">+</span></summary><div className="case-decision-list">{project.engineering.map(item=><div key={item.title}><h3>{item.title}</h3><p>{item.body}</p></div>)}</div></details>}
      <details className="case-disclosure"><summary>Implementation <span aria-hidden="true">+</span></summary><div className="case-implementation"><p>{project.solution}</p>{!!project.features.length && <ul>{project.features.map(item => <li key={item}>{item}</li>)}</ul>}<p className="case-stack">{project.stack.join(" / ")}</p></div></details>
      {(project.outcome || project.learning) && <div className="case-chapter"><h2>The outcome.</h2><div>{project.outcome && <p>{project.outcome}</p>}{project.learning && <p className="case-reflection">{project.learning}</p>}</div></div>}
      {projects.length > 1 && <Link className="next-project" href={`/work/${next.slug}`}><span className="eyebrow">NEXT PROJECT</span><h2>{next.name}<Arrow diagonal/></h2></Link>}
    </section>
    <Contact/>
  </main>;
}
