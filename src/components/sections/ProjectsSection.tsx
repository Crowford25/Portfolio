import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import AnimatedTetrahedron from '../ui/AnimatedTetrahedron'
import { projects } from '../../data/portfolio'

const ProjectsSection = () => {
  return (
    <section id="projects" className="relative py-20 sm:py-24 overflow-visible">
      <div className="pointer-events-none absolute right-0 top-[140%] z-0 h-[70vw] w-[70vw] max-w-[60rem] max-h-[60rem] translate-x-[22%] -translate-y-1/2 opacity-60">
        <AnimatedTetrahedron />
      </div>
      <SectionHeading number="04" title="Featured Projects" description="Highlighted work that blends visual polish, motion, and product-focused detail." />
      <div className="relative mx-auto grid max-w-6xl gap-6 px-6 sm:px-8 lg:grid-cols-3 lg:px-12">
        {projects.map((project, index) => (
          <motion.article
            key={project.name}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: 'easeOut', delay: index * 0.08 }}
            className="cyber-panel scanlines group relative rounded-[34px] p-4 shadow-[0_32px_100px_rgba(2,6,23,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-fuchsia-400/10 opacity-60" />
            <div className="absolute left-4 top-4 h-24 w-24 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute right-6 bottom-6 h-16 w-16 rounded-full bg-pink-400/10 blur-3xl" />
            <div className="relative space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300/75">
                {project.role}
              </div>
              <h3 className="text-2xl font-semibold text-white">{project.name}</h3>
              <p className="text-sm leading-7 text-slate-300/80">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300/75">
                    {tag}
                  </span>
                ))}
              </div>
              <a href={project.link} className="cursor-target inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200">
                Explore project
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export default ProjectsSection
