/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/sections/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  plugins: [],
  theme: {
    extend: {
      colors: {
        'bgray' : '#34414e',
        'tlight': '#D9D9D9'
      }
    }
  }
}