import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { experience } from '../../data/portfolio'

const ExperienceSection = () => {
  return (
    <section id="experience" className="relative py-20 sm:py-24">
      <SectionHeading number="03" title="Experience Timeline" description="Selected roles that shaped a motion-led, product-first frontend practice." />
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="relative border-l border-white/10 pl-8">
          {experience.map((item, index) => (
            <motion.div
              key={item.company}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: index * 0.1 }}
              className="mb-12 last:mb-0"
            >
              <div className="absolute -left-6 top-2 h-4 w-4 rounded-full border-2 border-cyan-300 bg-matte shadow-[0_0_0_4px_rgba(56,189,248,0.08)]" />
              <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-glass backdrop-blur-2xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">{item.period}</p>
                    <h3 className="mt-3 text-xl font-semibold text-white">{item.role}</h3>
                    <p className="text-sm text-slate-400/80">{item.company}</p>
                  </div>
                </div>
                <p className="mt-4 text-slate-300/85 leading-7">{item.details}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExperienceSection
