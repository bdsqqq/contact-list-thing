import { type AppType } from "next/app";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={inter.className}>
      <Component {...pageProps} />;
    </div>
  );
};

export default api.withTRPC(MyApp);
