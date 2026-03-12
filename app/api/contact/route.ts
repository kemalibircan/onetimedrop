import { NextRequest, NextResponse } from "next/server";
import { consumeContactAttempt } from "@/lib/contactRateLimit";
import {
  ContactMailConfigError,
  hasContactMailConfig,
  sendContactEmail,
} from "@/lib/contactMail";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactFieldErrorCode =
  | "NAME_REQUIRED"
  | "NAME_LENGTH"
  | "EMAIL_REQUIRED"
  | "EMAIL_INVALID"
  | "MESSAGE_REQUIRED"
  | "MESSAGE_LENGTH";

type ContactFieldErrors = Partial<
  Record<"name" | "email" | "message", ContactFieldErrorCode>
>;

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return (forwardedFor?.split(",")[0] || realIp || "unknown").trim();
}

function getLocale(request: NextRequest) {
  const localeHeader = request.headers.get("x-locale")?.trim();
  if (localeHeader) return localeHeader;

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const pathname = new URL(referer).pathname;
      const match = pathname.match(/^\/([a-z]{2})(?:\/|$)/i);
      if (match?.[1]) {
        return match[1].toLowerCase();
      }
    } catch {
      // Ignore malformed referers and fall back to accept-language.
    }
  }

  return request.headers.get("accept-language")?.split(",")[0]?.trim() || "unknown";
}

function validationResponse() {
  return NextResponse.json(
    { error: "VALIDATION", fieldErrors: { message: "MESSAGE_REQUIRED" } },
    { status: 400 }
  );
}

function validatePayload(payload: Record<string, unknown>): ContactFieldErrors {
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";

  const errors: ContactFieldErrors = {};

  if (!name) {
    errors.name = "NAME_REQUIRED";
  } else if (name.length < 2 || name.length > 80) {
    errors.name = "NAME_LENGTH";
  }

  if (!email) {
    errors.email = "EMAIL_REQUIRED";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "EMAIL_INVALID";
  }

  if (!message) {
    errors.message = "MESSAGE_REQUIRED";
  } else if (message.length < 10 || message.length > 2000) {
    errors.message = "MESSAGE_LENGTH";
  }

  return errors;
}

export async function POST(request: NextRequest) {
  let payload: Record<string, unknown> | null = null;

  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return validationResponse();
  }

  if (!payload || typeof payload !== "object") {
    return validationResponse();
  }

  const website = typeof payload.website === "string" ? payload.website.trim() : "";
  if (website) {
    return NextResponse.json({ ok: true });
  }

  const rateLimitResult = consumeContactAttempt(getClientIp(request));
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "RATE_LIMITED", retryAfter: rateLimitResult.retryAfterSeconds },
      { status: 429 }
    );
  }

  const fieldErrors = validatePayload(payload);
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ error: "VALIDATION", fieldErrors }, { status: 400 });
  }

  if (!hasContactMailConfig()) {
    return NextResponse.json({ error: "UNAVAILABLE" }, { status: 503 });
  }

  try {
    await sendContactEmail({
      name: String(payload.name).trim(),
      email: String(payload.email).trim(),
      message: String(payload.message).trim(),
      locale: getLocale(request),
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ContactMailConfigError) {
      return NextResponse.json({ error: "UNAVAILABLE" }, { status: 503 });
    }

    console.error("[contact]", error);
    return NextResponse.json({ error: "SEND_FAILED" }, { status: 500 });
  }
}

export const runtime = "nodejs";
