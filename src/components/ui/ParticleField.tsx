const ParticleField = () => {
  const particles = [
    { top: '10%', left: '14%', size: 'w-12 h-12', color: 'bg-cyan-400/10' },
    { top: '20%', left: '74%', size: 'w-16 h-16', color: 'bg-fuchsia-400/10' },
    { top: '50%', left: '12%', size: 'w-20 h-20', color: 'bg-cyan-300/8' },
    { top: '60%', left: '86%', size: 'w-24 h-24', color: 'bg-fuchsia-300/10' },
    { top: '82%', left: '38%', size: 'w-14 h-14', color: 'bg-white/10' },
  ]

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle, index) => (
        <div
          key={index}
          className={`absolute ${particle.size} ${particle.color} rounded-full blur-3xl opacity-70 animate-float`}
          style={{ top: particle.top, left: particle.left }}
        />
      ))}
    </div>
  )
}

export default ParticleField
