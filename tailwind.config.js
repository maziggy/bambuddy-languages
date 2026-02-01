/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bambu': {
          'green': '#00AE42',
          'green-dark': '#009939',
          'dark': {
            'primary': '#1a1a1a',
            'secondary': '#2d2d2d',
            'tertiary': '#3d3d3d',
          },
          'gray': '#9ca3af',
        },
      },
    },
  },
  plugins: [],
}
