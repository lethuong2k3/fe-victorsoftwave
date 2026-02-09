/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0B1C3E', // Navy from logo
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#3b82f6',
          900: '#0B1C3E',
        },
        accent: {
          DEFAULT: '#FF8C00', // Orange from logo
          500: '#FF8C00',
        }
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'marquee': 'marquee 25s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        shimmer: {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
