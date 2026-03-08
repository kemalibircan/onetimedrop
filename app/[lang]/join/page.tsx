import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import JoinClient from "./JoinClient";
import { getDictionary } from "@/lib/dictionaries";

export const metadata: Metadata = {
  title: "Join Session — OneTimeDrop",
  description:
    "Enter the 8-digit code or scan the QR code to join a desktop session and start sending files from your phone.",
  alternates: { canonical: "https://onetimedrop.io/join" },
  robots: { index: false, follow: false },
};

export default async function JoinPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ code?: string }>;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <Navbar lang={lang} dict={dict.navbar} />
      <main>
        <JoinClient searchParamsPromise={searchParams} dict={dict.mobile} />
      </main>
      <Footer lang={lang} dict={dict.footer} />
    </>
  );
}
