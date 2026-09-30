import savedConfig from "../../content/assistant.json";
import { portfolio, profile, projects, whatsappUrl, type Career } from "@/data/content";

export type PortfolioAnswer = {
  text: string;
  links?: { label: string; href: string }[];
};

type AssistantConfig = {
  name: string;
  greeting: string;
  suggestedQuestions: string[];
  fallback: string;
  faqs: { keywords: string[]; answer: string; links?: PortfolioAnswer["links"] }[];
};

// Edit the greeting, suggestions and optional keyword FAQs in content/assistant.json.
// Personal facts stay in content/portfolio.json; FAQs take precedence when matched.
export const assistantConfig: AssistantConfig = savedConfig;

const normalise = (value: string) => value
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/['’]/g, "")
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const containsPhrase = (question: string, phrase: string) => {
  const keyword = normalise(phrase);
  return keyword.length > 0 && ` ${question} `.includes(` ${keyword} `);
};

const firstPersonToThird = (text: string) => text
  .replace(/\bI[’']m\b/g, "He is")
  .replace(/\bI am\b/g, "He is")
  .replace(/\bI work\b/g, "He works")
  .replace(/\bI worked\b/g, "He worked")
  .replace(/\bI built\b/g, "He built")
  .replace(/\bI like\b/g, "He likes")
  .replace(/\bMy\b/g, "His")
  .replace(/\bmy\b/g, "his");

const roles = portfolio.career.filter((item) => !item.isPlaceholder);
const currentRole = roles.find((item) => item.current);
const internships = roles.filter((item) => /internship/i.test(item.stage));
const thetaInternship = internships.find((item) => item.organisation === currentRole?.organisation);
const previousInternship = internships.find((item) => item !== thetaInternship);
const qualifications = roles.filter((item) => /^(diploma|degree)$/i.test(item.stage));

const contactLinks: NonNullable<PortfolioAnswer["links"]> = [
  { label: "Email", href: `mailto:${profile.email}` },
  { label: "WhatsApp", href: whatsappUrl },
];
const socialLinks: NonNullable<PortfolioAnswer["links"]> = [
  ...(profile.linkedinUrl ? [{ label: "LinkedIn", href: profile.linkedinUrl }] : []),
  ...(profile.githubUrl ? [{ label: "GitHub", href: profile.githubUrl }] : []),
];

const roleSummary = (item: Career) =>
  `${item.title} at ${item.organisation} (${item.period}). ${firstPersonToThird(item.description)}`;

const educationSummary = (item: Career) =>
  `${item.title}${item.field ? ` · ${item.field}` : ""} — ${item.organisationShort || item.organisation} (${item.period}).`;

const experienceSummary = () => [
  ...(currentRole ? [roleSummary(currentRole)] : []),
  ...(thetaInternship ? [`Earlier at the same company: ${roleSummary(thetaInternship)}`] : []),
  ...(previousInternship ? [roleSummary(previousInternship)] : []),
].join("\n\n");

function response(text: string, links?: PortfolioAnswer["links"]): PortfolioAnswer {
  // Keep chat replies compact even if a future editable FAQ is unusually long.
  const clean = text.trim();
  const trimmed = clean.length > 1400 ? `${clean.slice(0, 1397).trimEnd()}…` : clean;
  const safeLinks = links?.filter(({ href }) => /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(href));
  return { text: trimmed, ...(safeLinks?.length ? { links: safeLinks } : {}) };
}

export function answerPortfolioQuestion(question: string): PortfolioAnswer {
  const query = normalise(question.slice(0, 1000));
  const has = (...phrases: string[]) => phrases.some((phrase) => containsPhrase(query, phrase));
  const fallback = () => response(assistantConfig.fallback, contactLinks);

  if (!query) return response(assistantConfig.greeting);

  const customAnswer = assistantConfig.faqs.find((faq) => faq.keywords.some((keyword) => containsPhrase(query, keyword)));
  if (customAnswer) return response(customAnswer.answer, customAnswer.links);

  if (has("who are you", "what are you", "are you ai", "are you a robot", "chatbot", "how do you work", "what can you answer", "what can you do")) {
    return response("I’m the portfolio companion. I answer simple questions using the saved portfolio information. I don’t use a live AI service or browse the web.");
  }

  if (/^(hi|hello|hey|good morning|good afternoon|good evening|help)$/.test(query)) {
    return response(assistantConfig.greeting);
  }
  if (/^(thanks|thank you|thank you very much|cheers|great thanks)$/.test(query)) {
    return response("You’re welcome! You can ask about his work, studies, skills or how to get in touch.");
  }

  // Unknown commercial or personal details should not be inferred from broad work keywords.
  if (has("salary", "rates", "rate", "pricing", "price", "budget", "notice period", "visa", "citizenship", "age", "birthday", "married", "address", "gpa", "cgpa", "grade", "grades", "certification", "certifications")) {
    return fallback();
  }

  if (has("resume", "cv", "curriculum vitae")) {
    return profile.resumeUrl
      ? response(`You can view ${profile.name}’s résumé here.`, [{ label: "View résumé", href: profile.resumeUrl }])
      : response("An updated résumé is pending and isn’t available to download yet. Contact him directly to request the latest version.", contactLinks);
  }

  if (has("whatsapp", "phone", "number", "call him", "call you")) {
    return response(`You can reach ${profile.shortName} on WhatsApp at +${profile.whatsapp}.`, [contactLinks[1]]);
  }
  if (has("email", "gmail", "e mail")) {
    return response(`Email ${profile.shortName} at ${profile.email}.`, [contactLinks[0]]);
  }
  if (has("linkedin")) {
    return response(`Find ${profile.name}’s professional profile on LinkedIn.`, socialLinks.filter((link) => link.label === "LinkedIn"));
  }
  if (has("github", "source code", "repositories", "repos")) {
    return response(`Visit ${profile.shortName}’s GitHub profile for his public repositories.`, socialLinks.filter((link) => link.label === "GitHub"));
  }
  if (has("contact", "get in touch", "reach him", "reach you", "talk to him", "talk to you", "message him", "message you")) {
    return response(`Email and WhatsApp are the easiest ways to contact ${profile.shortName}: ${profile.email} or +${profile.whatsapp}.`, contactLinks);
  }
  if (has("social", "profiles", "professional profile")) {
    return response("His LinkedIn and GitHub profiles are linked below.", socialLinks);
  }

  if (has("available", "availability", "freelance", "freelancing", "hire", "hiring", "open to work", "open for work", "opportunities", "looking for work", "looking for a job")) {
    return response(`${profile.name}: ${profile.availability}. Contact him to discuss the role or project and confirm timing.`, contactLinks);
  }
  if (has("location", "based", "live", "living", "country", "where is he", "where are you")) {
    return response(`${profile.name} is based in ${profile.location}.`, contactLinks);
  }

  if (has("viewpoint", "view point", "diploma internship", "business intelligence", "sql reporting")) {
    return previousInternship ? response(roleSummary(previousInternship)) : fallback();
  }
  if (has("india", "mortgage", "degree internship") || (has("theta") && has("intern", "internship"))) {
    return thetaInternship ? response(roleSummary(thetaInternship)) : fallback();
  }
  if (has("intern", "internship", "internships")) {
    return internships.length ? response([...internships].reverse().map(roleSummary).join("\n\n")) : fallback();
  }

  if (has("diploma")) {
    const diploma = qualifications.find((item) => /diploma/i.test(item.stage));
    return diploma ? response(`${educationSummary(diploma)}\n\n${diploma.organisation}. ${diploma.description}`) : fallback();
  }
  if (has("degree", "bachelor", "bachelors")) {
    const degree = qualifications.find((item) => /degree/i.test(item.stage));
    return degree ? response(`${educationSummary(degree)}\n\n${degree.organisation}. ${degree.description}`) : fallback();
  }
  if (has("study", "studies", "studied", "education", "university", "college", "qualification", "qualifications", "graduate", "graduated", "graduation", "tar umt", "computer science")) {
    return qualifications.length
      ? response(`${qualifications.map(educationSummary).join("\n\n")}\n\n${qualifications[0].organisation}.`)
      : fallback();
  }

  const selectedProject = projects.find((project) =>
    [project.name, project.slug.replace(/-/g, " "), ...(project.aliases || [])].some((name) => containsPhrase(query, name)));
  if (selectedProject) {
    if (has("contribution", "contributions", "role", "who built", "who made", "team", "solo", "client module", "client part")) {
      const detail = selectedProject.contribution || selectedProject.role;
      if (detail) return response(`${selectedProject.name}: ${firstPersonToThird(detail)}`, [{ label: "View project", href: `/work/${selectedProject.slug}` }]);
    }
    if (has("stack", "technologies", "technology", "tools", "framework", "frameworks", "built with", "programming languages")) {
      return response(`${selectedProject.name} uses ${selectedProject.stack.join(", ")}.`, [{ label: "View project", href: `/work/${selectedProject.slug}` }]);
    }
    const status = selectedProject.isExample ? "This is an illustrative sample study, not a completed client project." : "This project is listed in the portfolio.";
    return response(`${selectedProject.name}: ${status}\n\n${firstPersonToThird(selectedProject.summary)}${selectedProject.isExample ? " Real contributions and outcomes have not been added yet." : ""}`, [
      { label: selectedProject.isExample ? "View study" : "View project", href: `/work/${selectedProject.slug}` },
    ]);
  }

  if (has("deployment", "deployments", "deploy", "jenkins", "websphere", "winscp", "vulnerability", "vulnerabilities", "security", "taiwan", "singapore", "zk")) {
    return currentRole ? response(roleSummary(currentRole)) : fallback();
  }
  if (has("theta", "current role", "current job", "current work", "currently", "what does he work on", "what do you work on", "what is he working on", "what are you working on", "responsibilities", "loan", "loans", "day to day")) {
    return currentRole ? response(roleSummary(currentRole)) : fallback();
  }

  if (has("project", "projects", "portfolio", "case study", "case studies", "samples", "built", "building", "examples")) {
    if (!projects.length) return response("Project details have not been added yet. Contact him to discuss his work.", contactLinks);
    const samples = projects.filter((project) => project.isExample);
    const realProjects = projects.filter((project) => !project.isExample);
    const parts = [
      ...(realProjects.length ? [`Portfolio projects: ${realProjects.map((project) => project.name).join(", ")}.`] : []),
      ...(samples.length ? [`The portfolio includes illustrative sample studies: ${samples.map((project) => project.name).join(", ")}. These samples are not presented as completed client work; real contributions and outcomes have not been added yet.`] : []),
    ];
    return response(parts.join("\n\n"), [{ label: "Browse projects", href: "/#work" }]);
  }

  if (has("skills", "skill", "technology", "technologies", "tech", "stack", "tools", "languages", "programming", "java", "angular", "sql")) {
    const confirmedTools = [...new Set(roles.flatMap((item) => item.tools || []))];
    return response(`His saved work experience includes ${confirmedTools.join(", ")}. His current role also includes application deployments and security vulnerability fixes.`);
  }

  if (has("experience", "career", "journey", "background", "work history", "worked", "employers", "companies")) {
    return experienceSummary() ? response(experienceSummary()) : fallback();
  }
  if (has("interests", "interested in", "enjoy")) {
    return profile.interests?.length
      ? response(`His listed interests are ${profile.interests.join(", ")}.`)
      : fallback();
  }
  if (has("who is", "who are", "about him", "about you", "about chee chun", "about wong", "introduce", "introduction", "what does he do", "what do you do", "his name", "your name", "software engineer")) {
    return response(`${profile.name} is a ${currentRole?.title || profile.role} based in ${profile.location}. ${firstPersonToThird(profile.intro)}`);
  }

  return fallback();
}
