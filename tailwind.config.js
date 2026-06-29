/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#DEDBC8",
      },
      fontFamily: {
        sans: ['"Geist Mono"', '"IBM Plex Mono"', '"Fragment Mono"', 'monospace'],
        serif: ['"Instrument Serif"', 'serif'],
        mono: ['"Geist Mono"', '"IBM Plex Mono"', '"Fragment Mono"', 'monospace'],
        display: ['"Pixelify Sans"', '"Space Grotesk"', '"Clash Display"', 'sans-serif'],
        'pixelify': ['"Pixelify Sans"', 'sans-serif'],
        'handwritten': ['"Toms Handwritten"', 'cursive'],
      },
    },
  },
  plugins: [],
}
