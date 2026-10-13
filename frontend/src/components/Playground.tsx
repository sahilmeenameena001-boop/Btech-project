'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeftRight, Bookmark, BookmarkCheck, Check, Copy, Loader2, RotateCw } from 'lucide-react'
import { transliterateWords, type Direction } from '@/lib/api'
import { LANGUAGES, LANG_BY_CODE } from '@/lib/languages'
import { cn } from '@/lib/cn'
import { saveTranslation } from '@/lib/supabase'
import { useXlit } from './XlitContext'
import { SectionHeading } from './SectionHeading'

const SAMPLES = ['namaste duniya', 'mera bharat mahan', 'aap kaise hain?', 'dhanyavaad dosto']
const SPLIT = /(\s+|[.,!?;:"“”'‘’()[\]{}।॥|\-–—/]+)/

type Token = { text: string; isWord: boolean; key: string }

function tokenize(input: string, dir: Direction, lang: string): Token[] {
  return input
    .split(SPLIT)
    .filter(Boolean)
    .map((text) => {
      const isWord = dir === 'en2indic' ? /^[A-Za-z]+$/.test(text) : /\p{L}/u.test(text) && !/[A-Za-z]/.test(text)
      const word = dir === 'en2indic' ? text.toLowerCase() : text
      return { text, isWord, key: `${dir}:${lang}:${word}` }
    })
}

const wordOf = (key: string) => key.slice(key.indexOf(':', key.indexOf(':') + 1) + 1)

export function Playground() {
  const { lang, setLang, dir, setDir, status, recheck, addSaved, canSave } = useXlit()
  const [input, setInput] = useState('namaste duniya')
  const [cache, setCache] = useState<Record<string, string[]>>({})
  const [choice, setChoice] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openKey, setOpenKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'error'>('idle')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  const tokens = useMemo(() => tokenize(input, dir, lang), [input, dir, lang])
  const L = LANG_BY_CODE[lang]

  // Fetch candidates only for words we have not seen in this language/direction.
  // The cache is read through a ref so a finished batch doesn't re-run (and abort) this effect.
  const cacheRef = useRef(cache)
  useEffect(() => {
    cacheRef.current = cache
  }, [cache])
  useEffect(() => {
    if (status === 'offline') return
    const missing = [...new Set(tokens.filter((t) => t.isWord && !cacheRef.current[t.key]).map((t) => t.key))]
    if (missing.length === 0) return

    const ctrl = new AbortController()
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        for (let i = 0; i < missing.length; i += 64) {
          const batch = missing.slice(i, i + 64)
          const result = await transliterateWords(batch.map(wordOf), lang, dir, 5, ctrl.signal)
          setCache((c) => ({ ...c, ...Object.fromEntries(batch.map((k) => [k, result[wordOf(k)]])) }))
        }
        setError(null)
      } catch (e) {
        if (!ctrl.signal.aborted) setError(e instanceof Error ? e.message : 'Request failed')
      } finally {
        if (!ctrl.signal.aborted) setLoading(false)
      }
    }, 280)
    return () => {
      clearTimeout(timer)
      ctrl.abort()
      setLoading(false)
    }
  }, [tokens, lang, dir, status])

  const resolve = (t: Token) => (t.isWord && cache[t.key] ? cache[t.key][choice[t.key] ?? 0] ?? t.text : t.text)
  const outputText = tokens.map(resolve).join('')
  const pending = tokens.some((t) => t.isWord && !cache[t.key])

  useEffect(() => {
    if (!openKey) return
    const close = (e: KeyboardEvent | PointerEvent) => {
      if (e instanceof KeyboardEvent && e.key !== 'Escape') return
      if (e instanceof PointerEvent && (e.target as HTMLElement).closest('[data-candidates]')) return
      setOpenKey(null)
    }
    window.addEventListener('keydown', close)
    window.addEventListener('pointerdown', close)
    return () => {
      window.removeEventListener('keydown', close)
      window.removeEventListener('pointerdown', close)
    }
  }, [openKey])

  const swap = () => {
    if (!pending) setInput(outputText)
    setDir(dir === 'en2indic' ? 'indic2en' : 'en2indic')
    setOpenKey(null)
  }

  const saveKey = `${dir}|${lang}|${input.trim()}|${outputText.trim()}`
  const hasWords = tokens.some((t) => t.isWord)
  const isSaved = lastSaved === saveKey
  const saveDisabled = !canSave || !hasWords || pending || saveState === 'saving' || isSaved

  const save = async () => {
    setSaveState('saving')
    setSaveError(null)
    try {
      const row = await saveTranslation({ direction: dir, lang, source: input.trim(), output: outputText.trim() })
      addSaved(row)
      setLastSaved(saveKey)
      setSaveState('idle')
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Could not save')
      setSaveState('error')
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  const srcLabel = dir === 'en2indic' ? 'Roman' : L.name
  const tgtLabel = dir === 'en2indic' ? L.name : 'Roman'
  const outLang = dir === 'en2indic' ? lang : 'en'
  const outRtl = dir === 'en2indic' && L.rtl

  return (
    <section id="playground" className="relative border-t border-rule px-6 py-32 md:px-10 md:py-44">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-12">
        <div className="col-span-12 lg:col-span-4">
          <SectionHeading index="01" title="Playground" />
          <p className="reveal-up mt-8 max-w-[38ch] leading-relaxed text-paper/70">
            Type phonetically. Every word is sent to the IndicXlit model, which returns its five most likely
            spellings. Click any word in the output to pick a different one.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-8">
          {/* Language rail */}
          <div role="radiogroup" aria-label="Target language" className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                role="radio"
                aria-checked={l.code === lang}
                onClick={() => { setLang(l.code); setOpenKey(null) }}
                className={cn(
                  'flex min-h-11 items-baseline gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-200',
                  l.code === lang
                    ? 'border-paper bg-paper text-ink'
                    : 'border-rule text-paper/70 hover:border-paper/40 hover:text-paper',
                )}
              >
                <span lang={l.code} className="font-indic">{l.native}</span>
                <span className={cn('font-mono text-[10px] uppercase', l.code === lang ? 'text-ink/60' : 'text-muted')}>{l.code}</span>
              </button>
            ))}
          </div>

          {/* Editor */}
          <div className="mt-10 grid overflow-hidden rounded-sm border border-rule md:grid-cols-[1fr_auto_1fr]">
            <div className="flex min-h-[18rem] flex-col bg-ink-2">
              <PanelLabel>{srcLabel}</PanelLabel>
              <label htmlFor="xlit-input" className="sr-only">Text to transliterate ({srcLabel})</label>
              <textarea
                id="xlit-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={2000}
                spellCheck={false}
                lang={dir === 'en2indic' ? 'en' : lang}
                dir={dir === 'indic2en' && L.rtl ? 'rtl' : 'ltr'}
                placeholder={dir === 'en2indic' ? 'Start typing… e.g. “kya haal hai”' : `Paste ${L.name} text…`}
                className={cn(
                  'flex-1 resize-none bg-transparent px-6 pb-6 text-2xl leading-relaxed text-paper placeholder:text-muted/60 focus:outline-none',
                  dir === 'indic2en' && 'font-indic',
                )}
              />
            </div>

            <div className="flex items-center justify-center border-y border-rule bg-ink p-2 md:border-x md:border-y-0">
              <button
                type="button"
                onClick={swap}
                aria-label={`Swap direction to ${tgtLabel} → ${srcLabel}`}
                className="grid size-11 place-items-center rounded-full border border-rule text-paper/70 transition-[color,border-color,rotate] duration-300 hover:rotate-180 hover:border-paper/40 hover:text-paper"
              >
                <ArrowLeftRight className="size-4" />
              </button>
            </div>

            <div className="relative flex min-h-[18rem] flex-col">
              <PanelLabel>
                {tgtLabel}
                <span className="ml-auto flex items-center gap-3">
                  {loading && <Loader2 aria-label="Transliterating" className="size-3.5 animate-spin text-muted" />}
                  <button
                    type="button"
                    onClick={copy}
                    disabled={!outputText}
                    className="flex min-h-8 items-center gap-1.5 text-muted transition-colors hover:text-paper disabled:opacity-40"
                  >
                    {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  {canSave && (
                    <button
                      type="button"
                      onClick={save}
                      disabled={saveDisabled}
                      title={saveError ?? (pending ? 'Wait for the transliteration to finish' : 'Save to the public feed')}
                      className={cn(
                        'flex min-h-8 items-center gap-1.5 transition-colors disabled:opacity-40',
                        saveState === 'error' ? 'text-accent' : isSaved ? 'text-paper' : 'text-muted hover:text-paper',
                      )}
                    >
                      {saveState === 'saving' ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : isSaved ? (
                        <BookmarkCheck className="size-3.5" />
                      ) : (
                        <Bookmark className="size-3.5" />
                      )}
                      {saveState === 'error' ? 'Retry save' : isSaved ? 'Saved' : 'Save'}
                    </button>
                  )}
                </span>
              </PanelLabel>

              <div
                lang={outLang}
                dir={outRtl ? 'rtl' : 'ltr'}
                aria-live="polite"
                className={cn('flex-1 px-6 pb-6 text-[1.75rem] leading-[1.7] whitespace-pre-wrap', dir === 'en2indic' && 'font-indic')}
              >
                {tokens.length === 0 && <span className="text-muted/60">The transliteration appears here.</span>}
                {tokens.map((t, idx) => {
                  if (!t.isWord) return <span key={idx}>{t.text}</span>
                  const cands = cache[t.key]
                  if (!cands) return <span key={idx} className="text-muted/50">{t.text}</span>
                  const open = openKey === `${idx}|${t.key}`
                  return (
                    <span key={idx} className="relative inline-block" data-candidates>
                      <motion.button
                        type="button"
                        key={resolve(t)}
                        initial={{ opacity: 0, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 0.25 }}
                        onClick={() => setOpenKey(open ? null : `${idx}|${t.key}`)}
                        aria-haspopup="listbox"
                        aria-expanded={open}
                        className={cn(
                          'rounded-sm decoration-accent/60 decoration-1 underline-offset-[0.3em] transition-colors hover:underline',
                          open && 'bg-paper/5 underline',
                        )}
                      >
                        {resolve(t)}
                      </motion.button>
                      <AnimatePresence>
                        {open && (
                          <motion.ul
                            role="listbox"
                            aria-label={`Alternatives for ${t.text}`}
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.98 }}
                            transition={{ duration: 0.18 }}
                            className="absolute top-full z-20 mt-2 min-w-40 origin-top rounded-sm border border-rule bg-ink p-1 text-xl shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] ltr:left-0 rtl:right-0"
                          >
                            {cands.map((c, ci) => (
                              <li key={ci}>
                                <button
                                  type="button"
                                  role="option"
                                  aria-selected={(choice[t.key] ?? 0) === ci}
                                  onClick={() => { setChoice((m) => ({ ...m, [t.key]: ci })); setOpenKey(null) }}
                                  className={cn(
                                    'flex w-full items-center gap-4 rounded-sm px-3 py-1.5 text-start transition-colors hover:bg-paper/5',
                                    (choice[t.key] ?? 0) === ci && 'text-accent',
                                  )}
                                >
                                  <span className="font-mono text-[10px] text-muted" dir="ltr">{ci + 1}</span>
                                  {c}
                                </button>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </span>
                  )
                })}
              </div>
            </div>
          </div>

          {saveError && (
            <p role="alert" className="mt-4 text-sm text-accent">
              Couldn&rsquo;t save: {saveError}
            </p>
          )}

          {/* Footer row: samples or errors */}
          <div className="mt-6 flex min-h-11 flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            {status === 'offline' || error ? (
              <BackendHelp error={error} onRetry={() => { setError(null); recheck() }} />
            ) : dir === 'en2indic' ? (
              <>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Try</span>
                {SAMPLES.map((s) => (
                  <button key={s} type="button" onClick={() => setInput(s)} className="wipe-link min-h-8 text-paper/70 hover:text-paper">
                    {s}
                  </button>
                ))}
              </>
            ) : (
              <span className="text-muted">Native → Roman mode. Paste text in {L.name}, or swap back to type phonetically.</span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center px-6 pt-5 pb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
      {children}
    </div>
  )
}

function BackendHelp({ error, onRetry }: { error: string | null; onRetry: () => void }) {
  return (
    <div className="flex w-full flex-wrap items-center gap-x-6 gap-y-3 border-l-2 border-accent pl-4">
      <p className="text-paper/80">
        {error ? <>The model server returned an error: <span className="text-paper">{error}</span></> : 'Can’t reach the IndicXlit backend.'}{' '}
        Start it with <code className="font-mono text-[13px] text-accent">python start_server.py</code> in{' '}
        <code className="font-mono text-[13px]">IndicXlit-master/app</code>.
      </p>
      <button type="button" onClick={onRetry} className="flex min-h-11 items-center gap-2 text-paper/70 hover:text-paper">
        <RotateCw className="size-3.5" /> Retry
      </button>
    </div>
  )
}
