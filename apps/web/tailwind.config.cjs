/** @type {import('tailwindcss').Config} */
// @ts-ignore
const { slateDarkA, mintDarkA } = require("@radix-ui/colors");

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#000",
      white: "#fff",
      slate: {
        ...slateDarkA,
      },
      mint: {
        ...mintDarkA,
      },
    },
    extend: {},
  },
  plugins: [],
};

module.exports = config;
