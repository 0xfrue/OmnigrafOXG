"use client";

import { useEffect, useMemo, useState, type FC, type PropsWithChildren } from "react";
import {
  ConnectionProvider as RawConnectionProvider,
  WalletProvider as RawWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider as RawWalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PROJECT_CONFIG } from "@/config/constants";

import "@solana/wallet-adapter-react-ui/styles.css";

// @solana/wallet-adapter-react types lag behind React 18.3's stricter FC return-type.
// Re-cast to plain FCs to satisfy JSX without giving up prop typing.
const ConnectionProvider = RawConnectionProvider as unknown as FC<PropsWithChildren<{ endpoint: string }>>;
const WalletProvider = RawWalletProvider as unknown as FC<PropsWithChildren<{ wallets: any[]; autoConnect?: boolean }>>;
const WalletModalProvider = RawWalletModalProvider as unknown as FC<PropsWithChildren<{}>>;

const DEFAULT_RPC = "https://api.mainnet-beta.solana.com";

// Solana's Connection ctor throws if endpoint isn't http(s)://. Stale/empty/invalid
// env values would crash the page — fall back to mainnet-beta if anything's off.
function safeRpcEndpoint(raw: string | undefined): string {
  if (!raw) return DEFAULT_RPC;
  if (!/^https?:\/\//i.test(raw)) return DEFAULT_RPC;
  return raw;
}

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const endpoint = safeRpcEndpoint(PROJECT_CONFIG.SOLANA_RPC);
  // Empty array — Phantom, Backpack, Solflare, etc. register automatically via Wallet Standard.
  const wallets = useMemo(() => [], []);

  // Skip the wallet provider stack on server. ConnectionProvider's useMemo
  // calls new Connection() which doesn't survive Next.js static export.
  if (!mounted) return <>{children}</>;

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
