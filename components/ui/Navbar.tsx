"use client";

import Link from "next/link";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--color-bg)]/80 border-b border-[var(--color-border)]">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-[#FF8A3D] focus-visible:ring-offset-2 rounded-xl"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-orange flex items-center justify-center text-white font-bold text-sm shadow-glow">
            🍊
          </div>
          <span className="font-bold text-lg text-[var(--color-text)]">
            OneTime<span className="text-[#FF8A3D]">Drop</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/how-it-works" className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
            How it works
          </Link>
          <Link href="/blog" className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
            Blog
          </Link>
          <Link href="/privacy" className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
            Privacy
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="btn-ghost text-lg w-9 h-9 p-0"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <Link href="/join" className="btn-secondary text-sm py-2 px-4">
            Join session
          </Link>
          <Link href="/" className="btn-primary text-sm py-2 px-4">
            Start session
          </Link>
        </div>
      </nav>
    </header>
  );
}
