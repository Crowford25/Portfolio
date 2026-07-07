import AnimatedSphere from './AnimatedSphere'

export default function AnimatedMorph() {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 morph-sphere z-0">
        <AnimatedSphere />
      </div>
    </div>
  )
}
