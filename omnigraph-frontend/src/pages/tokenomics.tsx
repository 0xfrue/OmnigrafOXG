"use client";

import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

export default function TokenomicsPage() {
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
        <title>Tokenomics — OMNIGRAF ($GRAF)</title>
        <meta name="description" content="Full tokenomics breakdown for OMNIGRAF. 1 billion fixed supply. 84% locked at TGE. 16% circulating float." />
      </Head>

      <section className="page-hero" style={{ paddingBottom: 40 }}>
        <div className="hero-bg">
          <img src="/images/tokenomics-bg.jpg" alt="Token allocation visualization" loading="eager" />
        </div>
        <div className="container page-hero-content">
          <h1>Full Tokenomics Breakdown</h1>
          <p>Every number verified. Every allocation documented. Every lock on-chain.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">Key Metrics</div>
            <h2 className="section-title">The Numbers</h2>
            <div className="token-meta">
              OMNIGRAF <span>·</span> $GRAF <span>·</span> Solana (Jupiter) <span>·</span> 1,000,000,000 fixed supply <span>·</span> no mint function
            </div>
          </div>

          <div className="stats-grid fade-up">
            <div className="stat-card"><div className="stat-label">Launch FDV</div><div className="stat-value cyan">$4.5M</div></div>
            <div className="stat-card"><div className="stat-label">Presale Discount</div><div className="stat-value green">65.8%</div></div>
            <div className="stat-card"><div className="stat-label">Circulating Float</div><div className="stat-value gold">16%</div></div>
            <div className="stat-card"><div className="stat-label">Hard Cap Raise</div><div className="stat-value cyan">$360K</div></div>
            <div className="stat-card"><div className="stat-label">Peak FDV (Hard Cap)</div><div className="stat-value green">$9.7M</div></div>
            <div className="stat-card"><div className="stat-label">Pool Deaths (Monte Carlo)</div><div className="stat-value gold">0 / 50K</div></div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">Parameters</div>
            <h2 className="section-title">Core Token Parameters</h2>
          </div>

          <div className="params-grid fade-up">
            <div className="params-card">
              <h3>Token</h3>
              <div className="param-row"><span className="param-key">Name</span><span className="param-val">OMNIGRAF</span></div>
              <div className="param-row"><span className="param-key">Ticker</span><span className="param-val">$GRAF</span></div>
              <div className="param-row"><span className="param-key">Chain</span><span className="param-val">Solana</span></div>
              <div className="param-row"><span className="param-key">DEX</span><span className="param-val">Jupiter</span></div>
              <div className="param-row"><span className="param-key">Total Supply</span><span className="param-val">1,000,000,000</span></div>
              <div className="param-row"><span className="param-key">Mint Function</span><span className="param-val" style={{ color: "var(--accent-green)" }}>None — Fixed</span></div>
            </div>
            <div className="params-card">
              <h3>Pricing</h3>
              <div className="param-row"><span className="param-key">Launch FDV</span><span className="param-val">$4,500,000</span></div>
              <div className="param-row"><span className="param-key">TGE Price</span><span className="param-val">$0.004500</span></div>
              <div className="param-row"><span className="param-key">Presale Price</span><span className="param-val" style={{ color: "var(--accent-green)" }}>$0.001539</span></div>
              <div className="param-row"><span className="param-key">Discount</span><span className="param-val">65.8% below TGE</span></div>
              <div className="param-row"><span className="param-key">Soft Cap</span><span className="param-val">$120,000</span></div>
              <div className="param-row"><span className="param-key">Hard Cap</span><span className="param-val">$360,000</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">Allocation</div>
            <h2 className="section-title">Token Allocation</h2>
            <p className="section-desc">1,000,000,000 total supply — verified. No rounding errors.</p>
          </div>

          <div className="fade-up" style={{ overflowX: "auto" }}>
            <table className="allocation-table">
              <thead>
                <tr><th>Bucket</th><th>Tokens</th><th>%</th><th>Unlock Schedule</th></tr>
              </thead>
              <tbody>
                <tr><td>Public Presale</td><td>234,000,000</td><td>23.4%</td><td>50% at TGE · 50% stream daily over 15 months</td></tr>
                <tr><td>Referral Bonus Pool</td><td>23,400,000</td><td>2.3%</td><td>100% at TGE to referrers</td></tr>
                <tr><td>Treasury / Graphene Council</td><td>392,600,000</td><td>39.3%</td><td>Squads 3-of-5 · cash-first draw rule</td></tr>
                <tr><td>Ecosystem / Staking</td><td>150,000,000</td><td>15.0%</td><td>Fixed pool · daily drip 36 months</td></tr>
                <tr><td>Burn Reserve</td><td>50,000,000</td><td>5.0%</td><td>$3M / $5M / $10M FDV milestone triggers</td></tr>
                <tr><td>Team &amp; Founders</td><td>50,000,000</td><td>5.0%</td><td>30-day cliff · 36-month Sablier stream</td></tr>
                <tr><td>Community Airdrop</td><td>40,000,000</td><td>4.0%</td><td>50% TGE · 50% stream 15 months</td></tr>
                <tr><td>Marketing</td><td>30,000,000</td><td>3.0%</td><td>12-month Sablier stream</td></tr>
                <tr><td>LP Pool (locked)</td><td>30,000,000</td><td>3.0%</td><td>Locked in Jupiter pool 24 months</td></tr>
              </tbody>
              <tfoot>
                <tr><td>TOTAL</td><td>1,000,000,000</td><td>100%</td><td>Verified — no rounding errors</td></tr>
              </tfoot>
            </table>
          </div>

          <div className="float-note fade-up">
            <strong>Circulating at TGE: 160,400,000 (16.0%)</strong> — 84% locked. The team holds 5% on a 36-month Sablier stream with a 30-day cliff. Maximum team unlock: 1,388,889 tokens/month. No bulk unlock. No day-one dump.
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">Vesting</div>
            <h2 className="section-title">Vesting Design: Claim-on-Demand</h2>
            <p className="section-desc">Your tokens accumulate automatically. Claim when you want. No daily transactions required. No gas wasted.</p>
          </div>

          <div className="vesting-grid fade-up">
            <div className="vesting-card">
              <h4>At TGE</h4>
              <div className="vesting-pct" style={{ color: "var(--accent-cyan)" }}>50%</div>
              <div className="vesting-detail">Unlocked immediately to your wallet</div>
            </div>
            <div className="vesting-card">
              <h4>Streaming</h4>
              <div className="vesting-pct" style={{ color: "var(--accent-green)" }}>50%</div>
              <div className="vesting-detail">Daily linear release via Sablier</div>
            </div>
            <div className="vesting-card">
              <h4>Full Unlock</h4>
              <div className="vesting-pct" style={{ color: "var(--accent-gold)" }}>15mo</div>
              <div className="vesting-detail">100% available by month 15</div>
            </div>
          </div>

          <div className="challenge-grid fade-up" style={{ marginTop: 48 }}>
            <div className="challenge-card">
              <div className="challenge-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
              <h4>No Daily Claims</h4>
              <p>Tokens accumulate. Claim on your schedule, not a forced one.</p>
            </div>
            <div className="challenge-card">
              <div className="challenge-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></div>
              <h4>Gas Efficient</h4>
              <p>Save on transaction fees by claiming less frequently.</p>
            </div>
            <div className="challenge-card">
              <div className="challenge-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></div>
              <h4>Simple</h4>
              <p>No complex schedules. No missed windows. Your tokens, your timing.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content fade-up">
            <h2>Ready to Participate?</h2>
            <p>65.8% below TGE. Fixed supply. Verifiable on-chain.</p>
            <div className="hero-actions">
              <Link href="/presale" className="btn btn-primary" data-burst="true">Join the Presale →</Link>
              <Link href="/faq" className="btn btn-secondary">FAQ &amp; Due Diligence</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
