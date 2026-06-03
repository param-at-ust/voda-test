/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'vinto-black': '#000000',
        'vinto-deep': '#010101',
        'vinto-surface': '#0E0E0E',
        'vinto-card': '#111111',
        'vinto-elevated': '#1E1E1E',
        'vinto-red': '#E60000',
        'vinto-red-dark': '#DB0101',
        'vinto-red-glow': '#FF3F3F',
        'vinto-red-soft': '#FF8D8D',
        'vinto-text': '#FFFFFF',
        'vinto-text-secondary': '#DFDFDF',
        'vinto-muted': '#666666',
        'vinto-warm': '#A29191',
        'vinto-success': '#4CAF50',
      },
      fontFamily: {
        urbanist: ['Urbanist', 'sans-serif'],
        instrument: ['Instrument Serif', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display-xxl': ['322px', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-xl': ['240px', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-l': ['112px', { lineHeight: '1', letterSpacing: '-0.015em' }],
        'display-m': ['64px', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        'display-s': ['44px', { lineHeight: '1.1' }],
        'heading-l': ['24px', { lineHeight: '1.2' }],
        'body-l': ['18px', { lineHeight: '1.5' }],
        'ui-heading': ['16px', { lineHeight: '1.3' }],
        'ui-body': ['14px', { lineHeight: '1.5' }],
        'ui-label': ['11px', { lineHeight: '1.3' }],
      },
      backgroundImage: {
        'vinto-gradient': 'radial-gradient(circle at center, rgba(230,0,0,0.15) 0%, transparent 70%)',
        'vinto-gradient-strong': 'radial-gradient(circle at center, rgba(230,0,0,0.3) 0%, transparent 60%)',
      },
    },
  },
  plugins: [],
}
