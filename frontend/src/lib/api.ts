// Client for the IndicXlit Flask server (app/ai4bharat/transliteration/xlit_server.py).
// Requests go to /xlit/* which next.config.ts rewrites to XLIT_API_URL, so no CORS setup is needed.

const BASE = process.env.NEXT_PUBLIC_XLIT_API_URL ?? '/xlit'

export type Direction = 'en2indic' | 'indic2en'

export async function ping(signal?: AbortSignal): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/languages`, { signal, cache: 'no-store' })
    return res.ok
  } catch {
    return false
  }
}

/**
 * Batch word transliteration via the ULCA `/transliterate` endpoint:
 * one request returns top-k candidates for every word, which keeps us
 * well under the server's 5 req/s rate limit.
 */
export async function transliterateWords(
  words: string[],
  lang: string,
  dir: Direction,
  numSuggestions = 5,
  signal?: AbortSignal,
): Promise<Record<string, string[]>> {
  if (words.length === 0) return {}
  const res = await fetch(`${BASE}/transliterate`, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: words.map((source) => ({ source })),
      config: {
        language: dir === 'en2indic'
          ? { sourceLanguage: 'en', targetLanguage: lang }
          : { sourceLanguage: lang, targetLanguage: 'en' },
        isSentence: false,
        numSuggestions,
      },
    }),
  })
  if (res.status === 429) throw new Error('Rate limited — slow down a little.')
  if (!res.ok) throw new Error(`Server responded ${res.status}`)
  const data: { output: { source: string; target: string[] }[] } = await res.json()
  // The server truncates sources to 32 chars, so key by our original word, in order.
  return Object.fromEntries(words.map((w, i) => [w, data.output[i]?.target ?? [w]]))
}
