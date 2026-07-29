import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { useAuth } from '@/hooks/useAuth'
import { DEFAULT_LIFE_EXPECTANCY, LIFE_EXPECTANCY_BY_COUNTRY, estimateLifeExpectancy } from '@/lib/life-expectancy'
import { profileService } from '@/services/profile'

const COUNTRIES = Object.keys(LIFE_EXPECTANCY_BY_COUNTRY).sort()
const DEFAULT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

function Onboarding() {
  const { user, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [birthDate, setBirthDate] = useState('')
  const [country, setCountry] = useState('')
  const [timezone, setTimezone] = useState(DEFAULT_TIMEZONE)
  const [lifeExpectancyYears, setLifeExpectancyYears] = useState(DEFAULT_LIFE_EXPECTANCY)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function onCountryChange(nextCountry: string) {
    setCountry(nextCountry)
    setLifeExpectancyYears(estimateLifeExpectancy(nextCountry))
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!user) return

    setError('')
    setSubmitting(true)

    try {
      await profileService.saveProfile(user.$id, {
        birthDate,
        country: country || undefined,
        timezone,
        lifeExpectancyYears,
      })
      await refreshProfile()
      navigate('/', { replace: true })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save your profile.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <GlassCard className="w-full max-w-lg space-y-6 p-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">Personalize Orbit</p>
          <h1 className="mt-2 font-heading text-2xl font-semibold text-ink">
            Let&apos;s set up your Life Calendar
          </h1>
          <p className="mt-1 text-sm text-ink-secondary">
            This helps us visualize how much life you&apos;ve lived and how much remains. You can change
            this anytime in Settings.
          </p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm">
            <span className="mb-1.5 block text-ink-secondary">Date of birth</span>
            <input
              type="date"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              required
              max={new Date().toISOString().split('T')[0]}
              className="w-full rounded-control border border-glass-border bg-tint/5 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block text-ink-secondary">Country of birth</span>
            <select
              value={country}
              onChange={(event) => onCountryChange(event.target.value)}
              className="w-full rounded-control border border-glass-border bg-tint/5 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary"
            >
              <option value="" className="bg-surface">
                Select a country (optional)
              </option>
              {COUNTRIES.map((countryName) => (
                <option key={countryName} value={countryName} className="bg-surface">
                  {countryName}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block text-ink-secondary">Expected lifespan (years)</span>
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
            <span className="mb-1.5 block text-ink-secondary">Current timezone</span>
            <input
              type="text"
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
              required
              className="w-full rounded-control border border-glass-border bg-tint/5 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary"
            />
          </label>

          {error ? (
            <p className="rounded-control border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          ) : null}

          <Button type="submit" disabled={submitting} className="w-full justify-center">
            {submitting ? 'Saving...' : 'Start visualizing my time'}
          </Button>
        </form>
      </GlassCard>
    </div>
  )
}

export default Onboarding
