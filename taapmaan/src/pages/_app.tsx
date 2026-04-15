import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  // Register the TaapMaan service worker once on mount.
  // This runs only in the browser (useEffect never runs on the server).
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[TaapMaan] SW registered, scope:", reg.scope);
        })
        .catch((err) => {
          console.error("[TaapMaan] SW registration failed:", err);
        });
    }
  }, []);

  return <Component {...pageProps} />;
}
