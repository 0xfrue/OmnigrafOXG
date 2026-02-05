"use client";

import Head from "next/head";
import Link from "next/link";
import { PROJECT_CONFIG, COMPLIANCE, PLACEHOLDERS } from "@/config/constants";
import { BuyModule } from "@/components/Presale/BuyModule";
import { CountdownTimer } from "@/components/Presale/CountdownTimer";
import { TrustStrip } from "@/components/Presale/TrustStrip";
import { VideoBackground } from "@/components/Effects/VideoBackground";
import { FloatingParticles } from "@/components/Effects/FloatingParticles";

export default function Home() {
  return (
    <>
      <Head>
        <title>{PROJECT_CONFIG.PROJECT_NAME} on BASE - Revolutionary Graphene Token</title>
        <meta name="description" content="Graphene Token (GRAF) - Built on Base Network. TGE $0.02. Fund the future of graphene research." />
      </Head>

      <VideoBackground />
      <FloatingParticles />

      <div className="container mx-auto px-4 py-8 relative z-20">
        {/* HERO - Ultra Modern with Video */}
        <section className="relative text-center mb-20 py-24">
          {/* Reduced opacity gradients to let video show through */}
          <div className="absolute inset-0 bg-gradient-to-br from-base-blue/10 via-accent-500/5 to-purple-500/10 gradient-shift rounded-[3rem] blur-3xl -z-10" />
          <div className="absolute inset-0 bg-gradient-to-tl from-blue-600/10 via-transparent to-cyan-500/10 animate-pulse opacity-30 rounded-[3rem] blur-2xl -z-10" />

          {/* BASE Badge */}
          <div className="flex justify-center mb-8 md:mb-10">
            <div className="inline-flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 glass-card rounded-full glow-base pulse-ring">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 111 111" fill="none">
                <path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H0C2.35281 87.8625 26.0432 110.034 54.921 110.034Z" fill="#0052FF"/>
              </svg>
              <span className="text-sm sm:text-base font-bold text-base-blue neon-base">BUILT ON BASE</span>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold mb-6 md:mb-8">
            <span className="gradient-text neon-base block">Graphene research</span>
            <span className="gradient-text neon-base block">meets on-chain</span>
            <span className="gradient-text neon-base block">coordination</span>
          </h1>

          <p className="text-gray-300 text-base sm:text-lg md:text-3xl max-w-5xl mx-auto mb-6 md:mb-8 font-light leading-relaxed px-4">
            <span className="text-base-blue font-semibold">Decentralized funding</span> × <span className="text-accent-400 font-semibold">Research collaboration</span> × <span className="text-primary-400 font-semibold">Real-world impact</span>
          </p>

          {/* 3D Feature Cards */}
          <div className="max-w-5xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "⚡", text: "Lightning-fast on Base" },
              { icon: "🔒", text: `Fixed: ${PROJECT_CONFIG.TOTAL_SUPPLY}` },
              { icon: "🛡️", text: "Safety-first design" },
            ].map((item, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 card-3d magnetic-hover shimmer">
                <div className="text-4xl mb-3">{item.icon}</div>
                <p className="text-sm font-medium">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12">
            <div className="glass-card px-8 py-4 rounded-2xl pulse-ring">
              <span className="text-gray-400 text-sm block mb-1">TGE Price</span>
              <span className="font-bold text-4xl gradient-text">{PROJECT_CONFIG.TGE_PRICE}</span>
            </div>
            <div className="hidden md:block text-4xl text-gray-600">•</div>
            <div className="glass-card px-8 py-4 rounded-2xl">
              <span className="text-gray-400 text-sm block mb-1">Payment</span>
              <span className="font-bold text-2xl">USDC / ETH</span>
            </div>
          </div>

          {/* Countdown */}
          <div className="mb-12">
            <CountdownTimer targetDate={PROJECT_CONFIG.SALE_START_DATETIME} label="🚀 Sale launches in" />
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-6 px-4">
            <Link href="#buy">
              <button className="px-6 py-3 md:px-10 md:py-5 bg-gradient-to-r from-base-blue via-blue-600 to-accent-500 rounded-2xl font-bold text-sm md:text-lg shadow-2xl shadow-base-blue/50 hover:shadow-base-blue/70 transition-all duration-500 hover:-translate-y-2 liquid-button magnetic-hover">
                🚀 Buy {PROJECT_CONFIG.TOKEN_SYMBOL} at {PROJECT_CONFIG.TGE_PRICE}
              </button>
            </Link>
            <Link href="#whitelist">
              <button className="px-6 py-3 md:px-10 md:py-5 glass-card border-2 border-base-blue/50 hover:border-base-blue rounded-2xl font-bold text-sm md:text-lg transition-all duration-500 hover:-translate-y-2 magnetic-hover">
                ⭐ Join Whitelist
              </button>
            </Link>
          </div>

          <p className="text-xs text-gray-500 mt-8 max-w-3xl mx-auto">
            <Link href="/risk" className="text-accent-400 hover:underline font-semibold">Review risks & eligibility →</Link>
          </p>
        </section>

        <TrustStrip />

        {/* GRAPHENE SECTION */}
        <section className="my-16 md:my-24">
          <div className="text-center mb-12 md:mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 gradient-text neon-base">The Material of the Future</h2>
            <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-5xl mx-auto">
              200x stronger than steel • Highly conductive • Nearly transparent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Energy & Power", icon: "⚡" },
              { title: "Electronics", icon: "💻" },
              { title: "Materials", icon: "🏗️" },
              { title: "Sensors", icon: "📡" },
              { title: "Water Tech", icon: "💧" },
              { title: "Industrial", icon: "🏭" },
            ].map((item, i) => (
              <div key={i} className="glass-card rounded-3xl p-8 card-3d shimmer group cursor-pointer">
                <div className="text-6xl mb-4 scale-pulse">{item.icon}</div>
                <h3 className="font-bold text-2xl group-hover:text-base-blue transition-colors">{item.title}</h3>
                <div className="mt-4 w-full h-1 bg-gradient-to-r from-base-blue to-accent-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            ))}
          </div>

          <div className="text-center mt-12 glass-card rounded-3xl p-8 max-w-4xl mx-auto">
            <p className="text-2xl font-bold gradient-text">{PROJECT_CONFIG.PROJECT_NAME} solves the production bottleneck</p>
          </div>
        </section>

        {/* TOKENOMICS */}
        <section className="my-16 md:my-24" id="tokenomics">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 md:mb-12 text-center gradient-text neon-base px-4">Tokenomics</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Supply", value: PROJECT_CONFIG.TOTAL_SUPPLY },
              { label: "Network", value: "BASE" },
              { label: "Price", value: "$0.02" },
              { label: "Payment", value: "USDC/ETH" },
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-2xl p-8 text-center card-3d magnetic-hover shimmer">
                <p className="text-sm text-gray-400 mb-3">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-3xl p-10 max-w-5xl mx-auto">
            <h3 className="font-bold text-2xl mb-6 text-center gradient-text">Four-Pillar Engine</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: "💧", title: "Liquidity" },
                { icon: "🏦", title: "Treasury (30%)" },
                { icon: "🔥", title: "Burns (capped)" },
                { icon: "🎁", title: "Rewards" },
              ].map((item, i) => (
                <div key={i} className="bg-dark-200/50 rounded-xl p-6 hover:bg-dark-200/70 transition-all">
                  <span className="text-4xl">{item.icon}</span>
                  <h4 className="font-bold text-lg mt-2">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BUY MODULE */}
        <section className="my-16 md:my-24" id="buy">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 md:mb-12 text-center gradient-text neon-base px-4">Get {PROJECT_CONFIG.TOKEN_SYMBOL}</h2>
          <div className="max-w-3xl mx-auto">
            <BuyModule />
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="text-center py-12 md:py-16 glass-card rounded-3xl md:rounded-[3rem] mx-4">
          <div className="text-4xl md:text-6xl mb-4 md:mb-6 animate-bounce">🚀</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 gradient-text px-4">Join the Revolution</h2>
          <div className="flex flex-wrap justify-center gap-3 md:gap-6 px-4">
            <Link href="#buy">
              <button className="px-6 py-3 md:px-10 md:py-5 bg-gradient-to-r from-base-blue to-accent-500 rounded-2xl font-bold text-sm md:text-lg shadow-2xl shadow-base-blue/50 hover:-translate-y-2 liquid-button magnetic-hover">
                Buy Now
              </button>
            </Link>
            <Link href="/risk">
              <button className="px-6 py-3 md:px-10 md:py-5 glass-card border-2 border-base-blue/50 rounded-2xl font-bold text-sm md:text-lg hover:-translate-y-2 magnetic-hover">
                Review Risks
              </button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
