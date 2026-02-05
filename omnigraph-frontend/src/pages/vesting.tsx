"use client";

import Head from "next/head";
import { VestingCard } from "@/components/Vesting/VestingCard";
import { Card } from "@/components/ui/Card";

export default function VestingPage() {
  return (
    <>
      <Head>
        <title>OmnigrafOXG - Token Vesting</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Token Vesting</h1>
          <p className="text-gray-400">
            View and claim your vested OGX tokens from early supporter rounds and community allocations.
          </p>
        </div>

        {/* Info Banner with BASE styling */}
        <div className="relative bg-gradient-to-r from-base-blue/20 via-primary-500/20 to-accent-500/20 rounded-2xl p-8 mb-8 border border-base-blue/30 overflow-hidden animate-bg">
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-base-blue/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-10 w-24 h-24 bg-accent-500/20 rounded-full blur-2xl animate-float" style={{animationDelay: '0.8s'}} />

          <div className="relative">
            <h2 className="text-2xl font-bold mb-3 gradient-text">Linear Vesting Schedule</h2>
            <p className="text-gray-300 mb-6 text-lg">
              Tokens vest linearly over time. You can claim your vested tokens at any time -
              there's no need to claim daily, your entitlement accumulates automatically.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-5 border border-base-blue/20 hover:border-base-blue/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-base-blue/20">
                <p className="text-sm text-gray-400 mb-2">Round 1 (R1)</p>
                <p className="font-bold text-lg text-base-blue">35% TGE, 65% over 18 months</p>
              </div>
              <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-5 border border-primary-500/20 hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/20">
                <p className="text-sm text-gray-400 mb-2">Round 2 (R2)</p>
                <p className="font-bold text-lg text-primary-400">35% TGE, 65% over 15 months</p>
              </div>
              <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-5 border border-accent-500/20 hover:border-accent-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent-500/20">
                <p className="text-sm text-gray-400 mb-2">Round 3 (R3)</p>
                <p className="font-bold text-lg text-accent-400">40% TGE, 60% over 12 months</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <VestingCard />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <h3 className="font-semibold mb-3">How Vesting Works</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start space-x-2">
                  <span className="text-primary-400">•</span>
                  <span>Tokens vest continuously (per block)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-400">•</span>
                  <span>Claim anytime - no penalties</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-400">•</span>
                  <span>One-click claim for all rounds</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-400">•</span>
                  <span>Gas-efficient batch claiming</span>
                </li>
              </ul>
            </Card>

            <Card>
              <h3 className="font-semibold mb-3">Need Help?</h3>
              <p className="text-sm text-gray-400 mb-4">
                If you believe you should have vesting allocations but don't see them,
                please contact the team.
              </p>
              <a
                href="https://discord.gg/omnigraph"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 text-sm"
              >
                Join Discord for Support →
              </a>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
