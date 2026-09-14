import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface FeatureCard {
  id: string
  title: string
  tag: string
  description: string
  image: string
}

interface FeatureSlidingCardsProps {
  features: FeatureCard[]
}

export function FeatureSlidingCards({ features }: FeatureSlidingCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const autoPlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const visibleCards = 4 // Desktop view
  const totalCards = features.length
  // Create display array with duplicates at the end for infinite scroll
  const displayFeatures = [...features, ...features.slice(0, visibleCards)]
  // Real index for counter display (wraps around original features)
  const realIndex = currentIndex % totalCards

  // Handle infinite scroll - jump back to start when reaching end
  useEffect(() => {
    if (currentIndex >= totalCards && !isAnimating) {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
      }
      resetTimeoutRef.current = setTimeout(() => {
        setIsAnimating(true)
        setCurrentIndex(0)
        setTimeout(() => setIsAnimating(false), 50)
      }, 600) // Match animation duration
    }

    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
      }
    }
  }, [currentIndex, totalCards, isAnimating])

  const slideToIndex = (targetIndex: number) => {
    if (isAnimating) return
    setCurrentIndex(targetIndex)
    setIsAutoPlay(false)

    // Restart autoplay after 5 seconds
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current)
    }
    autoPlayTimeoutRef.current = setTimeout(() => {
      setIsAutoPlay(true)
    }, 5000)
  }

  const handlePrev = () => {
    if (currentIndex === 0) {
      slideToIndex(totalCards - 1)
    } else {
      slideToIndex(currentIndex - 1)
    }
  }
  const handleNext = () => slideToIndex(currentIndex + 1)

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1)
    }, 5000)

    return () => {
      clearInterval(interval)
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current)
      }
    }
  }, [isAutoPlay])

  return (
    <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center sm:mb-20 lg:mb-24"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary">
            <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            Interactive Features
          </div>
          <h2 className="font-heading text-4xl font-bold leading-tight text-ink sm:text-5xl lg:text-6xl">
            Explore every feature in detail
          </h2>
          <p className="mt-6 text-lg text-ink-secondary sm:text-xl">
            Slide through each feature and see what makes Orbit special
          </p>
        </motion.div>

        {/* Cards Container - Responsive Multi-Card Carousel */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-4 sm:gap-5 lg:gap-6"
            animate={{ x: -currentIndex * (100 / visibleCards) + '%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{ width: `${displayFeatures.length * (100 / visibleCards)}%` }}
          >
            {displayFeatures.map((feature, index) => (
              <motion.div
                key={`${feature.id}-${index}`}
                className="flex-shrink-0"
                style={{ width: `${100 / visibleCards}%` }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % totalCards) * 0.1 }}
              >
                <div className="group relative h-full overflow-hidden rounded-2xl border border-primary/15 bg-surface/30 shadow-lg shadow-primary/5 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-surface/50 hover:shadow-2xl hover:shadow-primary/15">
                  {/* Image Container - Large for 2K screens */}
                  <div className="relative w-full overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 h-64 sm:h-72 lg:h-80 xl:h-96">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>

                  {/* Content Container */}
                  <div className="flex flex-col p-5 sm:p-6 lg:p-7">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1 pr-3">
                        <h3 className="font-heading text-base font-semibold text-ink sm:text-lg">
                          {feature.title}
                        </h3>
                      </div>
                      <span className="flex-shrink-0 rounded-full bg-primary/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-primary sm:px-3 sm:text-[10px]">
                        {feature.tag}
                      </span>
                    </div>

                    <p className="mb-4 flex-1 text-xs leading-relaxed text-ink-secondary sm:text-sm">
                      {feature.description}
                    </p>

                    <div className="mt-auto h-0.5 w-8 bg-gradient-to-r from-primary to-secondary rounded-full opacity-60 transition-all group-hover:w-12 group-hover:opacity-100" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Controls */}
        <div className="mt-12 flex items-center justify-center gap-6 sm:gap-8 lg:mt-16">
          <button
            onClick={handlePrev}
            className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary transition-all duration-300 hover:bg-primary/20 hover:border-primary/50 active:scale-95 sm:h-12 sm:w-12"
            aria-label="Previous features"
          >
            <ChevronLeft className="h-5 w-5 transition-transform group-hover:scale-110 sm:h-6 sm:w-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-2 sm:gap-2.5">
            {features.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => slideToIndex(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === realIndex
                    ? 'h-2.5 w-8 bg-primary shadow-lg shadow-primary/50'
                    : 'h-2 w-2 bg-primary/30 hover:bg-primary/50'
                }`}
                whileHover={{ scale: 1.1 }}
                aria-label={`Go to feature ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary transition-all duration-300 hover:bg-primary/20 hover:border-primary/50 active:scale-95 sm:h-12 sm:w-12"
            aria-label="Next features"
          >
            <ChevronRight className="h-5 w-5 transition-transform group-hover:scale-110 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Card Counter */}
        <div className="mt-8 text-center text-xs text-ink-secondary sm:text-sm">
          <span className="font-semibold text-primary">{realIndex + 1}</span>
          <span> - </span>
          <span className="font-semibold text-primary">
            {Math.min(realIndex + visibleCards, totalCards)}
          </span>
          <span> of </span>
          <span className="font-semibold">{totalCards}</span>
        </div>
      </div>
    </section>
  )
}
