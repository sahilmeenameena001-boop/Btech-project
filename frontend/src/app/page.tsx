import { XlitProvider } from '@/components/XlitContext'
import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { Playground } from '@/components/Playground'
import { SavedFeed } from '@/components/SavedFeed'
import { LanguageIndex } from '@/components/LanguageIndex'
import { Method } from '@/components/Method'
import { Accuracy } from '@/components/Accuracy'
import { ApiSection } from '@/components/ApiSection'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <XlitProvider>
      <Nav />
      <main>
        <Hero />
        <Playground />
        <SavedFeed />
        <LanguageIndex />
        <Method />
        <Accuracy />
        <ApiSection />
      </main>
      <Footer />
    </XlitProvider>
  )
}
