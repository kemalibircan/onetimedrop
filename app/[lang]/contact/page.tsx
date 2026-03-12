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
  const contactDict = dict.contact_page;

  return (
    <>
      <Navbar lang={lang} dict={dict.navbar} />
      <main className="max-w-xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold mb-2">{contactDict.title}</h1>
          <p className="text-[var(--color-muted)]">
            {contactDict.subtitle}
          </p>
        </div>

        <div className="card mb-6">
          <p className="text-sm font-medium mb-1.5">{contactDict.email_label}</p>
          <a
            href="mailto:info@globaldijital.com"
            className="text-lg font-semibold text-[#FF8A3D] hover:underline break-all"
          >
            info@globaldijital.com
          </a>
          <p className="text-sm text-[var(--color-muted)] mt-2">
            {contactDict.email_hint}
          </p>
        </div>
      </main>
      <Footer lang={lang} dict={dict.footer} />
    </>
  );
}
