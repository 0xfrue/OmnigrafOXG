"use client";

import Head from "next/head";
import Link from "next/link";
import { PROJECT_CONFIG, COMPLIANCE, PLACEHOLDERS } from "@/config/constants";
import { BuyModule } from "@/components/Presale/BuyModule";
import { CountdownTimer } from "@/components/Presale/CountdownTimer";
import { TrustStrip } from "@/components/Presale/TrustStrip";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <>
      <Head>
        <title>{PROJECT_CONFIG.PROJECT_NAME} ({PROJECT_CONFIG.TOKEN_SYMBOL}) | Graphene Ecosystem Token on Base</title>
        <meta
          name="description"
          content="Graphene-focused ecosystem token on Base. TGE price $0.02. Buy with USDC or ETH. Eligibility restrictions may apply."
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* HERO SECTION */}
        <section className="relative text-center mb-12 py-16">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-base-blue/20 via-accent-500/10 to-primary-500/20 animate-bg rounded-3xl blur-3xl -z-10" />

          {/* Built on Base Badge */}
          <div className="flex justify-center mb-8 animate-slide-up">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-base-blue/10 border border-base-blue/30 rounded-full glow-base">
              <svg className="w-5 h-5" viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H0C2.35281 87.8625 26.0432 110.034 54.921 110.034Z" fill="#0052FF"/>
              </svg>
              <span className="text-sm font-semibold text-base-blue">Built on Base</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            <span className="gradient-text">Graphene research meets on-chain coordination.</span>
          </h1>

          <p className="text-gray-300 text-xl md:text-2xl max-w-4xl mx-auto mb-6 animate-slide-up">
            {PROJECT_CONFIG.PROJECT_NAME} ({PROJECT_CONFIG.TOKEN_SYMBOL}) is an ecosystem token built on Base to support graphene advancement, research collaboration, and real-world applications across energy, electronics, materials, filtration, and sensing—designed with safety rails and transparent sale phases.
          </p>

          {/* Key Benefits */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                <p className="text-sm text-gray-300">✓ Built on Base for fast, low-cost transactions</p>
              </div>
              <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                <p className="text-sm text-gray-300">✓ Fixed max supply: {PROJECT_CONFIG.TOTAL_SUPPLY} {PROJECT_CONFIG.TOKEN_SYMBOL}</p>
              </div>
              <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                <p className="text-sm text-gray-300">✓ Designed with caps, locks, and time-delayed controls</p>
              </div>
            </div>
          </div>

          {/* Price Row */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8 text-lg">
            <div className="bg-base-blue/10 px-6 py-3 rounded-xl border border-base-blue/30">
              <span className="text-gray-400">TGE Price: </span>
              <span className="font-bold text-white">{PROJECT_CONFIG.TGE_PRICE}</span>
            </div>
            <div className="bg-accent-500/10 px-6 py-3 rounded-xl border border-accent-500/30">
              <span className="text-gray-400">Pay with: </span>
              <span className="font-bold text-white">USDC / ETH</span>
            </div>
          </div>

          {/* Countdown */}
          <div className="mb-8">
            <CountdownTimer
              targetDate={PROJECT_CONFIG.SALE_START_DATETIME}
              label="Sale opens in"
            />
            <p className="text-sm text-gray-500 mt-4">
              Opens {PROJECT_CONFIG.SALE_START_DATETIME.toLocaleDateString()} • Ends {PROJECT_CONFIG.SALE_END_DATETIME.toLocaleDateString()}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4 animate-slide-up">
            <Link href="#buy">
              <button className="px-8 py-4 bg-gradient-to-r from-base-blue to-accent-500 hover:from-base-blue/90 hover:to-accent-600 rounded-xl font-semibold shadow-lg shadow-base-blue/50 hover:shadow-xl hover:shadow-base-blue/60 transition-all duration-300 hover:-translate-y-1">
                Connect Wallet to Buy at {PROJECT_CONFIG.TGE_PRICE}
              </button>
            </Link>
            <Link href="#whitelist">
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-base-blue/50 rounded-xl font-semibold backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
                Join Whitelist
              </button>
            </Link>
          </div>

          {/* Risk Line */}
          <p className="text-xs text-gray-500 mt-6 max-w-3xl mx-auto">
            {COMPLIANCE.RISK_DISCLOSURE}{" "}
            <Link href="/risk" className="text-accent-400 hover:underline">
              Read risk and eligibility
            </Link>
          </p>
        </section>

        {/* TRUST STRIP */}
        <section className="mb-16">
          <TrustStrip />
        </section>

        {/* WHY GRAPHENE */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 gradient-text">Graphene is a rare material with massive real-world utility.</h2>
            <p className="text-gray-300 text-lg max-w-4xl mx-auto">
              Graphene is a single atomic layer of carbon arranged in a hexagonal lattice. It&apos;s exceptionally strong, lightweight, nearly transparent, and highly conductive—making it relevant across multiple industries already being explored at scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Energy & Power", desc: "batteries, supercapacitors, solar improvements", icon: "⚡" },
              { title: "Electronics", desc: "flexible electronics, high-speed transistors", icon: "💻" },
              { title: "Materials", desc: "composites, coatings, concrete reinforcement", icon: "🏗️" },
              { title: "Sensors", desc: "biosensing and environmental sensing research", icon: "📡" },
              { title: "Water", desc: "membranes, filtration and separation", icon: "💧" },
              { title: "Industrial", desc: "lubricants, anti-corrosion barriers, additives", icon: "🏭" },
            ].map((item, index) => (
              <div key={index} className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 border border-white/5 hover:border-base-blue/50 transition-all duration-300 hover:-translate-y-1 card-glow">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-white">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400 mt-8 max-w-3xl mx-auto">
            The technology is powerful. The bottleneck has been consistent production, scale, and coordination. <span className="text-white font-semibold">{PROJECT_CONFIG.PROJECT_NAME}</span> exists to help solve that gap.
          </p>
        </section>

        {/* SUSTAINABILITY NARRATIVE */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl p-8 border border-green-500/20">
            <h2 className="text-3xl font-bold mb-4 text-center gradient-text">Advancing graphene with a carbon-aware production pathway.</h2>
            <p className="text-gray-300 text-lg max-w-4xl mx-auto mb-6">
              {PROJECT_CONFIG.PARENT_COMPANY}&apos;s production approach is described as carbon negative and near carbon neutral through pyrolysis (as reported by the team). More broadly, pyrolysis-to-biochar systems can be net carbon-negative depending on inputs and lifecycle assessment—making this pathway credible when measured and verified.
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 max-w-3xl mx-auto">
              <p className="text-sm text-gray-300">
                <strong className="text-yellow-400">Note:</strong> Sustainability claims depend on process design and measurement. We will share verification details as they become available. {PLACEHOLDERS.SUSTAINABILITY_VERIFICATION}
              </p>
            </div>
          </div>
        </section>

        {/* WHAT IS PROJECT_NAME */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-6 text-center gradient-text">A token ecosystem designed to help graphene move faster.</h2>
          <p className="text-gray-300 text-lg max-w-4xl mx-auto mb-8 text-center">
            {PROJECT_CONFIG.PROJECT_NAME} ({PROJECT_CONFIG.TOKEN_SYMBOL}) is built to support graphene research and development, encourage collaboration across producers and stakeholders, and create a transparent on-chain framework for long-term coordination.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 border border-base-blue/20 hover:border-base-blue/50 transition-all">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-bold text-lg mb-2">Education & Awareness</h3>
              <p className="text-sm text-gray-400">Making graphene understandable and relevant</p>
            </div>
            <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 border border-accent-500/20 hover:border-accent-500/50 transition-all">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-bold text-lg mb-2">Safety-First Design</h3>
              <p className="text-sm text-gray-400">Reducing common token launch risks</p>
            </div>
            <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 border border-primary-500/20 hover:border-primary-500/50 transition-all">
              <div className="text-3xl mb-3">🔗</div>
              <h3 className="font-bold text-lg mb-2">Regulated RWA Pathway</h3>
              <p className="text-sm text-gray-400">Long-term alignment (subject to legal review)</p>
            </div>
          </div>
        </section>

        {/* ECOSYSTEM ALIGNMENT (Liquidity Support) */}
        <section className="mb-16" id="liquidity">
          <div className="bg-gradient-to-br from-base-blue/10 to-accent-500/10 rounded-3xl p-8 border border-base-blue/30">
            <h2 className="text-3xl font-bold mb-4 text-center gradient-text">An ecosystem designed to stay healthy over time.</h2>
            <p className="text-gray-300 text-lg max-w-4xl mx-auto mb-6 text-center">
              {COMPLIANCE.LIQUIDITY_SUPPORT}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl mb-2">🤝</div>
                <h3 className="font-semibold mb-2">Aligned Incentives</h3>
                <p className="text-sm text-gray-400">Producers and researchers want stability</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💪</div>
                <h3 className="font-semibold mb-2">Liquidity Design</h3>
                <p className="text-sm text-gray-400">Strengthening is part of the philosophy</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold mb-2">Transparent</h3>
                <p className="text-sm text-gray-400">Support actions will be documented</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-6">
              Any ecosystem support actions will be documented under {PLACEHOLDERS.TREASURY_TRANSPARENCY}
            </p>
          </div>
        </section>

        {/* UTILITY */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-6 text-center gradient-text">What holding {PROJECT_CONFIG.TOKEN_SYMBOL} can unlock</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 border border-white/5">
              <p className="text-gray-300">✓ Access to ecosystem updates and releases</p>
            </div>
            <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 border border-white/5">
              <p className="text-gray-300">✓ Eligibility for community programs: {PLACEHOLDERS.UTILITY_FEATURES}</p>
            </div>
            <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 border border-white/5">
              <p className="text-gray-300">✓ Future on-chain mechanics: {PLACEHOLDERS.FUTURE_MECHANICS}</p>
            </div>
            <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 border border-white/5">
              <p className="text-gray-300">✓ Governance pathways: {PLACEHOLDERS.GOVERNANCE}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center mt-6 max-w-3xl mx-auto">
            {COMPLIANCE.NO_INVESTMENT}
          </p>
        </section>

        {/* TOKENOMICS */}
        <section className="mb-16" id="tokenomics">
          <h2 className="text-4xl font-bold mb-8 text-center gradient-text">Tokenomics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 border border-base-blue/20 text-center">
              <p className="text-sm text-gray-400 mb-2">Total Supply</p>
              <p className="text-2xl font-bold text-white">{PROJECT_CONFIG.TOTAL_SUPPLY}</p>
              <p className="text-xs text-gray-500 mt-1">{PROJECT_CONFIG.TOKEN_SYMBOL}</p>
            </div>
            <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 border border-accent-500/20 text-center">
              <p className="text-sm text-gray-400 mb-2">Network</p>
              <p className="text-2xl font-bold text-white">{PROJECT_CONFIG.NETWORK}</p>
              <p className="text-xs text-gray-500 mt-1">Fast & low-cost</p>
            </div>
            <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 border border-primary-500/20 text-center">
              <p className="text-sm text-gray-400 mb-2">TGE Price</p>
              <p className="text-2xl font-bold text-white">{PROJECT_CONFIG.TGE_PRICE}</p>
              <p className="text-xs text-gray-500 mt-1">per token</p>
            </div>
            <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 border border-green-500/20 text-center">
              <p className="text-sm text-gray-400 mb-2">Accepted</p>
              <p className="text-2xl font-bold text-white">USDC / ETH</p>
              <p className="text-xs text-gray-500 mt-1">on Base</p>
            </div>
          </div>

          <div className="bg-dark-200/30 rounded-2xl p-8 border border-white/5 max-w-4xl mx-auto">
            <h3 className="font-bold text-xl mb-4">Plain English: What the engine does</h3>
            <p className="text-gray-300 mb-4">The token design supports four outcomes:</p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start"><span className="text-accent-400 mr-2">•</span> Liquidity strengthening (protocol-owned liquidity design)</li>
              <li className="flex items-start"><span className="text-accent-400 mr-2">•</span> Treasury support for ecosystem development</li>
              <li className="flex items-start"><span className="text-accent-400 mr-2">•</span> A burn mechanism designed to decrease over time (to avoid long-term instability)</li>
              <li className="flex items-start"><span className="text-accent-400 mr-2">•</span> A rewards pool mechanism: {PLACEHOLDERS.REWARDS}</li>
            </ul>

            <details className="mt-6 bg-dark-100 rounded-xl p-4 cursor-pointer">
              <summary className="font-semibold text-base-blue">Advanced details</summary>
              <div className="mt-4 space-y-2 text-sm text-gray-400">
                <p><strong>Hard caps:</strong> Buy tax cannot exceed {PROJECT_CONFIG.MAX_BUY_TAX}. Sell tax cannot exceed {PROJECT_CONFIG.MAX_SELL_TAX}.</p>
                <p><strong>Timelock design:</strong> Sensitive changes require time delay before execution.</p>
                <p><strong>Vesting:</strong> Linear vesting with claim-on-demand (no forced daily claims).</p>
                <p><strong>LP lock design:</strong> Liquidity timelock framework</p>
                <p className="text-xs text-gray-500 mt-4">Allocation table: {PLACEHOLDERS.ALLOCATIONS_TABLE}</p>
              </div>
            </details>
          </div>
        </section>

        {/* BUY MODULE */}
        <section className="mb-16" id="buy">
          <h2 className="text-4xl font-bold mb-8 text-center gradient-text">Token Sale</h2>
          <div className="max-w-2xl mx-auto">
            <BuyModule />
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to participate?</h2>
          <p className="text-gray-400 mb-6">Join the graphene revolution on Base.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#buy">
              <Button size="lg">Buy {PROJECT_CONFIG.TOKEN_SYMBOL} Now</Button>
            </Link>
            <Link href="/risk">
              <Button size="lg" variant="outline">Review Risks & Eligibility</Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
