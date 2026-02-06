"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { PROJECT_CONFIG } from "@/config/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type PaymentToken = "USDC" | "ETH";
type SubmitStatus = "idle" | "loading" | "success" | "error";

export function WhitelistModule() {
  const { address, isConnected } = useAccount();

  const [walletAddress, setWalletAddress] = useState("");
  const [pledgeAmount, setPledgeAmount] = useState("");
  const [paymentToken, setPaymentToken] = useState<PaymentToken>("USDC");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState("");
  const [position, setPosition] = useState<number | null>(null);

  // Auto-fill wallet address when connected
  const effectiveWalletAddress = isConnected && address ? address : walletAddress;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!effectiveWalletAddress || !pledgeAmount) {
      setStatus("error");
      setMessage("Please fill in all required fields");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/whitelist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: effectiveWalletAddress,
          pledgeAmount,
          paymentToken,
          email: email || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to join whitelist");
      }

      setStatus("success");
      setMessage(data.message);
      if (data.position) {
        setPosition(data.position);
      }

      // Reset form (keep wallet address if connected)
      if (!isConnected) {
        setWalletAddress("");
      }
      setPledgeAmount("");
      setEmail("");

    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  // Success State
  if (status === "success") {
    return (
      <div className="bg-gradient-to-br from-green-500/10 to-accent-500/10 rounded-2xl p-4 sm:p-6 md:p-8 border border-green-500/30">
        <div className="text-center">
          <div className="text-4xl sm:text-5xl md:text-6xl mb-4">🎉</div>
          <h3 className="text-xl sm:text-2xl font-bold mb-2 text-green-400">You are on the Whitelist!</h3>
          <p className="text-gray-300 mb-4 text-sm sm:text-base">{message}</p>
          {position && (
            <div className="inline-flex items-center space-x-2 bg-green-500/20 px-4 py-2 rounded-full mb-6">
              <span className="text-green-400 font-bold">#{position}</span>
              <span className="text-gray-400 text-sm">in queue</span>
            </div>
          )}
          <div className="bg-dark-200/50 rounded-xl p-4 sm:p-6 text-left">
            <h4 className="font-bold text-gray-300 mb-3 text-sm sm:text-base">What Happens Next?</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li className="flex items-start space-x-2">
                <span className="text-green-400">✓</span>
                <span>You will receive priority access when the sale goes live</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-400">✓</span>
                <span>Follow our socials for launch announcements</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-400">✓</span>
                <span>Prepare your {paymentToken} on Base network</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => {
              setStatus("idle");
              setPosition(null);
            }}
            className="mt-6 text-sm text-accent-400 hover:underline"
          >
            Update my whitelist entry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-base-blue/10 to-accent-500/10 rounded-2xl p-4 sm:p-6 md:p-8 border border-base-blue/30">
      <h3 className="text-xl sm:text-2xl font-bold mb-2">Join the Whitelist</h3>
      <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
        Get priority access when the token sale goes live
      </p>

      <form onSubmit={handleSubmit}>
        {/* Wallet Address */}
        <div className="mb-3 sm:mb-4">
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
            Wallet Address <span className="text-red-400">*</span>
          </label>
          {isConnected && address ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
              <p className="text-[10px] sm:text-xs text-gray-400 mb-1">Connected Wallet</p>
              <p className="font-mono text-xs sm:text-sm text-green-400 break-all">{address}</p>
            </div>
          ) : (
            <>
              <Input
                type="text"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="font-mono text-xs sm:text-sm"
                required
              />
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                Or connect your wallet to auto-fill
              </p>
            </>
          )}
        </div>

        {/* Payment Token Toggle */}
        <div className="mb-3 sm:mb-4">
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
            Payment Method <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPaymentToken("USDC")}
              className={`flex-1 py-2 rounded-lg text-sm sm:text-base font-medium transition-all ${
                paymentToken === "USDC"
                  ? "bg-base-blue/20 text-base-blue border border-base-blue/50"
                  : "bg-dark-200 text-gray-400 hover:bg-dark-100"
              }`}
            >
              USDC
            </button>
            <button
              type="button"
              onClick={() => setPaymentToken("ETH")}
              className={`flex-1 py-2 rounded-lg text-sm sm:text-base font-medium transition-all ${
                paymentToken === "ETH"
                  ? "bg-base-blue/20 text-base-blue border border-base-blue/50"
                  : "bg-dark-200 text-gray-400 hover:bg-dark-100"
              }`}
            >
              ETH
            </button>
          </div>
        </div>

        {/* Pledge Amount */}
        <div className="mb-3 sm:mb-4">
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
            Intended Pledge Amount ({paymentToken}) <span className="text-red-400">*</span>
          </label>
          <Input
            type="number"
            placeholder="0.00"
            value={pledgeAmount}
            onChange={(e) => setPledgeAmount(e.target.value)}
            className="text-sm sm:text-base"
            min="0"
            step="any"
            required
          />
          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
            This is non-binding — you can adjust when the sale is live
          </p>
        </div>

        {/* Email (Optional) */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
            Email (Optional)
          </label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-sm sm:text-base"
          />
          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
            Get notified when the sale goes live
          </p>
        </div>

        {/* Error Message */}
        {status === "error" && message && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
            <p className="text-sm text-red-400">{message}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full text-sm sm:text-base"
          disabled={status === "loading" || (!effectiveWalletAddress || !pledgeAmount)}
        >
          {status === "loading" ? (
            <span className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Joining...</span>
            </span>
          ) : (
            "Join Whitelist"
          )}
        </Button>

        <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-3 sm:mt-4">
          By joining, you confirm you understand the risks and eligibility restrictions.
        </p>
      </form>
    </div>
  );
}
