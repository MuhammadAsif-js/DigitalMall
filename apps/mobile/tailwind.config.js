/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scans App file and all files in the src directory for Tailwind utility classes
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  // Required preset for NativeWind to properly compile styles for React Native
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};