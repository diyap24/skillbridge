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
        void:  '#190019',
        deep:  '#2B124C',
        royal: '#522B5B',
        mauve: '#854F6C',
        blush: '#DFB6B2',
        cream: '#FBE4D8',
      },
      animation: {
        'fade-in':      'fadeIn 0.5s ease-out',
        'fade-up':      'fadeUp 0.6s ease-out both',
        'slide-in':     'slideIn 0.4s ease-out both',
        'pulse-slow':   'pulse 3s infinite',
        'shimmer':      'shimmer 1.5s infinite',
        'float':        'float 6s ease-in-out infinite',
        'glow':         'glow 2s ease-in-out infinite alternate',
        'spin-slow':    'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeUp:  { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { '0%': { opacity: '0', transform: 'translateX(-12px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float:   { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        glow:    { '0%': { boxShadow: '0 0 20px rgba(133,79,108,0.3)' }, '100%': { boxShadow: '0 0 50px rgba(133,79,108,0.7)' } },
      },
    },
  },
  plugins: [],
};

export default config;
