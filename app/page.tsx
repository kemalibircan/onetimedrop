import { headers } from "next/headers";
import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import DesktopSession from "@/components/DesktopSession";
import MobileJoinCTA from "@/components/MobileJoinCTA";

export const metadata: Metadata = {
  title: "OneTimeDrop — Send Files From Your Phone to Any Computer",
  description:
    "Transfer files from your phone to any computer in seconds. Scan the QR code or enter the 8-digit code on your phone — no app or login needed.",
  alternates: {
    canonical: "https://onetimedrop.io",
  },
  openGraph: {
    title: "OneTimeDrop — Send Files From Your Phone to Any Computer",
    description:
      "Scan QR or type a code. Files appear on desktop instantly.",
    url: "https://onetimedrop.io",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "OneTimeDrop",
  url: "https://onetimedrop.io",
  description:
    "Transfer files from your phone to any computer using a QR code or 8-digit code. No app or account needed. Files auto-delete after 10 minutes.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default async function HomePage() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        {isMobile ? (
          /* Mobile: show hero + join CTA */
          <MobileJoinCTA />
        ) : (
          /* Desktop: show session with QR code */
          <>
            <section className="border-b border-[var(--color-border)] bg-gradient-to-b from-[#FFF7EF] to-white dark:from-[#1A1209] dark:to-[#110D06] py-6 px-4 text-center">
              <span className="badge-orange mb-2">No account required · Files auto-delete in 10 min</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold mt-2 leading-tight">
                Send files from your{" "}
                <span className="text-gradient-orange">phone</span> to any computer
              </h1>
              <p className="text-[var(--color-muted)] mt-3 text-lg max-w-xl mx-auto">
                Scan the QR code with your phone. Files arrive in seconds.
              </p>
            </section>
            <DesktopSession />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
