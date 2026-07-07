import { motion } from 'framer-motion'
import { Mail, Send } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'

const ContactSection = () => {
  return (
    <section id="contact" className="relative py-20 sm:py-24">
      <SectionHeading number="06" title="Contact" description="Ready to collaborate on your next premium digital experience? Let’s connect." />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="mx-auto grid max-w-4xl gap-8 px-6 sm:px-8 lg:px-12"
      >
        <div className="cyber-panel rounded-[36px] p-8 shadow-[0_32px_100px_rgba(2,6,23,0.35)]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Let’s build something</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Talk to me about product, motion, or your next launch.</h2>
            </div>
            <a href="mailto:zisonwong25@gmail.com" className="inline-flex items-center gap-2 rounded-full bg-white/5 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-white/10">
              <Mail className="h-4 w-4" />
              Say hello
            </a>
          </div>
          <div className="mt-8 grid gap-4 rounded-[30px] border border-white/10 bg-white/5 p-6 text-slate-300">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm uppercase tracking-[0.3em] text-slate-400/70">Email</span>
              <a href="mailto:zisonwong25@gmail.com" className="text-sm font-semibold text-white">zisonwong25@gmail.com</a>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm uppercase tracking-[0.3em] text-slate-400/70">Location</span>
              <span className="text-sm text-white">Kuala Lumpur, Malaysia</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm uppercase tracking-[0.3em] text-slate-400/70">Availability</span>
              <span className="text-sm text-white">Freelance & full-time engagements</span>
            </div>
          </div>
        </div>
        <div className="cyber-panel rounded-[36px] p-8 shadow-[0_24px_90px_rgba(2,6,23,0.25)]">
          <div className="space-y-4 text-slate-300">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400/70">Work inquiry</p>
            <p className="text-lg leading-8">Share a few details and I’ll respond within one business day. I’m available for product web builds, motion-driven brand launches, and interactive portfolio design.</p>
            <a href="mailto:zisonwong25@gmail.com" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200">
              Send a note <Send className="h-4 w-4" />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default ContactSection
