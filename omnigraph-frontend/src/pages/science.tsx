"use client";

import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

export default function SciencePage() {
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
        <title>The Science of Graphene — OMNIGRAF</title>
        <meta name="description" content="Graphene: 200x stronger than steel, better conductor than copper, one atom thick. Learn the science behind the material." />
      </Head>

      <section className="page-hero">
        <div className="hero-bg">
          <img src="/images/graphene-structure.jpg" alt="Graphene hexagonal lattice" loading="eager" />
        </div>
        <div className="container page-hero-content">
          <h1>The Material That Rewrites the Rules</h1>
          <p>200x stronger than steel. Better conductor than copper. One atom thick. Graphene is the most studied material of the 21st century — and the hardest to produce at scale.</p>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="content-grid fade-up">
            <div>
              <div className="section-label">Fundamentals</div>
              <h2 className="section-title" style={{ textAlign: "left" }}>What Is Graphene?</h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 24 }}>
                A single atomic layer of carbon atoms arranged in a hexagonal lattice. Isolated in 2004 by Andre Geim and Konstantin Novoselov — who won the 2010 Nobel Prize in Physics for the discovery. It&apos;s the thinnest material that exists, the strongest ever measured, and the best conductor of heat and electricity known to science.
              </p>
              <div className="props-grid">
                <div className="prop-card"><h4>Strength</h4><p>200x stronger than steel by weight. One atom thick (0.345 nanometers).</p></div>
                <div className="prop-card"><h4>Conductivity</h4><p>Outperforms copper electrically. Thermal conductivity: 5,000 W/m·K.</p></div>
                <div className="prop-card"><h4>Weight</h4><p>1 square meter weighs 0.77 milligrams. Nearly invisible — 98% transparent to light.</p></div>
                <div className="prop-card"><h4>Impermeability</h4><p>Blocks all gases, including helium. Nothing passes through an intact graphene sheet.</p></div>
              </div>
            </div>
            <div className="content-img">
              <img src="/images/graphene-structure.jpg" alt="Hexagonal carbon lattice structure" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">The Problem</div>
            <h2 className="section-title">Why Graphene Hasn&apos;t Scaled Yet</h2>
            <p className="section-desc">The properties are proven. The demand is real. Three barriers stand between the lab and the factory floor.</p>
          </div>

          <div className="challenge-grid fade-up">
            <div className="challenge-card">
              <div className="challenge-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg></div>
              <h4>Production Cost</h4>
              <p>High-quality graphene production at commercial scale remains expensive. Current methods don&apos;t pencil out for most manufacturers.</p>
            </div>
            <div className="challenge-card">
              <div className="challenge-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg></div>
              <h4>Consistency</h4>
              <p>Maintaining uniform quality across batches is difficult. One bad batch can derail an entire product line.</p>
            </div>
            <div className="challenge-card">
              <div className="challenge-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg></div>
              <h4>Scalability</h4>
              <p>Moving from milligrams in a lab to kilograms in a factory requires entirely different infrastructure and coordination.</p>
            </div>
          </div>

          <div className="float-note fade-up" style={{ marginTop: 48 }}>
            OMNIGRAF exists to coordinate funding for solutions to these three challenges. Aligned incentives between researchers, producers, and token holders create a feedback loop that accelerates progress.
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="content-grid reverse fade-up">
            <div>
              <div className="section-label">Sustainability</div>
              <h2 className="section-title" style={{ textAlign: "left" }}>Carbon-Aware Production</h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 16 }}>
                ResolutX&apos;s approach uses pyrolysis technology — thermal decomposition of organic materials without oxygen. When designed correctly, the process is carbon-negative: it sequesters more carbon than it releases.
              </p>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 24 }}>
                Biochar produced in the process locks carbon for centuries. Biomass waste becomes the feedstock. The process can be energy-positive. Net result: graphene production that takes more carbon out of the atmosphere than it puts in.
              </p>
              <div className="props-grid">
                <div className="prop-card"><h4>Carbon Sequestration</h4><p>Biochar locks carbon for centuries — measured via lifecycle assessment.</p></div>
                <div className="prop-card"><h4>Waste-to-Value</h4><p>Converts biomass waste into graphene. Feedstock that would otherwise emit CO2.</p></div>
                <div className="prop-card"><h4>Energy Recovery</h4><p>Process design allows energy-positive operation. Heat feeds back into the system.</p></div>
                <div className="prop-card"><h4>Verified Claims</h4><p>LCA verification details published as they become available.</p></div>
              </div>
            </div>
            <div className="content-img">
              <img src="/images/sustainability.jpg" alt="Carbon-negative biochar production" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content fade-up">
            <h2>Support Graphene Research Coordination</h2>
            <p>Every token purchased contributes to the ecosystem treasury funding research, partnerships, and production infrastructure.</p>
            <div className="hero-actions">
              <Link href="/presale" className="btn btn-primary" data-burst="true">Join the Presale →</Link>
              <Link href="/how-it-works" className="btn btn-secondary">How the Token Works →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
