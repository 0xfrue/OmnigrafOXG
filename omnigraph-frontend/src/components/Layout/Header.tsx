"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/presale", label: "Presale", highlight: true },
  { href: "/science", label: "Science" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/#tokenomics", label: "Tokenomics" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with BASE colors */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-lg shadow-base-blue/50 group-hover:shadow-xl group-hover:shadow-base-blue/70 transition-all duration-300 group-hover:scale-105 relative ring-2 ring-base-blue/30 group-hover:ring-base-blue/60 bg-transparent">
              <Image
                src="/omnigraf-logo.png"
                alt="Omnigrafx Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg leading-none gradient-text">omnigrafx</span>
              <span className="text-[10px] sm:text-xs text-gray-500 leading-none">Built on Base ⚡</span>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "px-4 py-2 rounded-lg font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary-500/20 text-primary-400"
                    : (item as any).highlight
                    ? "text-base-blue hover:text-white hover:bg-base-blue/10 border border-base-blue/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Connect Button */}
          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/5">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    "px-4 py-3 rounded-lg font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary-500/20 text-primary-400"
                      : (item as any).highlight
                      ? "text-base-blue bg-base-blue/5 border border-base-blue/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
