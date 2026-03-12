import nodemailer from "nodemailer";

const FROM_EMAIL = "info@globaldijital.com";
const TO_EMAIL = "kemal.alibircan@gmail.com";

type ContactTransporter = ReturnType<typeof nodemailer.createTransport>;

export class ContactMailConfigError extends Error {
  constructor(message = "Missing SMTP configuration") {
    super(message);
    this.name = "ContactMailConfigError";
  }
}

export interface ContactMailPayload {
  name: string;
  email: string;
  message: string;
  locale: string;
  submittedAt: string;
}

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  connectionTimeout: number;
  greetingTimeout: number;
  socketTimeout: number;
}

const globalState = globalThis as typeof globalThis & {
  __CONTACT_TRANSPORTER__?: ContactTransporter;
};

function parseBoolean(value: string | undefined): boolean | undefined {
  if (!value) return undefined;

  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return undefined;
}

function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const portValue = process.env.SMTP_PORT?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;

  if (!host || !portValue || !user || !pass) {
    return null;
  }

  const port = Number.parseInt(portValue, 10);
  if (!Number.isFinite(port) || port <= 0) {
    return null;
  }

  const secure = parseBoolean(process.env.SMTP_SECURE) ?? port === 465;
  const connectionTimeout = Number.parseInt(
    process.env.SMTP_CONNECTION_TIMEOUT_MS || "10000",
    10
  );
  const greetingTimeout = Number.parseInt(
    process.env.SMTP_GREETING_TIMEOUT_MS || "10000",
    10
  );
  const socketTimeout = Number.parseInt(
    process.env.SMTP_SOCKET_TIMEOUT_MS || "15000",
    10
  );

  return {
    host,
    port,
    secure,
    user,
    pass,
    connectionTimeout,
    greetingTimeout,
    socketTimeout,
  };
}

function getTransporter(): ContactTransporter {
  if (globalState.__CONTACT_TRANSPORTER__) {
    return globalState.__CONTACT_TRANSPORTER__;
  }

  const config = getSmtpConfig();
  if (!config) {
    throw new ContactMailConfigError();
  }

  globalState.__CONTACT_TRANSPORTER__ = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    connectionTimeout: config.connectionTimeout,
    greetingTimeout: config.greetingTimeout,
    socketTimeout: config.socketTimeout,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  return globalState.__CONTACT_TRANSPORTER__;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function hasContactMailConfig(): boolean {
  return getSmtpConfig() !== null;
}

export async function sendContactEmail(payload: ContactMailPayload) {
  const transporter = getTransporter();
  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeMessage = escapeHtml(payload.message).replaceAll("\n", "<br />");
  const safeLocale = escapeHtml(payload.locale);
  const safeSubmittedAt = escapeHtml(payload.submittedAt);

  await transporter.sendMail({
    from: `Global Dijital <${FROM_EMAIL}>`,
    to: TO_EMAIL,
    replyTo: payload.email,
    subject: `OneTimeDrop contact form | ${payload.name}`,
    text: [
      "New contact form submission",
      "",
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Locale: ${payload.locale}`,
      `Submitted at: ${payload.submittedAt}`,
      "",
      "Message:",
      payload.message,
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2 style="margin-bottom: 16px;">New contact form submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Locale:</strong> ${safeLocale}</p>
        <p><strong>Submitted at:</strong> ${safeSubmittedAt}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      </div>
    `,
  });
}
