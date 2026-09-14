import { useEffect } from 'react'
import PublicNav from '@/components/layout/PublicNav'
import PublicFooter from '@/components/layout/PublicFooter'

function TermsOfService() {
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
              Terms of Service
            </h1>
            <p className="mt-2 text-lg text-ink-secondary">
              Last updated: September 2026
            </p>

            <section className="mt-12 space-y-8">
              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  1. Agreement to Terms
                </h2>
                <p className="mt-4 text-ink-secondary">
                  By accessing and using Orbit, you accept and agree to be bound by the
                  terms and provision of this agreement. If you do not agree to abide by
                  the above, please do not use this service.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  2. Use License
                </h2>
                <p className="mt-4 text-ink-secondary">
                  Permission is granted to temporarily download one copy of the materials
                  (information or software) on Orbit for personal, non-commercial
                  transitory viewing only. This is the grant of a license, not a transfer
                  of title, and under this license you may not:
                </p>
                <ul className="mt-4 list-inside list-disc space-y-2 text-ink-secondary">
                  <li>Modify or copy the materials</li>
                  <li>
                    Use the materials for any commercial purpose or for any public display
                  </li>
                  <li>
                    Attempt to decompile or reverse engineer any software contained on
                    Orbit
                  </li>
                  <li>
                    Remove any copyright or other proprietary notations from the materials
                  </li>
                  <li>
                    Transfer the materials to another person or "mirror" the materials on
                    any other server
                  </li>
                  <li>
                    Use automated tools to access the service in an unauthorized manner
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  3. Disclaimer
                </h2>
                <p className="mt-4 text-ink-secondary">
                  The materials on Orbit are provided on an 'as is' basis. Orbit makes no
                  warranties, expressed or implied, and hereby disclaims and negates all
                  other warranties including, without limitation, implied warranties or
                  conditions of merchantability, fitness for a particular purpose, or
                  non-infringement of intellectual property or other violation of rights.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  4. Limitations
                </h2>
                <p className="mt-4 text-ink-secondary">
                  In no event shall Orbit or its suppliers be liable for any damages
                  (including, without limitation, damages for loss of data or profit, or
                  due to business interruption) arising out of the use or inability to use
                  the materials on Orbit, even if Orbit or an authorized representative
                  has been notified orally or in writing of the possibility of such
                  damage.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  5. Accuracy of Materials
                </h2>
                <p className="mt-4 text-ink-secondary">
                  The materials appearing on Orbit could include technical, typographical,
                  or photographic errors. Orbit does not warrant that any of the materials
                  on the Orbit website are accurate, complete, or current. Orbit may make
                  changes to the materials contained on the Orbit website at any time
                  without notice.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">6. Links</h2>
                <p className="mt-4 text-ink-secondary">
                  Orbit has not reviewed all of the sites linked to its website and is not
                  responsible for the contents of any such linked site. The inclusion of
                  any link does not imply endorsement by Orbit of the site. Use of any
                  such linked website is at the user's own risk.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  7. Modifications
                </h2>
                <p className="mt-4 text-ink-secondary">
                  Orbit may revise these terms of service for the website at any time
                  without notice. By using this website, you are agreeing to be bound by
                  the then current version of these terms of service.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  8. User Responsibilities
                </h2>
                <p className="mt-4 text-ink-secondary">You agree that:</p>
                <ul className="mt-4 list-inside list-disc space-y-2 text-ink-secondary">
                  <li>You will not use Orbit for any unlawful purposes</li>
                  <li>You will not harass, abuse, or harm other users</li>
                  <li>
                    You are responsible for maintaining the confidentiality of your
                    account credentials
                  </li>
                  <li>You are responsible for all activities under your account</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  9. Account Termination
                </h2>
                <p className="mt-4 text-ink-secondary">
                  Orbit reserves the right to terminate or suspend your account at any
                  time for violations of these Terms of Service or any unlawful activity.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  10. Governing Law
                </h2>
                <p className="mt-4 text-ink-secondary">
                  These terms and conditions are governed by and construed in accordance
                  with the laws of the jurisdiction in which Orbit operates, and you
                  irrevocably submit to the exclusive jurisdiction of the courts in that
                  location.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  11. Contact Information
                </h2>
                <p className="mt-4 text-ink-secondary">
                  If you have any questions about these Terms of Service, please contact
                  us at:
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

export default TermsOfService
