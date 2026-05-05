"use client";

import dynamic from "next/dynamic";

// WalletMultiButton has window references; load client-only to avoid SSR mismatch
const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((m) => m.WalletMultiButton),
  { ssr: false }
);
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/presale", label: "Presale" },
  { href: "/science", label: "Science" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/tokenomics", label: "Tokenomics" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    const path = router.pathname.replace(/\/$/, "") || "/";
    const target = href.replace(/\/$/, "") || "/";
    return path === target;
  };

  return (
    <nav
      className="nav"
      role="navigation"
      aria-label="Main navigation"
      style={scrolled ? { background: "rgba(10, 11, 15, 0.95)" } : undefined}
    >
      <div className="nav-inner">
        <Link href="/" className="nav-logo" aria-label="OMNIGRAF Home">
          <img src="/images/logo.png" alt="OMNIGRAF" className="nav-logo-img" />
          <span className="logo-text">OMNIGRAF</span>
        </Link>

        <ul className={`nav-links ${open ? "open" : ""}`}>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={isActive(item.href) ? "active" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li style={{ display: "flex", alignItems: "center" }}>
            <WalletMultiButton />
          </li>
        </ul>

        <button
          className="nav-hamburger"
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
