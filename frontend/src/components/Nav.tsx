'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { useScrollTo } from './SmoothScroll'
import { useXlit } from './XlitContext'

const LINKS = [
  { href: '#playground', label: 'Playground' },
  { href: '#saved', label: 'Saved' },
  { href: '#languages', label: 'Languages' },
  { href: '#method', label: 'Method' },
  { href: '#api', label: 'API' },
]

export function Nav() {
  const scrollTo = useScrollTo()
  const { status, recheck, canSave } = useXlit()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      data-hero-nav
      className={cn(
        'reveal-up fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,padding] duration-300',
        scrolled ? 'bg-ink/75 py-3 backdrop-blur-md' : 'py-6',
      )}
    >
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 md:px-10" aria-label="Primary">
        <a href="#top" onClick={(e) => { e.preventDefault(); scrollTo('#top') }} className="flex items-baseline gap-2">
          <span className="font-display text-2xl italic leading-none">Lipi</span>
          <span lang="hi" className="font-indic text-sm text-muted">लिपि</span>
        </a>

        <ul className="hidden items-center gap-8 text-sm text-paper/80 md:flex">
          {LINKS.filter((l) => canSave || l.href !== '#saved').map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="wipe-link pb-0.5 hover:text-paper"
                onClick={(e) => { e.preventDefault(); scrollTo(l.href) }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={recheck}
          className="flex min-h-11 items-center gap-2 rounded-full border border-rule px-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-paper/40 hover:text-paper"
          title="Re-check the IndicXlit backend"
        >
          <span
            aria-hidden
            className={cn(
              'size-1.5 rounded-full',
              status === 'online' && 'bg-[#6fcf8f]',
              status === 'offline' && 'bg-accent',
              status === 'checking' && 'animate-pulse bg-muted',
            )}
          />
          {status === 'online' ? 'Model online' : status === 'offline' ? 'Backend offline' : 'Connecting'}
        </button>
      </nav>
    </header>
  )
}
