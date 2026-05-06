"use client";

import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

function useFadeUp() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".fade-up").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export default function Home() {
  useFadeUp();

  return (
    <>
      <Head>
        <title>OMNIGRAF ($GRAF) — Real Graphene Utility On-Chain | Built on Solana</title>
        <meta name="description" content="OMNIGRAF is a DeSci utility token funding graphene research and production coordination on Solana. Fixed supply. Audited. LP locked 24 months." />
      </Head>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <img src="/images/hero-bg.jpg" alt="Graphene hexagonal lattice with blockchain visualization" loading="eager" />
        </div>
        <div className="hero-content fade-up">
          <h1>
            65.8% Below Launch Price.<br />
            <span className="gradient-text">You&apos;re Early.</span>
          </h1>
          <p className="hero-sub">
            $GRAF is the payment token for the graphene economy — used by distributors, vendors, buyers, and sellers across the supply chain. Backed by industry leaders who build with it, trade with it, and support it. Fixed supply. No mint function. When the presale closes, this price is gone.{" "}
            <Link href="/tokenomics" style={{ color: "var(--accent-cyan)", borderBottom: "1px solid var(--accent-cyan)" }}>84% locked at launch.</Link>
          </p>

          <div className="hero-actions">
            <Link href="/presale" className="btn btn-primary" data-burst="true">Reserve Your Allocation →</Link>
            <Link href="/science" className="btn btn-secondary">Read the Science</Link>
          </div>

          <div className="hero-trust-row">
            <span className="hero-trust-link" style={{ cursor: "default" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "-2px", marginRight: "4px" }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
              Audited by SolidProof
            </span>
            <span className="hero-trust-link" style={{ cursor: "default" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "-2px", marginRight: "4px" }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              LP Locked 24mo via UNCX
            </span>
            <span className="hero-trust-link" style={{ cursor: "default" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "-2px", marginRight: "4px" }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
              View Contract on Solscan
            </span>
          </div>
        </div>
      </section>

      {/* CREDIBILITY BAND */}
      <section className="credibility-band">
        <div className="container">
          <div className="cred-label">
            <div style={{ marginBottom: 6, color: "var(--text-primary)" }}>Graphene</div>
            <div>Backed by Real Science and Industry</div>
          </div>
          <div className="cred-row">
            <div className="cred-col">
              <div className="cred-img-wrap"><img src="/images/cred-gc.png" alt="The Graphene Council" width="64" height="64" /></div>
              <strong>Graphene Council</strong>
              <span>Industry body for graphene commercialization</span>
            </div>
            <div className="cred-col">
              <div className="cred-img-wrap"><img src="/images/cred-rx.png" alt="ResolutX" width="130" height="46" /></div>
              <strong>ResolutX</strong>
              <span>Carbon-neutral graphene production</span>
            </div>
            <div className="cred-col">
              <div className="cred-circle"><img src="/images/cred-spacex-circle.png" alt="SpaceX" /></div>
              <strong>SpaceX</strong>
              <span>Graphene tested in orbit on SpaceX missions</span>
            </div>
            <div className="cred-col">
              <div className="cred-circle"><img src="/images/cred-barkan-circle.png" alt="Terrance Barkan" /></div>
              <strong>Terrance Barkan</strong>
              <span>Executive Director, The Graphene Council</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="trust-bar">
        <div className="container">
          <div className="trust-strip">
            <div className="trust-pill">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Fixed supply — no mint function
            </div>
            <div className="trust-pill">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              LP locked 24 months
            </div>
            <div className="trust-pill">
              <img src="/images/logo-solidproof.png" alt="SolidProof" width="18" height="18" style={{ borderRadius: 4 }} />
              Audited by SolidProof
            </div>
            <div className="trust-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Squads 3-of-5
            </div>
            <div className="trust-pill">
              <svg width="16" height="16" viewBox="0 0 397.7 311.7" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="solg1" x1="360.879" y1="351.455" x2="141.213" y2="-69.294" gradientTransform="matrix(1 0 0 -1 0 314)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#00ffa3"/><stop offset="1" stopColor="#dc1fff"/></linearGradient><linearGradient id="solg2" x1="264.829" y1="401.601" x2="45.163" y2="-19.148" gradientTransform="matrix(1 0 0 -1 0 314)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#00ffa3"/><stop offset="1" stopColor="#dc1fff"/></linearGradient><linearGradient id="solg3" x1="312.548" y1="376.688" x2="92.882" y2="-44.061" gradientTransform="matrix(1 0 0 -1 0 314)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#00ffa3"/><stop offset="1" stopColor="#dc1fff"/></linearGradient></defs><path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1z" fill="url(#solg1)"/><path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1z" fill="url(#solg2)"/><path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1z" fill="url(#solg3)"/></svg>
              Built on Solana
            </div>
          </div>
        </div>
      </section>

      {/* APPLICATIONS */}
      <section className="section" id="applications">
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">Real-World Applications</div>
            <h2 className="section-title">The Material That Changes Everything</h2>
            <p className="section-desc">
              200x stronger than steel. Better conductor than copper. One atom thick. Graphene is already inside SpaceX components, Samsung prototypes, and military-grade composites. Here&apos;s where the market is going.
            </p>
          </div>

          <div className="app-grid">
            {[
              { img: "energy.jpg", title: "Energy & Power", items: ["Next-gen batteries: faster charging, higher capacity", "Supercapacitors: rapid energy storage and release", "Solar cells: improved efficiency and flexibility", "Fuel cells: better catalytic performance"], market: "Used by companies building EV batteries and grid-scale energy storage." },
              { img: "electronics.jpg", title: "Electronics", items: ["Flexible displays: bendable, transparent screens", "High-speed transistors: faster computing", "Touch screens: transparent conductive layers", "Quantum computing: single-electron transistors"], market: "Samsung, IBM, and others investing in graphene electronics R&D." },
              { img: "materials.jpg", title: "Materials & Composites", items: ["Advanced composites: aerospace, automotive strength", "Protective coatings: anti-corrosion, wear-resistant", "Concrete reinforcement: stronger infrastructure", "Lightweight armor: defense applications"], market: "Construction, aerospace, and defense sectors adopting graphene composites." },
              { img: "sensors.jpg", title: "Sensors & Detection", items: ["Biosensors: medical diagnostics, drug delivery", "Environmental sensors: pollution detection", "Chemical sensors: industrial safety monitoring", "Strain sensors: structural health monitoring"], market: "Medical device companies exploring graphene-based diagnostics." },
              { img: "water.jpg", title: "Water & Filtration", items: ["Desalination: graphene oxide membranes", "Water purification: contaminant removal", "Gas separation: industrial filtration", "Air filtration: ultra-efficient filters"], market: "Addressing global water scarcity with membrane filtration tech." },
              { img: "industrial.jpg", title: "Industrial Applications", items: ["Lubricants: reduced friction, wear protection", "Anti-corrosion coatings: marine, infrastructure", "Thermal management: heat dissipation in electronics", "3D printing: graphene-enhanced materials"], market: "Manufacturers integrating graphene for performance and longevity." },
            ].map((card) => (
              <div key={card.title} className="app-card fade-up">
                <img src={`/images/${card.img}`} alt={card.title} className="app-card-img" loading="lazy" />
                <div className="app-card-body">
                  <h3 className="app-card-title">{card.title}</h3>
                  <ul className="app-card-list">
                    {card.items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                  <p className="app-card-market">{card.market}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOKENOMICS SNAPSHOT */}
      <section className="tokenomics-hero" id="tokenomics">
        <div className="section-bg">
          <img src="/images/tokenomics-bg.jpg" alt="Token economics visualization" loading="lazy" />
        </div>
        <div className="container tokenomics-content">
          <div className="section-header fade-up">
            <div className="section-label">Tokenomics</div>
            <h2 className="section-title">Designed for Stability, Not Speculation</h2>
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
                <tr><td>Team & Founders</td><td>50,000,000</td><td>5.0%</td><td>30-day cliff · 36-month Sablier stream</td></tr>
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
            <strong>Circulating at TGE: 160,400,000 (16.0%)</strong> — 84% locked. Low float creates supply discipline. The team is on a 36-month stream — they can&apos;t sell at launch any more than you can.
          </div>

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/tokenomics" className="btn btn-secondary">Full Tokenomics Breakdown →</Link>
          </div>
        </div>
      </section>

      {/* TRUST STACK */}
      <section className="section section-alt" id="trust">
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">Verification</div>
            <h2 className="section-title">Don&apos;t Trust. Verify.</h2>
            <p className="section-desc">Every claim is on-chain. Every contract is public. Every lock is verifiable. Here&apos;s the trust stack.</p>
          </div>

          <div className="trust-grid fade-up">
            <div className="trust-card">
              <div className="trust-card-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg></div>
              <h4>Audited — SolidProof</h4>
              <p>Independent smart contract review. Every function examined. Badge live on DEX Screener.</p>
            </div>
            <div className="trust-card">
              <div className="trust-card-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
              <h4>LP Locked 24 Months</h4>
              <p>$25,000 liquidity locked on UNCX before TGE. Cannot be removed. Verifiable by anyone.</p>
            </div>
            <div className="trust-card">
              <div className="trust-card-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"></rect><path d="M2 7h20"></path><path d="M9 21h6"></path><path d="M12 17v4"></path></svg></div>
              <h4>Founders KYC Verified</h4>
              <p>Team identities verified through SolidProof KYC process. Real people, real accountability.</p>
            </div>
            <div className="trust-card">
              <div className="trust-card-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
              <h4>Squads 3-of-5</h4>
              <p>Treasury requires 3 separate signers to move funds. No single person controls the wallet.</p>
            </div>
            <div className="trust-card">
              <div className="trust-card-icon"><img src="/images/logo-coingecko.png" alt="CoinGecko" width="36" height="36" /></div>
              <h4>CoinGecko Listed</h4>
              <p>Public listing with verified metrics. Track price, volume, and market cap in real time.</p>
            </div>
            <div className="trust-card">
              <div className="trust-card-icon"><img src="/images/logo-dexscreener.png" alt="DEX Screener" width="36" height="36" /></div>
              <h4>DEX Screener Boosted</h4>
              <p>Visible on the most-used DEX analytics platform. Transparent trading data from day one.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content fade-up">
            <h2>The Presale Opens Soon</h2>
            <p>65.8% below TGE price. Fixed supply. No mint function. Review the contracts, then decide.</p>
            <div className="hero-actions">
              <Link href="/presale" className="btn btn-primary" data-burst="true">Reserve Your Allocation →</Link>
              <Link href="/faq" className="btn btn-secondary">FAQ &amp; Due Diligence</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
