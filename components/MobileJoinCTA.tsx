"use client";

import Link from "next/link";

export default function MobileJoinCTA() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-10 text-center animate-fade-in">
      {/* Hero */}
      <div className="text-7xl mb-6 animate-pulse-soft">🍊</div>
      <h1 className="text-3xl font-extrabold leading-tight mb-3">
        Send files from your phone
        <br />
        <span className="text-gradient-orange">to any computer</span>
      </h1>
      <p className="text-[var(--color-muted)] text-lg max-w-sm mx-auto mb-8">
        No app needed. Open this on a computer, scan the QR code and your files appear instantly.
      </p>

      {/* CTAs */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link href="/join" className="btn-primary text-lg py-4 w-full">
          📷 Scan QR / Enter code
        </Link>
        <p className="text-xs text-[var(--color-muted)]">
          Or open <strong>onetimedrop.io</strong> on a desktop computer to get a code.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 gap-4 mt-12 max-w-sm w-full text-left">
        {[
          { icon: "⚡️", title: "Instant", desc: "Files appear in real-time" },
          { icon: "🔒", title: "Private", desc: "Auto-deleted in 10 minutes" },
          { icon: "📱", title: "No app", desc: "Works in any browser" },
        ].map((item) => (
          <div key={item.title} className="card flex items-center gap-4 py-4">
            <div className="text-2xl w-10 flex items-center justify-center">{item.icon}</div>
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-[var(--color-muted)]">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
