import { motion } from 'framer-motion'
import { type ComponentType, type SVGProps, useState } from 'react'
import { Code, Cpu, Database, Layers, Rocket, Sparkles } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'

type SkillCard = {
  id: number
  title: string
  summary: string
  detail: string
  accent: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

const skillCards: SkillCard[] = [
  {
    id: 1,
    title: 'Java',
    summary: 'Robust object-oriented architecture for scalable systems.',
    detail: 'Enterprise-grade Java applications with clean code, modular services, and strong type discipline.',
    accent: 'from-cyan-400/20 to-sky-500/20',
    icon: Cpu,
  },
  {
    id: 2,
    title: 'ZK Framework',
    summary: 'Server-driven UI development with interactive Java components.',
    detail: 'Building modern business apps with ZK component flows, real-time updates, and polished interactions.',
    accent: 'from-fuchsia-400/20 to-violet-500/20',
    icon: Layers,
  },
  {
    id: 3,
    title: 'Database',
    summary: 'Reliable data modelling and optimized persistence layers.',
    detail: 'Schema design, query tuning, and data integrity practices for resilient backend systems.',
    accent: 'from-emerald-400/20 to-cyan-500/20',
    icon: Database,
  },
  {
    id: 4,
    title: 'React + TypeScript',
    summary: 'Typed front-end architecture for expressive, maintainable apps.',
    detail: 'Composable components, strict typings, and responsive UI patterns built for product velocity.',
    accent: 'from-sky-400/20 to-blue-500/20',
    icon: Code,
  },
  {
    id: 5,
    title: 'More & more',
    summary: 'Expanding capability across design, platform, and collaboration.',
    detail: 'A broad toolkit for building experiences that scale from idea to polished delivery.',
    accent: 'from-amber-400/20 to-orange-500/20',
    icon: Sparkles,
  },
  {
    id: 6,
    title: 'Performance & Scale',
    summary: 'Fast, reliable experiences engineered for real-world use.',
    detail: 'Optimised rendering, efficient state management, and scalable deployment pipelines.',
    accent: 'from-violet-400/20 to-indigo-500/20',
    icon: Rocket,
  },
]

const SkillsSection = () => {
  const [flippedCard, setFlippedCard] = useState<number | null>(null)

  return (
    <section id="skills" className="relative py-20 sm:py-24">
      <SectionHeading
        number="02"
        title="Skills"
        description="A scroll-driven toolkit for building elegant, cinematic, and high-performance digital experiences."
      />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_0_80px_rgba(8,145,178,0.12)] backdrop-blur-xl sm:p-8 lg:p-10"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Skills</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Skill Set Used</h3>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {skillCards.map((skill) => {
              const isFlipped = flippedCard === skill.id

              return (
                <motion.button
                  key={skill.id}
                  type="button"
                  onClick={() => setFlippedCard(isFlipped ? null : skill.id)}
                  whileHover={{ y: -6, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="group text-left"
                  aria-label={`Flip ${skill.title}`}
                >
                  <div className="relative h-[270px] [perspective:1200px]">
                    <motion.div
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="absolute inset-0 h-full w-full [transform-style:preserve-3d]"
                    >
                      <div className="absolute inset-0 flex h-full flex-col justify-between rounded-[24px] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-5 [backface-visibility:hidden]">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${skill.accent} ring-1 ring-white/10`}>
                        <skill.icon className="h-6 w-6 text-white" />
                      </div>
                        <div>
                          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Capability</p>
                          <h4 className="mt-2 text-lg font-semibold text-white">{skill.title}</h4>
                          <p className="mt-3 text-sm leading-6 text-slate-300/75">{skill.summary}</p>
                        </div>
                        <div className="flex items-center justify-between text-sm text-cyan-200/90">
                          <span>Flip for details</span>
                          <span className="text-lg transition group-hover:translate-x-1">↗</span>
                        </div>
                      </div>

                      <div className="absolute inset-0 flex h-full flex-col justify-between rounded-[24px] border border-cyan-400/20 bg-slate-900/95 p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        <div>
                          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Focus</p>
                          <h4 className="mt-2 text-lg font-semibold text-white">{skill.title}</h4>
                          <p className="mt-3 text-sm leading-7 text-slate-300/80">{skill.detail}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200/90">
                          Built for clarity, motion, and polish.
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default SkillsSection
