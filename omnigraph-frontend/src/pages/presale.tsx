"use client";

import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useAccount, useChainId, useSwitchChain, useSendTransaction, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { parseEther, parseUnits, type Hex } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PROJECT_CONFIG, COMPLIANCE } from "@/config/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TrustStrip } from "@/components/Presale/TrustStrip";
import { VideoBackground } from "@/components/Effects/VideoBackground";
import { FloatingParticles } from "@/components/Effects/FloatingParticles";

const USDC_ADDRESS = (process.env.NEXT_PUBLIC_USDC_ADDRESS || "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48") as Hex;
const PRESALE_ADDRESS = PROJECT_CONFIG.SALE_CONTRACT_ADDRESS as Hex;

// Minimal ERC20 ABI for approve + transfer
const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
] as const;

type PaymentToken = "USDC" | "ETH";

// ─── Sale Configuration ───────────────────────────────────────
const SALE_IS_LIVE = false;
const PRESALE_PHASES = [
  {
    name: "Private Round",
    price: PROJECT_CONFIG.PRESALE_PRICE,
    min: PROJECT_CONFIG.PRIVATE_MIN,
    max: PROJECT_CONFIG.PRIVATE_MAX,
    cap: PROJECT_CONFIG.PRIVATE_CAP,
    bonus: `${PROJECT_CONFIG.PRESALE_DISCOUNT} Below TGE`,
    start: PROJECT_CONFIG.PRIVATE_START,
    end: PROJECT_CONFIG.PRIVATE_END,
  },
  {
    name: "Public Round",
    price: PROJECT_CONFIG.TGE_PRICE,
    min: PROJECT_CONFIG.PUBLIC_MIN,
    max: PROJECT_CONFIG.PUBLIC_MAX,
    cap: PROJECT_CONFIG.PUBLIC_CAP,
    bonus: "TGE Price",
    start: PROJECT_CONFIG.PUBLIC_START,
    end: PROJECT_CONFIG.PUBLIC_END,
  },
];

// ─── Buy Section (Send Funds) ─────────────────────────────────
type TxStatus = "idle" | "approving" | "sending" | "confirming" | "success" | "error";

