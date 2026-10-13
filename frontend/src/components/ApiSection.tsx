import { SectionHeading } from './SectionHeading'

const ENDPOINTS = [
  { method: 'GET', path: '/languages', desc: 'Supported languages, scripts, direction and fonts.' },
  { method: 'GET', path: '/tl/{lang}/{word}', desc: 'Roman → native. Top-k suggestions for one word.' },
  { method: 'GET', path: '/rtl/{lang}/{word}', desc: 'Native → Roman for one word.' },
  { method: 'POST', path: '/transliterate', desc: 'ULCA batch endpoint: many words or full sentences.' },
]

const CURL = `curl -X POST http://localhost:8888/transliterate \\
  -H "Content-Type: application/json" \\
  -d '{
    "input":  [{ "source": "namaste" }],
    "config": {
      "language": { "sourceLanguage": "en", "targetLanguage": "hi" },
      "isSentence": false,
      "numSuggestions": 5
    }
  }'`

export function ApiSection() {
  return (
    <section id="api" className="border-t border-rule px-6 py-32 md:px-10 md:py-44">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-14">
        <div className="col-span-12 lg:col-span-5">
          <SectionHeading index="06" title="The API" />
          <p className="reveal-up mt-8 max-w-[40ch] leading-relaxed text-paper/70">
            This page talks to the project&rsquo;s Flask server in <code className="font-mono text-sm">IndicXlit-master/app</code>.
            The same endpoints are open to any client; each one is rate-limited to five requests per second.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <table className="reveal-up w-full border-t border-rule text-left text-sm">
            <caption className="sr-only">HTTP endpoints</caption>
            <thead className="sr-only">
              <tr><th>Method</th><th>Path</th><th>Description</th></tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((e) => (
                <tr key={e.path} className="border-b border-rule">
                  <td className="w-16 py-4 align-top font-mono text-[11px] text-accent">{e.method}</td>
                  <td className="py-4 pr-6 align-top font-mono text-[13px] whitespace-nowrap text-paper">{e.path}</td>
                  <td className="hidden py-4 align-top text-paper/60 sm:table-cell">{e.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <pre className="reveal-up mt-10 overflow-x-auto rounded-sm border border-rule bg-ink-2 p-6 font-mono text-[13px] leading-relaxed text-paper/80">
            <code>{CURL}</code>
          </pre>
        </div>
      </div>
    </section>
  )
}
