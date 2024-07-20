/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customYellow: "#FFBD59",
        customBlue: "#021993",
        customRed: "#EF1305",
      },
      fontFamily: {
        arima: ["Arima", "sans-serif"],
        anto: ["Anton SC"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
