"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { PROJECT_CONFIG, COMPLIANCE } from "@/config/constants";
import { VideoBackground } from "@/components/Effects/VideoBackground";
import { FloatingParticles } from "@/components/Effects/FloatingParticles";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
  verifyLinks?: string[];
  category: "trust" | "market" | "token" | "technical";
}

const FAQ_ITEMS: FAQItem[] = [
  {
    category: "trust",
    question: "Won't this just dump at launch?",
    answer: (
      <>
        <p className="mb-3">
          84% of total supply is locked at TGE. The team is on a 36-month Sablier stream — they can&apos;t sell at launch any more than you can. Only 16% circulates on day one.
        </p>
        <p className="mb-3">
          50% of presale tokens stream to your wallet daily over 15 months — not all at once. There is no single moment where a wall of tokens can hit the market.
        </p>
        <p>
          Contrast this with most launches where insiders hold massive unlocked positions and dump on day one.
        </p>
      </>
    ),
    verifyLinks: [
      "Team vesting stream address on Basescan",
      "$GRAF contract — no mint function",
    ],
  },
  {
    category: "trust",
    question: "How do I know you won&apos;t take the money and disappear?",
    answer: (
      <>
        <p className="mb-4 font-medium text-white">You don&apos;t have to trust us. Verify it.</p>
        <ul className="space-y-2">
          <li className="flex items-start space-x-2">
            <span className="text-base-blue mt-0.5">•</span>
            <span><strong className="text-white">LP locked 24 months on-chain</strong> — paste the UNCX transaction hash. The liquidity cannot be removed until the lock expires.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-base-blue mt-0.5">•</span>
            <span><strong className="text-white">Treasury is a Gnosis Safe 3-of-5 multisig</strong> — requires 3 of 5 signers to move a single dollar. Public address, viewable by anyone.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-base-blue mt-0.5">•</span>
            <span><strong className="text-white">No mint function</strong> — supply is fixed at 1,000,000,000. Verifiable on Basescan.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-base-blue mt-0.5">•</span>
            <span><strong className="text-white">SolidProof audit</strong> — independent third-party review of every function in the contract.</span>
          </li>
        </ul>
        <p className="mt-4 text-sm text-gray-400">
          A rug pull requires removing LP or minting new tokens. Both are impossible here.
        </p>
      </>
    ),
    verifyLinks: [
      "UNCX lock",
      "Gnosis Safe address",
      "Basescan contract",
      "SolidProof audit report",
    ],
  },
  {
    category: "trust",
    question: "What if nobody uses the network?",
    answer: (
      <>
        <p className="mb-3">
          Graphene Council members — professionals already working inside the graphene industry — committed $25,000 before the public presale opened. That capital is locked in the LP for 24 months.
        </p>
        <p>
          These aren&apos;t crypto speculators hoping a network gets built. They&apos;re manufacturers, researchers, and distributors who need the coordination infrastructure to exist. The demand isn&apos;t hypothetical — it&apos;s demonstrated by the people who wrote checks before anyone else could.
        </p>
      </>
    ),
  },
  {
    category: "token",
    question: "How do I actually sell? What's the exit?",
    answer: (
      <>
        <p className="mb-3">
          $GRAF trades on <strong className="text-white">Aerodrome Finance on Base</strong> — live at TGE. Any wallet can sell at any time, no permission required.
        </p>
        <p className="mb-3">
          The AMM liquidity pool uses the x&times;y=k formula — it is mathematically impossible to drain to zero. The pool will always have USDC available to buy your tokens, regardless of how many people sell.
        </p>
        <p>
          You are never locked in. The only variable is the price you receive — which depends on pool depth at the time of your trade.
        </p>
      </>
    ),
    verifyLinks: [
      "Aerodrome pool address on Base",
      "Pool USDC balance",
    ],
  },
  {
    category: "market",
    question: "Is graphene even a real market?",
    answer: (
      <>
        <p className="mb-3">
          Yes. The global graphene market is valued at <strong className="text-white">$1.08 billion today</strong> and projected to exceed <strong className="text-white">$5 billion by 2030</strong> (CAGR ~28%). Active buyers include Samsung, aerospace manufacturers, defense contractors, and advanced composites producers.
        </p>
        <p>
          Graphene is the strongest material ever tested — stronger than steel, more conductive than copper, flexible, and transparent. It&apos;s already in production. The bottleneck isn&apos;t the material — it&apos;s the fragmented industry infrastructure for verification, sourcing, and coordination. That&apos;s the problem the Graphene Council solves.
        </p>
      </>
    ),
  },
  {
    category: "token",
    question: "Why does this need a token? Why not just a membership fee?",
    answer: (
      <>
        <p className="mb-4">A membership fee is static. $GRAF is programmable.</p>
        <ul className="space-y-2">
          <li className="flex items-start space-x-2">
            <span className="text-base-blue mt-0.5">•</span>
            <span><strong className="text-white">Staking</strong> — lock $GRAF to earn from the 150M token protocol rewards pool</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-base-blue mt-0.5">•</span>
            <span><strong className="text-white">Governance</strong> — vote on network decisions, treasury allocations, membership criteria</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-base-blue mt-0.5">•</span>
            <span><strong className="text-white">Transferable</strong> — sell or transfer your council seat without asking anyone&apos;s permission</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-base-blue mt-0.5">•</span>
            <span><strong className="text-white">Verifiable on-chain</strong> — membership status is public and unforgeable</span>
          </li>
        </ul>
        <p className="mt-4 text-sm text-gray-400">
          None of that is possible with a subscription. The token is the access layer — not a fundraising wrapper.
        </p>
      </>
    ),
  },
  {
    category: "trust",
    question: "What happens to my money if the project fails to hit soft cap?",
    answer: (
      <>
        <p className="mb-3">
          <strong className="text-white">Full refund. Automatically.</strong> If the presale does not reach $120,000 by TGE, every participant receives 100% of their USDC back. No action required.
        </p>
        <p>
          This is enforced by the smart contract — not a promise from the team.
        </p>
      </>
    ),
    verifyLinks: [
      "Presale contract refund function",
      "Soft cap threshold",
    ],
  },
  {
    category: "trust",
    question: "Why not a VC round?",
    answer: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
          <h4 className="font-bold text-red-400 mb-3 text-sm">VC / Private Round</h4>
          <ul className="space-y-2 text-sm">
            {[
              "Preferential pricing — insiders pay less",
              "Board seats and control clauses",
              "Valuation games and side agreements",
              "12–18 month raise timeline",
              "VCs dump on retail at TGE",
              "You find out later what insiders paid",
              "Community has no say",
            ].map((item, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-red-400 mt-0.5">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
          <h4 className="font-bold text-green-400 mb-3 text-sm">$GRAF Presale</h4>
          <ul className="space-y-2 text-sm">
            {[
              "Flat pricing — same rate for everyone",
              "No board, no control, no strings",
              "Every term is public and on-chain",
              "Raise closes at TGE — clean timeline",
              "Council members in at same price as you",
              "Full transparency from day one",
              "Token holders govern the network",
            ].map((item, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  {
    category: "token",
    question: "Why is 50% of the presale allocation locked?",
    answer: (
      <>
        <p className="mb-3">
          Graphene doesn&apos;t move at crypto speed. Council members have material already produced. Purification, certification, and commercialization take months — not days. A 15-month stream keeps every participant aligned with the real-world timeline of the industry.
        </p>
        <p className="mb-4">
          Fast unlocks reward flippers. Streams reward builders. The 50% stream is a signal: the people who designed this structure believe in the 12-month timeline, not the 12-minute trade.
        </p>
        <div className="bg-dark-200/60 rounded-xl p-4">
          <h4 className="font-bold text-white text-sm mb-3">What the 15-month stream looks like on $1,000 entry:</h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-base-blue font-bold text-sm whitespace-nowrap">Day 1 (TGE)</span>
              <span className="text-sm">324,675 tokens available immediately in your wallet. Stake, sell, or hold.</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-base-blue font-bold text-sm whitespace-nowrap">Day 1+</span>
              <span className="text-sm">~721 tokens per day stream to your wallet automatically. Claimable anytime on the dashboard.</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-base-blue font-bold text-sm whitespace-nowrap">Month 15</span>
              <span className="text-sm">All 649,351 tokens fully in your possession. Stream complete.</span>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    category: "technical",
    question: "Why Base Chain?",
    answer: (
      <>
        <p className="mb-3">
          Base is Coinbase&apos;s L2, with <strong className="text-white">$10B+ in TVL</strong>, sub-cent transaction fees, and institutional backing. It&apos;s the fastest-growing L2 in the ecosystem.
        </p>
        <p className="mb-3">
          <strong className="text-white">Aerodrome Finance</strong> is the largest DEX on Base by volume — deep liquidity, battle-tested contracts, and the standard for serious Base-native projects.
        </p>
        <p>
          We chose Base because it&apos;s where serious DeFi participants already are — not a gambling chain chasing hype, but a professional infrastructure layer built for longevity.
        </p>
      </>
    ),
  },
];

const VERIFICATION_ITEMS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Smart Contract Audit",
    desc: "Independent review by SolidProof before TGE. Every function examined. Badge live on DEX Screener.",
    link: "SolidProof report: published at TGE",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: "LP Lock — 24 Months",
    desc: "$25,000 liquidity locked on UNCX before TGE. Cannot be removed. Verifiable by anyone with the tx hash.",
    link: "UNCX lock: tx hash at TGE",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
      </svg>
    ),
    title: "Gnosis Safe Treasury",
    desc: "3-of-5 multisig. Requires 3 separate signers to move any funds. Public address on Base.",
    link: "Safe address: published at TGE",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Team Vesting — Sablier",
    desc: "Team tokens on 30-day cliff + 36-month stream. No bulk unlock. 1,388,889 tokens/month max.",
    link: "Sablier stream: published at TGE",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    title: "No Mint Function",
    desc: "Total supply fixed at 1,000,000,000. The contract has no mint capability. Supply cannot be inflated.",
    link: "Basescan contract: published at TGE",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
      </svg>
    ),
    title: "Soft Cap Refund",
    desc: "If $120K soft cap is not reached, 100% refund is enforced by the smart contract. No action needed.",
    link: "Presale contract: published at TGE",
  },
];

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "trust", label: "Trust & Safety" },
  { key: "market", label: "Market" },
  { key: "token", label: "Token Design" },
  { key: "technical", label: "Technical" },
] as const;

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`border rounded-xl transition-all ${isOpen ? "border-base-blue/30 bg-base-blue/5" : "border-white/5 bg-dark-200/30 hover:border-white/10"}`}>
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
      >
        <h3 className="font-semibold text-sm sm:text-base text-white pr-4">{item.question}</h3>
        <svg
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-5 pb-5">
          <div className="text-sm text-gray-300 leading-relaxed">
            {item.answer}
          </div>
          {item.verifyLinks && item.verifyLinks.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/5">
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">Verify on-chain</p>
              <div className="flex flex-wrap gap-2">
                {item.verifyLinks.map((link, i) => (
                  <span key={i} className="text-xs bg-base-blue/10 text-base-blue px-2.5 py-1 rounded-lg">
                    {link}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredItems = activeCategory === "all"
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <>
      <Head>
        <title>FAQ & Due Diligence - Omnigrafx | $GRAF Token</title>
        <meta name="description" content="Common questions about $GRAF token answered directly. Due diligence, verification links, and transparency — don&apos;t trust, verify." />
      </Head>

      <VideoBackground />
      <FloatingParticles />

      <div className="container mx-auto px-4 py-6 md:py-12 relative z-20">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-base-blue/10 border border-base-blue/30 rounded-full mb-4">
            <span className="text-xs font-medium text-base-blue">DUE DILIGENCE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            <span className="gradient-text neon-base">Presale FAQ</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Common questions — answered directly. Don&apos;t trust. Verify.
          </p>
        </div>

        {/* Category Filter */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => { setActiveCategory(cat.key); setOpenIndex(null); }}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeCategory === cat.key
                    ? "bg-base-blue/15 text-base-blue border border-base-blue/40"
                    : "bg-dark-200/40 text-gray-400 border border-white/5 hover:border-white/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-3 mb-16">
          {filteredItems.map((item, i) => (
            <FAQAccordion
              key={`${activeCategory}-${i}`}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* Verification Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-2">Verification — Don&apos;t Trust. Check.</h2>
            <p className="text-sm text-gray-400">Every claim above is verifiable on-chain. Links go live at TGE.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {VERIFICATION_ITEMS.map((item, i) => (
              <div key={i} className="glass-card rounded-xl p-5 border border-white/5 hover:border-base-blue/20 transition-all">
                <div className="w-10 h-10 rounded-lg bg-base-blue/10 border border-base-blue/30 flex items-center justify-center text-base-blue mb-3">
                  {item.icon}
                </div>
                <h3 className="font-bold text-white text-sm mb-1.5">{item.title}</h3>
                <p className="text-xs text-gray-400 mb-3 leading-relaxed">{item.desc}</p>
                <p className="text-[10px] text-gray-600 font-mono">{item.link}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-xl mx-auto text-center glass-card rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-3">Ready to participate?</h3>
          <p className="text-sm text-gray-400 mb-6">
            Verify the contracts, then join the presale.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/presale">
              <button className="px-6 py-3 bg-gradient-to-r from-base-blue to-accent-500 rounded-xl font-bold text-sm shadow-lg shadow-base-blue/30 hover:-translate-y-1 transition-all">
                Join Presale
              </button>
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="max-w-3xl mx-auto mt-10 text-center">
          <p className="text-[10px] text-gray-600 leading-relaxed">
            $GRAF is a utility token granting access to the Graphene Council protocol on Base. It is not an investment vehicle, security, or financial instrument, and does not represent equity, debt, or any ownership interest in any legal entity. Participation in the presale involves substantial risk, including the risk of total loss of funds. The protocol operates autonomously on-chain — no central party manages, controls, or guarantees outcomes after deployment. Token price after TGE is determined by open market activity and may be significantly lower than the network launch rate. Only participate with funds you can afford to lose entirely. This document does not constitute financial, investment, or legal advice. Consult a qualified professional in your jurisdiction before participating.
          </p>
        </div>
      </div>
    </>
  );
}
