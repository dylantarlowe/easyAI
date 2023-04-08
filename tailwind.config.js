/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],  
  theme: {
    extend: {
      colors: {
        blueBg: "#E7F2FF",
        lightBlue: "#b1d3fa",
        blue: "#176AE8",
        green: "#17E845",
        purple: "#CB17E8",
      },

    },
  },
  plugins: [],
}
