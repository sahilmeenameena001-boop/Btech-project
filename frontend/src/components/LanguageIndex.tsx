'use client'

import { ArrowUpRight } from 'lucide-react'
import { LANGUAGES } from '@/lib/languages'
import { cn } from '@/lib/cn'
import { useXlit } from './XlitContext'
import { useScrollTo } from './SmoothScroll'
import { SectionHeading } from './SectionHeading'

export function LanguageIndex() {
  const { lang, setLang, setDir } = useXlit()
  const scrollTo = useScrollTo()
  const scripts = new Set(LANGUAGES.map((l) => l.script)).size

  return (
    <section id="languages" className="border-t border-rule bg-ink-2 px-6 py-32 md:px-10 md:py-44">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-16">
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeading index="03" title="Twenty-one languages" />
            <p className="reveal-up mt-8 max-w-[36ch] leading-relaxed text-paper/70">
              {scripts} writing systems across three language families: Brahmic scripts written left to right, and
              Perso-Arabic scripts written right to left. Pick one to load it into the playground.
            </p>
          </div>
        </div>

        <ol className="col-span-12 border-t border-rule lg:col-span-8">
          {LANGUAGES.map((l) => {
            const active = l.code === lang
            return (
              <li key={l.code} className="border-b border-rule">
                <button
                  type="button"
                  onClick={() => { setDir('en2indic'); setLang(l.code); scrollTo('#playground') }}
                  aria-label={`Use ${l.name} in the playground`}
                  className="group grid min-h-20 w-full grid-cols-[3.5rem_1fr_auto] items-center gap-x-4 py-4 text-left md:grid-cols-[4rem_1fr_12rem_auto]"
                >
                  <span className={cn('font-mono text-xs uppercase', active ? 'text-accent' : 'text-muted')}>{l.code}</span>
                  <span className="flex items-baseline gap-3">
                    <span className="text-lg text-paper/90 transition-transform duration-300 group-hover:translate-x-1">{l.name}</span>
                    <span className="hidden text-xs text-muted md:inline">{l.family}</span>
                  </span>
                  <span className="hidden text-sm text-muted md:block">{l.script}{l.rtl && ' · RTL'}</span>
                  <span className="flex items-center gap-4">
                    <span
                      lang={l.code}
                      dir={l.rtl ? 'rtl' : 'ltr'}
                      className={cn(
                        'font-indic text-[clamp(1.5rem,3vw,2.5rem)] leading-none transition-colors duration-300',
                        active ? 'text-accent' : 'text-paper group-hover:text-accent',
                      )}
                    >
                      {l.native}
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 text-muted opacity-100 transition-[opacity,translate] duration-300 md:-translate-x-1 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100"
                    />
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
