"use client";

import { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PROJECT_CONFIG, COMPLIANCE } from "@/config/constants";

const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((m) => m.WalletMultiButton),
  { ssr: false }
);

// Hardcoded Solana defaults — used if a non-base58 env var (stale EVM hex) overrides PROJECT_CONFIG
const DEFAULT_PRESALE_WALLET = "663atiZucS388vR1i1p7vQAt5EHtLLMxf885FVLJmkgf";
const DEFAULT_USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

function toPubkey(addr: string, fallback: string): PublicKey {
  try { return new PublicKey(addr); } catch { return new PublicKey(fallback); }
}

const PRESALE_WALLET = toPubkey(PROJECT_CONFIG.SALE_CONTRACT_ADDRESS, DEFAULT_PRESALE_WALLET);
const USDC_MINT = toPubkey(PROJECT_CONFIG.USDC_MINT, DEFAULT_USDC_MINT);
const USDC_DECIMALS = 6;

type PaymentToken = "USDC" | "SOL";
type TxStatus = "idle" | "sending" | "success" | "error";

function BuySection() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();

  const [paymentToken, setPaymentToken] = useState<PaymentToken>("SOL");
  const [amount, setAmount] = useState("");
  const [txStatus, setTxStatus] = useState<TxStatus>("idle");
  const [txSig, setTxSig] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const parsedAmount = amount ? parseFloat(amount) : 0;
  const estimatedTokens = parsedAmount > 0
    ? Math.floor(parsedAmount / PROJECT_CONFIG.PRESALE_PRICE_NUMERIC).toLocaleString()
    : "0";

  const reset = () => { setTxStatus("idle"); setTxSig(null); setErrorMsg(""); };

  const handleSend = async () => {
    if (!publicKey || !parsedAmount || parsedAmount <= 0) return;
    setTxStatus("sending");
    setErrorMsg("");
    try {
      const tx = new Transaction();

      if (paymentToken === "SOL") {
        const lamports = Math.round(parsedAmount * LAMPORTS_PER_SOL);
        tx.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: PRESALE_WALLET,
            lamports,
          })
        );
      } else {
        // USDC SPL transfer between associated token accounts
        const fromAta = await getAssociatedTokenAddress(USDC_MINT, publicKey);
        const toAta = await getAssociatedTokenAddress(USDC_MINT, PRESALE_WALLET);

        const fromAccount = await connection.getAccountInfo(fromAta);
        if (!fromAccount) throw new Error("No USDC token account on this wallet. Receive some USDC first.");

        const toAccount = await connection.getAccountInfo(toAta);
        if (!toAccount) {
          // Create the recipient's USDC ATA if it doesn't exist (payer pays rent)
          tx.add(
            createAssociatedTokenAccountInstruction(
              publicKey,        // payer
              toAta,            // ata
              PRESALE_WALLET,   // owner
              USDC_MINT,
              TOKEN_PROGRAM_ID,
              ASSOCIATED_TOKEN_PROGRAM_ID
            )
          );
        }

        const amountUnits = BigInt(Math.round(parsedAmount * 10 ** USDC_DECIMALS));
        tx.add(
          createTransferCheckedInstruction(
            fromAta,
            USDC_MINT,
            toAta,
            publicKey,
            amountUnits,
            USDC_DECIMALS
          )
        );
      }

      const sig = await sendTransaction(tx, connection);
      setTxSig(sig);

      // Wait for confirmation
      const latest = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        { signature: sig, blockhash: latest.blockhash, lastValidBlockHeight: latest.lastValidBlockHeight },
        "confirmed"
      );
      setTxStatus("success");
    } catch (err: any) {
      setTxStatus("error");
      setErrorMsg(err?.message || "Transaction failed");
    }
  };

  if (!connected) {
    return (
      <div>
        <p className="presale-sub" style={{ marginTop: 0 }}>
          Send SOL or USDC on Solana from any wallet, or connect for a guided flow.
        </p>
        <div className="wallet-address" onClick={() => navigator.clipboard.writeText(PROJECT_CONFIG.SALE_CONTRACT_ADDRESS)} title="Click to copy">
          <code>{PROJECT_CONFIG.SALE_CONTRACT_ADDRESS}</code>
          <button className="copy-btn" type="button">Copy</button>
        </div>

        <div className="presale-info-grid">
          <div className="presale-info-item">
            <div className="pi-label">Network</div>
            <div className="pi-value">{PROJECT_CONFIG.NETWORK}</div>
          </div>
          <div className="presale-info-item">
            <div className="pi-label">Minimum</div>
            <div className="pi-value">${PROJECT_CONFIG.PUBLIC_MIN}</div>
          </div>
        </div>

        <a
          href={`https://solscan.io/account/${PROJECT_CONFIG.SALE_CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
          style={{ width: "100%", marginBottom: 16 }}
        >
          View on Solscan →
        </a>

        <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 20, textAlign: "center" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 12 }}>
            Prefer in-browser? Connect for a one-click flow.
          </p>
          <div style={{ display: "inline-block" }}>
            <WalletMultiButton />
          </div>
        </div>
      </div>
    );
  }

  if (txStatus === "success" && txSig) {
    return (
      <div style={{ textAlign: "center" }}>
        <div className="tx-success" style={{ marginBottom: 20 }}>
          <h4 style={{ marginBottom: 8 }}>Transaction Confirmed</h4>
          <p style={{ fontSize: "0.85rem" }}>
            Your {amount} {paymentToken} has been sent to the presale wallet.
          </p>
        </div>
        <div className="presale-info-item" style={{ marginBottom: 16 }}>
          <div className="pi-label">Estimated tokens</div>
          <div className="pi-value">{estimatedTokens} GRAF</div>
        </div>
        <a
          href={`https://solscan.io/tx/${txSig}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
          style={{ width: "100%", marginBottom: 12 }}
        >
          View Transaction →
        </a>
        <button onClick={reset} className="btn btn-secondary" style={{ width: "100%" }}>
          Make Another Contribution
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="tx-info" style={{ marginBottom: 20, fontFamily: "var(--font-mono)" }}>
        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block", textTransform: "uppercase", letterSpacing: "0.06em" }}>Connected</span>
        <span style={{ color: "var(--accent-green)", fontSize: "0.8rem", wordBreak: "break-all" }}>{publicKey?.toBase58()}</span>
      </div>

      <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: 8, fontWeight: 600 }}>Pay With</label>
      <div className="token-select-row">
        {(["SOL", "USDC"] as PaymentToken[]).map((token) => (
          <button
            key={token}
            type="button"
            onClick={() => { setPaymentToken(token); reset(); }}
            disabled={txStatus === "sending"}
            className={`token-select ${paymentToken === token ? "active" : ""}`}
          >
            {token}
          </button>
        ))}
      </div>

      <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: 8, fontWeight: 600 }}>
        Amount ({paymentToken})
      </label>
      <input
        type="number"
        placeholder="0.00"
        value={amount}
        onChange={(e) => { setAmount(e.target.value); if (txStatus === "error") reset(); }}
        min="0"
        step="any"
        disabled={txStatus === "sending"}
        className="presale-input"
        style={{ marginBottom: 8 }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 16 }}>
        <span>Min: ${PROJECT_CONFIG.PUBLIC_MIN}</span>
        <span>Max: ${PROJECT_CONFIG.PUBLIC_MAX}</span>
      </div>

      {parsedAmount > 0 && (
        <div className="presale-info-item" style={{ marginBottom: 16, textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>You receive</span>
          <span className="pi-value" style={{ color: "var(--accent-cyan)" }}>~{estimatedTokens} GRAF</span>
        </div>
      )}

      <div className="tx-info" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Sending to</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", wordBreak: "break-all", color: "var(--text-secondary)" }}>
          {PROJECT_CONFIG.SALE_CONTRACT_ADDRESS}
        </div>
      </div>

      {txStatus === "error" && errorMsg && (
        <div className="tx-error" style={{ marginBottom: 16 }}>{errorMsg}</div>
      )}

      <button
        className="btn btn-primary"
        style={{ width: "100%" }}
        disabled={!parsedAmount || parsedAmount <= 0 || txStatus === "sending"}
        onClick={handleSend}
        data-burst="true"
      >
        {txStatus === "sending" ? "Confirm in Wallet..." : `Send ${amount || ""} ${paymentToken}`}
      </button>

      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
        {COMPLIANCE.RISK_DISCLOSURE}
      </p>
    </div>
  );
}

