import Link from "next/link";

interface FooterProps {
  lang: string;
  dict: any;
}

export default function Footer({ lang, dict }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href={`/${lang}`} className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-orange flex items-center justify-center text-white font-bold text-sm">
                🍊
              </div>
              <span className="font-bold text-lg">
                OneTime<span className="text-[#FF8A3D]">Drop</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              {dict.slogan}
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-sm mb-3">{dict.product}</h3>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li><Link href={`/${lang}`} className="hover:text-[#FF8A3D] transition-colors">{dict.start_session}</Link></li>
              <li><Link href={`/${lang}/join`} className="hover:text-[#FF8A3D] transition-colors">{dict.join_session}</Link></li>
              <li><Link href={`/${lang}/how-it-works`} className="hover:text-[#FF8A3D] transition-colors">{dict.how_it_works}</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-sm mb-3">{dict.resources}</h3>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li><Link href={`/${lang}/blog`} className="hover:text-[#FF8A3D] transition-colors">{dict.blog}</Link></li>
              <li><Link href={`/${lang}/contact`} className="hover:text-[#FF8A3D] transition-colors">{dict.contact}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm mb-3">{dict.legal}</h3>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li><Link href={`/${lang}/privacy`} className="hover:text-[#FF8A3D] transition-colors">{dict.privacy_policy}</Link></li>
              <li><Link href={`/${lang}/terms`} className="hover:text-[#FF8A3D] transition-colors">{dict.terms_of_service}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--color-muted)]">
          <p>© {year} OneTimeDrop. {dict.auto_delete}</p>
          <p>{dict.made_with}</p>
        </div>
      </div>
    </footer>
  );
}
