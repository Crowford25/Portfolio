import { Suspense, lazy } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ParticleField from './components/ui/ParticleField'
import SectionDivider from './components/ui/SectionDivider'
import LuxuryCursor from './components/ui/LuxuryCursor'

const HeroSection = lazy(() => import('./components/sections/HeroSection'))
const AboutSection = lazy(() => import('./components/sections/AboutSection'))
const SkillsSection = lazy(() => import('./components/sections/SkillsSection'))
const ExperienceSection = lazy(() => import('./components/sections/ExperienceSection'))
const ProjectsSection = lazy(() => import('./components/sections/ProjectsSection'))
const CertificationsSection = lazy(() => import('./components/sections/CertificationsSection'))
const ContactSection = lazy(() => import('./components/sections/ContactSection'))
const FooterSection = lazy(() => import('./components/sections/FooterSection'))

function App() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative min-h-screen overflow-hidden bg-matte text-white"
      >
        <div className="ambient-grid absolute inset-0 pointer-events-none" />
        <div className="aurora-orb aurora-a" />
        <div className="aurora-orb aurora-b" />
        <div className="aurora-orb aurora-c" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(103,232,249,0.14),transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(255,119,233,0.12),transparent_22%)] pointer-events-none" />
        <LuxuryCursor />
        <div className="relative w-full px-4 py-6 sm:px-6 lg:px-8">
          <header className="cyber-panel relative z-20 flex w-full flex-col gap-4 rounded-[32px] border border-white/10 px-6 py-4 shadow-[0_20px_70px_rgba(2,6,23,0.2)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/90">Wong Chee Chun</p>
              <p className="mt-1 text-sm text-slate-300/80">Product-focused frontend engineer</p>
            </div>
            <nav className="hidden items-center gap-6 text-sm text-slate-300/80 md:flex">
              <a href="#about" className="transition duration-200 hover:text-white">About</a>
              <a href="#skills" className="transition duration-200 hover:text-white">Skills</a>
              <a href="#experience" className="transition duration-200 hover:text-white">Experience</a>
              <a href="#projects" className="transition duration-200 hover:text-white">Work</a>
              <a href="#contact" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition duration-200 hover:bg-white/10">Contact</a>
            </nav>
          </header>
        </div>
        <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ParticleField />
          <Suspense fallback={<div className="mt-20 text-center text-slate-400">Loading portfolio...</div>}>
            <HeroSection />
            <SectionDivider />
            <AboutSection />
            <SkillsSection />
            <ExperienceSection />
            <SectionDivider />
            <ProjectsSection />
            <CertificationsSection />
            <ContactSection />
          </Suspense>
        </main>
        <FooterSection />
      </motion.div>
    </AnimatePresence>
  )
}

export default App
