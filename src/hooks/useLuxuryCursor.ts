import { useEffect, useMemo, useRef, useState } from 'react'

type CursorMode = 'default' | 'link' | 'button' | 'card' | 'image'

type CursorState = {
  x: number
  y: number
  targetX: number
  targetY: number
  scale: number
  opacity: number
  mode: CursorMode
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const useLuxuryCursor = () => {
  const [cursorState, setCursorState] = useState<CursorState>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    scale: 1,
    opacity: 1,
    mode: 'default',
  })

  const frameRef = useRef<number | null>(null)
  const velocityRef = useRef({ x: 0, y: 0 })
  const prefersReducedMotion = useRef(false)

  const modeMap: Record<CursorMode, { scale: number; glow: string; inner: string }> = useMemo(
    () => ({
      default: { scale: 1, glow: 'rgba(255,255,255,0.16)', inner: 'rgba(255,255,255,0.95)' },
      link: { scale: 1.18, glow: 'rgba(34,211,238,0.24)', inner: 'rgba(125,211,252,0.95)' },
      button: { scale: 1.14, glow: 'rgba(192,132,252,0.2)', inner: 'rgba(233,213,255,0.95)' },
      card: { scale: 1.08, glow: 'rgba(255,255,255,0.13)', inner: 'rgba(248,250,252,0.95)' },
      image: { scale: 1.2, glow: 'rgba(244,114,182,0.22)', inner: 'rgba(252,165,165,0.95)' },
    }),
    [],
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.current = media.matches

    const updateReducedMotion = () => {
      prefersReducedMotion.current = media.matches
    }

    media.addEventListener('change', updateReducedMotion)

    if (prefersReducedMotion.current || window.matchMedia('(pointer: coarse)').matches) {
      return () => media.removeEventListener('change', updateReducedMotion)
    }

    let lastTime = 0
    const animate = (time: number) => {
      const delta = Math.min(32, time - lastTime || 16)
      lastTime = time

      setCursorState((current) => {
        const inertia = 0.14 + delta / 5000
        const nextX = current.x + (current.targetX - current.x) * inertia
        const nextY = current.y + (current.targetY - current.y) * inertia
        const nextVelocityX = velocityRef.current.x * 0.84 + (current.targetX - current.x) * 0.0022
        const nextVelocityY = velocityRef.current.y * 0.84 + (current.targetY - current.y) * 0.0022
        velocityRef.current = { x: nextVelocityX, y: nextVelocityY }

        return {
          ...current,
          x: nextX,
          y: nextY,
          scale: clamp(current.scale + (current.scale - current.scale) * 0.0, 0.9, 1.25),
          opacity: 1,
        }
      })

      frameRef.current = window.requestAnimationFrame(animate)
    }

    const handlePointerMove = (event: MouseEvent) => {
      setCursorState((current) => ({
        ...current,
        targetX: event.clientX,
        targetY: event.clientY,
      }))
    }

    const handlePointerOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const interactive = target?.closest('a, button, input, textarea, select, [role="button"], .interactive-card, img')
      if (!interactive) {
        setCursorState((current) => ({ ...current, mode: 'default', scale: 1 }))
        return
      }

      if (interactive.matches('a')) {
        setCursorState((current) => ({ ...current, mode: 'link', scale: 1.18 }))
      } else if (interactive.matches('button, input, textarea, select, [role="button"]')) {
        setCursorState((current) => ({ ...current, mode: 'button', scale: 1.14 }))
      } else if (interactive.matches('img')) {
        setCursorState((current) => ({ ...current, mode: 'image', scale: 1.2 }))
      } else {
        setCursorState((current) => ({ ...current, mode: 'card', scale: 1.08 }))
      }
    }

    const handlePointerLeave = () => {
      setCursorState((current) => ({ ...current, mode: 'default', scale: 1, opacity: 1 }))
    }

    window.addEventListener('mousemove', handlePointerMove)
    window.addEventListener('mouseover', handlePointerOver)
    window.addEventListener('mouseout', handlePointerLeave)
    frameRef.current = window.requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('mouseover', handlePointerOver)
      window.removeEventListener('mouseout', handlePointerLeave)
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current)
      }
      media.removeEventListener('change', updateReducedMotion)
    }
  }, [])

  return { cursorState, modeMap }
}
