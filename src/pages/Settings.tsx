import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { Switch } from '@/components/ui/switch'
import { useAccent } from '@/hooks/useAccent'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { LIFE_EXPECTANCY_BY_COUNTRY, estimateLifeExpectancy } from '@/lib/life-expectancy'
import { authService } from '@/services/appwrite'
import { profileService } from '@/services/profile'
import { cn } from '@/lib/utils'

const COUNTRIES = Object.keys(LIFE_EXPECTANCY_BY_COUNTRY).sort()

function Settings() {
  const { user, profile, refreshProfile, refreshUser, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { accentKey, customHex, presets, setPreset, setCustomHex } = useAccent()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name ?? '')
  const [birthDate, setBirthDate] = useState(profile?.birthDate?.slice(0, 10) ?? '')
  const [country, setCountry] = useState(profile?.country ?? '')
  const [lifeExpectancyYears, setLifeExpectancyYears] = useState(profile?.lifeExpectancyYears ?? 80)
  const [timezone, setTimezone] = useState(profile?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone)

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [syncedUserId, setSyncedUserId] = useState(user?.$id)
  if (user && user.$id !== syncedUserId) {
    setSyncedUserId(user.$id)
    setName(user.name ?? '')
  }

  const [syncedProfileAt, setSyncedProfileAt] = useState(profile?.timezone)
  if (profile && profile.timezone !== syncedProfileAt) {
    setSyncedProfileAt(profile.timezone)
    setBirthDate(profile.birthDate?.slice(0, 10) ?? '')
    setCountry(profile.country ?? '')
    setLifeExpectancyYears(profile.lifeExpectancyYears)
    setTimezone(profile.timezone)
  }

  function handleCountryChange(nextCountry: string) {
    setCountry(nextCountry)
    setLifeExpectancyYears(estimateLifeExpectancy(nextCountry))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return
    setSaving(true)
    setSaved(false)
    setError('')

    try {
      if (name.trim() && name.trim() !== user.name) {
        await authService.updateName(name.trim())
        await refreshUser()
      }

      await profileService.saveProfile(user.$id, {
        birthDate,
        country: country || undefined,
        timezone,
        lifeExpectancyYears,
      })
      await refreshProfile()
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error('Failed to save settings.', err)
      setError('Something went wrong while saving. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <GlassCard className="space-y-5 p-6">
        <h2 className="font-heading text-base font-semibold text-ink">Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1.5 block text-ink-secondary">Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-control border border-glass-border bg-tint/5 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block text-ink-secondary">Birth date</span>
              <input
                type="date"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
                required
                className="w-full rounded-control border border-glass-border bg-tint/5 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1.5 block text-ink-secondary">Country</span>
              <select
                value={country}
                onChange={(event) => handleCountryChange(event.target.value)}
                className="w-full rounded-control border border-glass-border bg-tint/5 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary"
              >
                <option value="">Prefer not to say</option>
                {COUNTRIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block text-ink-secondary">Life expectancy (years)</span>
              <input
                type="number"
                min={1}
                max={120}
                value={lifeExpectancyYears}
                onChange={(event) => setLifeExpectancyYears(Number(event.target.value))}
                required
                className="w-full rounded-control border border-glass-border bg-tint/5 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1.5 block text-ink-secondary">Timezone</span>
              <input
                type="text"
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
                required
                className="w-full rounded-control border border-glass-border bg-tint/5 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary"
              />
            </label>
          </div>

          {error ? (
            <p className="rounded-control border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
          ) : null}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
            {saved ? (
              <span className="flex items-center gap-1.5 text-sm text-success">
                <Check className="h-4 w-4" strokeWidth={2} />
                Saved
              </span>
            ) : null}
          </div>
        </form>
      </GlassCard>

      <GlassCard className="space-y-5 p-6">
        <h2 className="font-heading text-base font-semibold text-ink">Appearance</h2>

        <div className="flex items-center justify-between rounded-control border border-glass-border bg-tint/5 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-ink">Dark mode</p>
            <p className="text-xs text-ink-secondary">Switch between dark and light themes.</p>
          </div>
          <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} ariaLabel="Toggle dark mode" />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-ink">Accent color</p>
          <div className="flex flex-wrap gap-3">
            {presets.map((preset) => (
              <button
                key={preset.key}
                type="button"
                onClick={() => setPreset(preset.key)}
                aria-label={preset.label}
                title={preset.label}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-transform hover:scale-105',
                  accentKey === preset.key ? 'border-ink' : 'border-transparent',
                )}
                style={{ backgroundColor: preset.swatch }}
              >
                {accentKey === preset.key ? <Check className="h-4 w-4 text-white drop-shadow" strokeWidth={3} /> : null}
              </button>
            ))}

            <label
              className={cn(
                'relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 transition-transform hover:scale-105',
                accentKey === 'custom' ? 'border-ink' : 'border-glass-border',
              )}
              style={{ background: 'conic-gradient(from 0deg, #ff4d6d, #fbbf24, #34d399, #38bdf8, #a78bfa, #ff4d6d)' }}
              title="Custom color"
            >
              {accentKey === 'custom' ? <Check className="h-4 w-4 text-white drop-shadow" strokeWidth={3} /> : null}
              <input
                type="color"
                value={customHex}
                onChange={(event) => setCustomHex(event.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </label>
          </div>
          <p className="mt-2 text-xs text-ink-secondary">Pick a preset or use the custom picker to build your own theme.</p>
        </div>
      </GlassCard>

      <GlassCard className="space-y-4 p-6">
        <h2 className="font-heading text-base font-semibold text-ink">Account</h2>
        <p className="text-sm text-ink-secondary">Signed in as {user?.email}</p>
        <Button variant="danger" onClick={handleLogout} className="w-fit">
          <LogOut className="h-4 w-4" strokeWidth={2} />
          Log out
        </Button>
      </GlassCard>
    </div>
  )
}

export default Settings
