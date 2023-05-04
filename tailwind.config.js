/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    darkmode: "media",
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        Montserrat:['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [    require('@tailwindcss/typography'),
  require('@tailwindcss/forms'),
],
};
