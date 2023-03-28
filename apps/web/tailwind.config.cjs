/** @type {import('tailwindcss').Config} */
// @ts-ignore
const { slateDarkA: slate, mintDarkA: mint } = require("@radix-ui/colors");
// @ts-ignore
const onlyNumbers = (str) => str.replace(/[^0-9]/g, "");

// By default radix colors would create classes like `bg-slate-slateA1` or `bg-slateA1`. passing a color object trough this function creates classes like `bg-slate-1`
// @ts-ignore
const numberfyRadixColorNames = (colors) => {
  const numberfied = {};
  for (const [key, value] of Object.entries(colors)) {
    if (typeof value === "string") {
      // @ts-ignore
      numberfied[onlyNumbers(key)] = value;
    } else {
      // @ts-ignore
      numberfied[key] = numberfyRadixColorNames(value);
    }
  }
  return numberfied;
};

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#000",
      white: "#fff",
      slate: numberfyRadixColorNames(slate),
      mint: numberfyRadixColorNames(mint),
    },
    extend: {},
  },
  plugins: [],
};

module.exports = config;
