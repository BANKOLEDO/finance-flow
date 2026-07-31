/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm charcoal canvas (terminal ledger)
        canvas: {
          DEFAULT: '#14130F',
          soft: '#1C1A15',
          card: '#211F19',
          deep: '#0D0C09',
          line: '#2C2A22',
        },
        // Warm light text on dark
        ink: {
          DEFAULT: '#F4F1E8',
          soft: '#C9C4B2',
          mute: '#8C8775',
          faint: '#5F5B4D',
        },
        line: {
          DEFAULT: '#2C2A22',
          strong: '#3D392E',
        },
        // Cash green — crisp, not neon
        money: {
          50: '#EBF9F1',
          100: '#D4F3E0',
          200: '#A6E6C0',
          300: '#6ED79B',
          400: '#3ECB79',
          500: '#22B85F',
          600: '#15944A',
          700: '#12763D',
          800: '#105D31',
          900: '#0C4726',
        },
        // Neutral warm grays for hover / fills
        charcoal: {
          50: '#F5F4F0',
          100: '#E9E7E0',
          200: '#D6D3C6',
          300: '#B5B1A0',
          400: '#8F8A78',
          500: '#6E695A',
          600: '#504C41',
          700: '#3A372E',
          800: '#2A2822',
          900: '#1E1D18',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        pixel: ['"Press Start 2P"', 'monospace'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display': ['clamp(2.75rem, 7.5vw, 5.75rem)', { lineHeight: '0.96', letterSpacing: '-0.04em' }],
        'display-sm': ['clamp(2.25rem, 5vw, 4rem)', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      boxShadow: {
        card: '0 1px 0 rgba(0,0,0,0.25), 0 12px 32px -12px rgba(0,0,0,0.55)',
        lift: '0 2px 0 rgba(0,0,0,0.3), 0 24px 48px -16px rgba(0,0,0,0.65)',
        pop: '0 0 0 1px rgba(244,241,232,0.06), 0 40px 80px -24px rgba(0,0,0,0.7)',
        edge: '5px 5px 0 0 rgba(244,241,232,0.08)',
        edgeSm: '3px 3px 0 0 rgba(244,241,232,0.07)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        dash: {
          to: { strokeDashoffset: '0' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: {
        marquee: 'marquee 44s linear infinite',
        'marquee-slow': 'marquee 70s linear infinite',
        blink: 'blink 1.1s step-end infinite',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
