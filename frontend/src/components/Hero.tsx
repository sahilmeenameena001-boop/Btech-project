'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowDownRight } from 'lucide-react'
import { HERO_WORDS, LANG_BY_CODE } from '@/lib/languages'
import { useScrollTo } from './SmoothScroll'
import { MagneticButton } from './MagneticButton'

const STATS = [
  { value: '21', label: 'Indic languages' },
  { value: '26M', label: 'training word pairs' },
  { value: '~11M', label: 'model parameters' },
]

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const scrollTo = useScrollTo()
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)

  // Storytelling: one Roman word, many scripts.
  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setI((n) => (n + 1) % HERO_WORDS.length), 2200)
    return () => clearInterval(id)
  }, [reduce])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } })
        tl.set('.reveal-up', { autoAlpha: 1 })
          .from('.hero-line > span', { yPercent: 110, duration: 1.15, stagger: 0.09 })
          .from('.hero-word', { scale: 1.15, autoAlpha: 0, duration: 1.4, ease: 'expo.out' }, 0.15)
          .from('.hero-fade', { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.06 }, 0.7)
        const nav = document.querySelector('[data-hero-nav]')
        if (nav) tl.fromTo(nav, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 1.1)
        // Gate on fonts so lines never reveal mid-swap.
        document.fonts.ready.then(() => tl.play())
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const word = HERO_WORDS[i]
  const lang = LANG_BY_CODE[word.code]

  return (
    <section id="top" ref={root} className="relative min-h-svh overflow-hidden px-6 pt-36 pb-16 md:px-10 md:pt-44">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6">
        <p className="hero-fade reveal-up col-span-12 mb-10 font-mono text-[11px] uppercase tracking-[0.2em] text-muted md:col-span-6 md:col-start-1">
          B.Tech project · built on AI4Bharat IndicXlit
        </p>

        <h1
          aria-label="Type it the way you say it."
          className="reveal-up col-span-12 font-display text-[clamp(3.25rem,9.5vw,10rem)] leading-[0.92] tracking-[-0.035em] lg:col-span-9"
        >
          <span aria-hidden className="hero-line line-mask"><span>Type it the way</span></span>
          <span aria-hidden className="hero-line line-mask"><span className="italic text-paper/70">you say it.</span></span>
        </h1>

        <div className="hero-fade reveal-up col-span-12 mt-12 max-w-[46ch] text-lg leading-relaxed text-paper/75 md:col-span-5 md:col-start-1 lg:mt-16">
          Write any of 21 Indian languages using the English keyboard. A transformer model
          trained on India&rsquo;s largest transliteration corpus turns it into the native script,
          and back again.
        </div>

        <div className="hero-fade reveal-up col-span-12 mt-10 flex items-center gap-6 md:col-span-5 md:col-start-1">
          <MagneticButton onClick={() => scrollTo('#playground')}>
            Open the playground <ArrowDownRight className="size-4" aria-hidden />
          </MagneticButton>
        </div>

        {/* The word sits in its own plane, breaking out of the text column */}
        <figure
          className="hero-word reveal-up relative col-span-12 mt-20 flex flex-col items-start lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-3 lg:mt-12 lg:items-end lg:self-center"
          aria-live="polite"
        >
          <figcaption className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            <span className="text-paper">bharat</span>
            <span aria-hidden className="h-px w-8 bg-rule" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={word.code}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
              >
                {lang.name}
              </motion.span>
            </AnimatePresence>
          </figcaption>
          <div className="relative h-[clamp(7rem,16vw,15rem)] w-full overflow-hidden lg:text-right">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={word.code}
                lang={word.code}
                dir={lang.rtl ? 'rtl' : 'ltr'}
                className="absolute inset-x-0 block font-indic text-[clamp(5rem,13vw,12.5rem)] leading-[1.15] text-accent"
                initial={{ y: '100%', opacity: 0, filter: 'blur(8px)' }}
                animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                exit={{ y: '-60%', opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {word.text}
              </motion.span>
            </AnimatePresence>
          </div>
        </figure>

        <dl className="col-span-12 mt-24 grid grid-cols-3 border-t border-rule pt-8 md:mt-28">
          {STATS.map((s) => (
            <div key={s.label} className="hero-fade reveal-up flex flex-col">
              <dt className="order-2 mt-2 text-sm text-muted">{s.label}</dt>
              <dd className="order-1 font-display text-[clamp(2rem,4.5vw,4rem)] leading-none tracking-[-0.02em]">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
