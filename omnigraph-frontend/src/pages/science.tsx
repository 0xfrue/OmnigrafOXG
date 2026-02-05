"use client";

import Head from "next/head";
import Link from "next/link";
import { PROJECT_CONFIG } from "@/config/constants";

export default function SciencePage() {
  return (
    <>
      <Head>
        <title>The Science of Graphene | {PROJECT_CONFIG.PROJECT_NAME}</title>
        <meta
          name="description"
          content="Learn about graphene's revolutionary properties and real-world applications across energy, electronics, materials, and more."
        />
      </Head>

      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 gradient-text">The Science of Graphene</h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Understanding the material that could revolutionize multiple industries—from batteries to water filtration.
          </p>
        </div>

        {/* What is Graphene */}
        <section className="mb-16">
          <div className="bg-dark-200/50 backdrop-blur-sm rounded-2xl p-8 border border-base-blue/20">
            <h2 className="text-3xl font-bold mb-6 gradient-text">What is Graphene?</h2>
            <p className="text-gray-300 text-lg mb-4">
              Graphene is a single atomic layer of carbon atoms arranged in a hexagonal (honeycomb) lattice. Discovered in 2004 by Andre Geim and Konstantin Novoselov (who won the 2010 Nobel Prize in Physics), graphene is the thinnest, strongest, and most conductive material known to science.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-dark-100 rounded-xl p-6">
                <h3 className="font-bold text-xl mb-4 text-base-blue">Physical Properties</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>200x stronger than steel</strong> by weight</li>
                  <li>• <strong>One atom thick</strong> (0.345 nanometers)</li>
                  <li>• <strong>Extremely lightweight</strong> (1 square meter = 0.77 mg)</li>
                  <li>• <strong>98% transparent</strong> to visible light</li>
                  <li>• <strong>Impermeable</strong> to gases, even helium</li>
                </ul>
              </div>
              <div className="bg-dark-100 rounded-xl p-6">
                <h3 className="font-bold text-xl mb-4 text-accent-400">Electrical Properties</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Excellent electrical conductivity</strong> (better than copper)</li>
                  <li>• <strong>Superior thermal conductivity</strong> (5000 W/m·K)</li>
                  <li>• <strong>High electron mobility</strong> at room temperature</li>
                  <li>• <strong>Zero band gap</strong> semiconductor</li>
                  <li>• <strong>Quantum Hall effect</strong> at room temperature</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Real-World Applications */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center gradient-text">Real-World Applications</h2>
          <p className="text-gray-300 text-lg text-center max-w-4xl mx-auto mb-12">
            Graphene's unique properties make it valuable across multiple high-growth industries. According to Grand View Research, the global graphene market is projected to grow significantly as production methods scale.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Energy & Power */}
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-yellow-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-bold text-xl mb-3 text-yellow-400">Energy & Power</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• <strong>Next-gen batteries:</strong> faster charging, higher capacity</li>
                <li>• <strong>Supercapacitors:</strong> rapid energy storage and release</li>
                <li>• <strong>Solar cells:</strong> improved efficiency and flexibility</li>
                <li>• <strong>Fuel cells:</strong> enhanced catalytic performance</li>
              </ul>
              <p className="text-xs text-gray-500 mt-4">Market potential: Used by companies developing EV batteries and energy storage systems.</p>
            </div>

            {/* Electronics */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="font-bold text-xl mb-3 text-blue-400">Electronics</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• <strong>Flexible displays:</strong> bendable, transparent screens</li>
                <li>• <strong>High-speed transistors:</strong> faster computing</li>
                <li>• <strong>Touch screens:</strong> transparent conductive layers</li>
                <li>• <strong>Quantum computing:</strong> single-electron transistors</li>
              </ul>
              <p className="text-xs text-gray-500 mt-4">Market potential: Samsung, IBM, and others investing in graphene electronics research.</p>
            </div>

            {/* Materials & Composites */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl mb-4">🏗️</div>
              <h3 className="font-bold text-xl mb-3 text-purple-400">Materials & Composites</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• <strong>Advanced composites:</strong> aerospace, automotive</li>
                <li>• <strong>Protective coatings:</strong> anti-corrosion, wear-resistant</li>
                <li>• <strong>Concrete enhancement:</strong> stronger infrastructure</li>
                <li>• <strong>Lightweight armor:</strong> defense applications</li>
              </ul>
              <p className="text-xs text-gray-500 mt-4">Market potential: Construction, aerospace, and automotive industries adopting graphene composites.</p>
            </div>

            {/* Sensors & Detection */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl mb-4">📡</div>
              <h3 className="font-bold text-xl mb-3 text-green-400">Sensors & Detection</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• <strong>Biosensors:</strong> medical diagnostics, drug delivery</li>
                <li>• <strong>Environmental sensors:</strong> pollution detection</li>
                <li>• <strong>Chemical sensors:</strong> industrial safety</li>
                <li>• <strong>Pressure/strain sensors:</strong> structural health monitoring</li>
              </ul>
              <p className="text-xs text-gray-500 mt-4">Market potential: Medical device companies exploring graphene-based diagnostics.</p>
            </div>

            {/* Water & Filtration */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-2xl p-6 border border-cyan-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl mb-4">💧</div>
              <h3 className="font-bold text-xl mb-3 text-cyan-400">Water & Filtration</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• <strong>Desalination:</strong> graphene oxide membranes</li>
                <li>• <strong>Water purification:</strong> removes contaminants</li>
                <li>• <strong>Gas separation:</strong> industrial filtration</li>
                <li>• <strong>Air filtration:</strong> ultra-efficient filters</li>
              </ul>
              <p className="text-xs text-gray-500 mt-4">Market potential: Addressing global water scarcity with breakthrough filtration tech.</p>
            </div>

            {/* Industrial Applications */}
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl p-6 border border-red-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl mb-4">🏭</div>
              <h3 className="font-bold text-xl mb-3 text-red-400">Industrial Applications</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• <strong>Lubricants:</strong> reduced friction, wear protection</li>
                <li>• <strong>Anti-corrosion coatings:</strong> marine, infrastructure</li>
                <li>• <strong>Thermal management:</strong> heat dissipation in electronics</li>
                <li>• <strong>3D printing:</strong> graphene-enhanced materials</li>
              </ul>
              <p className="text-xs text-gray-500 mt-4">Market potential: Industrial manufacturers integrating graphene for performance gains.</p>
            </div>
          </div>
        </section>

        {/* The Production Challenge */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-base-blue/10 to-accent-500/10 rounded-2xl p-8 border border-base-blue/30">
            <h2 className="text-3xl font-bold mb-6 gradient-text">The Production Challenge</h2>
            <p className="text-gray-300 text-lg mb-6">
              Despite graphene's incredible potential, widespread adoption has been limited by three key challenges:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-dark-200/50 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3 text-yellow-400">1. Production Cost</h3>
                <p className="text-sm text-gray-400">High-quality graphene production remains expensive at scale, limiting commercial viability.</p>
              </div>
              <div className="bg-dark-200/50 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3 text-orange-400">2. Consistency & Quality</h3>
                <p className="text-sm text-gray-400">Maintaining uniform quality across batches is difficult with current methods.</p>
              </div>
              <div className="bg-dark-200/50 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3 text-red-400">3. Scalability</h3>
                <p className="text-sm text-gray-400">Moving from laboratory production to industrial-scale manufacturing is complex.</p>
              </div>
            </div>
            <p className="text-gray-300 text-lg mt-8 text-center">
              <strong className="text-white">{PROJECT_CONFIG.PROJECT_NAME}</strong> exists to support solutions to these challenges through coordinated funding, research collaboration, and ecosystem alignment.
            </p>
          </div>
        </section>

        {/* Carbon-Aware Production */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-8 border border-green-500/20">
            <h2 className="text-3xl font-bold mb-6 gradient-text">Carbon-Aware Production Pathways</h2>
            <p className="text-gray-300 text-lg mb-6">
              {PROJECT_CONFIG.PARENT_COMPANY}'s approach uses pyrolysis technology, which can be carbon-negative when designed and measured correctly.
            </p>
            <div className="bg-dark-200/50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-xl mb-4">What is Pyrolysis?</h3>
              <p className="text-gray-300 mb-4">
                Pyrolysis is the thermal decomposition of organic materials at elevated temperatures in the absence of oxygen. When used to produce biochar, the process can sequester carbon while creating valuable materials like graphene.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>Carbon sequestration:</strong> Biochar locks carbon for centuries</li>
                <li>• <strong>Waste valorization:</strong> Converts biomass waste into graphene</li>
                <li>• <strong>Energy recovery:</strong> Process can be energy-positive</li>
                <li>• <strong>Lifecycle benefits:</strong> Net carbon-negative when measured via LCA</li>
              </ul>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <p className="text-sm text-gray-300">
                <strong className="text-yellow-400">Verification:</strong> Sustainability claims depend on process design and measurement. We will share lifecycle assessment (LCA) verification details as they become available. Sources: Pacific Northwest National Laboratory (PNNL), ATTRA Sustainable Agriculture.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Join the Graphene Revolution</h2>
          <p className="text-gray-400 mb-6">Support ecosystem-aligned research and production coordination.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/#buy">
              <button className="px-8 py-4 bg-gradient-to-r from-base-blue to-accent-500 hover:from-base-blue/90 hover:to-accent-600 rounded-xl font-semibold shadow-lg shadow-base-blue/50 hover:shadow-xl hover:shadow-base-blue/60 transition-all duration-300 hover:-translate-y-1">
                Buy {PROJECT_CONFIG.TOKEN_SYMBOL}
              </button>
            </Link>
            <Link href="/how-it-works">
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-base-blue/50 rounded-xl font-semibold backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
                How It Works
              </button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
