// Mirrors IndicXlit-master/app/ai4bharat/transliteration/transformer/models/en2indic/lang_list.txt
// and the display names in utils.py, so the UI works even before the backend is up.

export type Lang = {
  code: string
  name: string
  native: string
  script: string
  rtl?: boolean
  family: 'Indo-Aryan' | 'Dravidian' | 'Tibeto-Burman'
}

export const LANGUAGES: Lang[] = [
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', script: 'Bengali–Assamese', family: 'Indo-Aryan' },
  { code: 'bn', name: 'Bangla', native: 'বাংলা', script: 'Bengali–Assamese', family: 'Indo-Aryan' },
  { code: 'brx', name: 'Boro', native: 'बड़ो', script: 'Devanagari', family: 'Tibeto-Burman' },
  { code: 'gom', name: 'Konkani', native: 'कोंकणी', script: 'Devanagari', family: 'Indo-Aryan' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', script: 'Gujarati', family: 'Indo-Aryan' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी', script: 'Devanagari', family: 'Indo-Aryan' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', script: 'Kannada', family: 'Dravidian' },
  { code: 'ks', name: 'Kashmiri', native: 'كٲشُر', script: 'Perso-Arabic', rtl: true, family: 'Indo-Aryan' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली', script: 'Devanagari', family: 'Indo-Aryan' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', script: 'Malayalam', family: 'Dravidian' },
  { code: 'mni', name: 'Manipuri', native: 'ꯃꯤꯇꯩꯂꯣꯟ', script: 'Meetei Mayek', family: 'Tibeto-Burman' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', script: 'Devanagari', family: 'Indo-Aryan' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली', script: 'Devanagari', family: 'Indo-Aryan' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', script: 'Odia', family: 'Indo-Aryan' },
  { code: 'pa', name: 'Panjabi', native: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', family: 'Indo-Aryan' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्', script: 'Devanagari', family: 'Indo-Aryan' },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي', script: 'Perso-Arabic', rtl: true, family: 'Indo-Aryan' },
  { code: 'si', name: 'Sinhala', native: 'සිංහල', script: 'Sinhala', family: 'Indo-Aryan' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', script: 'Tamil', family: 'Dravidian' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', script: 'Telugu', family: 'Dravidian' },
  { code: 'ur', name: 'Urdu', native: 'اُردُو', script: 'Perso-Arabic', rtl: true, family: 'Indo-Aryan' },
]

export const LANG_BY_CODE = Object.fromEntries(LANGUAGES.map((l) => [l.code, l])) as Record<string, Lang>

// One Roman word, rendered across scripts — used by the hero.
export const HERO_WORDS: { code: string; text: string }[] = [
  { code: 'hi', text: 'भारत' },
  { code: 'bn', text: 'ভারত' },
  { code: 'ta', text: 'பாரத்' },
  { code: 'te', text: 'భారత్' },
  { code: 'gu', text: 'ભારત' },
  { code: 'ml', text: 'ഭാരത്' },
  { code: 'pa', text: 'ਭਾਰਤ' },
  { code: 'kn', text: 'ಭಾರತ' },
  { code: 'or', text: 'ଭାରତ' },
  { code: 'ur', text: 'بھارت' },
]

// Top-1 accuracy (%), En→Indic, from the IndicXlit README (Aksharantar benchmark).
export const ACCURACY = {
  native: {
    as: 60.27, bn: 61.7, brx: 70.79, gu: 61.89, hi: 55.59, kn: 76.18, ks: 28.76, gom: 63.06, mai: 72.06,
    ml: 64.73, mni: 83.19, mr: 63.72, ne: 80.25, or: 58.9, pa: 40.27, sa: 78.63, ta: 69.78, te: 84.69, ur: 48.37,
  },
  named: {
    as: 38.62, bn: 37.12, brx: 30.32, gu: 48.89, hi: 58.87, kn: 49.92, ks: 20.23, gom: 34.36, mai: 42.82,
    ml: 33.93, mni: 44.12, mr: 53.57, ne: 52.67, or: 30.63, pa: 36.08, sa: 24.06, ta: 42.12, te: 51.82, ur: 47.77,
  },
} as const satisfies Record<string, Record<string, number>>
