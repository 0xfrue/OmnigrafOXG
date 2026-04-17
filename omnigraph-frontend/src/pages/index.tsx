"use client";

import Head from "next/head";
import Link from "next/link";
import { PROJECT_CONFIG } from "@/config/constants";
import { TrustStrip } from "@/components/Presale/TrustStrip";
import { VideoBackground } from "@/components/Effects/VideoBackground";
import { FloatingParticles } from "@/components/Effects/FloatingParticles";

export default function Home() {
  return (
    <>
      <Head>
        <title>Omnigrafx - Built on Base</title>
        <meta name="description" content="Omnigrafx - Real Graphene Utility On-chain. Built on Base Network. Token Coming Soon." />
      </Head>

      <VideoBackground />
      <FloatingParticles />

      <div className="container mx-auto px-4 py-8 relative z-20">
        {/* HERO - Ultra Modern with Video */}
        <section className="relative text-center mb-20 py-24">
          {/* Reduced opacity gradients to let video show through */}
          <div className="absolute inset-0 bg-gradient-to-br from-base-blue/10 via-accent-500/5 to-purple-500/10 gradient-shift rounded-[3rem] blur-3xl -z-10" />
          <div className="absolute inset-0 bg-gradient-to-tl from-blue-600/10 via-transparent to-cyan-500/10 animate-pulse opacity-30 rounded-[3rem] blur-2xl -z-10" />

          {/* Centered Logo */}
          <div className="flex justify-center mb-8 md:mb-10">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-2xl shadow-base-blue/50 ring-4 ring-base-blue/30 morph-border pulse-ring magnetic-hover glow-base">
              <img
                src="/omnigraf-logo.png"
                alt="Omnigrafx Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* BASE Badge */}
          <div className="flex justify-center mb-8 md:mb-10">
            <div className="inline-flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 glass-card rounded-full glow-base pulse-ring">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 111 111" fill="none">
                <path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H0C2.35281 87.8625 26.0432 110.034 54.921 110.034Z" fill="#0052FF"/>
              </svg>
              <span className="text-sm sm:text-base font-bold text-base-blue neon-base">OMNIGRAFX BUILT ON BASE</span>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 md:mb-8 px-4">
            <span className="gradient-text neon-base block">SpaceX Proved It Real</span>
            <span className="gradient-text neon-base block">Graphene in orbit.</span>
            <span className="gradient-text neon-base block mt-4">AI Demands It</span>
            <span className="gradient-text neon-base block">Real Utility On-chain.</span>
          </h1>

          <p className="text-gray-300 text-xl sm:text-2xl md:text-4xl max-w-5xl mx-auto mb-6 md:mb-8 font-semibold leading-relaxed px-4">
            <span className="text-base-blue">Token Coming Soon to Base.</span>
          </p>

          {/* Join Presale CTA - Primary */}
          <div className="flex justify-center mb-12">
            <Link href="/presale">
              <button className="px-8 py-4 md:px-12 md:py-5 bg-gradient-to-r from-base-blue via-purple-500 to-cyan-500 rounded-2xl font-bold text-base md:text-lg shadow-2xl shadow-base-blue/50 hover:-translate-y-2 liquid-button magnetic-hover ripple transition-all duration-300 hover:shadow-base-blue/70">
                Join Presale
              </button>
            </Link>
          </div>

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
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-6">
            <div className="glass-card px-8 py-4 rounded-2xl pulse-ring">
              <span className="text-gray-400 text-sm block mb-1">TGE Price</span>
              <span className="font-bold text-4xl gradient-text">TBD</span>
            </div>
            <div className="hidden md:block text-4xl text-gray-600">•</div>
            <div className="glass-card px-8 py-4 rounded-2xl">
              <span className="text-gray-400 text-sm block mb-1">Payment</span>
              <span className="font-bold text-2xl">USDC / ETH</span>
            </div>
          </div>

          {/* Launching Soon */}
          <p className="text-center text-lg sm:text-xl md:text-2xl text-accent-400 font-semibold mb-12">
            Launching Soon — Join Waitlist
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-6 px-4">
            <Link href="/presale">
              <button className="px-6 py-3 md:px-10 md:py-5 bg-gradient-to-r from-base-blue to-accent-500 rounded-2xl font-bold text-sm md:text-lg shadow-2xl shadow-base-blue/50 hover:-translate-y-2 transition-all duration-500 magnetic-hover">
                🚀 Join Presale
              </button>
            </Link>
            <Link href="/faq">
              <button className="px-6 py-3 md:px-10 md:py-5 glass-card border-2 border-base-blue/50 hover:border-base-blue rounded-2xl font-bold text-sm md:text-lg transition-all duration-500 hover:-translate-y-2 magnetic-hover">
                FAQ & Due Diligence
              </button>
            </Link>
          </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { title: "Energy & Power", icon: "⚡" },
              { title: "Electronics", icon: "💻" },
              { title: "Materials", icon: "🏗️" },
              { title: "Sensors", icon: "📡" },
              { title: "Water Tech", icon: "💧" },
              { title: "Industrial", icon: "🏭" },
            ].map((item, i) => (
              <div key={i} className="glass-card rounded-3xl p-8 card-3d shimmer group cursor-pointer text-center">
                <div className="text-6xl mb-4 scale-pulse">{item.icon}</div>
                <h3 className="font-bold text-2xl group-hover:text-base-blue transition-colors">{item.title}</h3>
                <div className="mt-4 w-full h-1 bg-gradient-to-r from-base-blue to-accent-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            ))}
          </div>

          <div className="text-center mt-12 glass-card rounded-3xl p-8 max-w-4xl mx-auto">
            <p className="text-2xl font-bold gradient-text">{PROJECT_CONFIG.PROJECT_NAME} Shaping Tomorrow’s Blockchain Engineered for Performance Powered by Community.
</p>
          </div>
        </section>

        {/* TOKENOMICS */}
        <section className="my-16 md:my-24" id="tokenomics">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center gradient-text neon-base px-4">Tokenomics</h2>
          <p className="text-center text-gray-400 text-sm sm:text-base mb-10 md:mb-12 px-4">
            OMNIGRAF · $GRAF · Base (Aerodrome) · 1,000,000,000 fixed supply · no mint function
          </p>

          {/* Headline stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12 max-w-5xl mx-auto">
            {[
              { label: "Launch FDV", value: PROJECT_CONFIG.LAUNCH_FDV },
              { label: "Buyer ROI Day 1", value: "+46%" },
              { label: "Circulating Float", value: PROJECT_CONFIG.CIRCULATING_PCT },
              { label: "Hard Cap Raise", value: "$360K" },
              { label: "Peak FDV (Hard Cap)", value: PROJECT_CONFIG.PEAK_FDV },
              { label: "Pool Deaths (Monte Carlo)", value: "0 / 50K" },
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 md:p-8 text-center card-3d magnetic-hover shimmer">
                <p className="text-xs sm:text-sm text-gray-400 mb-2 md:mb-3">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Core parameters */}
          <div className="glass-card rounded-3xl p-6 md:p-10 max-w-5xl mx-auto mb-10">
            <h3 className="font-bold text-2xl mb-6 text-center gradient-text">Core Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm uppercase tracking-wider text-accent-400 mb-3">Token</h4>
                <dl className="space-y-2 text-sm md:text-base">
                  {[
                    ["Name", "OMNIGRAF"],
                    ["Ticker", "$GRAF"],
                    ["Chain", "Base (EVM L2)"],
                    ["DEX", "Aerodrome Finance"],
                    ["Total Supply", "1,000,000,000"],
                    ["Mint Function", "None — Fixed Supply"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-white/5 py-1.5">
                      <dt className="text-gray-400">{k}</dt>
                      <dd className="font-semibold text-right">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div>
                <h4 className="text-sm uppercase tracking-wider text-accent-400 mb-3">Pricing</h4>
                <dl className="space-y-2 text-sm md:text-base">
                  {[
                    ["Launch FDV", "$4,500,000"],
                    ["TGE Price", "$0.004500"],
                    ["Presale Price", "$0.001539"],
                    ["Discount", "65.8% below TGE"],
                    ["Soft Cap", "$120,000 (full refund if missed)"],
                    ["Hard Cap", "$360,000"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-white/5 py-1.5">
                      <dt className="text-gray-400">{k}</dt>
                      <dd className="font-semibold text-right">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          {/* Token allocation */}
          <div className="glass-card rounded-3xl p-6 md:p-10 max-w-5xl mx-auto mb-10">
            <h3 className="font-bold text-2xl mb-2 text-center gradient-text">Token Allocation</h3>
            <p className="text-center text-gray-400 text-sm mb-6">1,000,000,000 total supply — verified</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="text-left text-accent-400 uppercase text-xs tracking-wider">
                    <th className="py-3 pr-4">Bucket</th>
                    <th className="py-3 pr-4 text-right">Tokens</th>
                    <th className="py-3 pr-4 text-right">%</th>
                    <th className="py-3">Unlock Schedule</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Public Presale", "234,000,000", "23.4%", "50% at TGE · 50% stream daily over 15 months"],
                    ["Referral Bonus Pool", "23,400,000", "2.3%", "100% at TGE to referrers"],
                    ["Treasury / Graphene Council", "392,600,000", "39.3%", "Gnosis Safe 3-of-5 · cash-first draw rule"],
                    ["Ecosystem / Staking", "150,000,000", "15.0%", "Fixed pool · daily drip 36 months"],
                    ["Burn Reserve", "50,000,000", "5.0%", "$3M / $5M / $10M FDV milestone triggers"],
                    ["Team & Founders", "50,000,000", "5.0%", "30-day cliff · 36-month Sablier stream"],
                    ["Community Airdrop", "40,000,000", "4.0%", "50% TGE · 50% stream 15 months"],
                    ["Marketing", "30,000,000", "3.0%", "12-month Sablier stream"],
                    ["LP Pool (locked)", "30,000,000", "3.0%", "Locked in Aerodrome pool 24 months"],
                  ].map(([bucket, tokens, pct, schedule]) => (
                    <tr key={bucket} className="border-t border-white/5">
                      <td className="py-3 pr-4 font-semibold">{bucket}</td>
                      <td className="py-3 pr-4 text-right font-mono text-xs md:text-sm">{tokens}</td>
                      <td className="py-3 pr-4 text-right font-bold">{pct}</td>
                      <td className="py-3 text-gray-300 text-xs md:text-sm">{schedule}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-accent-400/30">
                    <td className="py-3 pr-4 font-bold gradient-text">TOTAL</td>
                    <td className="py-3 pr-4 text-right font-mono font-bold">1,000,000,000</td>
                    <td className="py-3 pr-4 text-right font-bold">100%</td>
                    <td className="py-3 text-green-400 text-xs md:text-sm">Verified — no rounding errors</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 p-4 rounded-2xl border border-green-500/30 bg-green-500/5">
              <p className="text-sm md:text-base text-green-300">
                <span className="font-bold">Circulating at TGE: 160,400,000 (16.0%)</span> — 84% locked. Low float = supply discipline = price moves faster on organic buying.
              </p>
            </div>
          </div>

          {/* Trust signals */}
          <div className="glass-card rounded-3xl p-6 md:p-10 max-w-5xl mx-auto">
            <h3 className="font-bold text-2xl mb-6 text-center gradient-text">Launch Trust Stack</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: "✅", title: "Audited — SolidProof" },
                { icon: "🔒", title: "LP Locked 24 Months" },
                { icon: "🪪", title: "Founders KYC Verified" },
                { icon: "🛡️", title: "Gnosis Safe 3-of-5" },
                { icon: "📊", title: "CoinGecko Listed" },
                { icon: "🔥", title: "DEX Screener Boosted" },
              ].map((item, i) => (
                <div key={i} className="bg-dark-200/50 rounded-xl p-4 md:p-5 hover:bg-dark-200/70 transition-all text-center">
                  <span className="text-3xl block mb-2">{item.icon}</span>
                  <h4 className="font-semibold text-sm md:text-base">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRESALE CTA SECTION */}
        <section className="my-16 md:my-24">
          <div className="max-w-2xl mx-auto text-center glass-card rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 gradient-text neon-base">Join the Presale</h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-8 max-w-xl mx-auto">
              Purchase GRAF tokens with USDC or ETH on Base network.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/presale">
                <button className="px-8 py-4 bg-gradient-to-r from-base-blue to-accent-500 rounded-2xl font-bold text-base shadow-2xl shadow-base-blue/50 hover:-translate-y-2 transition-all duration-300 magnetic-hover">
                  Buy Tokens
                </button>
              </Link>
              <Link href="/faq">
                <button className="px-8 py-4 glass-card border-2 border-base-blue/50 rounded-2xl font-bold text-base hover:-translate-y-2 transition-all duration-300 magnetic-hover">
                  FAQ & Due Diligence
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
