import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { useAuth } from '@/hooks/useAuth'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await register(name, email, password)
      navigate('/onboarding', { replace: true })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to register.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <GlassCard className="w-full max-w-md space-y-6 p-8">
        <div className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary font-heading text-sm font-semibold text-white">
            O
          </div>
          <h1 className="mt-4 font-heading text-2xl font-semibold text-ink">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-ink-secondary">
            Start visualizing your life in weeks.
          </p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm">
            <span className="mb-1.5 block text-ink-secondary">Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-control border border-glass-border bg-tint/5 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-ink-secondary">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-control border border-glass-border bg-tint/5 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-ink-secondary">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
            {submitting ? 'Creating account...' : 'Register'}
          </Button>
        </form>

        <div className="text-center text-xs text-ink-secondary">
          By creating an account, you agree to our{' '}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Privacy Policy
          </a>
        </div>

        <p className="text-center text-sm text-ink-secondary">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary transition-colors hover:text-highlight hover:underline"
          >
            Log in
          </Link>
        </p>
      </GlassCard>
    </div>
  )
}

export default Register
