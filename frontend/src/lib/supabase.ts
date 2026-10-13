import { createClient } from '@supabase/supabase-js'
import type { Direction } from './api'

// Both values are public by design (the publishable key only has the rights that RLS grants).
// Table + policies: supabase/migrations/*_create_saved_translations.sql
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export const supabase = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null

export type SavedTranslation = {
  id: number
  created_at: string
  direction: Direction
  lang: string
  source: string
  output: string
}

export async function listSaved(limit = 24): Promise<SavedTranslation[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('saved_translations')
    .select('id, created_at, direction, lang, source, output')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw new Error(error.message)
  return data as SavedTranslation[]
}

export async function saveTranslation(row: Pick<SavedTranslation, 'direction' | 'lang' | 'source' | 'output'>) {
  if (!supabase) throw new Error('Supabase is not configured')
  const { data, error } = await supabase
    .from('saved_translations')
    .insert(row)
    .select('id, created_at, direction, lang, source, output')
    .single()
  if (error) throw new Error(error.message)
  return data as SavedTranslation
}
