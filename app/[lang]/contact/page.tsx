import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { getDictionary } from "@/lib/dictionaries";

export const metadata: Metadata = {
  title: "Contact — OneTimeDrop",
  description: "Get in touch with OneTimeDrop. Questions, feedback, or support.",
  alternates: { canonical: "https://onetimedrop.io/contact" },
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <Navbar lang={lang} dict={dict.navbar} />
      <main className="max-w-xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold mb-2">Get in touch</h1>
          <p className="text-[var(--color-muted)]">
            Have a question, feedback, or issue? We'd love to hear from you.
          </p>
        </div>

        <div className="card space-y-5">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium mb-1.5">
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              placeholder="Your name"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium mb-1.5">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              placeholder="you@example.com"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="contact-msg" className="block text-sm font-medium mb-1.5">
              Message
            </label>
            <textarea
              id="contact-msg"
              rows={5}
              placeholder="Tell us what's on your mind…"
              className="input-field resize-none"
            />
          </div>

          <button className="btn-primary w-full">
            Send message →
          </button>

          <p className="text-xs text-center text-[var(--color-muted)]">
            We typically respond within 1-2 business days.
          </p>
        </div>
      </main>
      <Footer lang={lang} dict={dict.footer} />
    </>
  );
}
