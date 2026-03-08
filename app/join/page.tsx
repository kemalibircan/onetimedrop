import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import JoinClient from "./JoinClient";

export const metadata: Metadata = {
  title: "Join Session — OneTimeDrop",
  description:
    "Enter the 8-digit code or scan the QR code to join a desktop session and start sending files from your phone.",
  alternates: { canonical: "https://onetimedrop.io/join" },
  robots: { index: false, follow: false },
};

export default function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  return (
    <>
      <Navbar />
      <main>
        <JoinClient searchParamsPromise={searchParams} />
      </main>
      <Footer />
    </>
  );
}
