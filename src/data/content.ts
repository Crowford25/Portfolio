import content from "../../content/portfolio.json";
export type Project = {
  slug: string; title: string; name: string; category: string; year: string;
  isExample: boolean; visual: string; image: string; imageAlt: string;
  preview?: "hotel" | "fyp"; aliases?: string[];
  homepageSummary?: string;
  imageCaption?: string;
  gallery?: { image: string; imageAlt: string; caption?: string }[];
  summary: string; role: string; stack: string[]; problem: string; solution: string;
  features: string[]; engineering: { title: string; body: string }[];
  learning: string; liveUrl: string; sourceUrl: string;
  contribution?: string; outcome?: string;
  built?: string;
  story?: { title: string; description: string; image?: string; imageAlt?: string; imageCaption?: string }[];
  architecture?: { title: string; detail: string }[];
  integrations?: string[];
};
export type Career = {
  stage: string; title: string; field?: string; period: string;
  organisation: string; organisationShort?: string; verb: string;
  description: string; tools?: string[]; current: boolean; isPlaceholder: boolean;
};
type Profile = {
  name: string; shortName: string; role: string; location: string; email: string;
  whatsapp: string; availability: string; intro: string; about: string; approach: string;
  resumeUrl: string; githubUrl: string; linkedinUrl: string;
  interests?: string[];
};
type Portfolio = {
  career: Career[];
  profile: Profile; projects: Project[];
  services: {title:string; description:string; items:string[]}[];
  capabilities: {title:string; items:string[]}[];
  process: {title:string; description:string}[];
};
export const portfolio: Portfolio = content;
export const profile = portfolio.profile;
export const projects = portfolio.projects;
export const whatsappUrl = `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(`Hi ${profile.shortName}, I’d like to talk about a project or opportunity.`)}`;
