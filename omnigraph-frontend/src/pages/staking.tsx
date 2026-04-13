"use client";

import Head from "next/head";
import { StakingCard } from "@/components/Staking/StakingCard";

export default function StakingPage() {
  return (
    <>
      <Head>
        <title>Omnigrafx - Staking</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Stake & Support Research</h1>
          <p className="text-gray-400">
            Stake your OGX tokens or LP tokens to earn rewards while contributing to the graphene research treasury.
          </p>
        </div>

        {/* Info Banner with BASE branding */}
        <div className="relative bg-gradient-to-r from-base-blue/20 via-accent-500/20 to-base-blue/20 rounded-2xl p-8 mb-8 border border-base-blue/30 overflow-hidden animate-bg">
          {/* Floating orbs */}
          <div className="absolute top-5 right-10 w-24 h-24 bg-base-blue/20 rounded-full blur-2xl animate-float" />
          <div className="absolute bottom-5 left-10 w-32 h-32 bg-accent-500/10 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}} />

          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h2 className="text-2xl font-bold mb-2 gradient-text">Earn Rewards, Fund Innovation</h2>
              <p className="text-gray-300 max-w-xl">
                Stakers earn OGX rewards while protocol fees fund graphene R&D initiatives through the community treasury.
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="px-4 py-2 bg-base-blue/20 text-base-blue border border-base-blue/30 rounded-xl text-sm font-semibold glow-base">
                🔬 Supporting Research
              </span>
              <span className="px-4 py-2 bg-accent-500/20 text-accent-400 border border-accent-500/30 rounded-xl text-sm font-semibold">
                ⚡ Built on Base
              </span>
            </div>
          </div>
        </div>

        {/* Staking Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <StakingCard isLP={false} />
          <StakingCard isLP={true} />
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Staking FAQ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-2">How are rewards calculated?</h3>
              <p className="text-gray-400 text-sm">
                Rewards are distributed proportionally based on your share of the staking pool.
                The reward rate is set by community governance and funded from the research support allocation.
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-2">What is the LP staking bonus?</h3>
              <p className="text-gray-400 text-sm">
                LP stakers who maintain their position for 30+ days receive a 10% bonus on their
                earned rewards, encouraging long-term protocol liquidity and stability.
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-2">How does staking support research?</h3>
              <p className="text-gray-400 text-sm">
                Transaction fees are automatically split between POL, research treasury (30%), burns, and lottery.
                By staking, you help maintain protocol health while the treasury funds graphene R&D.
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-2">Is there a lock-up period?</h3>
              <p className="text-gray-400 text-sm">
                No lock-up required! You can withdraw your staked tokens at any time.
                However, maintaining your stake longer increases your lottery chances and supports sustained research funding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
