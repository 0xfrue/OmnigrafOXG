"use client";

import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

export default function HowItWorksPage() {
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
        <title>How $GRAF Works — OMNIGRAF Token Mechanics</title>
        <meta name="description" content="Token mechanics, fee distribution, safety features, and the ecosystem alignment model. All verifiable on-chain." />
      </Head>

      <section className="page-hero">
        <div className="hero-bg">
          <img src="/images/trust-security.jpg" alt="Blockchain security" loading="eager" />
        </div>
        <div className="container page-hero-content">
          <h1>How the $GRAF Token Works</h1>
          <p>Token mechanics, fee distribution, safety features, and the ecosystem alignment model. All verifiable on-chain.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">Overview</div>
            <h2 className="section-title">Token Parameters</h2>
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

      <section className="section section-alt">
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">Fee Distribution</div>
            <h2 className="section-title">What the Token Engine Does</h2>
            <p className="section-desc">Transaction fees are distributed automatically to four ecosystem functions. No manual intervention. No central authority.</p>
          </div>

          <div className="engine-grid fade-up">
            <div className="engine-card">
              <div className="engine-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg></div>
              <h4>Liquidity Strengthening</h4>
              <p>Protocol-owned liquidity (POL) design keeps trading conditions healthy over time.</p>
              <ul className="engine-list">
                <li>Automatic LP provision from fees</li>
                <li>Reduced reliance on individual LPs</li>
                <li>Long-term liquidity stability</li>
              </ul>
            </div>
            <div className="engine-card">
              <div className="engine-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg></div>
              <h4>Treasury Support</h4>
              <p>Ecosystem development treasury funds research, partnerships, and infrastructure.</p>
              <ul className="engine-list">
                <li>Graphene R&amp;D coordination funding</li>
                <li>Ecosystem partnerships</li>
                <li>Education and awareness initiatives</li>
              </ul>
            </div>
            <div className="engine-card">
              <div className="engine-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1.5-2.5S8 8.38 8 7a2.5 2.5 0 0 1 5 0"></path></svg></div>
              <h4>Burn Mechanism</h4>
              <p>Deflationary burns reduce supply over time. Capped at 30% to prevent instability.</p>
              <ul className="engine-list">
                <li>Deflationary pressure on total supply</li>
                <li>Max burn: 30% of total supply</li>
                <li>Burn rate decreases over time</li>
              </ul>
            </div>
            <div className="engine-card">
              <div className="engine-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path></svg></div>
              <h4>Rewards Pool</h4>
              <p>Staking and participation incentives for long-term holders.</p>
              <ul className="engine-list">
                <li>Staking rewards from fee pool</li>
                <li>Community lottery pool</li>
                <li>Participation-based incentives</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="content-grid fade-up">
            <div>
              <div className="section-label">Alignment</div>
              <h2 className="section-title" style={{ textAlign: "left" }}>Ecosystem Alignment &amp; Liquidity</h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 16 }}>
                Graphene producers, research groups, and stakeholders who hold tokens have aligned incentives for ecosystem health. Their success is tied to token stability and ecosystem growth.
              </p>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
                Ecosystem participants may choose to contribute liquidity over time. These contributions are discretionary and documented on-chain — not guaranteed.
              </p>
            </div>
            <div className="content-img">
              <img src="/images/trust-security.jpg" alt="Blockchain trust and security infrastructure" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">Security</div>
            <h2 className="section-title">Safety-First Design</h2>
            <p className="section-desc">Every safeguard is enforced by the smart contract. Not by promises. Not by trust. By code.</p>
          </div>

          <div className="safety-grid fade-up">
            <div className="safety-item"><span className="safety-check">✓</span> Fixed max supply — no infinite minting possible</div>
            <div className="safety-item"><span className="safety-check">✓</span> Hard caps on buy tax (≤3%) and sell tax (≤7%)</div>
            <div className="safety-item"><span className="safety-check">✓</span> LP timelock mechanism — liquidity can&apos;t be pulled</div>
            <div className="safety-item"><span className="safety-check">✓</span> Time-delayed governance for sensitive changes</div>
            <div className="safety-item"><span className="safety-check">✓</span> Claim-on-demand vesting — no forced claims</div>
            <div className="safety-item"><span className="safety-check">✓</span> Audited by SolidProof before TGE</div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content fade-up">
            <h2>Ready to Participate?</h2>
            <p>Review the risks and contracts. Then decide.</p>
            <div className="hero-actions">
              <Link href="/presale" className="btn btn-primary" data-burst="true">Join the Presale →</Link>
              <Link href="/faq" className="btn btn-secondary">FAQ &amp; Due Diligence →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
