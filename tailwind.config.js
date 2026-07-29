/** @type {import('tailwindcss').Config} */
function withOpacity(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`
    }
    return `rgb(var(${variable}) / ${opacityValue})`
  }
}

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: withOpacity('--color-bg'),
          soft: withOpacity('--color-bg-soft'),
        },
        surface: {
          DEFAULT: withOpacity('--color-surface'),
          elevated: withOpacity('--color-surface-elevated'),
        },
        glass: 'var(--color-glass)',
        'glass-border': 'var(--color-glass-border)',
        tint: withOpacity('--color-tint'),
        primary: {
          DEFAULT: withOpacity('--color-primary'),
          light: withOpacity('--color-primary-light'),
        },
        secondary: withOpacity('--color-secondary'),
        highlight: withOpacity('--color-highlight'),
        success: withOpacity('--color-success'),
        warning: withOpacity('--color-warning'),
        danger: withOpacity('--color-danger'),
        muted: withOpacity('--color-muted'),
        ink: {
          DEFAULT: withOpacity('--color-ink'),
          secondary: withOpacity('--color-ink-secondary'),
        },
      },
      borderRadius: {
        card: '22px',
        control: '14px',
        cell: '5px',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      backdropBlur: {
        glass: '28px',
      },
      transitionDuration: {
        200: '200ms',
      },
      boxShadow: {
        glow: '0 0 32px rgb(var(--color-primary) / 0.18)',
        glass: 'var(--shadow-glass)',
      },
    },
  },
  plugins: [],
}
