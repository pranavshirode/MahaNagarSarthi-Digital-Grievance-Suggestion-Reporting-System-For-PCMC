/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pcmc-navy': '#002e62',
        'pcmc-orange': '#f39200',
      },
    },
  },
  plugins: [],
}