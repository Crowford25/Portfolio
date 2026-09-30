import { CareerJourney } from "@/components/career-journey";
import { profile, projects } from "@/data/content";
import { Arrow } from "@/components/icons";
import { HeroCompanion } from "@/components/hero-companion";
import { FlagshipProject, SecondaryProject } from "@/components/project-stories";
import { Capabilities } from "@/components/capabilities";
import { Experiment } from "@/components/experiment";
import { Contact } from "@/components/contact";

export default function Home() {
  const work = projects.filter(project => !project.isExample);
  const studies = projects.filter(project => project.isExample);
  return <main id="main" className="refined-home calm-home">
    <section className="hero refined-hero wrap">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="personal-eyebrow"><strong>{profile.name}</strong></div>
          <h1>From surface<br />to <em>system.</em></h1>
          <p>{profile.intro}</p>
        </div>
        <div className="hero-visual hero-companion-shell"><HeroCompanion/></div>
        <div className="hero-actions"><div className="hero-cta-row"><a className="primary-button" href="#work">View work <Arrow /></a><a className="text-link" href="#contact">Let’s talk <Arrow diagonal /></a></div></div>
      </div>
    </section>

    <section id="work" className="work-section refined-work wrap" aria-labelledby="work-title">
      <div className="work-intro"><h2 id="work-title">Selected work.</h2></div>
      {work[0] && <FlagshipProject project={work[0]}/>}
      {work.slice(1).map((project,i)=><SecondaryProject key={project.slug} project={project} index={i+1}/>)}
      {!work.length && <p className="empty-work">New work is taking shape.</p>}
      {!!studies.length && <details className="project-sketchbook"><summary>Interface studies <span aria-hidden="true">+</span></summary><p className="sketchbook-note">A few illustrative experiments.</p>{studies.map((project,i)=><SecondaryProject key={project.slug} project={project} index={work.length+i}/>)}</details>}
    </section>

    <section id="about" className="about-section refined-about"><div className="wrap"><div className="section-top"><span className="eyebrow">ABOUT</span></div><div className="about-grid"><div className="about-side"><span className="about-monogram" aria-hidden="true">cc</span></div><div className="about-copy"><h2>Curious about<br /><em>the whole picture.</em></h2><p>{profile.approach}</p></div></div></div></section>
    <Capabilities/>
    <CareerJourney/>
    <Experiment/>
    <Contact/>
  </main>;
}
