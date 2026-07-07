import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'

const howIWorkCards = [
  {
    title: 'Motion-first product pages',
    description: 'Immersive, responsive experiences with rhythm, depth, and quiet confidence.',
  },
  {
    title: 'Accessible systems',
    description: 'Reusable patterns built with clarity, focus states, and inclusive interactions.',
  },
  {
    title: 'Performance-led builds',
    description: 'Fast, lightweight interfaces that feel instant and elegant at every scale.',
  },
  {
    title: 'Storytelling through UI',
    description: 'Interfaces that guide the eye, frame the message, and leave a lasting impression.',
  },
]

const AboutSection = () => {
  return (
    <section id="about" className="relative py-20 sm:py-24">
      <SectionHeading
        number="01"
        title="About Me"
        description="A product-minded frontend engineer crafting cinematic, high-performance experiences with precise UI systems."
      />

      <div className="relative mx-auto grid max-w-7xl gap-6 px-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-12">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="cyber-panel relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/75 to-slate-950/90 p-8 shadow-[0_30px_120px_rgba(2,6,23,0.38)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.12),transparent_26%)]" />
          <div className="relative space-y-7 text-slate-300/90">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.36em] text-cyan-200/90">
              <span className="h-2 w-2 rounded-full bg-cyan-300" />
              Creative frontend craft
            </div>

            <div className="space-y-4">
              <h3 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
                I design interfaces that feel premium, expressive, and effortless.
              </h3>
              <p className="max-w-2xl text-base leading-8 text-slate-300/80">
                I build polished digital products with a thoughtful balance of storytelling, interaction detail, and resilient frontend architecture.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/6 p-5 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.32em] text-slate-400/80">Focus</p>
                <p className="mt-3 text-sm leading-6 text-slate-200/90">Design systems, product strategy, motion, and responsive performance.</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/6 p-5 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.32em] text-slate-400/80">Approach</p>
                <p className="mt-3 text-sm leading-6 text-slate-200/90">Refined spacing, layered gradients, deliberate pacing, and polished storytelling.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="cyber-panel scanlines relative overflow-hidden rounded-[36px] border border-white/10 bg-slate-950/75 p-8 shadow-[0_25px_100px_rgba(2,6,23,0.34)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.14),transparent_24%)]" />
          <div className="relative space-y-6 text-slate-300/85">
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.36em] text-cyan-300/80">How I work</p>
              <h3 className="text-2xl font-semibold text-white">A clean process for premium digital experiences.</h3>
            </div>

            <p className="text-base leading-8 text-slate-300/80">
              I blend strategy, interaction design, and frontend craftsmanship to build websites that feel cinematic, fast, and memorable.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {howIWorkCards.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-white/10 bg-slate-900/90 p-5 shadow-[0_12px_40px_rgba(2,6,23,0.2)] transition duration-300 hover:-translate-y-1 hover:border-cyan-400/25"
                >
                  <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-300/80">{item.title}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300/75">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
