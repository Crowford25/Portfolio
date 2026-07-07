import { motion } from 'framer-motion'
import { useLuxuryCursor } from '../../hooks/useLuxuryCursor'

type LuxuryCursorProps = {
  className?: string
}

const LuxuryCursor = ({ className = '' }: LuxuryCursorProps) => {
  const { cursorState, modeMap } = useLuxuryCursor()
  const currentMode = modeMap[cursorState.mode]

  return (
    <motion.div
      className={`pointer-events-none fixed z-[70] ${className}`}
      animate={{
        x: cursorState.x,
        y: cursorState.y,
        scale: cursorState.scale,
        opacity: cursorState.opacity,
      }}
      transition={{ type: 'spring', stiffness: 180, damping: 24, mass: 0.6 }}
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      <motion.div
        className="relative h-10 w-10 rounded-full"
        animate={{
          boxShadow: `0 0 0 1px rgba(255,255,255,0.12), 0 0 40px ${currentMode.glow}`,
          background: `radial-gradient(circle, ${currentMode.inner} 0%, rgba(255,255,255,0.08) 55%, transparent 70%)`,
          scale: cursorState.scale * 0.92,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border border-white/20"
        animate={{
          scale: cursorState.scale * 1.25,
          opacity: cursorState.mode === 'default' ? 0.8 : 1,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{
          backgroundColor: currentMode.inner,
          scale: cursorState.mode === 'default' ? [1, 1.4, 1] : 1.2,
          boxShadow: `0 0 16px ${currentMode.inner}`,
        }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}

export default LuxuryCursor
