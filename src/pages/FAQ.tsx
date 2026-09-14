import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PublicNav from '@/components/layout/PublicNav'
import PublicFooter from '@/components/layout/PublicFooter'

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const faqs = [
    {
      category: 'Getting Started',
      items: [
        {
          question: 'What is Orbit?',
          answer:
            'Orbit is a time management and life planning application designed to help you visualize your life in weeks, manage your time intentionally, and build meaningful habits. It combines life calendar perspective, focus rituals, task management, and personal insights.',
        },
        {
          question: 'How do I create an account?',
          answer:
            'Click "Register" on the landing page, enter your name, email, and password. Accept our Terms of Service and Privacy Policy, then click "Register". You\'ll then be guided through our onboarding process.',
        },
        {
          question: 'Is Orbit free to use?',
          answer:
            'Orbit offers a free tier with essential features. Premium plans are available with advanced analytics, unlimited notes, and priority support.',
        },
      ],
    },
    {
      category: 'Features',
      items: [
        {
          question: 'What is the Life Calendar?',
          answer:
            'The Life Calendar shows your life in weeks. Based on typical life expectancy, you can visualize how many weeks you have left and plan accordingly. Each week is represented as a dot, giving you a unique perspective on time.',
        },
        {
          question: 'How do focus rituals work?',
          answer:
            'Focus rituals are protected time blocks for deep work. Set a duration (25 min, 50 min, 90 min), and the timer will help you maintain momentum. You can track these sessions and see your productivity patterns.',
        },
        {
          question: 'Can I integrate with other apps?',
          answer:
            'Orbit integrates with popular calendars and productivity tools. Check the Settings > Integrations page for the latest supported services.',
        },
      ],
    },
    {
      category: 'Privacy & Security',
      items: [
        {
          question: 'Is my data secure?',
          answer:
            'Yes. All data is encrypted in transit (TLS/SSL) and at rest. We follow industry-standard security practices and comply with GDPR and CCPA regulations.',
        },
        {
          question: 'Who has access to my data?',
          answer:
            'Only you have access to your personal data. We never sell or share your information with third parties without your explicit consent.',
        },
        {
          question: 'Can I export my data?',
          answer:
            'Yes. Go to Settings > Data & Privacy > Export My Data to download all your information in a standard format.',
        },
      ],
    },
    {
      category: 'Troubleshooting',
      items: [
        {
          question: 'Why is Orbit running slowly?',
          answer:
            'Try clearing your browser cache, disabling browser extensions, or using a different browser. If the issue persists, contact golamalif4702@GMAIL.COM.',
        },
        {
          question: 'How do I reset my password?',
          answer:
            'Click "Forgot Password" on the login page. Enter your email, and we\'ll send you a reset link. Follow the instructions to create a new password.',
        },
        {
          question: 'What should I do if I experience a bug?',
          answer:
            'Report bugs through the in-app feedback tool or email golamalif4702@GMAIL.COM with a detailed description and screenshots.',
        },
      ],
    },
    {
      category: 'Billing & Account',
      items: [
        {
          question: 'When do I get charged?',
          answer:
            "If you have a paid plan, you're charged on your renewal date (monthly or yearly, depending on your plan). You can view your billing details in Settings > Billing.",
        },
        {
          question: 'Can I upgrade or downgrade my plan?',
          answer:
            "Yes. Go to Settings > Billing and select a new plan. Changes take effect immediately, and we'll prorate any additional charges.",
        },
        {
          question: 'What is your refund policy?',
          answer:
            "We offer a 30-day money-back guarantee if you're not satisfied. Contact golamalif4702@GMAIL.COM to request a refund.",
        },
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <PublicNav />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="mb-12">
            <h1 className="font-heading text-4xl font-bold text-ink sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-ink-secondary">
              Find answers to common questions about Orbit. Can't find what you're looking
              for?{' '}
              <Link to="/contact" className="font-medium text-primary hover:underline">
                Contact us
              </Link>
              .
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((section, sectionIndex) => (
              <section key={sectionIndex}>
                <h2 className="font-heading text-2xl font-bold text-ink">
                  {section.category}
                </h2>
                <div className="mt-6 space-y-3">
                  {section.items.map((item, itemIndex) => {
                    const globalIndex = sectionIndex * 100 + itemIndex
                    const isOpen = openIndex === globalIndex

                    return (
                      <div
                        key={itemIndex}
                        className="rounded-xl border border-primary/15 bg-surface/30 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-surface/50"
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                          className="w-full px-6 py-4 text-left transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="font-heading font-semibold text-ink">
                              {item.question}
                            </h3>
                            <ChevronDown
                              className={`mt-1 flex-shrink-0 h-5 w-5 text-primary transition-transform ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </button>

                        {isOpen && (
                          <div className="border-t border-primary/10 px-6 py-4">
                            <p className="text-sm leading-relaxed text-ink-secondary">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* Contact CTA */}
          <section className="mt-16 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
            <h3 className="font-heading text-xl font-semibold text-ink">
              Still have questions?
            </h3>
            <p className="mt-3 text-ink-secondary">
              Our support team is here to help. Reach out anytime.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-block rounded-lg bg-primary px-6 py-2.5 font-medium text-white transition-colors hover:bg-primary/90"
            >
              Contact Support
            </Link>
          </section>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}

export default FAQ
