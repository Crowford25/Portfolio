import type { Project } from "@/data/content";

export type ProjectScreen = { image: string; imageAlt: string; caption: string };

export function getProjectScreens(project: Project): ProjectScreen[] {
  const screens: ProjectScreen[] = [];
  const add = (image?: string, imageAlt?: string, caption?: string) => {
    if (!image || screens.some(screen => screen.image === image)) return;
    screens.push({ image, imageAlt: imageAlt || project.name, caption: caption || project.name });
  };
  project.story?.forEach(step => add(step.image, step.imageAlt, step.imageCaption || step.title));
  add(project.image, project.imageAlt, project.imageCaption);
  project.gallery?.forEach(screen => add(screen.image, screen.imageAlt, screen.caption));
  return screens;
}
