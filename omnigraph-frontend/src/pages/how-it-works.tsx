"use client";

import Head from "next/head";
import Link from "next/link";
import { PROJECT_CONFIG, COMPLIANCE, PLACEHOLDERS } from "@/config/constants";

export default function HowItWorksPage() {
  return (
    <>
      <Head>
        <title>How It Works | {PROJECT_CONFIG.PROJECT_NAME}</title>
        <meta
          name="description"
          content="Understand the token mechanics, liquidity support design, and safety features of Graphene Token."
        />
      </Head>

      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 gradient-text">How It Works</h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Understanding the token mechanics, ecosystem alignment, and safety-first design philosophy.
          </p>
        </div>

        {/* Token Overview */}
        <section className="mb-16">
          <div className="bg-dark-200/50 backdrop-blur-sm rounded-2xl p-8 border border-base-blue/20">
            <h2 className="text-3xl font-bold mb-6 gradient-text">Token Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-xl mb-4 text-base-blue">Basic Information</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-gray-400">Token Name</dt>
                    <dd className="text-lg font-semibold">{PROJECT_CONFIG.PROJECT_NAME}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-400">Symbol</dt>
                    <dd className="text-lg font-semibold">{PROJECT_CONFIG.TOKEN_SYMBOL}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-400">Network</dt>
                    <dd className="text-lg font-semibold">{PROJECT_CONFIG.NETWORK}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-400">Total Supply</dt>
                    <dd className="text-lg font-semibold">{PROJECT_CONFIG.TOTAL_SUPPLY}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-400">TGE Price</dt>
                    <dd className="text-lg font-semibold">{PROJECT_CONFIG.TGE_PRICE}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-4 text-accent-400">Safety Features</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span><strong>Fixed supply:</strong> No unlimited minting</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span><strong>Hard caps:</strong> Buy tax ≤{PROJECT_CONFIG.MAX_BUY_TAX}, Sell tax ≤{PROJECT_CONFIG.MAX_SELL_TAX}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span><strong>LP lock design:</strong> Liquidity timelock mechanism</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span><strong>Time-delayed governance:</strong> No instant parameter changes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span><strong>Claim-on-demand vesting:</strong> No forced claims</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Token Engine (4 outcomes) */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center gradient-text">What the Token Engine Does</h2>
          <p className="text-gray-300 text-lg text-center max-w-4xl mx-auto mb-12">
            Transaction fees are automatically distributed to support four key ecosystem outcomes:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-8 border border-blue-500/20">
              <div className="text-4xl mb-4">💧</div>
              <h3 className="font-bold text-2xl mb-4 text-blue-400">1. Liquidity Strengthening</h3>
              <p className="text-gray-300 mb-4">
                Protocol-owned liquidity (POL) design ensures the ecosystem can maintain healthy trading conditions over time.
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Automatic LP provision from fees</li>
                <li>• Reduced reliance on individual LPs</li>
                <li>• Long-term liquidity stability</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-8 border border-green-500/20">
              <div className="text-4xl mb-4">🏦</div>
              <h3 className="font-bold text-2xl mb-4 text-green-400">2. Treasury Support</h3>
              <p className="text-gray-300 mb-4">
                Ecosystem development treasury funds research collaboration, partnerships, and infrastructure.
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Graphene R&D funding</li>
                <li>• Ecosystem partnerships</li>
                <li>• Education and awareness initiatives</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-8 border border-orange-500/20">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="font-bold text-2xl mb-4 text-orange-400">3. Burn Mechanism</h3>
              <p className="text-gray-300 mb-4">
                Deflationary burns reduce supply over time, designed to decrease gradually to avoid long-term instability.
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Deflationary pressure on supply</li>
                <li>• Capped total burn (max 30%)</li>
                <li>• Decreasing burn rate over time</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-purple-500/20">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="font-bold text-2xl mb-4 text-purple-400">4. Rewards Pool</h3>
              <p className="text-gray-300 mb-4">
                {PLACEHOLDERS.REWARDS}
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Staking rewards</li>
                <li>• Lottery pool</li>
                <li>• Participation incentives</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Ecosystem Alignment (Liquidity Support) */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-base-blue/10 to-accent-500/10 rounded-2xl p-8 border border-base-blue/30">
            <h2 className="text-3xl font-bold mb-6 gradient-text">Ecosystem Alignment & Liquidity Support</h2>
            <p className="text-gray-300 text-lg mb-6">
              {COMPLIANCE.LIQUIDITY_SUPPORT}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-dark-200/50 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3 text-base-blue">Who are ecosystem participants?</h3>
                <p className="text-sm text-gray-400">
                  Graphene producers, research groups, and stakeholders who hold tokens and have aligned incentives for ecosystem health.
                </p>
              </div>
              <div className="bg-dark-200/50 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3 text-accent-400">Why would they contribute?</h3>
                <p className="text-sm text-gray-400">
                  As token holders, their success is tied to token stability and ecosystem growth. Healthy liquidity benefits everyone.
                </p>
              </div>
              <div className="bg-dark-200/50 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3 text-primary-400">How is it transparent?</h3>
                <p className="text-sm text-gray-400">
                  Any discretionary liquidity contributions will be documented on-chain: {PLACEHOLDERS.TREASURY_TRANSPARENCY}
                </p>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <p className="text-sm text-gray-300">
                <strong className="text-yellow-400">Important:</strong> Liquidity contributions are discretionary, not guaranteed, and should not be considered a promise of future support. The ecosystem design philosophy includes aligned incentives, but execution is always at the discretion of participants.
              </p>
            </div>
          </div>
        </section>

        {/* Vesting Design */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center gradient-text">Vesting Design: Claim-on-Demand</h2>
          <div className="bg-dark-200/50 backdrop-blur-sm rounded-2xl p-8 border border-base-blue/20">
            <p className="text-gray-300 text-lg mb-6">
              Unlike many token launches that force daily claims, {PROJECT_CONFIG.TOKEN_SYMBOL} uses a claim-on-demand vesting model. This means:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-dark-100 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3 text-green-400">✓ No daily claims required</h3>
                <p className="text-sm text-gray-400">Your vested tokens accumulate automatically. Claim when you want, not when forced.</p>
              </div>
              <div className="bg-dark-100 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3 text-green-400">✓ Gas efficient</h3>
                <p className="text-sm text-gray-400">Save on transaction fees by claiming less frequently.</p>
              </div>
              <div className="bg-dark-100 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3 text-green-400">✓ User-friendly</h3>
                <p className="text-sm text-gray-400">No complex claiming schedules or missed rewards.</p>
              </div>
            </div>

            <h3 className="font-bold text-xl mb-4">Vesting Schedules</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
                <h4 className="font-bold mb-2 text-base-blue">Round 1 (R1)</h4>
                <p className="text-sm text-gray-400 mb-1">{PROJECT_CONFIG.R1_TGE} at TGE</p>
                <p className="text-sm text-gray-400">{PROJECT_CONFIG.R1_VESTING}</p>
              </div>
              <div className="bg-gradient-to-br from-accent-500/10 to-teal-500/10 rounded-xl p-6 border border-accent-500/20">
                <h4 className="font-bold mb-2 text-accent-400">Round 2 (R2)</h4>
                <p className="text-sm text-gray-400 mb-1">{PROJECT_CONFIG.R2_TGE} at TGE</p>
                <p className="text-sm text-gray-400">{PROJECT_CONFIG.R2_VESTING}</p>
              </div>
              <div className="bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-xl p-6 border border-primary-500/20">
                <h4 className="font-bold mb-2 text-primary-400">Round 3 (R3)</h4>
                <p className="text-sm text-gray-400 mb-1">{PROJECT_CONFIG.R3_TGE} at TGE</p>
                <p className="text-sm text-gray-400">{PROJECT_CONFIG.R3_VESTING}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Transparency */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center gradient-text">Security & Transparency</h2>
          <div className="bg-dark-200/50 backdrop-blur-sm rounded-2xl p-8 border border-base-blue/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-xl mb-4 text-green-400">Built-in Safeguards</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span><strong>Fixed max supply design</strong> (no infinite minting)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span><strong>Hard caps on buy and sell taxes</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span><strong>LP lock design via timelock mechanism</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span><strong>Timelocked governance actions</strong> for sensitive changes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span><strong>Claim-on-demand vesting design</strong></span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-4 text-base-blue">Contract Transparency</h3>
                <div className="space-y-4">
                  <div className="bg-dark-100 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1">Token Contract</p>
                    <p className="font-mono text-xs text-gray-300 break-all">{PROJECT_CONFIG.TOKEN_CONTRACT_ADDRESS}</p>
                  </div>
                  <div className="bg-dark-100 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1">Sale Contract</p>
                    <p className="font-mono text-xs text-gray-300 break-all">{PROJECT_CONFIG.SALE_CONTRACT_ADDRESS}</p>
                  </div>
                  <a
                    href={PROJECT_CONFIG.BASE_EXPLORER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center py-3 bg-base-blue/10 hover:bg-base-blue/20 border border-base-blue/30 rounded-xl font-semibold transition-all text-base-blue"
                  >
                    View on Explorer →
                  </a>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center mt-8">
              Even strong safeguards cannot eliminate market risk, contract risk, or regulatory risk.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to participate?</h2>
          <p className="text-gray-400 mb-6">Review risks and eligibility before purchasing.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/#buy">
              <button className="px-8 py-4 bg-gradient-to-r from-base-blue to-accent-500 hover:from-base-blue/90 hover:to-accent-600 rounded-xl font-semibold shadow-lg shadow-base-blue/50 hover:shadow-xl hover:shadow-base-blue/60 transition-all duration-300 hover:-translate-y-1">
                Buy {PROJECT_CONFIG.TOKEN_SYMBOL}
              </button>
            </Link>
            <Link href="/risk">
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-base-blue/50 rounded-xl font-semibold backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
                Review Risks
              </button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
