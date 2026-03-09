import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { getDictionary } from "@/lib/dictionaries";

export const metadata: Metadata = {
  title: "Privacy Policy — OneTimeDrop",
  description:
    "OneTimeDrop Privacy Policy: We store files temporarily for 10 minutes, use limited Google Analytics traffic measurement, and collect no account data.",
  alternates: { canonical: "https://onetimedrop.io/privacy" },
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <Navbar lang={lang} dict={dict.navbar} />
      <main className="max-w-3xl mx-auto px-4 py-16 prose prose-neutral dark:prose-invert max-w-none">
        <h1 className="text-4xl font-extrabold mb-2">Privacy Policy</h1>
        <p className="text-[var(--color-muted)] text-sm mb-10">
          Last updated: March 9, 2026
        </p>

        <div className="space-y-8 text-[var(--color-text)]">
          <section>
            <h2 className="text-xl font-bold">1. What OneTimeDrop Does</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              OneTimeDrop is a browser-based file transfer service that allows you to send files from
              your phone to a computer using a temporary session code and QR code. No registration or
              account is required.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">2. What We Collect</h2>
            <ul className="text-[var(--color-muted)] space-y-2 leading-relaxed">
              <li>
                <strong>Files you upload:</strong> Stored temporarily in server memory/disk, accessible only with your session token. Auto-deleted after <strong>10 minutes</strong> regardless of download status.
              </li>
              <li>
                <strong>Session data:</strong> A random session ID, an 8-digit pairing code, and two unique tokens. No personal data attached.
              </li>
              <li>
                <strong>Server logs:</strong> Standard web server logs (IP address, timestamp, request path) for security and debugging, retained for up to 7 days.
              </li>
              <li>
                <strong>Usage analytics:</strong> Google Analytics may collect page views and basic device/browser information, along with cookie identifiers and approximate location data, to help us understand site traffic and improve the service.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">3. What We Do NOT Collect</h2>
            <ul className="text-[var(--color-muted)] space-y-2 leading-relaxed">
              <li>No names, emails, or accounts</li>
              <li>No advertising trackers or remarketing pixels</li>
              <li>No file content analysis or scanning</li>
              <li>No permanent file storage after the retention window expires</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">4. File Storage and Deletion</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              All uploaded files are stored on temporary server storage (e.g., <code>/tmp</code>).
              A cleanup worker runs every 60 seconds and permanently deletes any session older than
              10 minutes, including all associated files. File URLs contain your unique session token
              and are not publicly guessable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">5. Security</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              Sessions are protected by a random 64-character hex token generated server-side. File
              downloads require this token. Join attempts are rate-limited to 10 per minute per IP.
              We recommend not uploading highly sensitive documents (passwords, financial data) from
              shared or public computers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">6. Third-Party Services</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              OneTimeDrop uses Google Analytics for aggregated traffic measurement. We do not use
              advertising pixels such as Facebook Pixel, and QR codes are generated client-side in
              your browser with no external API calls.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">7. Changes</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              We may update this policy. Changes will be posted here with a new date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">8. Contact</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">
              Questions? Visit our <a href="/contact" className="text-[#FF8A3D] hover:underline">contact page</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer lang={lang} dict={dict.footer} />
    </>
  );
}
