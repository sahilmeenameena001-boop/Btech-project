'use client'

import gsap from 'gsap'
import { cn } from '@/lib/cn'

const canHover = () => matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches

export function MagneticButton({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!canHover()) return
    const r = e.currentTarget.getBoundingClientRect()
    gsap.to(e.currentTarget, {
      x: (e.clientX - (r.left + r.width / 2)) * 0.3,
      y: (e.clientY - (r.top + r.height / 2)) * 0.3,
      duration: 0.6,
      ease: 'power3.out',
    })
  }
  const onLeave = (e: React.PointerEvent<HTMLButtonElement>) =>
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' })

  return (
    <button
      type="button"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn(
        'inline-flex min-h-12 items-center gap-3 rounded-full bg-paper px-7 text-sm font-medium text-ink transition-[background-color,scale] duration-200 hover:bg-white active:scale-[0.97]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
