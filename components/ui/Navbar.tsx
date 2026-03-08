"use client";

import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavbarProps {
  lang: string;
  dict: any;
}

export default function Navbar({ lang, dict }: NavbarProps) {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--color-bg)]/80 border-b border-[var(--color-border)]">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href={`/${lang}`}
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
          <Link href={`/${lang}/how-it-works`} className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
            {dict.how_it_works}
          </Link>
          <Link href={`/${lang}/blog`} className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
            {dict.blog}
          </Link>
          <Link href={`/${lang}/privacy`} className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
            {dict.privacy}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="btn-ghost text-lg w-9 h-9 p-0"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <LanguageSwitcher lang={lang} />
          <div className="w-px h-5 bg-[var(--color-border)] mx-1" />
          <Link href={`/${lang}/join`} className="btn-secondary text-sm py-2 px-4">
            {dict.join_session}
          </Link>
          <Link href={`/${lang}`} className="btn-primary text-sm py-2 px-4">
            {dict.start_session}
          </Link>
        </div>
      </nav>
    </header>
  );
}
