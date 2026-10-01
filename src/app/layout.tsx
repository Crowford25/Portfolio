import { MobileIntro } from "@/components/mobile-intro";
import { EdgeScrollIndicator } from "@/components/edge-scroll-indicator";
import { CustomCursor } from "@/components/custom-cursor";
import { ProjectDialogProvider } from "@/components/project-dialog";
import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { profile } from "@/data/content";
import { withBasePath } from "@/lib/site-path";
import "@fontsource-variable/manrope";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "./globals.css";
import "./readability.css";
import "./refinements.css";
import "./story-screens.css";
import "./lower-story.css";
import "./content-polish.css";
import "./study-polish.css";
import "./hero-companion.css";
import "./hotel-project.css";
import "./fyp-project.css";
import "./project-screenshots.css";
import "./calm-career.css";
import "./calm-details.css";
import "./calm-portfolio.css";
import "./project-gallery.css";
import "./project-dialog.css";
import "./scrollbars.css";
import "./mobile-intro.css";
import "./landing-showcase.css";
import "./mobile-navigation.css";

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
const socialImageUrl = new URL(withBasePath("/og-image.png"), siteUrl).href;
const socialImage = { url: socialImageUrl, width: 1200, height: 630, alt: `${profile.name} — ${profile.role}` };

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: `${profile.name} — ${profile.role}`, template: `%s — ${profile.name}` },
  description: `${profile.name}. ${profile.intro} ${profile.availability}.`,
  openGraph: { title: `${profile.name} — From surface to system.`, description: profile.intro, type: "website", locale: "en_MY", url: siteUrl.href, images: [socialImage] },
  twitter: { card: "summary_large_image", images: [socialImage] },
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body><MobileIntro /><a className="skip-link" href="#main">Skip to content</a><Navigation /><CustomCursor /><EdgeScrollIndicator /><ProjectDialogProvider>{children}</ProjectDialogProvider><footer className="footer personal-footer calm-footer"><a className="wordmark" href={withBasePath("/")} aria-label={`${profile.name} home`}>cc</a><span className="footer-place">{profile.location} · © {new Date().getFullYear()}</span><a href="#main">Back to top ↑</a></footer></body></html>;
}
