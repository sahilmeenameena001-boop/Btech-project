'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function LenisGsapBridge() {
  const lenis = useLenis(() => ScrollTrigger.update())
  useEffect(() => {
    if (!lenis) return
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => gsap.ticker.remove(raf)
  }, [lenis])
  return null
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Native scrolling for reduced-motion and touch devices.
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch = matchMedia('(pointer: coarse)').matches
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading media queries is client-only
    setEnabled(!reduced && !touch)
  }, [])

  if (!enabled) return <>{children}</>
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true, autoRaf: false }}>
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  )
}

/** Scroll to an in-page anchor through Lenis when it is running, natively otherwise. */
export function useScrollTo() {
  const lenis = useLenis()
  return (target: string) => {
    if (lenis) lenis.scrollTo(target, { offset: -24, duration: 1.4 })
    else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
