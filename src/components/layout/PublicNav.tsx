import { Menu, X, Moon, Sun } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import orbitMark from '@/assets/Orbit.png'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/hooks/useAuth'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function PublicNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24)
    }

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-primary/10 transition-all duration-300',
        scrolled
          ? 'bg-bg/95 backdrop-blur-md shadow-lg shadow-primary/5'
          : 'bg-transparent backdrop-blur-0',
      )}
    >
      <nav className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2">
            <img src={orbitMark} alt="Orbit" className="h-8 w-8 object-contain" />
            <span className="font-heading text-lg font-semibold text-ink">Orbit</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="/#features"
              className="text-sm text-ink-secondary transition-colors hover:text-ink"
            >
              Features
            </a>
            <a
              href="/#method"
              className="text-sm text-ink-secondary transition-colors hover:text-ink"
            >
              How it works
            </a>
            <Link
              to="/faq"
              className="text-sm text-ink-secondary transition-colors hover:text-ink"
            >
              FAQ
            </Link>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-surface/50 text-ink-secondary transition-colors hover:bg-surface hover:text-primary"
            >
              {theme === 'dark' ? (
                <Sun className="h-[18px] w-[18px]" strokeWidth={2} />
              ) : (
                <Moon className="h-[18px] w-[18px]" strokeWidth={2} />
              )}
            </button>

            <div className="hidden gap-2 md:flex">
              {user ? (
                <Link to="/app" className={cn(buttonVariants({ size: 'sm' }))}>
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={cn(
                      buttonVariants({
                        size: 'sm',
                        variant: 'secondary',
                        className: 'flex-1',
                      }),
                    )}
                  >
                    Log in
                  </Link>
                  <Link to="/register" className={cn(buttonVariants({ size: 'sm' }))}>
                    Get started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-surface/50 text-ink-secondary md:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="mt-4 space-y-3 border-t border-primary/10 pt-4 md:hidden">
            <a
              href="/#features"
              onClick={() => setIsOpen(false)}
              className="block text-sm text-ink-secondary transition-colors hover:text-ink"
            >
              Features
            </a>
            <a
              href="/#method"
              onClick={() => setIsOpen(false)}
              className="block text-sm text-ink-secondary transition-colors hover:text-ink"
            >
              How it works
            </a>
            <Link
              to="/faq"
              onClick={() => setIsOpen(false)}
              className="block text-sm text-ink-secondary transition-colors hover:text-ink"
            >
              FAQ
            </Link>
            <div className="flex gap-2 pt-4">
              {user ? (
                <Link
                  to="/app"
                  className={cn(buttonVariants({ size: 'sm', className: 'flex-1' }))}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      buttonVariants({
                        size: 'sm',
                        variant: 'secondary',
                        className: 'flex-1',
                      }),
                    )}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className={cn(buttonVariants({ size: 'sm', className: 'flex-1' }))}
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default PublicNav
