import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-root text-slate-12 selection:bg-mint-4 selection:text-mint-11 font-sans antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
