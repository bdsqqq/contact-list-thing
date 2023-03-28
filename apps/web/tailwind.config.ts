import type { Config } from "tailwindcss";

import { slateDarkA as slate, mintDarkA as mint } from "@radix-ui/colors";

const onlyNumbers = (str: string) => str.replace(/[^0-9]/g, "");

// By default radix colors would create classes like `bg-slate-slateA1` or `bg-slateA1`. passing a color object trough this function creates classes like `bg-slate-1`
const numberfyRadixColorNames = (colors: { [key: string]: string }) => {
  const numberfied: {
    [key: string]: string;
  } = {};
  for (const [key, value] of Object.entries(colors)) {
    if (typeof value === "string") {
      numberfied[onlyNumbers(key)] = value;
    }
  }
  return numberfied;
};

export default {
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
} satisfies Config;
