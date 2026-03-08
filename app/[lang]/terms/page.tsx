import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { getDictionary } from "@/lib/dictionaries";

export const metadata: Metadata = {
  title: "Terms of Service — OneTimeDrop",
  description: "OneTimeDrop Terms of Service. By using OneTimeDrop you agree to these terms.",
  alternates: { canonical: "https://onetimedrop.io/terms" },
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <Navbar lang={lang} dict={dict.navbar} />
      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2">Terms of Service</h1>
        <p className="text-[var(--color-muted)] text-sm mb-10">
          Last updated: March 8, 2026
        </p>

        <div className="space-y-8">
          {[
            {
              title: "1. Acceptance",
              body: "By accessing or using OneTimeDrop, you agree to these Terms. If you do not agree, please do not use the service.",
            },
            {
              title: "2. Description of Service",
              body: "OneTimeDrop provides a temporary, session-based file transfer service. Files are stored for a maximum of 10 minutes and then permanently deleted. No account is required.",
            },
            {
              title: "3. Acceptable Use",
              body: "You may not use OneTimeDrop to upload, share, or distribute illegal, harmful, or infringing content. You are solely responsible for the files you transfer.",
            },
            {
              title: "4. No Warranty",
              body: "OneTimeDrop is provided 'as is' without warranties of any kind. We do not guarantee file delivery, uptime, or data retention beyond the stated TTL.",
            },
            {
              title: "5. Limitation of Liability",
              body: "OneTimeDrop and its operators shall not be liable for any direct or indirect damages arising from use or inability to use the service.",
            },
            {
              title: "6. Privacy",
              body: "Our Privacy Policy explains how temporary data is handled. By using the service you also agree to the Privacy Policy.",
            },
            {
              title: "7. Changes",
              body: "We reserve the right to modify these Terms at any time. Continued use after changes constitutes acceptance.",
            },
            {
              title: "8. Governing Law",
              body: "These Terms shall be governed by applicable law in the jurisdiction where OneTimeDrop operates.",
            },
          ].map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-bold mb-2">{section.title}</h2>
              <p className="text-[var(--color-muted)] leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer lang={lang} dict={dict.footer} />
    </>
  );
}
