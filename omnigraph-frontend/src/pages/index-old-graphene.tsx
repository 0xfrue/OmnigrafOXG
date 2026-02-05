"use client";

import Head from "next/head";
import Link from "next/link";
import { useAccount } from "wagmi";
import { TokenStats } from "@/components/Dashboard/TokenStats";
import { ProtocolStats } from "@/components/Dashboard/ProtocolStats";
import { useTokenBalance } from "@/hooks/useToken";
import { formatTokenAmount } from "@/utils/format";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useTokenBalance(address);

  return (
    <>
      <Head>
        <title>OmnigrafOXG - Graphene Research Community Token</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section with Animated Background */}
        <div className="relative text-center mb-12 py-16">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-base-blue/20 via-accent-500/10 to-primary-500/20 animate-bg rounded-3xl blur-3xl -z-10" />

          {/* Built on Base Badge */}
          <div className="flex justify-center mb-6 animate-slide-up">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-base-blue/10 border border-base-blue/30 rounded-full glow-base">
              <svg className="w-5 h-5" viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H0C2.35281 87.8625 26.0432 110.034 54.921 110.034Z" fill="#0052FF"/>
              </svg>
              <span className="text-sm font-semibold text-base-blue">Built on Base</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            <span className="gradient-text">OmnigrafOXG</span>
          </h1>
          <p className="text-gray-300 text-xl md:text-2xl max-w-3xl mx-auto mb-3 animate-slide-up font-medium">
            Revolutionizing Graphene Research Through DeFi
          </p>
          <p className="text-gray-500 text-base max-w-2xl mx-auto mb-8 animate-slide-up">
            A deflationary community token on Base Network funding decentralized graphene R&D
            through innovative tokenomics and protocol-owned liquidity
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 animate-slide-up">
            <Link href="/staking">
              <button className="px-8 py-4 bg-gradient-to-r from-base-blue to-accent-500 hover:from-base-blue/90 hover:to-accent-600 rounded-xl font-semibold shadow-lg shadow-base-blue/50 hover:shadow-xl hover:shadow-base-blue/60 transition-all duration-300 hover:-translate-y-1">
                Start Staking
              </button>
            </Link>
            <Link href="#tokenomics">
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-base-blue/50 rounded-xl font-semibold backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
                Learn More
              </button>
            </Link>
          </div>
        </div>

        {/* User Balance (if connected) */}
        {isConnected && (
          <div className="mb-8">
            <Card className="bg-gradient-to-br from-base-blue/20 to-accent-500/20 border-base-blue/30 glow-base card-glow">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <p className="text-gray-400 mb-1">Your Balance</p>
                  <p className="text-4xl font-bold gradient-text">{formatTokenAmount(balance)} OGX</p>
                </div>
                <div className="flex space-x-3 mt-4 md:mt-0">
                  <Link href="/staking">
                    <Button>Stake Now</Button>
                  </Link>
                  <Link href="/vesting">
                    <Button variant="secondary">View Vesting</Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Research Focus Banner with Floating Animation */}
        <div className="relative bg-gradient-to-r from-base-blue/20 via-accent-500/20 to-base-blue/20 rounded-3xl p-8 mb-8 border border-base-blue/30 overflow-hidden animate-bg">
          {/* Floating orbs */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-base-blue/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-accent-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}} />

          <div className="relative text-center">
            <h2 className="text-3xl font-bold mb-4 gradient-text">Advancing Graphene Technology</h2>
            <p className="text-gray-300 max-w-3xl mx-auto mb-6 text-lg">
              OmnigrafOXG brings together researchers, engineers, and investors to accelerate
              graphene innovation. Our tokenomics ensure sustainable funding for R&D initiatives
              while rewarding long-term community participation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 border border-white/5 hover:border-base-blue/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-base-blue/20 card-glow">
                <div className="text-4xl mb-3 animate-float">🔬</div>
                <h3 className="font-bold text-lg mb-2 text-base-blue">Research Funding</h3>
                <p className="text-sm text-gray-400">Protocol treasury supports graphene R&D projects</p>
              </div>
              <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 border border-white/5 hover:border-accent-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-accent-500/20 card-glow" style={{animationDelay: '0.2s'}}>
                <div className="text-4xl mb-3 animate-float" style={{animationDelay: '0.5s'}}>🏭</div>
                <h3 className="font-bold text-lg mb-2 text-accent-400">Production Scaling</h3>
                <p className="text-sm text-gray-400">Community funding for manufacturing capabilities</p>
              </div>
              <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 border border-white/5 hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary-500/20 card-glow" style={{animationDelay: '0.4s'}}>
                <div className="text-4xl mb-3 animate-float" style={{animationDelay: '1s'}}>🤝</div>
                <h3 className="font-bold text-lg mb-2 text-primary-400">Collaborative Network</h3>
                <p className="text-sm text-gray-400">Connecting scientists, engineers, and industry</p>
              </div>
            </div>
          </div>
        </div>

        {/* Token Stats */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Token Statistics</h2>
          <TokenStats />
        </section>

        {/* Protocol Stats */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Protocol Health</h2>
          <ProtocolStats />
        </section>

        {/* Quick Actions with Enhanced Cards */}
        <section id="tokenomics">
          <h2 className="text-3xl font-bold mb-6 text-center gradient-text">Participate in the Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-base-blue/10 to-base-blue/5 rounded-2xl p-6 border border-base-blue/20 hover:border-base-blue/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-base-blue/20 group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-base-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">💎</span>
                </div>
                <span className="text-xs font-semibold text-base-blue px-3 py-1 bg-base-blue/10 rounded-full">Active</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-white">Stake Tokens</h3>
              <p className="text-sm text-gray-500 mb-1">Support R&D and earn rewards</p>
              <p className="text-gray-400 mb-6 text-sm">
                Stake OGX tokens to earn passive rewards while supporting the graphene research treasury.
              </p>
              <Link href="/staking">
                <button className="w-full py-3 bg-base-blue/10 hover:bg-base-blue/20 border border-base-blue/30 hover:border-base-blue/50 rounded-xl font-semibold transition-all duration-300 text-base-blue">
                  Go to Staking →
                </button>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-accent-500/10 to-accent-500/5 rounded-2xl p-6 border border-accent-500/20 hover:border-accent-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent-500/20 group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">⏳</span>
                </div>
                <span className="text-xs font-semibold text-accent-400 px-3 py-1 bg-accent-500/10 rounded-full">Linear</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-white">Claim Vesting</h3>
              <p className="text-sm text-gray-500 mb-1">Release your vested tokens</p>
              <p className="text-gray-400 mb-6 text-sm">
                Early supporters can check their vesting schedule and claim available tokens.
              </p>
              <Link href="/vesting">
                <button className="w-full py-3 bg-accent-500/10 hover:bg-accent-500/20 border border-accent-500/30 hover:border-accent-500/50 rounded-xl font-semibold transition-all duration-300 text-accent-400">
                  View Vesting →
                </button>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-primary-500/10 to-primary-500/5 rounded-2xl p-6 border border-primary-500/20 hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-500/20 group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🎰</span>
                </div>
                <span className="text-xs font-semibold text-primary-400 px-3 py-1 bg-primary-500/10 rounded-full">Weekly</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-white">Community Lottery</h3>
              <p className="text-sm text-gray-500 mb-1">Win USDC prizes</p>
              <p className="text-gray-400 mb-6 text-sm">
                Stakers automatically earn lottery entries for weekly prize draws.
              </p>
              <Link href="/lottery">
                <button className="w-full py-3 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 hover:border-primary-500/50 rounded-xl font-semibold transition-all duration-300 text-primary-400">
                  View Lottery →
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works - Enhanced */}
        <section className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3 gradient-text">Sustainable Tokenomics for Research</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Every transaction fuels graphene innovation through our automated treasury system
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-base-blue to-base-blue/50 flex items-center justify-center mx-auto shadow-lg shadow-base-blue/50 group-hover:shadow-2xl group-hover:shadow-base-blue/60 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-500 rounded-full animate-ping opacity-75" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-white">Dynamic Tax System</h3>
              <p className="text-sm text-gray-400">
                Transaction fees automatically fund protocol-owned liquidity, research treasury, and token burns.
              </p>
            </div>
            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center mx-auto shadow-lg shadow-accent-500/50 group-hover:shadow-2xl group-hover:shadow-accent-500/60 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full animate-ping opacity-75" style={{animationDelay: '0.3s'}} />
              </div>
              <h3 className="font-bold text-lg mb-3 text-white">Research Treasury</h3>
              <p className="text-sm text-gray-400">
                <span className="text-accent-400 font-bold">30% of fees</span> build a sustainable treasury to fund graphene R&D projects and partnerships.
              </p>
            </div>
            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto shadow-lg shadow-primary-500/50 group-hover:shadow-2xl group-hover:shadow-primary-500/60 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-base-blue rounded-full animate-ping opacity-75" style={{animationDelay: '0.6s'}} />
              </div>
              <h3 className="font-bold text-lg mb-3 text-white">Deflationary Model</h3>
              <p className="text-sm text-gray-400">
                Token burns reduce supply over time, creating scarcity while funding research continues.
              </p>
            </div>
            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/50 group-hover:shadow-2xl group-hover:shadow-purple-500/60 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <span className="text-3xl font-bold text-white">4</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-400 rounded-full animate-ping opacity-75" style={{animationDelay: '0.9s'}} />
              </div>
              <h3 className="font-bold text-lg mb-3 text-white">Community Rewards</h3>
              <p className="text-sm text-gray-400">
                Staking rewards and lottery incentivize long-term community participation and governance.
              </p>
            </div>
          </div>
        </section>

        {/* Graphene Info */}
        <section className="mt-12">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
            <h2 className="text-2xl font-bold mb-4">Why Graphene?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2 text-blue-400">Revolutionary Material Properties</h3>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• 200x stronger than steel by weight</li>
                  <li>• Excellent electrical and thermal conductivity</li>
                  <li>• Ultra-lightweight and flexible</li>
                  <li>• Transparent and impermeable to gases</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-cyan-400">Applications & Impact</h3>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• Advanced electronics and semiconductors</li>
                  <li>• Energy storage and battery technology</li>
                  <li>• Medical devices and bioengineering</li>
                  <li>• Composite materials and aerospace</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4 pt-4 border-t border-gray-700">
              OmnigrafOXG aims to democratize access to graphene research funding and accelerate
              the transition from laboratory innovation to industrial-scale production.
            </p>
          </Card>
        </section>
      </div>
    </>
  );
}
