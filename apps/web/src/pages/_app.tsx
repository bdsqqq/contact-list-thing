import { type AppType } from "next/app";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
};

export default api.withTRPC(MyApp);
