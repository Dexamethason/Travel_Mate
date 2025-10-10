/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#13a4ec',
        'background-light': '#f6f7f8',
        'background-dark': '#101c22',
        secondary: '#e7eff3',
        text: '#0d171b',
        placeholder: '#4c809a',
        border: '#e7eff3',
        'light-blue': '#cfdfe7',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'Noto Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        'full': '9999px',
      },
    },
  },
  plugins: [],
}
