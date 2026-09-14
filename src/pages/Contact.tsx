import { Mail } from 'lucide-react'
import { useEffect } from 'react'
import PublicNav from '@/components/layout/PublicNav'
import PublicFooter from '@/components/layout/PublicFooter'

function Contact() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <PublicNav />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="mb-12">
            <h1 className="font-heading text-4xl font-bold text-ink sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-4 text-lg text-ink-secondary">
              Have questions? We'd love to hear from you. Reach out to our team.
            </p>
          </div>

          <div className="mx-auto max-w-2xl">
            {/* Email Contact Card */}
            <div className="rounded-2xl border border-primary/15 bg-surface/30 p-8 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-surface/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-ink">
                Get in Touch
              </h3>
              <p className="mt-2 text-sm text-ink-secondary">
                Send us an email and we'll respond as soon as possible. We're here to
                help!
              </p>
              <a
                href="mailto:golamalif4702@GMAIL.COM"
                className="mt-4 inline-block font-medium text-primary hover:underline"
              >
                golamalif4702@GMAIL.COM
              </a>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="mt-16">
            <h2 className="font-heading text-3xl font-bold text-ink">
              Frequently Asked Questions
            </h2>

            <div className="mt-8 space-y-6">
              <div className="rounded-2xl border border-primary/15 bg-surface/30 p-6 backdrop-blur-sm">
                <h3 className="font-heading text-lg font-semibold text-ink">
                  What should I do if I forgot my password?
                </h3>
                <p className="mt-3 text-ink-secondary">
                  Click "Forgot Password" on the login page and follow the instructions.
                  You'll receive a password reset link via email.
                </p>
              </div>

              <div className="rounded-2xl border border-primary/15 bg-surface/30 p-6 backdrop-blur-sm">
                <h3 className="font-heading text-lg font-semibold text-ink">
                  How can I delete my account?
                </h3>
                <p className="mt-3 text-ink-secondary">
                  Go to Settings, scroll to "Danger Zone", and click "Delete Account".
                  Please note this action is irreversible.
                </p>
              </div>

              <div className="rounded-2xl border border-primary/15 bg-surface/30 p-6 backdrop-blur-sm">
                <h3 className="font-heading text-lg font-semibold text-ink">
                  Can I export my data?
                </h3>
                <p className="mt-3 text-ink-secondary">
                  Yes! Go to Settings, find "Data & Privacy", and click "Export My Data"
                  to download all your information.
                </p>
              </div>

              <div className="rounded-2xl border border-primary/15 bg-surface/30 p-6 backdrop-blur-sm">
                <h3 className="font-heading text-lg font-semibold text-ink">
                  Is my data encrypted?
                </h3>
                <p className="mt-3 text-ink-secondary">
                  Yes, all data is encrypted in transit and at rest. We use
                  industry-standard security protocols to protect your information.
                </p>
              </div>

              <div className="rounded-2xl border border-primary/15 bg-surface/30 p-6 backdrop-blur-sm">
                <h3 className="font-heading text-lg font-semibold text-ink">
                  How often should I update my password?
                </h3>
                <p className="mt-3 text-ink-secondary">
                  We recommend changing your password every 90 days. For added security,
                  enable two-factor authentication in Settings.
                </p>
              </div>
            </div>
          </section>

          {/* Response Time */}
          <section className="mt-16 rounded-2xl border border-primary/20 bg-primary/5 p-8">
            <h3 className="font-heading text-xl font-semibold text-ink">Response Time</h3>
            <p className="mt-4 text-ink-secondary">
              We aim to respond to all inquiries within 24 business hours. For urgent
              matters, please mark your email as urgent.
            </p>
          </section>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}

export default Contact
