'use client'

import { useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ACCURACY, LANG_BY_CODE } from '@/lib/languages'
import { cn } from '@/lib/cn'
import { SectionHeading } from './SectionHeading'

const SETS = {
  native: { label: 'Native words', note: 'everyday vocabulary' },
  named: { label: 'Named entities', note: 'people, places, organisations' },
} as const
type SetKey = keyof typeof SETS

export function Accuracy() {
  const [set, setSet] = useState<SetKey>('native')
  const [hover, setHover] = useState<string | null>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const inView = useInView(chartRef, { once: true, margin: '0px 0px -20% 0px' })
  const reduce = useReducedMotion()

  const rows = Object.entries(ACCURACY[set])
    .map(([code, v]) => ({ code, v, name: LANG_BY_CODE[code]?.name ?? code }))
    .sort((a, b) => b.v - a.v)
  const mean = rows.reduce((s, r) => s + r.v, 0) / rows.length
  const shown = inView || reduce

  return (
    <section id="accuracy" className="border-t border-rule bg-ink-2 px-6 py-32 md:px-10 md:py-44">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-14">
        <div className="col-span-12 lg:col-span-4">
          <SectionHeading index="05" title="Accuracy" />
          <p className="reveal-up mt-8 max-w-[38ch] leading-relaxed text-paper/70">
            Top-1 accuracy on the Aksharantar benchmark, Roman → native: the share of words where the model&rsquo;s first
            guess exactly matches the reference spelling. The other four suggestions often contain the right answer
            when the first does not.
          </p>
          <p className="reveal-up mt-10 font-display text-[clamp(3rem,6vw,5.5rem)] leading-none tracking-[-0.02em]">
            {mean.toFixed(1)}%
          </p>
          <p className="reveal-up mt-2 text-sm text-muted">mean across 19 languages · {SETS[set].note}</p>
        </div>

        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-sm text-paper/80">Top-1 accuracy (%) by language — {SETS[set].label}</h3>
            <div role="radiogroup" aria-label="Benchmark subset" className="flex rounded-full border border-rule p-1">
              {(Object.keys(SETS) as SetKey[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={set === k}
                  onClick={() => setSet(k)}
                  className="relative min-h-9 rounded-full px-4 text-xs transition-colors"
                >
                  {set === k && (
                    <motion.span layoutId="acc-pill" className="absolute inset-0 rounded-full bg-paper" transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }} />
                  )}
                  <span className={cn('relative', set === k ? 'text-ink' : 'text-paper/70')}>{SETS[k].label}</span>
                </button>
              ))}
            </div>
          </div>

          <div ref={chartRef} className="relative mt-8">
            {/* Recessive gridlines */}
            <div aria-hidden className="pointer-events-none absolute inset-y-0 left-[7.5rem] right-[3.5rem]">
              {[0, 25, 50, 75, 100].map((g) => (
                <div key={g} className="absolute inset-y-0 border-l border-rule/70" style={{ left: `${g}%` }}>
                  <span className="absolute -bottom-6 -translate-x-1/2 font-mono text-[10px] text-muted">{g}</span>
                </div>
              ))}
            </div>

            <ul className="relative">
              {rows.map((r, i) => (
                <motion.li
                  key={r.code}
                  layout={!reduce}
                  transition={{ type: 'spring', bounce: 0.1, duration: 0.6 }}
                  className="relative"
                >
                  <div
                    tabIndex={0}
                    onPointerEnter={() => setHover(r.code)}
                    onPointerLeave={() => setHover(null)}
                    onFocus={() => setHover(r.code)}
                    onBlur={() => setHover(null)}
                    aria-label={`${r.name}: ${r.v.toFixed(2)} percent, rank ${i + 1} of ${rows.length}`}
                    className="grid grid-cols-[7.5rem_1fr_3.5rem] items-center py-[5px] outline-offset-0"
                  >
                    <span className={cn('truncate pr-3 text-sm transition-colors', hover === r.code ? 'text-paper' : 'text-paper/70')}>
                      {r.name}
                    </span>
                    <span className="relative h-3">
                      <motion.span
                        className="absolute inset-0 rounded-r-[4px] bg-accent"
                        initial={false}
                        animate={{
                          clipPath: `inset(0 ${shown ? 100 - r.v : 100}% 0 0 round 0 4px 4px 0)`,
                          opacity: hover && hover !== r.code ? 0.45 : 1,
                        }}
                        transition={{ duration: reduce ? 0 : 0.9, delay: inView && !reduce ? i * 0.03 : 0, ease: [0.16, 1, 0.3, 1] }}
                      />
                      {hover === r.code && (
                        <span
                          role="tooltip"
                          className="absolute bottom-full z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-sm border border-rule bg-ink px-3 py-1.5 text-xs text-paper shadow-[0_16px_40px_-16px_rgba(0,0,0,0.9)]"
                          style={{ left: `${r.v}%` }}
                        >
                          {r.name} · <span className="font-mono">{r.v.toFixed(2)}%</span>
                          <span className="text-muted"> · #{i + 1} of {rows.length}</span>
                        </span>
                      )}
                    </span>
                    <span className="text-right font-mono text-xs tabular-nums text-muted">{r.v.toFixed(1)}</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
          <p className="mt-12 text-xs text-muted">
            Source: IndicXlit README / Madhani et al., <span className="italic">Aksharantar</span> (arXiv:2205.03018). Konkani is reported as “kok”.
          </p>
        </div>
      </div>
    </section>
  )
}
