import { Html, Head, Main, NextScript } from "next/document";

// Inter Tight is only used by the "Hello" loading screen.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Inter+Tight:wght@500&display=swap";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
