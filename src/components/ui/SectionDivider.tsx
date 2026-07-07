const SectionDivider = () => {
  return (
    <div className="relative my-16 h-16 w-full overflow-hidden">
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-slate-300/20 to-transparent" />
      <div className="absolute left-8 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute right-8 top-1/2 h-14 w-14 -translate-y-1/2 rounded-full bg-fuchsia-400/10 blur-3xl" />
    </div>
  )
}

export default SectionDivider
