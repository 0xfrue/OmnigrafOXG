"use client";

import Head from "next/head";
import { VestingCard } from "@/components/Vesting/VestingCard";
import { Card } from "@/components/ui/Card";

export default function VestingPage() {
  return (
    <>
      <Head>
        <title>Omnigrafx - Token Vesting</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Token Vesting & Unlock Schedule</h1>
          <p className="text-gray-400">
            Track and claim your vested $GRAF from presale, airdrop, and ecosystem allocations. 1,000,000,000 fixed supply · 160,400,000 (16.0%) circulating at TGE · 84% locked across Sablier streams, multisig, and milestone-gated reserves.
          </p>
        </div>

        {/* Your Vesting — presale/airdrop headline schedule */}
        <div className="mb-8 rounded-2xl border border-base-blue/40 bg-gradient-to-br from-base-blue/15 via-primary-500/10 to-accent-500/10 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-400 mb-2">Your Vesting</p>
          <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-4">50% at TGE · 50% streamed daily over 15 months</h2>
          <p className="text-gray-300 mb-6 text-base md:text-lg">
            Half of your presale allocation is unlocked and claimable the moment the token generation event occurs. The remaining 50% streams linearly, per second, over 15 months — you can claim the accrued portion at any time without penalty.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-dark-200/60 rounded-xl p-5 border border-base-blue/20">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">At TGE</p>
              <p className="text-2xl font-bold text-base-blue">50%</p>
              <p className="text-xs text-gray-400 mt-1">Unlocked immediately — claim day one</p>
            </div>
            <div className="bg-dark-200/60 rounded-xl p-5 border border-primary-500/20">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Stream</p>
              <p className="text-2xl font-bold text-primary-400">50%</p>
              <p className="text-xs text-gray-400 mt-1">Daily linear release via Sablier</p>
            </div>
            <div className="bg-dark-200/60 rounded-xl p-5 border border-accent-500/20">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Duration</p>
              <p className="text-2xl font-bold text-accent-400">15 months</p>
              <p className="text-xs text-gray-400 mt-1">Full unlock by month 15 after TGE</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Applies to Public Presale (234M $GRAF) and Community Airdrop (40M $GRAF) allocations. See the full schedule below for other buckets.
          </p>
        </div>

        {/* Schedule banner */}
        <div className="relative bg-gradient-to-r from-base-blue/20 via-primary-500/20 to-accent-500/20 rounded-2xl p-6 md:p-8 mb-8 border border-base-blue/30 overflow-hidden animate-bg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-base-blue/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-10 w-24 h-24 bg-accent-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '0.8s' }} />

          <div className="relative">
            <h2 className="text-2xl font-bold mb-2 gradient-text">Unlock Schedule</h2>
            <p className="text-gray-300 mb-6">
              Each bucket releases on its own rails. Claims accrue continuously on streamed buckets — no need to claim daily.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="text-left text-accent-400 uppercase text-xs tracking-wider">
                    <th className="py-3 pr-4">Bucket</th>
                    <th className="py-3 pr-4 text-right">Tokens</th>
                    <th className="py-3 pr-4 text-right">%</th>
                    <th className="py-3 pr-4 text-right">TGE Unlock</th>
                    <th className="py-3">Remainder</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { bucket: "Public Presale", tokens: "234,000,000", pct: "23.4%", tge: "50%", rest: "Daily stream · 15 months" },
                    { bucket: "Referral Bonus Pool", tokens: "23,400,000", pct: "2.3%", tge: "100%", rest: "Paid to referrers at TGE" },
                    { bucket: "Treasury / Graphene Council", tokens: "392,600,000", pct: "39.3%", tge: "0%", rest: "Gnosis Safe 3-of-5 · cash-first draw rule" },
                    { bucket: "Ecosystem / Staking", tokens: "150,000,000", pct: "15.0%", tge: "0%", rest: "Daily drip · 36 months" },
                    { bucket: "Burn Reserve", tokens: "50,000,000", pct: "5.0%", tge: "0%", rest: "Triggered at $3M / $5M / $10M FDV milestones" },
                    { bucket: "Team & Founders", tokens: "50,000,000", pct: "5.0%", tge: "0%", rest: "30-day cliff · Sablier stream 36 months" },
                    { bucket: "Community Airdrop", tokens: "40,000,000", pct: "4.0%", tge: "50%", rest: "Daily stream · 15 months" },
                    { bucket: "Marketing", tokens: "30,000,000", pct: "3.0%", tge: "0%", rest: "Sablier stream · 12 months" },
                    { bucket: "LP Pool (locked)", tokens: "30,000,000", pct: "3.0%", tge: "0%", rest: "Aerodrome pool lock · 24 months" },
                  ].map((row) => (
                    <tr key={row.bucket} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 pr-4 font-semibold text-white">{row.bucket}</td>
                      <td className="py-3 pr-4 text-right font-mono text-xs md:text-sm">{row.tokens}</td>
                      <td className="py-3 pr-4 text-right font-bold">{row.pct}</td>
                      <td className="py-3 pr-4 text-right">{row.tge}</td>
                      <td className="py-3 text-gray-300 text-xs md:text-sm">{row.rest}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-accent-400/30">
                    <td className="py-3 pr-4 font-bold gradient-text">TOTAL</td>
                    <td className="py-3 pr-4 text-right font-mono font-bold">1,000,000,000</td>
                    <td className="py-3 pr-4 text-right font-bold">100%</td>
                    <td className="py-3 pr-4 text-right font-bold text-green-400">16.0%</td>
                    <td className="py-3 text-green-400 text-xs md:text-sm">Circulating at TGE</td>
                  </tr>
                </tbody>
              </table>
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
                  <span>Streamed buckets (Presale, Airdrop, Team, Marketing, Ecosystem) use Sablier — entitlement accrues per second</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-400">•</span>
                  <span>Claim anytime, no penalties or deadlines</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-400">•</span>
                  <span>Team allocation has a 30-day cliff before the 36-month stream begins</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-400">•</span>
                  <span>Burn Reserve only unlocks when FDV crosses $3M / $5M / $10M milestones — tokens go to burn, not wallets</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-400">•</span>
                  <span>LP tokens are locked for 24 months on Aerodrome and cannot be claimed</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-400">•</span>
                  <span>Treasury spend is gated by a 3-of-5 Gnosis Safe under a cash-first draw rule</span>
                </li>
              </ul>
            </Card>

            <Card>
              <h3 className="font-semibold mb-3">Need Help?</h3>
              <p className="text-sm text-gray-400 mb-4">
                If you believe you should have vesting allocations but don&apos;t see them,
                please contact the team.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
