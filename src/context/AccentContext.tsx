import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'

interface AccentPreset {
  key: string
  label: string
  primary: string
  secondary: string
  highlight: string
  swatch: string
}

const ACCENT_PRESETS: AccentPreset[] = [
  { key: 'cyan', label: 'Cyan Orbit', primary: '53 217 255', secondary: '122 92 255', highlight: '158 94 255', swatch: '#35D9FF' },
  { key: 'crimson', label: 'Dark Red', primary: '255 77 109', secondary: '190 24 60', highlight: '244 63 94', swatch: '#FF4D6D' },
  { key: 'emerald', label: 'Dark Green', primary: '52 211 153', secondary: '5 150 105', highlight: '132 204 22', swatch: '#34D399' },
  { key: 'violet', label: 'Violet', primary: '167 139 250', secondary: '124 58 237', highlight: '217 70 239', swatch: '#A78BFA' },
  { key: 'amber', label: 'Sunset', primary: '251 191 36', secondary: '249 115 22', highlight: '244 63 94', swatch: '#FBBF24' },
  { key: 'ocean', label: 'Ocean Blue', primary: '56 189 248', secondary: '37 99 235', highlight: '99 102 241', swatch: '#38BDF8' },
]

interface AccentColors {
  primary: string
  secondary: string
  highlight: string
}

interface AccentContextValue {
  accentKey: string
  customHex: string
  presets: AccentPreset[]
  colors: AccentColors
  setPreset: (key: string) => void
  setCustomHex: (hex: string) => void
}

const AccentContext = createContext<AccentContextValue | null>(null)
const STORAGE_KEY = 'orbit-accent'
const DEFAULT_CUSTOM_HEX = '#35D9FF'

function hexToChannels(hex: string): string {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const bigint = parseInt(full, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `${r} ${g} ${b}`
}

function rotateHue(hex: string, degrees: number): string {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const bigint = parseInt(full, 16)
  const r = ((bigint >> 16) & 255) / 255
  const g = ((bigint >> 8) & 255) / 255
  const b = (bigint & 255) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  const d = max - min

  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }

  h = ((h + degrees / 360) % 1 + 1) % 1

  function hue2rgb(p: number, q: number, t: number) {
    let tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1 / 6) return p + (q - p) * 6 * tt
    if (tt < 1 / 2) return q
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
    return p
  }

  let nr: number
  let ng: number
  let nb: number

  if (s === 0) {
    nr = l
    ng = l
    nb = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    nr = hue2rgb(p, q, h + 1 / 3)
    ng = hue2rgb(p, q, h)
    nb = hue2rgb(p, q, h - 1 / 3)
  }

  return `${Math.round(nr * 255)} ${Math.round(ng * 255)} ${Math.round(nb * 255)}`
}

function resolveAccentColors(accentKey: string, customHex: string): AccentColors | null {
  if (accentKey === 'custom') {
    return {
      primary: hexToChannels(customHex),
      secondary: rotateHue(customHex, -30),
      highlight: rotateHue(customHex, 30),
    }
  }

  const preset = ACCENT_PRESETS.find((item) => item.key === accentKey)
  if (!preset) return null

  return { primary: preset.primary, secondary: preset.secondary, highlight: preset.highlight }
}

const DEFAULT_DARK_COLORS: AccentColors = { primary: '53 217 255', secondary: '122 92 255', highlight: '158 94 255' }

function applyAccent(accentKey: string, customHex: string) {
  const root = document.documentElement
  const resolved = resolveAccentColors(accentKey, customHex)

  if (!resolved) {
    root.style.removeProperty('--color-primary')
    root.style.removeProperty('--color-secondary')
    root.style.removeProperty('--color-highlight')
    return
  }

  root.style.setProperty('--color-primary', resolved.primary)
  root.style.setProperty('--color-secondary', resolved.secondary)
  root.style.setProperty('--color-highlight', resolved.highlight)
}

function getInitialAccent(): { accentKey: string; customHex: string } {
  if (typeof window === 'undefined') return { accentKey: 'cyan', customHex: DEFAULT_CUSTOM_HEX }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return { accentKey: 'cyan', customHex: DEFAULT_CUSTOM_HEX }
    const parsed = JSON.parse(stored) as { accentKey?: string; customHex?: string }
    return {
      accentKey: parsed.accentKey ?? 'cyan',
      customHex: parsed.customHex ?? DEFAULT_CUSTOM_HEX,
    }
  } catch {
    return { accentKey: 'cyan', customHex: DEFAULT_CUSTOM_HEX }
  }
}

function AccentProvider({ children }: { children: ReactNode }) {
  const initial = getInitialAccent()
  const [accentKey, setAccentKey] = useState(initial.accentKey)
  const [customHex, setCustomHexState] = useState(initial.customHex)

  useEffect(() => {
    applyAccent(accentKey, customHex)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ accentKey, customHex }))
  }, [accentKey, customHex])

  function setPreset(key: string) {
    setAccentKey(key)
  }

  function setCustomHex(hex: string) {
    setCustomHexState(hex)
    setAccentKey('custom')
  }

  const colors = useMemo<AccentColors>(
    () => resolveAccentColors(accentKey, customHex) ?? DEFAULT_DARK_COLORS,
    [accentKey, customHex],
  )

  const value = useMemo<AccentContextValue>(
    () => ({ accentKey, customHex, presets: ACCENT_PRESETS, colors, setPreset, setCustomHex }),
    [accentKey, customHex, colors],
  )

  return <AccentContext.Provider value={value}>{children}</AccentContext.Provider>
}

export { AccentContext, AccentProvider }
export type { AccentPreset }
