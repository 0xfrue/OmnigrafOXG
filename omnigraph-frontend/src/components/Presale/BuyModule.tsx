"use client";

import { useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { PROJECT_CONFIG, COMPLIANCE } from "@/config/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type PaymentToken = "USDC" | "ETH";
type PurchaseMode = "wallet" | "manual";

// Sale status - set to true when sale goes live
const SALE_IS_LIVE = false;

export function BuyModule() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [mode, setMode] = useState<PurchaseMode>("wallet");
  const [paymentToken, setPaymentToken] = useState<PaymentToken>("USDC");
  const [amount, setAmount] = useState("");
  const [manualAddress, setManualAddress] = useState("");
  const [isApproved, setIsApproved] = useState(false);

  const isWrongNetwork = isConnected && chainId !== PROJECT_CONFIG.CHAIN_ID;
  const estimatedTokens = amount ? (parseFloat(amount) / PROJECT_CONFIG.TGE_PRICE_NUMERIC).toFixed(2) : "0";

  // Sale Not Live State
  if (!SALE_IS_LIVE) {
    return (
      <div className="bg-gradient-to-br from-base-blue/10 to-accent-500/10 rounded-2xl p-4 sm:p-6 md:p-8 border border-base-blue/30 opacity-60 pointer-events-none">
        <h3 className="text-xl sm:text-2xl font-bold mb-2">Buy {PROJECT_CONFIG.TOKEN_SYMBOL}</h3>
        <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
          TGE Price: {PROJECT_CONFIG.TGE_PRICE} • Pay with USDC or ETH • Network: {PROJECT_CONFIG.NETWORK}
        </p>

        {/* Mode Toggle - Disabled */}
        <div className="flex gap-3 mb-6">
          <button
            disabled
            className="flex-1 py-3 rounded-xl font-semibold bg-dark-200 text-gray-500 cursor-not-allowed"
          >
            Connect Wallet
          </button>
          <button
            disabled
            className="flex-1 py-3 rounded-xl font-semibold bg-dark-200 text-gray-500 cursor-not-allowed"
          >
            Manual Purchase
          </button>
        </div>

        {/* Not Live Message */}
        <div className="bg-gray-500/10 border border-gray-500/30 rounded-xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 text-center">
          <div className="text-3xl sm:text-4xl md:text-5xl mb-3 md:mb-4">🔒</div>
          <h4 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-300 mb-2">Token Sale Not Live Yet</h4>
          <p className="text-xs sm:text-sm text-gray-400 mb-3 md:mb-4">
            The sale will begin soon. Check back for updates or join our community for announcements.
          </p>
          <div className="inline-flex items-center space-x-2 text-gray-500 text-xs sm:text-sm">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-500" />
            <span>Coming Soon</span>
          </div>
        </div>

        {/* Disabled Input Fields */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Amount to spend
          </label>
          <Input
            type="number"
            placeholder="0.00"
            disabled
            className="opacity-50 cursor-not-allowed"
          />
        </div>

        {/* Estimated Tokens - Disabled */}
        <div className="bg-dark-200/50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">Estimated {PROJECT_CONFIG.TOKEN_SYMBOL}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-600">0.00</p>
        </div>

        <Button className="w-full opacity-50 cursor-not-allowed text-sm sm:text-base" disabled>
          Sale Not Active
        </Button>

        <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-3 sm:mt-4">
          By continuing, you confirm you understand the risks and eligibility restrictions.
        </p>
      </div>
    );
  }

  // Wallet Connect State
  if (mode === "wallet" && !isConnected) {
    return (
      <div className="bg-gradient-to-br from-base-blue/10 to-accent-500/10 rounded-2xl p-4 sm:p-6 md:p-8 border border-base-blue/30">
        <h3 className="text-xl sm:text-2xl font-bold mb-2">Buy {PROJECT_CONFIG.TOKEN_SYMBOL}</h3>
        <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
          TGE Price: {PROJECT_CONFIG.TGE_PRICE} • Pay with USDC or ETH • Network: {PROJECT_CONFIG.NETWORK}
        </p>

        {/* Mode Toggle */}
        <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
          <button
            onClick={() => setMode("wallet")}
            className={`flex-1 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all ${
              mode === "wallet"
                ? "bg-base-blue text-white"
                : "bg-dark-200 text-gray-400 hover:bg-dark-100"
            }`}
          >
            Connect Wallet
          </button>
          <button
            onClick={() => setMode("manual")}
            className={`flex-1 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all ${
              mode === "manual"
                ? "bg-base-blue text-white"
                : "bg-dark-200 text-gray-400 hover:bg-dark-100"
            }`}
          >
            Manual Purchase
          </button>
        </div>

        <div className="bg-dark-200/50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
            Connect your wallet to view eligibility and purchase directly.
          </p>
          <Button className="w-full text-sm sm:text-base">Connect Wallet</Button>
        </div>

        <p className="text-[10px] sm:text-xs text-gray-500 text-center">
          By continuing, you confirm you understand the risks and eligibility restrictions.
        </p>
      </div>
    );
  }

  // Wrong Network State
  if (mode === "wallet" && isWrongNetwork) {
    return (
      <div className="bg-gradient-to-br from-base-blue/10 to-accent-500/10 rounded-2xl p-4 sm:p-6 md:p-8 border border-base-blue/30">
        <h3 className="text-xl sm:text-2xl font-bold mb-2">Buy {PROJECT_CONFIG.TOKEN_SYMBOL}</h3>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <h4 className="font-bold text-yellow-400 mb-2 text-sm sm:text-base">Switch network</h4>
          <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4">
            This sale runs on {PROJECT_CONFIG.NETWORK}. Switch networks to continue.
          </p>
          <Button onClick={() => switchChain?.({ chainId: PROJECT_CONFIG.CHAIN_ID })} className="w-full text-sm sm:text-base">
            Switch to {PROJECT_CONFIG.NETWORK}
          </Button>
          <a href="https://chainlist.org/chain/8453" className="text-[10px] sm:text-xs text-accent-400 hover:underline mt-2 block text-center">
            How to add Base
          </a>
        </div>
      </div>
    );
  }

  // Manual Purchase Mode
  if (mode === "manual") {
    return (
      <div className="bg-gradient-to-br from-base-blue/10 to-accent-500/10 rounded-2xl p-4 sm:p-6 md:p-8 border border-base-blue/30">
        <h3 className="text-xl sm:text-2xl font-bold mb-2">Buy {PROJECT_CONFIG.TOKEN_SYMBOL}</h3>
        <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
          TGE Price: {PROJECT_CONFIG.TGE_PRICE} • Pay with USDC or ETH • Network: {PROJECT_CONFIG.NETWORK}
        </p>

        {/* Mode Toggle */}
        <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
          <button
            onClick={() => setMode("wallet")}
            className={`flex-1 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all ${
              mode === "wallet"
                ? "bg-base-blue text-white"
                : "bg-dark-200 text-gray-400 hover:bg-dark-100"
            }`}
          >
            Connect Wallet
          </button>
          <button
            onClick={() => setMode("manual")}
            className={`flex-1 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all ${
              mode === "manual"
                ? "bg-base-blue text-white"
                : "bg-dark-200 text-gray-400 hover:bg-dark-100"
            }`}
          >
            Manual Purchase
          </button>
        </div>

        {/* Payment Token Toggle */}
        <div className="flex gap-2 mb-4 sm:mb-6">
          <button
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

        {/* Your Wallet Address */}
        <div className="mb-3 sm:mb-4">
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
            Your wallet address (where tokens will be sent)
          </label>
          <Input
            type="text"
            placeholder="0x..."
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            className="font-mono text-xs sm:text-sm"
          />
          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
            Double-check this address. Tokens will be sent here after purchase.
          </p>
        </div>

        {/* Amount */}
        <div className="mb-3 sm:mb-4">
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
            Amount to spend ({paymentToken})
          </label>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-sm sm:text-base"
          />
          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
            Min {PROJECT_CONFIG.PUBLIC_MIN} {paymentToken} • Max {PROJECT_CONFIG.PUBLIC_MAX} {paymentToken}
          </p>
        </div>

        {/* Estimated Tokens */}
        <div className="bg-dark-200/50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <p className="text-xs sm:text-sm text-gray-400 mb-1">Estimated {PROJECT_CONFIG.TOKEN_SYMBOL}</p>
          <p className="text-xl sm:text-2xl font-bold text-white">{estimatedTokens}</p>
        </div>

        {/* Payment Instructions */}
        <div className="bg-accent-500/10 border border-accent-500/30 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <h4 className="font-bold text-accent-400 mb-2 sm:mb-3 text-sm sm:text-base">Payment Instructions</h4>
          <ol className="space-y-2 text-xs sm:text-sm text-gray-300">
            <li>1. Send exactly <span className="font-mono text-white">{amount || "0"} {paymentToken}</span> to:</li>
            <li className="font-mono text-[10px] sm:text-xs bg-dark-200 p-2 sm:p-3 rounded break-all">
              {PROJECT_CONFIG.SALE_CONTRACT_ADDRESS}
            </li>
            <li>2. Include your wallet address in the transaction memo/note (if supported)</li>
            <li>3. Tokens will be sent to <span className="font-mono text-[10px] sm:text-xs">{manualAddress || "your address"}</span> after confirmation</li>
          </ol>
        </div>

        <Button
          className="w-full text-sm sm:text-base"
          disabled={!manualAddress || !amount}
        >
          Generate Payment Instructions
        </Button>

        <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-3 sm:mt-4">
          By continuing, you confirm you understand the risks and eligibility restrictions.
        </p>
      </div>
    );
  }

  // Ready to Buy State (Wallet Connected)
  return (
    <div className="bg-gradient-to-br from-base-blue/10 to-accent-500/10 rounded-2xl p-4 sm:p-6 md:p-8 border border-base-blue/30">
      <h3 className="text-xl sm:text-2xl font-bold mb-2">Buy {PROJECT_CONFIG.TOKEN_SYMBOL}</h3>
      <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
        TGE Price: {PROJECT_CONFIG.TGE_PRICE} • Pay with USDC or ETH • Network: {PROJECT_CONFIG.NETWORK}
      </p>

      {/* Mode Toggle */}
      <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
        <button
          onClick={() => setMode("wallet")}
          className={`flex-1 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all ${
            mode === "wallet"
              ? "bg-base-blue text-white"
              : "bg-dark-200 text-gray-400 hover:bg-dark-100"
          }`}
        >
          Connect Wallet
        </button>
        <button
          onClick={() => setMode("manual")}
          className={`flex-1 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all ${
            mode === "manual"
              ? "bg-base-blue text-white"
              : "bg-dark-200 text-gray-400 hover:bg-dark-100"
          }`}
        >
          Manual Purchase
        </button>
      </div>

      {/* Connected Address */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-2 sm:p-3 mb-4 sm:mb-6">
        <p className="text-[10px] sm:text-xs text-gray-400">Connected</p>
        <p className="font-mono text-xs sm:text-sm text-green-400 break-all">{address}</p>
      </div>

      {/* Payment Token Toggle */}
      <div className="flex gap-2 mb-4 sm:mb-6">
        <button
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

      {/* Amount Input */}
      <div className="mb-3 sm:mb-4">
        <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
          Amount to spend
        </label>
        <Input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="text-sm sm:text-base"
        />
        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
          Min {PROJECT_CONFIG.PUBLIC_MIN} {paymentToken} • Max {PROJECT_CONFIG.PUBLIC_MAX} {paymentToken}
        </p>
      </div>

      {/* Estimated Tokens */}
      <div className="bg-dark-200/50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
        <p className="text-xs sm:text-sm text-gray-400 mb-1">Estimated {PROJECT_CONFIG.TOKEN_SYMBOL}</p>
        <p className="text-xl sm:text-2xl font-bold text-white">{estimatedTokens}</p>
      </div>

      {/* Action Buttons */}
      {paymentToken === "USDC" && !isApproved ? (
        <Button className="w-full mb-2 sm:mb-3 text-sm sm:text-base" onClick={() => setIsApproved(true)}>
          Approve USDC
        </Button>
      ) : null}

      <Button className="w-full text-sm sm:text-base" disabled={!amount}>
        Confirm Purchase
      </Button>

      <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-3 sm:mt-4">
        By continuing, you confirm you understand the risks and eligibility restrictions.
      </p>
    </div>
  );
}
