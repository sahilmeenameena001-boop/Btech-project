'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

/** Section title with a masked line reveal on scroll; also reveals sibling `.reveal-up` copy in its section. */
export function SectionHeading({ index, title }: { index: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    const section = el.closest('section')
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const rest = section ? [...section.querySelectorAll('.reveal-up')].filter((n) => !el.contains(n)) : []
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        defaults: { ease: 'power4.out' },
      })
      tl.set(el.querySelectorAll('.reveal-up'), { autoAlpha: 1 })
        .from(el.querySelectorAll('.line-mask > span'), { yPercent: 110, duration: 1.1 })
        .from(el.querySelectorAll('.idx'), { autoAlpha: 0, x: -8, duration: 0.6 }, 0.2)
      if (rest.length) tl.fromTo(rest, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.25)
    })
    return () => mm.revert()
  })

  return (
    <div ref={ref}>
      <p className="idx reveal-up font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{index}</p>
      <h2 className="reveal-up mt-4 font-display text-[clamp(2.75rem,6vw,6rem)] leading-[0.95] tracking-[-0.03em]" aria-label={title}>
        <span className="line-mask" aria-hidden><span>{title}</span></span>
      </h2>
    </div>
  )
}
