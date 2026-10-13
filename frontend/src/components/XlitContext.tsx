'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { ping, type Direction } from '@/lib/api'
import { listSaved, supabase, type SavedTranslation } from '@/lib/supabase'

type Status = 'checking' | 'online' | 'offline'

type Ctx = {
  lang: string
  setLang: (code: string) => void
  dir: Direction
  setDir: (d: Direction) => void
  status: Status
  recheck: () => void
  saved: SavedTranslation[] | null // null while loading
  savedError: string | null
  addSaved: (row: SavedTranslation) => void
  canSave: boolean
}

const XlitContext = createContext<Ctx | null>(null)

export function XlitProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState('hi')
  const [dir, setDir] = useState<Direction>('en2indic')
  const [status, setStatus] = useState<Status>('checking')
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    const ctrl = new AbortController()
    ping(ctrl.signal).then((ok) => {
      if (!ctrl.signal.aborted) setStatus(ok ? 'online' : 'offline')
    })
    return () => ctrl.abort()
  }, [nonce])

  const [saved, setSaved] = useState<SavedTranslation[] | null>(null)
  const [savedError, setSavedError] = useState<string | null>(null)
  useEffect(() => {
    listSaved()
      .then(setSaved)
      .catch((e: Error) => {
        setSavedError(e.message)
        setSaved([])
      })
  }, [])
  const addSaved = (row: SavedTranslation) => setSaved((s) => [row, ...(s ?? []).filter((r) => r.id !== row.id)])

  const recheck = () => {
    setStatus('checking')
    setNonce((n) => n + 1)
  }

  return (
    <XlitContext.Provider value={{ lang, setLang, dir, setDir, status, recheck, saved, savedError, addSaved, canSave: supabase !== null }}>
      {children}
    </XlitContext.Provider>
  )
}

export function useXlit() {
  const ctx = useContext(XlitContext)
  if (!ctx) throw new Error('useXlit must be used inside <XlitProvider>')
  return ctx
}
