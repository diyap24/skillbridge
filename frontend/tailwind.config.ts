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
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeUp:  { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        float:   { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer: { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
      },
      animation: {
        'fade-up':  'fadeUp 0.55s ease-out both',
        'fade-in':  'fadeIn 0.4s ease-out both',
        'float':    'float 5s ease-in-out infinite',
        'shimmer':  'shimmer 2s infinite linear',
      },
      backgroundImage: {
        'grad-btn':  'linear-gradient(135deg, #522B5B 0%, #854F6C 100%)',
      },
      boxShadow: {
        'royal': '0 4px 24px rgba(82,43,91,0.4)',
        'mauve': '0 4px 24px rgba(133,79,108,0.4)',
        'glow':  '0 0 40px rgba(133,79,108,0.4)',
      },
    },
  },
  plugins: [],
};

export default config;
