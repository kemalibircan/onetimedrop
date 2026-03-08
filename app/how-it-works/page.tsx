import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How OneTimeDrop Works — Phone to Computer File Transfer",
  description:
    "Learn how OneTimeDrop transfers files from phone to computer using a QR code or 8-digit code. Step-by-step guide with FAQs.",
  alternates: { canonical: "https://onetimedrop.io/how-it-works" },
  openGraph: {
    title: "How OneTimeDrop Works",
    description:
      "Transfer files from phone to computer in 3 steps. No app, no account, no hassle.",
    url: "https://onetimedrop.io/how-it-works",
  },
};

const faqItems = [
  {
    q: "Is OneTimeDrop free to use?",
    a: "Yes, completely free. No account, no subscription, no hidden fees.",
  },
  {
    q: "How long are files kept?",
    a: "Files are automatically deleted after 10 minutes. This is by design to protect your privacy.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. OneTimeDrop works entirely in your web browser on both phone and computer. No app download required.",
  },
  {
    q: "What is the maximum file size?",
    a: "Each file must be under 50MB. You can upload up to 20 files per session.",
  },
  {
    q: "Is my data secure?",
    a: "Files are stored temporarily on our server and protected by a unique session token. They are never publicly accessible and are auto-deleted after expiry.",
  },
  {
    q: "Can I send files from the computer to my phone?",
    a: "Currently, OneTimeDrop is optimised for phone → computer transfers. Desktop-to-phone is coming soon.",
  },
  {
    q: "What file types are supported?",
    a: "Images, PDFs, Microsoft Office documents, text files, video, and audio files are all supported.",
  },
  {
    q: "Does it work on public/library computers?",
    a: "Yes — just remember your files will be temporary. Don't upload sensitive documents on public computers.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

const steps = [
  {
    n: "1",
    icon: "💻",
    title: "Open on your computer",
    desc: "Visit onetimedrop.io on the computer you want to send files to. An 8-digit code and QR code appear instantly — no account needed.",
  },
  {
    n: "2",
    icon: "📱",
    title: "Scan with your phone",
    desc: 'Point your phone camera at the QR code, or open onetimedrop.io on your phone and tap "Join session" to type the code manually.',
  },
  {
    n: "3",
    icon: "📤",
    title: "Upload files",
    desc: "Pick photos, PDFs, or documents from your phone. Files transfer in real-time and appear on the desktop immediately.",
  },
  {
    n: "4",
    icon: "⬇️",
    title: "Download on the computer",
    desc: "Click Download next to any file on the desktop. Files are auto-deleted after 10 minutes for your privacy.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <span className="badge-orange mb-3">Step-by-step guide</span>
          <h1 className="text-4xl font-extrabold mt-2">How OneTimeDrop Works</h1>
          <p className="text-[var(--color-muted)] mt-3 text-lg">
            Transfer files from phone to computer in under 30 seconds.
          </p>
        </div>

        {/* Steps */}
        <section aria-labelledby="steps-heading" className="mb-20">
          <h2 id="steps-heading" className="text-2xl font-bold mb-8">
            4 simple steps
          </h2>
          <div className="space-y-5">
            {steps.map((step) => (
              <div key={step.n} className="card flex gap-5 items-start">
                <div className="w-12 h-12 rounded-2xl bg-gradient-orange flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {step.n}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {step.icon} {step.title}
                  </h3>
                  <p className="text-[var(--color-muted)] mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="card bg-gradient-to-br from-[#FFB86B]/20 to-[#FF8A3D]/10 text-center mb-20">
          <h2 className="text-2xl font-bold mb-2">Ready to try it?</h2>
          <p className="text-[var(--color-muted)] mb-5">
            Open OneTimeDrop on your computer to get a code.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/" className="btn-primary">
              Start a session →
            </Link>
            <Link href="/join" className="btn-secondary">
              Join with code
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-bold mb-8">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
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
      <Footer />
    </>
  );
}
