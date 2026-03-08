import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: `${dict.how_it_works.title} — OneTimeDrop`,
    description: dict.how_it_works.subtitle,
    alternates: { canonical: `https://onetimedrop.com/${lang}/how-it-works` },
    openGraph: {
      title: dict.how_it_works.title,
      description: dict.how_it_works.subtitle,
      url: `https://onetimedrop.com/${lang}/how-it-works`,
    },
  };
}

const STEP_ICONS = ["💻", "📱", "📤", "⬇️"];

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const d = dict.how_it_works;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: d.faqs.map((item: { q: string; a: string }) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar lang={lang} dict={dict.navbar} />
      <main className="max-w-3xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <span className="badge-orange mb-3">{d.badge}</span>
          <h1 className="text-4xl font-extrabold mt-2">{d.title}</h1>
          <p className="text-[var(--color-muted)] mt-3 text-lg">{d.subtitle}</p>
        </div>

        {/* Steps */}
        <section aria-labelledby="steps-heading" className="mb-20">
          <h2 id="steps-heading" className="text-2xl font-bold mb-8">
            {d.steps_heading}
          </h2>
          <div className="space-y-5">
            {d.steps.map((step: { title: string; desc: string }, i: number) => (
              <div key={i} className="card flex gap-5 items-start">
                <div className="w-12 h-12 rounded-2xl bg-gradient-orange flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {STEP_ICONS[i]} {step.title}
                  </h3>
                  <p className="text-[var(--color-muted)] mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="card bg-gradient-to-br from-[#FFB86B]/20 to-[#FF8A3D]/10 text-center mb-20">
          <h2 className="text-2xl font-bold mb-2">{d.cta_title}</h2>
          <p className="text-[var(--color-muted)] mb-5">{d.cta_desc}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href={`/${lang}`} className="btn-primary">
              {d.cta_start}
            </Link>
            <Link href={`/${lang}/join`} className="btn-secondary">
              {d.cta_join}
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-bold mb-8">
            {d.faq_heading}
          </h2>
          <div className="space-y-4">
            {d.faqs.map((item: { q: string; a: string }) => (
              <details
                key={item.q}
                className="card group cursor-pointer"
              >
                <summary className="font-semibold flex items-center justify-between gap-2 list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A3D] rounded-xl">
                  {item.q}
                  <span className="text-[#FF8A3D] text-xl transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[var(--color-muted)] leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer lang={lang} dict={dict.footer} />
    </>
  );
}
