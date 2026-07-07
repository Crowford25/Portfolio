import { motion } from 'framer-motion'
import { socialLinks } from '../../data/portfolio'

const FooterSection = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#050713]/80 py-10 text-slate-400 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="space-y-3"
        >
          <p className="text-sm text-slate-300">Wong Chee Chun — Crafted with precision, motion, and premium digital polish.</p>
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} All rights reserved.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="flex flex-wrap items-center gap-4 text-sm"
        >
          {socialLinks.map((social) => (
            <a key={social.label} href={social.href} className="transition hover:text-white" target="_blank" rel="noreferrer">
              {social.label}
            </a>
          ))}
        </motion.div>
      </div>
    </footer>
  )
}

export default FooterSection
