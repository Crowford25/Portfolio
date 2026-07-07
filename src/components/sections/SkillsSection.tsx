import { motion } from 'framer-motion'
import { useState } from 'react'
import SectionHeading from '../ui/SectionHeading'

type SkillCard = {
  id: number
  title: string
  summary: string
  detail: string
  accent: string
}

const skillCards: SkillCard[] = [
  {
    id: 1,
    title: 'Motion-first interfaces',
    summary: 'Cinematic transitions that make every interaction feel intentional.',
    detail: 'Scroll choreography, layered reveals, and tactile micro-interactions designed to guide attention without noise.',
    accent: 'from-cyan-400/20 to-sky-500/20',
  },
  {
    id: 2,
    title: 'Design systems',
    summary: 'A consistent visual language that scales from concept to launch.',
    detail: 'Reusable UI patterns, polished tokens, and flexible layouts that keep the experience premium across breakpoints.',
    accent: 'from-fuchsia-400/20 to-violet-500/20',
  },
  {
    id: 3,
    title: 'High-performance builds',
    summary: 'Fast, lightweight experiences built for delight and durability.',
    detail: 'Optimized rendering, responsive architecture, and efficient motion that keeps sites feeling instant.',
    accent: 'from-emerald-400/20 to-cyan-500/20',
  },
  {
    id: 4,
    title: 'Accessible storytelling',
    summary: 'Narratives that feel elegant, inclusive, and easy to follow.',
    detail: 'Clear hierarchy, readable motion, and thoughtful focus states that make the experience feel effortless.',
    accent: 'from-amber-400/20 to-orange-500/20',
  },
  {
    id: 5,
    title: 'React + TypeScript',
    summary: 'Typed interfaces that turn ideas into resilient product experiences.',
    detail: 'Structured components and composable logic that make iteration smooth and future-proof.',
    accent: 'from-sky-400/20 to-blue-500/20',
  },
  {
    id: 6,
    title: 'Product thinking',
    summary: 'A strategy-first approach that frames visuals around user momentum.',
    detail: 'Every motion and layout decision is shaped around clarity, conversion, and emotional resonance.',
    accent: 'from-rose-400/20 to-pink-500/20',
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
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">How I work</p>
              <h3 className="mt-2 text-xl font-semibold text-white">An infinite carousel of ideas, motion, and craft.</h3>
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
                        <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${skill.accent} ring-1 ring-white/10`} />
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
