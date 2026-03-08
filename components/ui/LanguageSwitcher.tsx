"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
];

interface LanguageSwitcherProps {
  lang: string;
}

export default function LanguageSwitcher({ lang }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLang(newLang: string) {
    // Replace the current lang segment in the path
    const segments = pathname.split("/");
    // segments[0] = "", segments[1] = lang code
    segments[1] = newLang;
    router.push(segments.join("/") || "/");
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        aria-expanded={open}
        className="btn-ghost text-sm px-2.5 py-1.5 h-9 flex items-center gap-1.5 rounded-xl font-medium"
      >
        <span aria-hidden="true">{current.flag}</span>
        <span className="hidden sm:inline">{current.code.toUpperCase()}</span>
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 4L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-44 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-xl py-1 z-50 animate-fade-in"
          role="menu"
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              role="menuitem"
              onClick={() => switchLang(l.code)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-border)] ${
                l.code === lang
                  ? "font-semibold text-[#FF8A3D]"
                  : "text-[var(--color-text)]"
              }`}
            >
              <span className="text-base">{l.flag}</span>
              <span>{l.label}</span>
              {l.code === lang && (
                <span className="ml-auto text-[#FF8A3D]">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
