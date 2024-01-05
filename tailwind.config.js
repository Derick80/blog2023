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

    },
  },
  plugins: [    require('@tailwindcss/typography'), require('tailwindcss-animate'),
  require('@tailwindcss/forms'),
],
};
