"use client";

import Head from "next/head";
import { LotteryCard } from "@/components/Lottery/LotteryCard";
import { Card } from "@/components/ui/Card";

export default function LotteryPage() {
  return (
    <>
      <Head>
        <title>Omnigrafx - Community Lottery</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community Lottery</h1>
          <p className="text-gray-400">
            Stakers automatically earn entries for weekly USDC prize draws - rewarding community participation.
          </p>
        </div>

        {/* Info Banner with animations */}
        <div className="relative bg-gradient-to-r from-accent-500/20 via-primary-500/20 to-base-blue/20 rounded-2xl p-8 mb-8 border border-accent-500/30 overflow-hidden animate-bg">
          {/* Animated elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-base-blue/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}} />

          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h2 className="text-2xl font-bold mb-2 gradient-text">Protocol-Funded Prizes</h2>
              <p className="text-gray-300 max-w-xl text-lg">
                <span className="text-accent-400 font-bold">10% of all fees</span> go to the lottery pool. No user deposits required - just stake to enter!
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center bg-dark-200/50 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Draw Frequency</p>
                <p className="font-bold text-lg text-accent-400">Weekly</p>
              </div>
              <div className="text-center bg-dark-200/50 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Winner Selection</p>
                <p className="font-bold text-lg text-base-blue">Chainlink VRF</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <LotteryCard />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <h3 className="font-semibold mb-3">How to Earn Entries</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-dark-200 rounded-lg">
                  <span className="text-gray-400">Stake OGX</span>
                  <span className="font-medium">1 entry / 100 OGX</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-200 rounded-lg">
                  <span className="text-gray-400">Stake LP</span>
                  <span className="font-medium">2 entries / LP token</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-200 rounded-lg">
                  <span className="text-gray-400">Complete Quests</span>
                  <span className="font-medium">Varies</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold mb-3">Lottery Rules</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Epochs run for 7 days</li>
                <li>• Winner selected using Chainlink VRF</li>
                <li>• 90% of pool paid to winner</li>
                <li>• 10% rolls over to next epoch</li>
                <li>• Entries reset each epoch</li>
                <li>• Winners have 30 days to claim</li>
              </ul>
            </Card>

            <Card>
              <h3 className="font-semibold mb-3">Past Winners</h3>
              <p className="text-sm text-gray-400 mb-4">
                View historical lottery results and past winners.
              </p>
              <a
                href="#"
                className="text-primary-400 hover:text-primary-300 text-sm"
              >
                View History →
              </a>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
