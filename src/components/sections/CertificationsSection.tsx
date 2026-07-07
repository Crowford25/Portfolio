import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { certifications } from '../../data/portfolio'

const CertificationsSection = () => {
  return (
    <section id="certifications" className="relative py-20 sm:py-24">
      <SectionHeading number="05" title="Certifications" description="Recognized credentials that support a strong expertise in frontend craft and motion design." />
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {certifications.map((cert) => (
            <div key={cert.title} className="rounded-[32px] border border-white/10 bg-slate-950/40 p-6 shadow-glass backdrop-blur-2xl">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">{cert.year}</p>
              <h3 className="mt-4 text-xl font-semibold text-white">{cert.title}</h3>
              <p className="mt-2 text-sm text-slate-300/80">{cert.issuer}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default CertificationsSection
