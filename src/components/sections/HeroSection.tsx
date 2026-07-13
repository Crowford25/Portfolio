import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import GradientButton from '../ui/GradientButton'
import AnimatedMorph from '../ui/AnimatedMorph'

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-90">
        <AnimatedMorph />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-hero-glow opacity-70 blur-3xl -z-10" />
      <div className="pointer-events-none absolute left-6 top-28 h-28 w-28 rounded-full bg-cyan-400/20 blur-3xl -z-10" />
      <div className="pointer-events-none absolute right-4 top-48 h-32 w-32 rounded-full bg-fuchsia-400/20 blur-3xl -z-10" />
      <div className="relative z-20 mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <div className="futuristic-chip inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm text-cyan-200/90 shadow-glass">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            <span>Hi, I’m Wong. I design premium interfaces with motion-first storytelling.</span>
          </div>
          <h1 className="mt-8 max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-white sm:text-6xl">
            Crafting <span className="gradient-text">cinematic</span> digital experiences with calm clarity, motion, and premium polish.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300/90 sm:text-xl">
            I build polished product sites, interactive portfolios, and immersive launch experiences for ambitious brands.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
            <GradientButton href="#projects">View Featured Work</GradientButton>
            <GradientButton href="#contact" variant="secondary">Let’s Talk</GradientButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="relative mx-auto w-full max-w-4xl"
        >
          <div className="absolute -left-16 top-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl animate-float" />
          <div className="absolute -right-20 bottom-14 h-56 w-56 rounded-full bg-fuchsia-400/10 blur-3xl animate-float" />
          <div className="absolute left-8 top-8 h-20 w-20 rounded-full border border-cyan-300/30 bg-cyan-300/10 blur-2xl" />
          <div className="absolute right-8 bottom-14 h-24 w-24 rounded-full border border-fuchsia-300/30 bg-fuchsia-300/10 blur-2xl" />
          <div className="cyber-panel scanlines relative overflow-hidden rounded-[40px] p-6 shadow-[0_40px_140px_rgba(2,6,23,0.55)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(41,128,255,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(255,98,231,0.14),transparent_22%)]" />
            <div className="absolute inset-x-8 top-8 h-16 rounded-full bg-gradient-to-r from-cyan-300/10 via-transparent to-fuchsia-300/10 blur-2xl" />
            <div className="relative grid gap-6 sm:grid-cols-[1.4fr_1fr]">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400/70">Featured design concept</p>
                <h2 className="text-3xl font-semibold text-white">A motion-led brand presence for modern SaaS.</h2>
                <p className="text-slate-300/85 leading-7">A premium landing experience with soft neon gradients, floating cards, and a polished visual rhythm designed to delight.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-slate-950/20 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-200/80">Brand</span>
                  <span className="rounded-full border border-white/10 bg-slate-950/20 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-200/80">Web</span>
                </div>
              </div>
              <div className="flex items-end justify-end">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40 p-5 shadow-[0_40px_120px_rgba(15,23,42,0.35)] backdrop-blur-xl">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_40%)]" />
                  <div className="absolute left-4 top-4 h-12 w-12 rounded-full bg-cyan-400/20 blur-2xl" />
                  <div className="absolute right-4 bottom-4 h-16 w-16 rounded-full bg-fuchsia-400/20 blur-2xl" />
                  <div className="relative rounded-3xl bg-slate-950/90 p-4">
                    <div className="mb-4 flex items-center justify-between text-sm text-slate-300/70">
                      <span>Prototype</span>
                      <span className="rounded-full bg-white/10 px-2 py-1">Top</span>
                    </div>
                    <div className="grid gap-3">
                      <div className="rounded-3xl bg-[#0d1021]/90 p-4 text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400/70">Launch</p>
                            <p className="mt-2 text-xl font-semibold text-white">09.12</p>
                          </div>
                          <div className="rounded-full border border-white/10 bg-cyan-400/10 p-2 text-cyan-300">
                            <ArrowUpRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                      <div className="rounded-[28px] bg-slate-950/80 p-4 text-slate-300 shadow-[0_20px_55px_rgba(15,23,42,0.16)]">
                        <p className="text-sm leading-6">Custom design system with scalable components, motion presets, and refined typography for high-end product experiences.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
