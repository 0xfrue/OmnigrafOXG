import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Web3Provider } from "@/context/Web3Provider";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { GrapheneCanvas } from "@/components/Effects/GrapheneCanvas";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3Provider>
      <GrapheneCanvas />
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0f1117",
            color: "#e8eaed",
            border: "1px solid rgba(56,189,248,0.3)",
          },
          success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
    </Web3Provider>
  );
}
