'use client'

import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'motion/react'
import { LANG_BY_CODE } from '@/lib/languages'
import type { SavedTranslation } from '@/lib/supabase'
import { cn } from '@/lib/cn'
import { useXlit } from './XlitContext'
import { SectionHeading } from './SectionHeading'

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
function ago(iso: string) {
  const s = Math.round((new Date(iso).getTime() - Date.now()) / 1000)
  const units: [Intl.RelativeTimeFormatUnit, number][] = [['day', 86400], ['hour', 3600], ['minute', 60]]
  for (const [unit, size] of units) if (Math.abs(s) >= size) return rtf.format(Math.round(s / size), unit)
  return 'just now'
}

export function SavedFeed() {
  const { saved, savedError, canSave } = useXlit()
  // The feed loads after first paint and changes page height; re-measure scroll triggers below it.
  const count = saved?.length ?? -1
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [count])
  if (!canSave) return null

  return (
    <section id="saved" className="border-t border-rule px-6 py-32 md:px-10 md:py-44">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-14">
        <div className="col-span-12 lg:col-span-4">
          <SectionHeading index="02" title="Saved" />
          <p className="reveal-up mt-8 max-w-[36ch] leading-relaxed text-paper/70">
            Transliterations visitors chose to keep, newest first. Press <span className="text-paper">Save</span> in the
            playground to add yours. Everything here is public.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-8" aria-live="polite">
          {saved === null ? (
            <p className="text-muted">Loading saved translations…</p>
          ) : savedError ? (
            <p className="border-l-2 border-accent pl-4 text-paper/80">Couldn&rsquo;t load the feed: {savedError}</p>
          ) : saved.length === 0 ? (
            <p className="text-muted">Nothing saved yet. Be the first.</p>
          ) : (
            <ul className="border-t border-rule">
              <AnimatePresence initial={false}>
                {saved.map((row) => (
                  <motion.li
                    key={row.id}
                    layout
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-rule"
                  >
                    <SavedRow row={row} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

function SavedRow({ row }: { row: SavedTranslation }) {
  const L = LANG_BY_CODE[row.lang]
  const toNative = row.direction === 'en2indic'
  const native = toNative ? row.output : row.source
  const roman = toNative ? row.source : row.output

  return (
    <div className="grid gap-x-6 gap-y-2 py-6 md:grid-cols-[1fr_14rem]">
      <div className="min-w-0">
        <p
          lang={row.lang}
          dir={L?.rtl ? 'rtl' : 'ltr'}
          className={cn('font-indic text-[clamp(1.5rem,3vw,2.25rem)] leading-snug break-words text-paper', L?.rtl && 'text-right md:text-left')}
        >
          {native}
        </p>
        <p className="mt-1 break-words text-paper/55">{roman}</p>
      </div>
      <p className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted md:flex-col md:items-end md:gap-1 md:text-right">
        <span className="text-paper/70">{L?.name ?? row.lang} · {toNative ? 'Roman → native' : 'native → Roman'}</span>
        <time dateTime={row.created_at}>{ago(row.created_at)}</time>
      </p>
    </div>
  )
}
