import type { Config } from "tailwindcss";

import {
  slateDarkA as slate,
  mintDarkA as mint,
  blackA,
} from "@radix-ui/colors";

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
      black: numberfyRadixColorNames(blackA),
      white: "#fff",
      root: "rgb(5, 5, 10)",
      slate: numberfyRadixColorNames(slate),
      green: numberfyRadixColorNames(mint),
    },
    extend: {
      animation: {
        "fade-in": "fade-in .2s ease",
        "fade-out": "fade-out .2s ease",
      },
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "fade-out": {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
