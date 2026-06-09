/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: '#F7F6F3',
        bgSecondary: '#FFFFFF',
        textPrimary: '#0D0D0D',
        textSecondary: '#4A4A4A',
        accentPurple: '#6B5CF6',
        accentTeal: '#0FA884',
        accentAmber: '#F59E0B',
        accentCoral: '#E85D40',
        accentBlue: '#2563EB',
        borderCustom: 'rgba(0,0,0,0.08)',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        syne: ['Syne', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee var(--duration) infinite linear',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-100% - var(--gap, 1rem)))' },
        },
        'marquee-vertical': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(calc(-100% - var(--gap, 1rem)))' },
        },
      },
    },
  },
  plugins: [],
}
