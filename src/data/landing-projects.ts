import entries from "../../content/landing-projects.json";

export type LandingProject = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  cover: string;
  coverAlt: string;
  previewUrl: string;
  liveUrl: string;
  stack: string[];
  highlights: string[];
  previewNote: string;
};

export const landingProjects: LandingProject[] = entries;
