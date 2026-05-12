/** @type {import('tailwindcss').Config} */
module.exports = {
  // We added "./components" and the root folder to the search path
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/(tabs)/**/*.{js,jsx,ts,tsx}",
    "./*.{js,jsx,ts,tsx}" 
  ],
  theme: {
    extend: {
      colors: {
        // This ensures the "Emerald" theme Jules used is fully supported
        emerald: {
          500: '#10b981',
          600: '#059669',
        },
        slate: {
          900: '#0f172a',
          950: '#020617',
        },
      },
    },
  },
  plugins: [],
}