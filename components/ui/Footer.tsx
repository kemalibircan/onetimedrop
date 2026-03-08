import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-orange flex items-center justify-center text-white font-bold text-sm">
                🍊
              </div>
              <span className="font-bold text-lg">
                OneTime<span className="text-[#FF8A3D]">Drop</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              Send files from phone to computer in seconds. No app, no account.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Product</h3>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li><Link href="/" className="hover:text-[#FF8A3D] transition-colors">Start session</Link></li>
              <li><Link href="/join" className="hover:text-[#FF8A3D] transition-colors">Join session</Link></li>
              <li><Link href="/how-it-works" className="hover:text-[#FF8A3D] transition-colors">How it works</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Resources</h3>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li><Link href="/blog" className="hover:text-[#FF8A3D] transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-[#FF8A3D] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li><Link href="/privacy" className="hover:text-[#FF8A3D] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#FF8A3D] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--color-muted)]">
          <p>© {year} OneTimeDrop. Files auto-deleted after 10 minutes.</p>
          <p>Made with 🍊 for effortless sharing</p>
        </div>
      </div>
    </footer>
  );
}
