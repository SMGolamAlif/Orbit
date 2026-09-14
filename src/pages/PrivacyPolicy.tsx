import { useEffect } from 'react'
import PublicNav from '@/components/layout/PublicNav'
import PublicFooter from '@/components/layout/PublicFooter'

function PrivacyPolicy() {
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
              Privacy Policy
            </h1>
            <p className="mt-2 text-lg text-ink-secondary">
              Last updated: September 2026
            </p>

            <section className="mt-12 space-y-8">
              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  1. Introduction
                </h2>
                <p className="mt-4 text-ink-secondary">
                  Orbit ("we," "us," "our," or "Company") is committed to protecting your
                  privacy. This Privacy Policy explains how we collect, use, disclose, and
                  safeguard your information when you visit our website and use our
                  application.
                </p>
                <p className="mt-4 text-ink-secondary">
                  Please read this Privacy Policy carefully. If you do not agree with our
                  policies and practices, please do not use our services.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  2. Information We Collect
                </h2>
                <p className="mt-4 text-ink-secondary">
                  We collect information you voluntarily provide:
                </p>
                <ul className="mt-4 list-inside list-disc space-y-2 text-ink-secondary">
                  <li>Account information (name, email, password)</li>
                  <li>Profile data (preferences, profile picture)</li>
                  <li>Usage data (time tracking, focus sessions, tasks, notes)</li>
                  <li>Device information (device type, OS, browser)</li>
                  <li>Communication preferences</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  3. How We Use Your Information
                </h2>
                <p className="mt-4 text-ink-secondary">
                  We use the information we collect to:
                </p>
                <ul className="mt-4 list-inside list-disc space-y-2 text-ink-secondary">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process your transactions and send notifications</li>
                  <li>Personalize your experience and deliver customized content</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                  <li>Send promotional communications (with your consent)</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  4. Data Security
                </h2>
                <p className="mt-4 text-ink-secondary">
                  We implement appropriate technical and organizational measures to
                  protect your personal information against unauthorized access,
                  alteration, disclosure, or destruction. However, no method of
                  transmission over the internet is 100% secure.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  5. Data Retention
                </h2>
                <p className="mt-4 text-ink-secondary">
                  We retain your personal information for as long as necessary to provide
                  our services and fulfill the purposes outlined in this Privacy Policy.
                  You can request deletion of your account at any time.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  6. Third-Party Services
                </h2>
                <p className="mt-4 text-ink-secondary">
                  Our application may contain links to third-party websites and services.
                  We are not responsible for the privacy practices of these external
                  sites. We encourage you to review their privacy policies.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  7. Your Rights
                </h2>
                <p className="mt-4 text-ink-secondary">You have the right to:</p>
                <ul className="mt-4 list-inside list-disc space-y-2 text-ink-secondary">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Data portability</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  8. Children's Privacy
                </h2>
                <p className="mt-4 text-ink-secondary">
                  Orbit is not intended for users under 13 years old. We do not knowingly
                  collect personal information from children under 13. If we discover we
                  have collected information from a child under 13, we will delete it
                  promptly.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  9. Changes to This Policy
                </h2>
                <p className="mt-4 text-ink-secondary">
                  We may update this Privacy Policy from time to time. We will notify you
                  of any changes by posting the new policy and updating the "Last updated"
                  date. Your continued use of the service constitutes your acceptance of
                  the updated policy.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  10. Contact Us
                </h2>
                <p className="mt-4 text-ink-secondary">
                  If you have questions about this Privacy Policy or our privacy
                  practices, please contact us at:
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

export default PrivacyPolicy