function LiveBalance() {
  const [b, setB] = useState<{ sol: number; usdc: number } | null>(null);

  useEffect(() => {
    const fetchBalance = () => {
      fetch("/api/presale-balance")
        .then((r) => r.json())
        .then((data) => setB({ sol: Number(data.sol) || 0, usdc: Number(data.usdc) || 0 }))
        .catch(() => {});
    };
    fetchBalance();
    const id = setInterval(fetchBalance, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="presale-info-grid" style={{ marginBottom: 20 }}>
      <div className="presale-info-item" style={{ borderColor: "var(--border-accent)", border: "1px solid var(--border-accent)", background: "rgba(56,189,248,0.04)" }}>
        <div className="pi-label">USDC Raised</div>
        <div className="pi-value" style={{ color: "var(--accent-green)" }}>
          {b ? `$${b.usdc.toLocaleString()}` : "Loading..."}
        </div>
      </div>
      <div className="presale-info-item" style={{ borderColor: "var(--border-accent)", border: "1px solid var(--border-accent)", background: "rgba(56,189,248,0.04)" }}>
        <div className="pi-label">SOL Raised</div>
        <div className="pi-value" style={{ color: "var(--accent-cyan)" }}>
          {b ? `${b.sol.toFixed(4)}` : "Loading..."}
        </div>
      </div>
    </div>
  );
}

export default function PresalePage() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("visible"), obs.unobserve(e.target))),
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".fade-up").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>$GRAF Presale — Buy OMNIGRAF Tokens on Solana</title>
        <meta name="description" content="Join the OMNIGRAF presale. Purchase $GRAF tokens with USDC or SOL on Solana. Private round: 65.8% below TGE price." />
      </Head>

      <section className="page-hero">
        <div className="hero-bg">
          <img src="/images/spacex-orbit.jpg" alt="Graphene in space technology" loading="eager" />
        </div>
        <div className="container page-hero-content">
          <h1>Join the $GRAF Presale</h1>
          <p>Purchase OMNIGRAF tokens with USDC or SOL on Solana. Private round pricing: 65.8% below TGE.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <div className="presale-box fade-up">
            <h3>Send USDC or SOL on Solana</h3>
            <p className="presale-sub">Tokens are delivered to your wallet address after confirmation.</p>

            <LiveBalance />

            <BuySection />
          </div>

          <div style={{ maxWidth: 560, margin: "32px auto 0", textAlign: "center" }}>
            <div className="presale-info-grid">
              <div className="presale-info-item">
                <div className="pi-label">Presale Price</div>
                <div className="pi-value" style={{ color: "var(--accent-green)" }}>{PROJECT_CONFIG.PRESALE_PRICE}</div>
              </div>
              <div className="presale-info-item">
                <div className="pi-label">TGE Price</div>
                <div className="pi-value">{PROJECT_CONFIG.TGE_PRICE}</div>
              </div>
              <div className="presale-info-item">
                <div className="pi-label">Soft Cap</div>
                <div className="pi-value">{PROJECT_CONFIG.SOFT_CAP}</div>
              </div>
              <div className="presale-info-item">
                <div className="pi-label">Hard Cap</div>
                <div className="pi-value">{PROJECT_CONFIG.HARD_CAP}</div>
              </div>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.6, marginTop: 16 }}>
              Soft cap: {PROJECT_CONFIG.SOFT_CAP} (full refund if missed)
            </p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">Sale Phases</div>
            <h2 className="section-title">Two Rounds. One Price Advantage.</h2>
          </div>

          <div className="params-grid fade-up">
            <div className="params-card" style={{ borderColor: "var(--accent-cyan)" }}>
              <h3>Private Round</h3>
              <div className="param-row"><span className="param-key">Price</span><span className="param-val" style={{ color: "var(--accent-green)" }}>{PROJECT_CONFIG.PRESALE_PRICE}</span></div>
              <div className="param-row"><span className="param-key">Discount</span><span className="param-val">65.8% below TGE</span></div>
              <div className="param-row"><span className="param-key">Min / Max</span><span className="param-val">${PROJECT_CONFIG.PRIVATE_MIN} / ${PROJECT_CONFIG.PRIVATE_MAX}</span></div>
              <div className="param-row"><span className="param-key">Status</span><span className="param-val" style={{ color: "var(--accent-green)" }}>OPEN</span></div>
            </div>
            <div className="params-card">
              <h3>Public Round</h3>
              <div className="param-row"><span className="param-key">Price</span><span className="param-val">{PROJECT_CONFIG.TGE_PRICE}</span></div>
              <div className="param-row"><span className="param-key">Discount</span><span className="param-val">TGE price</span></div>
              <div className="param-row"><span className="param-key">Min / Max</span><span className="param-val">${PROJECT_CONFIG.PUBLIC_MIN} / ${PROJECT_CONFIG.PUBLIC_MAX}</span></div>
              <div className="param-row"><span className="param-key">Status</span><span className="param-val" style={{ color: "var(--text-muted)" }}>Coming Soon</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">Process</div>
            <h2 className="section-title">How the Presale Works</h2>
          </div>

          <div className="steps-list fade-up">
            <div className="step-item">
              <div className="step-num">1</div>
              <div className="step-content">
                <h3>Get a Solana Wallet</h3>
                <p>Use Phantom, Backpack, or Solflare. Make sure you&apos;re connected to Solana mainnet.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-num">2</div>
              <div className="step-content">
                <h3>Fund with USDC or SOL</h3>
                <p>Bridge USDC or buy SOL on a major exchange and transfer to your Solana wallet. You need a small amount of SOL for transaction fees.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-num">3</div>
              <div className="step-content">
                <h3>Send to the Presale Address</h3>
                <p>Connect your wallet above and use the form, or copy the presale wallet address and send your contribution. Double-check on Solscan before sending.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-num">4</div>
              <div className="step-content">
                <h3>Receive Your $GRAF Tokens</h3>
                <p>After confirmation, tokens are allocated to your wallet. 50% unlocks at TGE. The remaining 50% streams daily over 15 months.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">Vesting</div>
            <h2 className="section-title">Token Vesting Schedule</h2>
            <p className="section-desc">Claim-on-demand design. Your tokens accumulate automatically. Claim when you want, not when forced. No gas waste on daily claims.</p>
          </div>

          <div className="vesting-grid fade-up">
            <div className="vesting-card">
              <h4>At TGE</h4>
              <div className="vesting-pct" style={{ color: "var(--accent-cyan)" }}>50%</div>
              <div className="vesting-detail">Unlocked immediately</div>
            </div>
            <div className="vesting-card">
              <h4>Streaming</h4>
              <div className="vesting-pct" style={{ color: "var(--accent-green)" }}>50%</div>
              <div className="vesting-detail">Daily linear release</div>
            </div>
            <div className="vesting-card">
              <h4>Duration</h4>
              <div className="vesting-pct" style={{ color: "var(--accent-gold)" }}>15mo</div>
              <div className="vesting-detail">Full unlock by month 15</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">Safety</div>
            <h2 className="section-title">Built-In Safeguards</h2>
          </div>
          <div className="safety-grid fade-up">
            <div className="safety-item"><span className="safety-check">✓</span> Fixed supply — no mint authority</div>
            <div className="safety-item"><span className="safety-check">✓</span> Hard caps on buy/sell taxes</div>
            <div className="safety-item"><span className="safety-check">✓</span> LP locked 24 months</div>
            <div className="safety-item"><span className="safety-check">✓</span> Time-delayed governance</div>
            <div className="safety-item"><span className="safety-check">✓</span> Claim-on-demand vesting</div>
            <div className="safety-item"><span className="safety-check">✓</span> Soft cap refund guarantee</div>
          </div>

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link href="/faq" className="btn btn-secondary">FAQ &amp; Due Diligence</Link>
          </div>
        </div>
      </section>
    </>
  );
}
