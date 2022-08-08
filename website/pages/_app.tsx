import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.scss";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>HOPR | Playground</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="/hopr-favicon.svg" />
        <script src="https://cdn.usefathom.com/script.js" data-site="CYGLLAKV" defer></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default App;
