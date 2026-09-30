import { profile } from "@/data/content";

export function ResumeLink({ download = true }: { download?: boolean }) {
  if (!profile.resumeUrl) return <span className="profile-link-pending">Résumé pending</span>;
  return <a href={profile.resumeUrl} target={download ? undefined : "_blank"} rel={download ? undefined : "noopener noreferrer"} download={download ? "Wong-Chee-Chun-Resume.pdf" : undefined}>{download ? "Download résumé ↓" : "View résumé ↗"}</a>;
}

export function ProfessionalLinks({ placement = "contact" }: { placement?: "hero" | "career" | "contact" }) {
  return <div className={`professional-links professional-links-${placement}`}>
    {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}
    {placement === "contact" && profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
    <ResumeLink download/>
  </div>;
}
