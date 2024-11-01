/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customYellow: "#BF8F43",
        customBlue: "#021993",
        customRed: "#EF1305",
        customPantone: "#F3F0EB",
        customVerde: "#718359",
        customFondo: "#F3F0EB",
        customBlueVerde: "#AFC7AD",
      },
      fontFamily: {
        arima: ["Arima", "sans-serif"],
        anto: ["Anton SC"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
