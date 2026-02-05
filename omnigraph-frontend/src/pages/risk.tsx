"use client";

import Head from "next/head";
import { PROJECT_CONFIG, COMPLIANCE } from "@/config/constants";

export default function RiskPage() {
  return (
    <>
      <Head>
        <title>Risk & Eligibility | {PROJECT_CONFIG.PROJECT_NAME}</title>
        <meta
          name="description"
          content="Important risk disclosures and eligibility requirements for participating in the Graphene Token sale."
        />
      </Head>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 gradient-text">Risk & Eligibility</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Please read these important disclosures before participating in the {PROJECT_CONFIG.TOKEN_SYMBOL} token sale.
          </p>
        </div>

        {/* Critical Warning */}
        <div className="bg-red-500/10 border-2 border-red-500/50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-red-400">⚠️ High-Risk Asset</h2>
          <p className="text-gray-300 text-lg">
            {COMPLIANCE.RISK_DISCLOSURE}
          </p>
        </div>

        {/* Eligibility */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 gradient-text">Eligibility Requirements</h2>
          <div className="bg-dark-200/50 backdrop-blur-sm rounded-2xl p-8 border border-base-blue/20">
            <h3 className="font-bold text-xl mb-4 text-yellow-400">Geographic Restrictions</h3>
            <p className="text-gray-300 mb-6">
              {PROJECT_CONFIG.GEO_RESTRICTIONS_TEXT}
            </p>

            <h3 className="font-bold text-xl mb-4 text-yellow-400 mt-8">Who Cannot Participate</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-red-400 mr-3">✗</span>
                <span>Residents of the United States and its territories</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-3">✗</span>
                <span>Residents of sanctioned countries (OFAC list)</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-3">✗</span>
                <span>Individuals under 18 years of age</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-3">✗</span>
                <span>Entities or individuals on sanctions lists</span>
              </li>
            </ul>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mt-6">
              <p className="text-sm text-gray-300">
                <strong className="text-yellow-400">Responsibility:</strong> It is your responsibility to verify your eligibility before participating. Misrepresenting your location or eligibility status may result in loss of funds and legal consequences.
              </p>
            </div>
          </div>
        </section>

        {/* Risks */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 gradient-text">Material Risks</h2>

          <div className="space-y-6">
            {/* Market Risk */}
            <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 border border-red-500/20">
              <h3 className="font-bold text-lg mb-3 text-red-400">Market & Price Risk</h3>
              <p className="text-gray-300 mb-3">
                Cryptocurrency markets are extremely volatile. The value of {PROJECT_CONFIG.TOKEN_SYMBOL} could decline significantly or become worthless.
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• No guarantee of price appreciation</li>
                <li>• High volatility and potential for total loss</li>
                <li>• Market conditions can change rapidly</li>
                <li>• Limited or no liquidity may occur</li>
              </ul>
            </div>

            {/* Regulatory Risk */}
            <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
              <h3 className="font-bold text-lg mb-3 text-orange-400">Regulatory & Legal Risk</h3>
              <p className="text-gray-300 mb-3">
                Cryptocurrency regulations are evolving and uncertain. Future regulations could negatively impact {PROJECT_CONFIG.TOKEN_SYMBOL}.
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Regulatory changes could restrict trading or holding</li>
                <li>• Tax treatment is uncertain and may change</li>
                <li>• Cross-border regulations may affect participation</li>
                <li>• Legal status varies by jurisdiction</li>
              </ul>
            </div>

            {/* Smart Contract Risk */}
            <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
              <h3 className="font-bold text-lg mb-3 text-yellow-400">Smart Contract & Technical Risk</h3>
              <p className="text-gray-300 mb-3">
                Smart contracts may contain bugs, vulnerabilities, or design flaws that could result in loss of funds.
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Code vulnerabilities despite audits</li>
                <li>• Network congestion or failures</li>
                <li>• Potential exploits or hacks</li>
                <li>• Irreversible transactions</li>
              </ul>
            </div>

            {/* Liquidity Risk */}
            <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
              <h3 className="font-bold text-lg mb-3 text-blue-400">Liquidity Risk</h3>
              <p className="text-gray-300 mb-3">
                There is no guarantee that adequate liquidity will exist for trading {PROJECT_CONFIG.TOKEN_SYMBOL}.
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Limited trading venues</li>
                <li>• Wide bid-ask spreads possible</li>
                <li>• Difficulty selling at desired price</li>
                <li>• Ecosystem liquidity contributions are discretionary, not guaranteed</li>
              </ul>
            </div>

            {/* Project Risk */}
            <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <h3 className="font-bold text-lg mb-3 text-purple-400">Project & Execution Risk</h3>
              <p className="text-gray-300 mb-3">
                The success of the graphene ecosystem depends on many factors beyond the token itself.
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Graphene production may not scale as anticipated</li>
                <li>• Market adoption of graphene technologies uncertain</li>
                <li>• Ecosystem partnerships may not materialize</li>
                <li>• Competition from other materials or tokens</li>
                <li>• Team execution risk</li>
              </ul>
            </div>

            {/* No Guarantee of Utility */}
            <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 border border-gray-500/20">
              <h3 className="font-bold text-lg mb-3 text-gray-400">No Guarantee of Utility or Returns</h3>
              <p className="text-gray-300 mb-3">
                {PROJECT_CONFIG.TOKEN_SYMBOL} does not guarantee any specific utility, returns, or benefits.
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Future utility features are not guaranteed</li>
                <li>• No promise of revenue, profits, or dividends</li>
                <li>• Ecosystem support is discretionary</li>
                <li>• RWA pathway is exploratory and subject to legal review</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Not an Investment */}
        <section className="mb-12">
          <div className="bg-yellow-500/10 border-2 border-yellow-500/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">This is Not an Investment</h2>
            <p className="text-gray-300 text-lg mb-4">
              {COMPLIANCE.NO_INVESTMENT}
            </p>
            <p className="text-gray-300">
              {PROJECT_CONFIG.TOKEN_SYMBOL} is a utility token designed to support ecosystem coordination. It is not:
            </p>
            <ul className="space-y-2 text-gray-300 mt-4">
              <li className="flex items-start">
                <span className="text-yellow-400 mr-3">•</span>
                <span>An investment contract or security (in jurisdictions where these terms apply)</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-3">•</span>
                <span>A guarantee of profit, returns, or price appreciation</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-3">•</span>
                <span>A share of company profits or dividends</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-3">•</span>
                <span>A promise of future liquidity support</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Forward-Looking Statements */}
        <section className="mb-12">
          <div className="bg-dark-200/50 backdrop-blur-sm rounded-2xl p-8 border border-base-blue/20">
            <h2 className="text-2xl font-bold mb-4 gradient-text">Forward-Looking Statements</h2>
            <p className="text-gray-300 mb-4">
              This website contains forward-looking statements about future plans, objectives, and expectations. Words like &quot;may,&quot; &quot;intend,&quot; &quot;plan,&quot; &quot;explore,&quot; &quot;design,&quot; and similar language indicate forward-looking statements.
            </p>
            <p className="text-gray-300">
              These statements are not guarantees and are subject to risks, uncertainties, and assumptions. Actual results may differ materially from these statements. Do not rely on forward-looking statements as predictions of future events.
            </p>
          </div>
        </section>

        {/* Acknowledgment */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-base-blue/10 to-accent-500/10 rounded-2xl p-8 border border-base-blue/30">
            <h2 className="text-2xl font-bold mb-4 gradient-text">Acknowledgment Required</h2>
            <p className="text-gray-300 mb-4">
              By purchasing {PROJECT_CONFIG.TOKEN_SYMBOL}, you acknowledge and agree that:
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-base-blue mr-3">✓</span>
                <span>You have read and understood all risk disclosures</span>
              </li>
              <li className="flex items-start">
                <span className="text-base-blue mr-3">✓</span>
                <span>You meet all eligibility requirements</span>
              </li>
              <li className="flex items-start">
                <span className="text-base-blue mr-3">✓</span>
                <span>You can afford to lose your entire investment</span>
              </li>
              <li className="flex items-start">
                <span className="text-base-blue mr-3">✓</span>
                <span>You are not relying on any promises of profit or returns</span>
              </li>
              <li className="flex items-start">
                <span className="text-base-blue mr-3">✓</span>
                <span>You have sought independent legal, financial, and tax advice</span>
              </li>
              <li className="flex items-start">
                <span className="text-base-blue mr-3">✓</span>
                <span>You understand that liquidity support is discretionary and not guaranteed</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Questions?</h2>
          <p className="text-gray-400 mb-6">
            If you have questions about eligibility or risks, please contact support before participating.
          </p>
          <a
            href={PROJECT_CONFIG.SUPPORT_LINK}
            className="inline-block px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-base-blue/50 rounded-xl font-semibold backdrop-blur-sm transition-all duration-300"
          >
            Contact Support
          </a>
        </section>

        {/* Footer Disclosure */}
        <div className="bg-dark-200/30 border border-white/5 rounded-xl p-6 mt-12">
          <p className="text-xs text-gray-500 text-center">
            {COMPLIANCE.FOOTER_DISCLOSURE}
          </p>
        </div>
      </div>
    </>
  );
}
