"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

const FAQS: { q: string; a: string }[] = [
  { q: "What is OMNIGRAF ($GRAF)?", a: "A fixed-supply DeSci utility token on Solana. It coordinates funding for graphene research and carbon-aware production methods. Total supply: 1,000,000,000 tokens. No mint function — supply can never increase." },
  { q: "Is this a security?", a: "No. $GRAF is a utility token granting access to the Graphene Council protocol. It does not represent equity, debt, or ownership in any legal entity. It's not an investment vehicle or financial instrument. Token price after TGE is determined entirely by open market activity." },
  { q: "How much supply is locked at launch?", a: "84% of total supply is locked at TGE. Only 160,400,000 tokens (16%) circulate on day one. The team holds 5% — on a 36-month Sablier stream with a 30-day cliff. They can't sell at launch any more than you can." },
  { q: "What's the presale price and how does it compare to TGE?", a: "Private round: $0.001539 per token. TGE price: $0.004500. That's a 65.8% discount. Minimum contribution: $100. Maximum: $10,000. Public round (coming soon): $0.004500, min $100, max $2,000." },
  { q: "What if the soft cap isn't reached?", a: "100% refund. The smart contract enforces this automatically. If $120,000 in contributions isn't reached, all funds return to contributors. No manual process. No trust required." },
  { q: "How does vesting work?", a: "50% of your presale tokens unlock at TGE. The remaining 50% streams to your wallet daily over 15 months. It's claim-on-demand — your tokens accumulate, and you claim when you want. No forced daily transactions. No gas wasted on micro-claims." },
  { q: "Has the smart contract been audited?", a: "Yes. Independent audit by SolidProof. Every contract function examined. Full report published at TGE. SolidProof badge displayed on DEX Screener for ongoing visibility." },
  { q: "Is the liquidity locked?", a: "$25,000 in liquidity locked on UNCX for 24 months before TGE. This lock is on-chain and verifiable by anyone with the transaction hash. The LP cannot be removed during the lock period." },
  { q: "Who controls the treasury?", a: "A Squads multisig wallet requiring 3 of 5 signers to approve any transaction. No single person can move treasury funds. The Squads address is public on Solana. Cash-first draw rule: treasury funds real expenses before discretionary spending." },
  { q: "What are the risks?", a: "This is crypto. Risks are real. Token price may go down. Smart contracts can have vulnerabilities despite audits. Regulatory environments change. Market conditions are unpredictable. Only participate with money you can afford to lose entirely. This is not financial advice. Consult a qualified professional in your jurisdiction." },
  { q: "What network is $GRAF on?", a: "Solana — high-throughput Layer 1. $GRAF trades on Jupiter (Solana's leading DEX aggregator) and Raydium. You need a Solana wallet (Phantom, Backpack, Solflare) with a small SOL balance for transaction fees." },
];

export default function FaqPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("visible"), obs.unobserve(e.target))),
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".fade-up").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>FAQ &amp; Verification — OMNIGRAF</title>
        <meta name="description" content="Common questions about $GRAF presale, vesting, audit, LP lock, and risks. Every claim verifiable on-chain." />
      </Head>

      <section className="page-hero" style={{ paddingBottom: 60 }}>
        <div className="hero-bg">
          <img src="/images/hero-bg.jpg" alt="OMNIGRAF background" loading="eager" />
        </div>
        <div className="container page-hero-content">
          <h1>FAQ &amp; Verification</h1>
          <p>Questions answered directly. Every claim verifiable on-chain. Don&apos;t trust — verify.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">Presale FAQ</div>
            <h2 className="section-title">Common Questions</h2>
          </div>

          <div className="faq-list fade-up">
            {FAQS.map((item, idx) => (
              <div key={idx} className={`faq-item ${openIdx === idx ? "open" : ""}`}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  aria-expanded={openIdx === idx}
                >
                  {item.q}
                </button>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">On-Chain Verification</div>
            <h2 className="section-title">Don&apos;t Trust. Check.</h2>
            <p className="section-desc">Every claim is verifiable. Links go live at TGE.</p>
          </div>

          <div className="trust-grid fade-up">
            <div className="trust-card">
              <div className="trust-card-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg></div>
              <h4>Smart Contract Audit</h4>
              <p>Independent review by SolidProof. Every function examined. Badge live on DEX Screener.</p>
            </div>
            <div className="trust-card">
              <div className="trust-card-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
              <h4>LP Lock — 24 Months</h4>
              <p>$25,000 liquidity locked on UNCX before TGE. Cannot be removed. Verifiable by anyone.</p>
            </div>
            <div className="trust-card">
              <div className="trust-card-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg></div>
              <h4>Squads Treasury</h4>
              <p>3-of-5 multisig. Requires 3 signers to move funds. Public address on Solana.</p>
            </div>
            <div className="trust-card">
              <div className="trust-card-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
              <h4>Team Vesting — Sablier</h4>
              <p>30-day cliff + 36-month stream. Max: 1,388,889 tokens/month. No bulk unlock.</p>
            </div>
            <div className="trust-card">
              <div className="trust-card-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg></div>
              <h4>No Mint Function</h4>
              <p>1,000,000,000 fixed. The contract has no mint capability. Supply cannot be inflated. Ever.</p>
            </div>
            <div className="trust-card">
              <div className="trust-card-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg></div>
              <h4>Soft Cap Refund</h4>
              <p>If $120K soft cap isn&apos;t reached, 100% refund enforced by the smart contract. No action needed.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content fade-up">
            <h2>Verified the Contracts? Ready to Participate?</h2>
            <p>Review everything above. Then decide.</p>
            <Link href="/presale" className="btn btn-primary" data-burst="true">Join the Presale →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