function BuySection() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [paymentToken, setPaymentToken] = useState<PaymentToken>("ETH");
  const [amount, setAmount] = useState("");
  const [txStatus, setTxStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // wagmi hooks for sending transactions
  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();

  const isWrongNetwork = isConnected && chainId !== PROJECT_CONFIG.CHAIN_ID;
  const parsedAmount = amount ? parseFloat(amount) : 0;
  const estimatedTokens = parsedAmount > 0
    ? Math.floor(parsedAmount / PROJECT_CONFIG.TGE_PRICE_NUMERIC).toLocaleString()
    : "0";

  const resetTx = () => {
    setTxStatus("idle");
    setTxHash(null);
    setErrorMsg("");
  };

  // Send ETH directly to presale wallet
  const handleSendEth = async () => {
    if (!parsedAmount || parsedAmount <= 0) return;
    setTxStatus("sending");
    setErrorMsg("");
    try {
      const hash = await sendTransactionAsync({
        to: PRESALE_ADDRESS,
        value: parseEther(amount),
      });
      setTxHash(hash);
      setTxStatus("success");
    } catch (err: any) {
      setTxStatus("error");
      setErrorMsg(err?.shortMessage || err?.message || "Transaction failed");
    }
  };

  // Send USDC via ERC20 transfer to presale wallet
  const handleSendUsdc = async () => {
    if (!parsedAmount || parsedAmount <= 0) return;
    setTxStatus("sending");
    setErrorMsg("");
    try {
      const usdcAmount = parseUnits(amount, 6); // USDC has 6 decimals
      const hash = await writeContractAsync({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [PRESALE_ADDRESS, usdcAmount],
      });
      setTxHash(hash);
      setTxStatus("success");
    } catch (err: any) {
      setTxStatus("error");
      setErrorMsg(err?.shortMessage || err?.message || "Transaction failed");
    }
  };

  const handleSend = () => {
    if (paymentToken === "ETH") {
      handleSendEth();
    } else {
      handleSendUsdc();
    }
  };

  // Not connected state
  if (!isConnected) {
    return (
      <div className="space-y-5">
        {/* Primary: send direct — no wallet connection required */}
        <div className="rounded-2xl border border-base-blue/40 bg-gradient-to-br from-base-blue/10 to-accent-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 border border-green-500/40 px-2.5 py-0.5 text-[10px] font-semibold text-green-300 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              No Wallet Connection Required
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Send Direct to the Presale Wallet</h3>
          <p className="text-sm text-gray-300 mb-4">
            Send {PROJECT_CONFIG.ACCEPTED_TOKENS.join(" or ")} on {PROJECT_CONFIG.NETWORK} from any wallet or exchange. Tokens are allocated to the sending address at TGE — you do not need to connect here.
          </p>

          <div className="bg-dark-200/70 rounded-xl p-3 mb-3">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Presale Wallet Address</p>
            <p className="font-mono text-xs text-base-blue break-all select-all">{PROJECT_CONFIG.SALE_CONTRACT_ADDRESS}</p>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => navigator.clipboard.writeText(PROJECT_CONFIG.SALE_CONTRACT_ADDRESS)}
                className="text-[11px] text-accent-400 hover:underline"
              >
                Copy address
              </button>
              <a
                href={`https://basescan.org/address/${PROJECT_CONFIG.SALE_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-base-blue hover:underline"
              >
                View on BaseScan
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-dark-200/50 rounded-lg p-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Network</p>
              <p className="text-sm font-semibold text-white">{PROJECT_CONFIG.NETWORK}</p>
            </div>
            <div className="bg-dark-200/50 rounded-lg p-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Minimum</p>
              <p className="text-sm font-semibold text-white">{PROJECT_CONFIG.PUBLIC_MIN} USDC</p>
            </div>
            <div className="bg-dark-200/50 rounded-lg p-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Accepts</p>
              <p className="text-sm font-semibold text-white">{PROJECT_CONFIG.ACCEPTED_TOKENS.join(" / ")}</p>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 mt-3 leading-relaxed">
            Send only on {PROJECT_CONFIG.NETWORK}. Funds sent on other networks will be lost. Keep records of your transaction hash for allocation verification.
          </p>
        </div>

        {/* Secondary: connect wallet for guided flow */}
        <div className="border-t border-white/5 pt-5">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-3">Prefer an in-browser flow? Connect your wallet to send with one click.</p>
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <Button onClick={openConnectModal} variant="outline" className="px-6 py-2.5 text-sm">
                  Connect Wallet (Optional)
                </Button>
              )}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
    );
  }

  // Wrong network
  if (isWrongNetwork) {
    return (
      <div className="text-center py-8">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 max-w-md mx-auto">
          <h4 className="font-bold text-yellow-400 mb-2">Wrong Network</h4>
          <p className="text-sm text-gray-300 mb-4">
            Switch to {PROJECT_CONFIG.NETWORK} to send funds.
          </p>
          <Button onClick={() => switchChain?.({ chainId: PROJECT_CONFIG.CHAIN_ID })} className="w-full">
            Switch to {PROJECT_CONFIG.NETWORK}
          </Button>
        </div>
      </div>
    );
  }

  // Success state
  if (txStatus === "success" && txHash) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-green-400">Transaction Sent!</h3>
        <p className="text-sm text-gray-300">
          Your {amount} {paymentToken} has been sent to the presale wallet.
        </p>
        <div className="bg-dark-200/60 rounded-xl p-4">
          <p className="text-[10px] text-gray-500 mb-1">Transaction Hash</p>
          <a
            href={`https://basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-base-blue hover:underline break-all"
          >
            {txHash}
          </a>
        </div>
        <div className="bg-base-blue/5 border border-base-blue/20 rounded-xl p-3">
          <p className="text-xs text-gray-400">Estimated tokens</p>
          <p className="text-lg font-bold text-white">{estimatedTokens} GRAF</p>
        </div>
        <Button onClick={resetTx} variant="outline" className="mt-4">
          Make Another Contribution
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Connected Wallet */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-gray-400">Connected</p>
          <p className="font-mono text-xs text-green-400 break-all">{address}</p>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0 ml-3" />
      </div>

      {/* Payment Token */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-base-blue/20 border border-base-blue/50 flex items-center justify-center">
            <span className="text-xs text-base-blue font-bold">1</span>
          </div>
          <label className="text-sm font-semibold text-white">Pay With</label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(["ETH", "USDC"] as PaymentToken[]).map((token) => (
            <button
              key={token}
              type="button"
              onClick={() => { setPaymentToken(token); resetTx(); }}
              disabled={txStatus === "sending" || txStatus === "approving"}
              className={`py-3 rounded-xl font-medium transition-all border ${
                paymentToken === token
                  ? "bg-base-blue/15 text-base-blue border-base-blue/50 shadow-lg shadow-base-blue/10"
                  : "bg-dark-200/50 text-gray-400 border-white/5 hover:border-white/10"
              }`}
            >
              <span className="text-lg">{token === "USDC" ? "💵" : "⟠"}</span>
              <span className="ml-2">{token}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-base-blue/20 border border-base-blue/50 flex items-center justify-center">
            <span className="text-xs text-base-blue font-bold">2</span>
          </div>
          <label className="text-sm font-semibold text-white">Amount ({paymentToken})</label>
        </div>
        <Input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => { setAmount(e.target.value); if (txStatus === "error") resetTx(); }}
          min="0"
          step="any"
          disabled={txStatus === "sending" || txStatus === "approving"}
          suffix={<span className="text-sm font-medium">{paymentToken}</span>}
        />
        <div className="flex justify-between mt-2">
          <p className="text-xs text-gray-500">Min: {PROJECT_CONFIG.PUBLIC_MIN}</p>
          <p className="text-xs text-gray-500">Max: {PROJECT_CONFIG.PUBLIC_MAX}</p>
        </div>

        {parsedAmount > 0 && (
          <div className="mt-3 bg-base-blue/5 border border-base-blue/20 rounded-xl p-3 flex justify-between items-center">
            <span className="text-xs text-gray-400">You receive</span>
            <span className="font-bold text-white">~{estimatedTokens} GRAF</span>
          </div>
        )}
      </div>

      {/* Destination info */}
      <div className="bg-dark-200/40 rounded-xl p-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-gray-500">Sending to presale wallet</p>
          <a
            href={`https://basescan.org/address/${PROJECT_CONFIG.SALE_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-base-blue hover:underline"
          >
            View on BaseScan
          </a>
        </div>
        <p className="font-mono text-[10px] text-gray-400 mt-1 break-all">{PROJECT_CONFIG.SALE_CONTRACT_ADDRESS}</p>
      </div>

      {/* Error */}
      {txStatus === "error" && errorMsg && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
          <p className="text-sm text-red-400">{errorMsg}</p>
        </div>
      )}

      {/* Send Button */}
      <Button
        className="w-full py-4 text-base font-bold"
        disabled={!parsedAmount || parsedAmount <= 0 || txStatus === "sending" || txStatus === "approving"}
        loading={txStatus === "sending" || txStatus === "approving"}
        onClick={handleSend}
      >
        {txStatus === "sending"
          ? "Confirm in Wallet..."
          : txStatus === "approving"
          ? "Approving USDC..."
          : `Send ${parsedAmount > 0 ? amount : ""} ${paymentToken}`}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        {COMPLIANCE.RISK_DISCLOSURE}
      </p>
    </div>
  );
}

// ─── My Contribution Tracker ──────────────────────────────────
interface ContributionData {
  usdc: { total: number; transfers: { amount: number; txHash: string; block: number }[]; count: number };
  eth: { total: number; transfers: { amount: number; txHash: string; block: number }[]; count: number; note: string };
  estimatedTokens: number;
  totalContributions: number;
}

function MyContribution() {
  const { address, isConnected } = useAccount();
  const [lookupAddress, setLookupAddress] = useState("");
  const [contribution, setContribution] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  const effectiveAddress = isConnected && address ? address : lookupAddress;

  const fetchContribution = async (addr: string) => {
    if (!addr || !/^0x[a-fA-F0-9]{40}$/.test(addr)) {
      setError("Enter a valid wallet address.");
      return;
    }
    setLoading(true);
    setError("");
    setContribution(null);
    try {
      const res = await fetch(`/api/presale-contribution?address=${addr}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setContribution(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      fetchContribution(address);
    }
  }, [isConnected, address]);

  const truncateHash = (hash: string) =>
    hash ? `${hash.slice(0, 10)}...${hash.slice(-8)}` : "";

  return (
    <div className="bg-gradient-to-br from-dark-100/80 to-dark-200/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {/* Header - clickable to expand */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-accent-500/10 border border-accent-500/30 flex items-center justify-center">
            <svg className="w-4 h-4 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-white">My Contribution</h3>
            <p className="text-[10px] text-gray-500">
              {isConnected ? "Connected wallet detected" : "Look up any wallet"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {contribution && contribution.usdc.total > 0 && (
            <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-lg">
              ${contribution.usdc.total.toLocaleString()} USDC
            </span>
          )}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-white/5">
          {/* Address Input (if not connected) */}
          {!isConnected && (
            <div className="mt-4 flex gap-2">
              <Input
                type="text"
                placeholder="0x... wallet address"
                value={lookupAddress}
                onChange={(e) => setLookupAddress(e.target.value)}
                className="font-mono text-xs flex-1"
              />
              <Button
                size="sm"
                onClick={() => fetchContribution(lookupAddress)}
                disabled={loading}
                loading={loading}
              >
                Look Up
              </Button>
            </div>
          )}

          {/* Connected wallet auto-lookup */}
          {isConnected && address && (
            <div className="mt-4 bg-green-500/5 border border-green-500/20 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-500">Looking up</p>
                <p className="font-mono text-xs text-green-400 break-all">{address}</p>
              </div>
              <button
                onClick={() => fetchContribution(address)}
                className="text-[10px] text-base-blue hover:underline flex-shrink-0 ml-3"
              >
                Refresh
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="mt-4 flex items-center justify-center space-x-2 py-6">
              <svg className="animate-spin h-5 w-5 text-base-blue" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm text-gray-400">Scanning on-chain transfers...</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Results */}
          {contribution && !loading && (
            <div className="mt-4 space-y-3">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-dark-200/60 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-gray-500 mb-1">USDC Sent</p>
                  <p className="text-base font-bold text-white">${contribution.usdc.total.toLocaleString()}</p>
                </div>
                <div className="bg-dark-200/60 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-gray-500 mb-1">ETH Sent</p>
                  <p className="text-base font-bold text-white">{contribution.eth.total.toFixed(4)}</p>
                </div>
                <div className="bg-dark-200/60 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-gray-500 mb-1">Est. GRAF</p>
                  <p className="text-base font-bold text-white">
                    {contribution.estimatedTokens > 0
                      ? contribution.estimatedTokens.toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>

              {/* No contributions */}
              {contribution.totalContributions === 0 && (
                <div className="bg-dark-200/40 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-400 mb-1">No contributions found</p>
                  <p className="text-xs text-gray-500">
                    This wallet hasn&apos;t sent USDC to the presale address yet.
                    ETH contributions can be verified on{" "}
                    <a
                      href={`https://basescan.org/address/${effectiveAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base-blue hover:underline"
                    >
                      BaseScan
                    </a>.
                  </p>
                </div>
              )}

              {/* USDC Transfer History */}
              {contribution.usdc.transfers.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 mb-2">USDC Transfers ({contribution.usdc.count})</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {contribution.usdc.transfers.map((tx, i) => (
                      <div key={i} className="bg-dark-200/40 rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-white">${tx.amount.toLocaleString()} USDC</p>
                          <a
                            href={`https://basescan.org/tx/${tx.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono text-base-blue hover:underline"
                          >
                            {truncateHash(tx.txHash)}
                          </a>
                        </div>
                        <span className="text-[10px] text-gray-500">Block #{tx.block.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ETH note */}
              {contribution.eth.note && (
                <p className="text-[10px] text-gray-500 text-center">
                  {contribution.eth.note}{" "}
                  <a
                    href={`https://basescan.org/address/${effectiveAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base-blue hover:underline"
                  >
                    View on BaseScan
                  </a>
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Sale Stats Bar ───────────────────────────────────────────
function SaleStats() {
  const [walletBalance, setWalletBalance] = useState<{ eth: number; usdc: number } | null>(null);

  useEffect(() => {
    fetch("/api/presale-balance")
      .then((r) => r.json())
      .then((data) => setWalletBalance({ eth: Number(data.eth) || 0, usdc: Number(data.usdc) || 0 }))
      .catch(() => {});

    // Refresh balance every 30 seconds
    const interval = setInterval(() => {
      fetch("/api/presale-balance")
        .then((r) => r.json())
        .then((data) => setWalletBalance({ eth: Number(data.eth) || 0, usdc: Number(data.usdc) || 0 }))
        .catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatUsd = (n: unknown) => {
    const num = typeof n === "number" ? n : parseFloat(String(n || 0)) || 0;
    return num >= 1000 ? `$${(num / 1000).toFixed(1)}k` : `$${num.toFixed(2)}`;
  };

  return (
    <div className="space-y-4">
      {/* Wallet Balance Tracker */}
      <div className="bg-gradient-to-r from-base-blue/10 via-accent-500/5 to-base-blue/10 rounded-2xl p-4 md:p-6 border border-base-blue/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <h3 className="text-sm font-semibold text-white">Presale Wallet — Live Balance</h3>
          </div>
          <a
            href={`https://basescan.org/address/${PROJECT_CONFIG.SALE_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-base-blue hover:underline"
          >
            View on BaseScan
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-dark-200/60 rounded-xl p-3 md:p-4 text-center">
            <p className="text-[10px] sm:text-xs text-gray-500 mb-1">USDC Raised</p>
            <p className="text-lg sm:text-2xl font-bold text-white">
              {walletBalance ? formatUsd(walletBalance.usdc) : "..."}
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              {walletBalance ? `${(walletBalance.usdc || 0).toLocaleString()} USDC` : "Loading..."}
            </p>
          </div>
          <div className="bg-dark-200/60 rounded-xl p-3 md:p-4 text-center">
            <p className="text-[10px] sm:text-xs text-gray-500 mb-1">ETH Raised</p>
            <p className="text-lg sm:text-2xl font-bold text-white">
              {walletBalance ? `${(walletBalance.eth || 0).toFixed(4)}` : "..."}
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              {walletBalance ? `${walletBalance.eth} ETH` : "Loading..."}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-1.5">
          <div className="w-1 h-1 rounded-full bg-gray-600" />
          <p className="text-[10px] text-gray-600 font-mono truncate">
            {PROJECT_CONFIG.SALE_CONTRACT_ADDRESS}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {[
          { label: "Token Price", value: "TBD" },
          { label: "Network", value: "Base" },
          { label: "Payment", value: "USDC / ETH" },
        ].map((stat, i) => (
          <div key={i} className="bg-dark-200/40 backdrop-blur-sm rounded-xl p-3 md:p-4 text-center border border-white/5">
            <p className="text-[10px] sm:text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className="text-sm sm:text-lg font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Presale Page ────────────────────────────────────────
export default function PresalePage() {
  return (
    <>
      <Head>
        <title>Presale - Omnigrafx | Buy GRAF Token</title>
        <meta name="description" content="Join the Omnigrafx presale. Purchase GRAF tokens on Base network with USDC or ETH." />
      </Head>

      <VideoBackground />
      <FloatingParticles />

      <div className="container mx-auto px-4 py-6 md:py-12 relative z-20">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-base-blue/10 border border-base-blue/30 rounded-full mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium text-base-blue">PRESALE OPEN</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            <span className="gradient-text neon-base">Join the GRAF Presale</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-5">
            Purchase GRAF tokens with USDC or ETH on Base network.
          </p>

          {/* Presale Wallet Address */}
          <div className="max-w-lg mx-auto bg-dark-200/60 border border-base-blue/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400 font-semibold">Presale Wallet</p>
              <a
                href={`https://basescan.org/address/${PROJECT_CONFIG.SALE_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-base-blue hover:underline"
              >
                View on BaseScan
              </a>
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-sm text-base-blue break-all select-all">
                {PROJECT_CONFIG.SALE_CONTRACT_ADDRESS}
              </p>
              <button
                onClick={() => navigator.clipboard.writeText(PROJECT_CONFIG.SALE_CONTRACT_ADDRESS)}
                className="flex-shrink-0 p-2 rounded-lg bg-base-blue/10 hover:bg-base-blue/20 transition-colors"
                title="Copy address"
              >
                <svg className="w-4 h-4 text-base-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="max-w-3xl mx-auto mb-8 md:mb-10">
          <SaleStats />
        </div>

        {/* My Contribution */}
        <div className="max-w-xl mx-auto mb-8 md:mb-10">
          <MyContribution />
        </div>

        {/* Presale Phases */}
        <div className="max-w-3xl mx-auto mb-8 md:mb-10">
          <h3 className="text-sm font-semibold text-gray-400 mb-4 text-center uppercase tracking-wider">Sale Phases</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PRESALE_PHASES.map((phase, i) => (
              <div
                key={i}
                className={`rounded-xl p-4 border transition-all ${
                  i === 0
                    ? "bg-base-blue/10 border-base-blue/30 shadow-lg shadow-base-blue/5"
                    : "bg-dark-200/40 border-white/5"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm text-white">{phase.name}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    i === 0
                      ? "bg-base-blue/20 text-base-blue"
                      : "bg-white/5 text-gray-500"
                  }`}>
                    {phase.bonus}
                  </span>
                </div>
                <p className="text-xl font-bold text-white mb-2">{phase.price}</p>
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>Min: ${phase.min}</span>
                  <span>Max: ${phase.max}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Buy Card */}
        <div className="max-w-xl mx-auto">
          <div className="bg-gradient-to-br from-dark-100/80 to-dark-200/80 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-center space-x-2 py-4 border-b border-white/5">
              <svg className="w-5 h-5 text-base-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-lg font-bold text-white">Buy GRAF Tokens</h2>
            </div>
            <div className="p-5 md:p-8">
              <BuySection />
            </div>
          </div>
        </div>

        {/* Trust Strip */}
        <div className="mt-10 md:mt-16">
          <TrustStrip />
        </div>

        {/* How It Works */}
        <div className="max-w-3xl mx-auto mt-12 md:mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 gradient-text">How the Presale Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Connect or Enter Wallet",
                desc: "Connect your wallet via RainbowKit or manually enter your Base network wallet address.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 6v3" />
                  </svg>
                ),
              },
              {
                title: "Choose Amount",
                desc: "Select USDC or ETH and enter how much you want to contribute. See your estimated GRAF tokens instantly.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008H18v-.008zm0 2.25h.008v.008H18V13.5zM9.75 9h4.5" />
                  </svg>
                ),
              },
              {
                title: "Send Payment",
                desc: "Send USDC or ETH on Base to the presale wallet. Tokens are delivered to your address after confirmation.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-base-blue/10 border border-base-blue/30 flex items-center justify-center mx-auto mb-4 text-base-blue">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vesting Info */}
        <div className="max-w-3xl mx-auto mt-12 md:mt-16">
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <h3 className="font-bold text-xl mb-2 text-center gradient-text">Token Vesting Schedule</h3>
            <p className="text-center text-gray-400 text-sm mb-6">
              50% at TGE · 50% streamed daily over 15 months
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "At TGE", value: "50%", desc: "Unlocked immediately" },
                { label: "Stream", value: "50%", desc: "Daily linear release" },
                { label: "Duration", value: "15 months", desc: "Full unlock by month 15" },
              ].map((item, i) => (
                <div key={i} className="bg-dark-200/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{item.label}</p>
                  <p className="text-2xl font-bold text-white mb-1">{item.value}</p>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Disclosure */}
        <div className="max-w-2xl mx-auto mt-10 text-center">
          <p className="text-xs text-gray-500 mb-3">{COMPLIANCE.RISK_DISCLOSURE}</p>
          <Link href="/faq" className="text-xs text-accent-400 hover:underline">
            FAQ & Due Diligence
          </Link>
        </div>
      </div>
    </>
  );
}
