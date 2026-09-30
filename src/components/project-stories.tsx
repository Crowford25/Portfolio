"use client";

import type { Project } from "@/data/content";
import { Arrow } from "./icons";
import { ProjectGallery } from "./project-gallery";
import { useProjectDialog } from "./project-dialog";

export function ProjectLinks({project}:{project:Project}) {
  const { openProject } = useProjectDialog();
  return <div className="project-actions"><button type="button" className="text-link" aria-haspopup="dialog" data-project-trigger={project.slug} onClick={() => openProject(project.slug)}>{project.isExample ? "View study" : "View project"}<Arrow diagonal/></button></div>;
}

function ProjectHeading({project}:{project:Project}) {
  return <div className="project-heading"><div>{project.isExample && <span className="example-inline">ILLUSTRATIVE STUDY</span>}<h3>{project.name}</h3><p>{project.homepageSummary || project.summary}</p></div><ProjectLinks project={project}/></div>;
}

export function FlagshipProject({project}:{project:Project}) {
  const { openProject } = useProjectDialog();
  return <article className="flagship-project calm-project" id={`project-${project.slug}`}>
    <ProjectHeading project={project}/>
    <div className="project-canvas"><ProjectGallery project={project} onExpand={index => openProject(project.slug, index)}/></div>
  </article>;
}

export function SecondaryProject({project,index}:{project:Project;index:number}) {
  const { openProject } = useProjectDialog();
  return <article className={`calm-project secondary-project ${index%2 ? "project-offset" : ""}`} id={`project-${project.slug}`}>
    <ProjectHeading project={project}/>
    <ProjectGallery project={project} onExpand={image => openProject(project.slug, image)}/>
  </article>;
}
