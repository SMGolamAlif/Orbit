import { useEffect } from 'react'
import PublicNav from '@/components/layout/PublicNav'
import PublicFooter from '@/components/layout/PublicFooter'

function CookiePolicy() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <PublicNav />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <article className="prose prose-invert max-w-none">
            <h1 className="font-heading text-4xl font-bold text-ink sm:text-5xl">
              Cookie Policy
            </h1>
            <p className="mt-2 text-lg text-ink-secondary">
              Last updated: September 2026
            </p>

            <section className="mt-12 space-y-8">
              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  1. What Are Cookies?
                </h2>
                <p className="mt-4 text-ink-secondary">
                  Cookies are small data files stored on your device when you visit our
                  website or use our application. They help us remember your preferences
                  and improve your experience.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  2. Types of Cookies We Use
                </h2>
                <p className="mt-4 text-ink-secondary">
                  <strong className="text-ink">Essential Cookies:</strong> Required for
                  basic functionality of our services (authentication, security).
                </p>
                <p className="mt-4 text-ink-secondary">
                  <strong className="text-ink">Preference Cookies:</strong> Remember your
                  choices and settings (theme, language, layout preferences).
                </p>
                <p className="mt-4 text-ink-secondary">
                  <strong className="text-ink">Analytics Cookies:</strong> Help us
                  understand how users interact with our services to improve performance.
                </p>
                <p className="mt-4 text-ink-secondary">
                  <strong className="text-ink">Marketing Cookies:</strong> Used to track
                  marketing campaign effectiveness and personalize content (only with
                  consent).
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  3. How We Use Cookies
                </h2>
                <ul className="mt-4 list-inside list-disc space-y-2 text-ink-secondary">
                  <li>To authenticate users and maintain secure sessions</li>
                  <li>To save your preferences and personalization settings</li>
                  <li>To analyze website traffic and user behavior</li>
                  <li>To improve and optimize our services</li>
                  <li>To track the effectiveness of marketing campaigns</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  4. Cookie Consent
                </h2>
                <p className="mt-4 text-ink-secondary">
                  When you first visit Orbit, we ask for your consent to use cookies. You
                  can choose to:
                </p>
                <ul className="mt-4 list-inside list-disc space-y-2 text-ink-secondary">
                  <li>Accept all cookies</li>
                  <li>Accept only essential cookies</li>
                  <li>Customize your cookie preferences</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  5. How to Control Cookies
                </h2>
                <p className="mt-4 text-ink-secondary">
                  You can control cookies through your browser settings. Most browsers
                  allow you to:
                </p>
                <ul className="mt-4 list-inside list-disc space-y-2 text-ink-secondary">
                  <li>Block all cookies</li>
                  <li>Block third-party cookies</li>
                  <li>Delete cookies after you close your browser</li>
                  <li>Receive notifications when cookies are being sent</li>
                </ul>
                <p className="mt-4 text-ink-secondary">
                  Note: Blocking essential cookies may affect the functionality of our
                  services.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  6. Third-Party Cookies
                </h2>
                <p className="mt-4 text-ink-secondary">
                  We may allow third-party service providers to place cookies on your
                  device for analytics and marketing purposes. These third parties have
                  their own privacy policies.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  7. Updates to This Policy
                </h2>
                <p className="mt-4 text-ink-secondary">
                  We may update this Cookie Policy from time to time to reflect changes in
                  our practices or applicable laws. We will notify you of significant
                  changes.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  8. Contact Us
                </h2>
                <p className="mt-4 text-ink-secondary">
                  If you have questions about our cookie practices, please contact:
                </p>
                <p className="mt-4 text-ink-secondary">
                  Email: golamalif4702@GMAIL.COM
                  <br />
                  Website: https://orbit-time.vercel.app
                </p>
              </div>
            </section>
          </article>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}

export default CookiePolicy
