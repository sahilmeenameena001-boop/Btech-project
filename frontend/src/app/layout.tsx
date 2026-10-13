import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Noto_Nastaliq_Urdu, Noto_Sans_Meetei_Mayek } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const display = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});
// Scripts that Windows/macOS system fonts cover poorly; loaded lazily.
const nastaliq = Noto_Nastaliq_Urdu({ variable: "--font-nastaliq", subsets: ["arabic"], preload: false, display: "swap" });
const meetei = Noto_Sans_Meetei_Mayek({ variable: "--font-meetei", subsets: ["meetei-mayek"], preload: false, display: "swap" });

export const metadata: Metadata = {
  title: "Lipi — Indic transliteration, powered by IndicXlit",
  description:
    "Type Indian languages in the Roman alphabet and read them in their native script. 21 languages, one transformer model, trained on 26M word pairs.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${display.variable} ${nastaliq.variable} ${meetei.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Before first paint: opt into reveal animations only when motion is allowed, so
            content is never hidden for no-JS or reduced-motion visitors. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-ok')`,
          }}
        />
      </head>
      <body className="grain min-h-full bg-ink text-paper">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
