import { ProfessionalLinks } from "./professional-links";
import { profile, whatsappUrl } from "@/data/content";
import { Arrow } from "./icons";

export function Contact() {
  return <section id="contact" className="contact-section refined-contact calm-contact" aria-labelledby="contact-title">
    <span className="eyebrow">CONTACT</span>
    <div className="contact-grid"><div><h2 id="contact-title">Let’s build<br /><em>something useful.</em></h2><p>{profile.availability}.</p></div><div className="contact-actions"><div className="contact-main-links"><a className="primary-button" href={`mailto:${profile.email}`}>Email me <Arrow diagonal /></a><a className="text-link" href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp <Arrow diagonal /></a></div><ProfessionalLinks/></div></div>
  </section>;
}
