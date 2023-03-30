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
        "open-scale-in-fade": "open-scale-in-fade .2s ease",
        "close-scale-out-fade": "close-scale-out-fade .2s ease",
        "open-slide-up-fade": "open-slide-up-fade .2s ease",
        "close-slide-down-fade": "close-slide-down-fade .2s ease",
        "open-slide-down-fade": "open-slide-down-fade .2s ease",
        "close-slide-up-fade": "close-slide-up-fade .2s ease",
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
        "open-scale-in-fade": {
          "0%": {
            opacity: "0",
            transform: "scale(.98)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        "close-scale-out-fade": {
          "0%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "100%": {
            opacity: "0",
            transform: "scale(0)",
          },
        },
        "open-slide-up-fade": {
          "0%": {
            opacity: "0",
            transform: "translateY(4px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "close-slide-down-fade": {
          "0%": {
            opacity: "1",
            transform: "translateY(0)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(4px)",
          },
        },
        "open-slide-down-fade": {
          "0%": {
            opacity: "0",
            transform: "translateY(-4px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "close-slide-up-fade": {
          "0%": {
            opacity: "1",
            transform: "translateY(0)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(-4px)",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
