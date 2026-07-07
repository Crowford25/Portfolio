import { motion } from 'framer-motion'
import type { PropsWithChildren } from 'react'

interface GradientButtonProps {
  href?: string
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary'
}

const GradientButton = ({ href, onClick, children, className = '', variant = 'primary' }: PropsWithChildren<GradientButtonProps>) => {
  const sharedStyles = 'inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/60'
  const variantStyles =
    variant === 'secondary'
      ? 'bg-white/5 text-slate-100 hover:bg-white/10'
      : 'bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-400 text-slate-950 hover:brightness-110'

  const ButtonContent = (
    <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} className={`${sharedStyles} ${variantStyles} ${className} cursor-target`}>
      {children}
    </motion.span>
  )

  return href ? (
    <a href={href} className="inline-block" onClick={onClick}>
      {ButtonContent}
    </a>
  ) : (
    <button type="button" onClick={onClick} className="inline-block">
      {ButtonContent}
    </button>
  )
}

export default GradientButton
