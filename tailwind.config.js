/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme.js'
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    darkmode: 'media',
    extend: {
      fontFamily: {
        robo: ['Roboto', 'sans-serif', 'system-ui', ...defaultTheme.fontFamily.sans],
        sans: ['Roboto', 'sans-serif', 'system-ui', ...defaultTheme.fontFamily.sans],
        Montserrat:['Montserrat', 'sans-serif', 'system-ui', ...defaultTheme.fontFamily.sans],
      },
      colors: {
  'violet1': '#fdfcfe',
  'violet2': '#fbfaff',
  'violet3': '#f5f2ff',
  'violet4': '#ede9fe',
  'violet5': '#e4defc',
  'violet6': '#d7cff9',
  'violet7': '#c4b8f3',
  'violet8': '#aa99ec',
  'violet9': '#6e56cf',
  'violet10': '#644fc1',
  'violet11': '#5746af',
  'violet12': '#2f265f',
  'violet1_dark': '#17151f',
  'violet2_dark': '#1c172b',
  'violet3_dark': '#271f3f',
  'violet4_dark': '#2d254c',
  'violet5_dark': '#342a58',
  'violet6_dark': '#3d316a',
  'violet7_dark': '#4c3e89',
  'violet8_dark': '#6654c0',
  'violet9_dark': '#6e56cf',
  'violet10_dark': '#836add',
  'violet11_dark': '#b399ff',
  'violet12_dark': '#e2ddfe',
      },
    },
  },
  plugins: [    require('@tailwindcss/typography'),
  require('@tailwindcss/forms'),
],
};
