import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://onetimedrop.io";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "OneTimeDrop — Send Files From Your Phone to Any Computer",
    template: "%s | OneTimeDrop",
  },
  description:
    "Transfer files from your phone to any computer in seconds using a QR code or 8-digit code. No app, no login, no email — just scan and send.",
  keywords: [
    "phone to computer file transfer",
    "send files from phone to pc",
    "QR code file sharing",
    "wireless file transfer",
    "print from phone",
    "no install file sharing",
  ],
  authors: [{ name: "OneTimeDrop" }],
  creator: "OneTimeDrop",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "OneTimeDrop",
    title: "OneTimeDrop — Send Files From Your Phone to Any Computer",
    description:
      "Transfer files from your phone to any computer in seconds using a QR code or 8-digit code. No app, no login, no email.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OneTimeDrop — Send Files From Phone to Computer",
    description:
      "Transfer files instantly using QR code. No app needed.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#FFB86B" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
