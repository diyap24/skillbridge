import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void:       '#0B0B0D',
        deep:       '#131316',
        royal:      '#26262B',
        mauve:      '#FF4F00',
        blush:      '#C9C9CF',
        cream:      '#FFFFFF',
        'gc-bright':'#FF6A1F',
        'gc-deep':  '#D63A00',
        'gc-soft':  '#FF8A45',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        fadeUp:   { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:   { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        float:    { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer:  { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
        halo:     { '0%, 100%': { opacity: '.55', transform: 'scale(1)' }, '50%': { opacity: '.85', transform: 'scale(1.06)' } },
        spinslow: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        'fade-up':  'fadeUp 0.55s ease-out both',
        'fade-in':  'fadeIn 0.4s ease-out both',
        'float':    'float 5s ease-in-out infinite',
        'shimmer':  'shimmer 2s infinite linear',
        'halo':     'halo 6s ease-in-out infinite',
        'spinslow': 'spinslow 18s linear infinite',
      },
      backgroundImage: {
        'grad-btn': 'linear-gradient(180deg, #FF6A1F 0%, #D63A00 100%)',
      },
      boxShadow: {
        'royal':     '0 4px 24px rgba(255,79,0,0.22)',
        'mauve':     '0 8px 32px rgba(255,79,0,0.45)',
        'glow':      '0 0 60px rgba(255,92,26,0.55)',
        'btn-inset': 'inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -2px 0 rgba(0,0,0,0.20)',
      },
    },
  },
  plugins: [],
};

export default config;
