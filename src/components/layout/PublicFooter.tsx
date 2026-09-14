import { Mail, Share2, Code2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import orbitMark from '@/assets/Orbit.png'

function PublicFooter() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/#features', external: false },
        { label: 'How it works', href: '/#method', external: false },
        { label: 'Pricing', href: '/#pricing', external: false },
        { label: 'Open app', href: '/app', external: false },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/#about', external: false },
        { label: 'Blog', href: '/', external: false },
        { label: 'Careers', href: '/', external: false },
        { label: 'Contact', href: '/contact', external: false },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Help & FAQ', href: '/faq', external: false },
        {
          label: 'Documentation',
          href: 'https://github.com/SMGolamAlif/Orbit',
          external: true,
        },
        { label: 'API', href: 'https://github.com/SMGolamAlif/Orbit', external: true },
        { label: 'Status', href: 'https://orbit-time.vercel.app', external: true },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy', external: false },
        { label: 'Terms of Service', href: '/terms', external: false },
        { label: 'Cookie Policy', href: '/cookies', external: false },
        { label: 'GDPR', href: '/privacy', external: false },
      ],
    },
  ]

  return (
    <footer className="relative isolate border-t border-primary/10 bg-bg">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgb(var(--color-secondary)/0.06),transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        {/* Main footer content */}
        <div className="grid gap-12 md:grid-cols-5 md:gap-8">
          {/* Brand section */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img src={orbitMark} alt="Orbit" className="h-8 w-8 object-contain" />
              <span className="font-heading text-lg font-semibold text-ink">Orbit</span>
            </Link>
            <p className="mt-4 max-w-xs leading-6 text-ink-secondary">
              A personal system for seeing your time and choosing it with care. Built for
              return visits, not performative productivity.
            </p>

            {/* Social links */}
            <div className="mt-6 flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-surface/50 text-ink-secondary transition-all hover:border-primary/40 hover:bg-surface hover:text-primary"
                aria-label="Twitter"
              >
                <Share2 className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/SMGolamAlif/Orbit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-surface/50 text-ink-secondary transition-all hover:border-primary/40 hover:bg-surface hover:text-primary"
                aria-label="GitHub"
              >
                <Code2 className="h-4 w-4" />
              </a>
              <a
                href="mailto:golamalif4702@GMAIL.COM"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-surface/50 text-ink-secondary transition-all hover:border-primary/40 hover:bg-surface hover:text-primary"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Footer sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
                {section.title}
              </h3>
              <ul className="mt-6 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') && !link.external ? (
                      <Link
                        to={link.href}
                        className="text-sm text-ink-secondary transition-colors hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="text-sm text-ink-secondary transition-colors hover:text-ink"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-12 border-t border-primary/10" />

        {/* Bottom section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-secondary">
            © {currentYear} Orbit. All rights reserved.
          </p>
          <p className="text-xs text-ink-secondary">
            Made with care for intentional living.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default PublicFooter
