import { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*', 'index.html'],
  darkMode: 'class',
  theme: {
    extend: {}
  },
  plugins: [require('tailwindcss-animate')]
} satisfies Config
