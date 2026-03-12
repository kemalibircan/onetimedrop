const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const globalState = globalThis as typeof globalThis & {
  __CONTACT_RATE_LIMITS__?: Map<string, RateLimitRecord>;
};

if (!globalState.__CONTACT_RATE_LIMITS__) {
  globalState.__CONTACT_RATE_LIMITS__ = new Map<string, RateLimitRecord>();
}

const attempts = globalState.__CONTACT_RATE_LIMITS__;

function pruneExpiredEntries(now: number) {
  for (const [key, value] of attempts.entries()) {
    if (now > value.resetAt) {
      attempts.delete(key);
    }
  }
}

export function consumeContactAttempt(ip: string) {
  const key = ip || "unknown";
  const now = Date.now();

  pruneExpiredEntries(now);

  const existing = attempts.get(key);
  if (!existing) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (existing.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true };
}
