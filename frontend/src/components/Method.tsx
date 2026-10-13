'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SectionHeading } from './SectionHeading'

const STEPS = [
  {
    n: 'i',
    title: 'Aksharantar corpus',
    body: '26 million Roman–native word pairs, the largest public transliteration corpus. Mined from Samanantar parallel text and IndicCorp monolingual text, plus Wikidata, existing datasets and human-annotated pairs from Karya.',
  },
  {
    n: 'ii',
    title: 'One multilingual transformer',
    body: 'A single ~11M-parameter fairseq transformer works character by character for all 21 languages. A language tag tells it which script to produce, so related languages learn from each other.',
  },
  {
    n: 'iii',
    title: 'Beam search and re-scoring',
    body: 'Beam search produces several candidate spellings. For Roman → native, they are re-ranked against word-frequency dictionaries built from real text, so the common spelling comes out on top.',
  },
]

export function Method() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Draw the pipeline as the reader reaches it: the line tells the order of operations.
        gsap.fromTo(
          '.pipe-path',
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: { trigger: '.pipe', start: 'top 80%', end: 'bottom 45%', scrub: 1 },
          },
        )
        gsap.from('.pipe-node', {
          autoAlpha: 0,
          y: 10,
          stagger: 0.15,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.pipe', start: 'top 75%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="method" ref={root} className="border-t border-rule px-6 py-32 md:px-10 md:py-44">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-16">
        <div className="col-span-12 md:col-span-7">
          <SectionHeading index="04" title="How it works" />
        </div>

        {/* Pipeline diagram — full width, a deliberate break from the text grid */}
        <figure className="pipe col-span-12 -mx-6 md:-mx-10" aria-label="namasthe goes into the model, which returns ranked candidates such as नमस्ते and नमस्थे">
          <svg viewBox="0 0 1200 220" className="h-auto w-full" role="img" aria-hidden>
            <path
              className="pipe-path"
              d="M 300 110 L 470 110 M 730 110 C 860 110, 900 50, 1040 50 M 730 110 L 1040 110 M 730 110 C 860 110, 900 170, 1040 170"
              fill="none"
              stroke="var(--color-rule)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              pathLength={1}
              strokeDasharray="1"
            />
            <g className="pipe-node">
              <text x="60" y="92" fill="var(--color-muted)" fontFamily="var(--font-geist-mono)" fontSize="13" letterSpacing="2">INPUT</text>
              <text x="60" y="150" fill="var(--color-paper)" fontFamily="var(--font-instrument)" fontSize="44" fontStyle="italic">namasthe</text>
            </g>
            <g className="pipe-node">
              <rect x="470" y="70" width="260" height="80" rx="2" fill="var(--color-ink-2)" stroke="var(--color-rule)" />
              <text x="600" y="105" textAnchor="middle" fill="var(--color-paper)" fontFamily="var(--font-geist-sans)" fontSize="17">Transformer · &lt;hi&gt;</text>
              <text x="600" y="130" textAnchor="middle" fill="var(--color-muted)" fontFamily="var(--font-geist-mono)" fontSize="12">beam search + rescore</text>
            </g>
            {[
              { y: 50, t: 'नमस्ते', s: '1', on: true },
              { y: 110, t: 'नमस्थे', s: '2' },
              { y: 170, t: 'नामस्थे', s: '3' },
            ].map((c) => (
              <g key={c.s} className="pipe-node">
                <circle cx="1040" cy={c.y} r="4" fill={c.on ? 'var(--color-accent)' : 'var(--color-muted)'} />
                <text x="1060" y={c.y + 10} fill={c.on ? 'var(--color-accent)' : 'var(--color-paper)'} fontFamily="'Nirmala UI', 'Noto Sans', sans-serif" fontSize="30">{c.t}</text>
              </g>
            ))}
          </svg>
        </figure>

        <ol className="col-span-12 grid gap-x-6 gap-y-14 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="reveal-up border-t border-rule pt-6">
              <span className="font-display text-3xl italic text-accent">{s.n}.</span>
              <h3 className="mt-4 text-xl text-paper">{s.title}</h3>
              <p className="mt-3 max-w-[42ch] leading-relaxed text-paper/65">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
