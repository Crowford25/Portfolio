import { motion } from 'framer-motion'

interface SectionHeadingProps {
  number: string
  title: string
  description?: string
}

const SectionHeading = ({ number, title, description }: SectionHeadingProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="mx-auto mb-10 max-w-3xl text-center"
    >
      <div className="futuristic-chip mb-4 inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm uppercase tracking-[0.35em] text-slate-300/80">
        <span className="gradient-text">{number}</span>
        <span>{title}</span>
      </div>
      {description ? (
        <p className="text-base text-slate-300/80 sm:text-lg">{description}</p>
      ) : null}
    </motion.div>
  )
}

export default SectionHeading
