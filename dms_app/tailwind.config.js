/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          blue:    "#0071e3",
          bluehov: "#0077ed",
          gray1:   "#f5f5f7",
          gray2:   "#e8e8ed",
          gray3:   "#d2d2d7",
          gray4:   "#86868b",
          gray5:   "#6e6e73",
          dark1:   "#1c1c1e",
          dark2:   "#2c2c2e",
          dark3:   "#3a3a3c",
          dark4:   "#48484a",
          label:   "#1d1d1f",
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'apple-sm': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'apple':    '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        'apple-lg': '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
      }
    },
  },
  plugins: [],
}
