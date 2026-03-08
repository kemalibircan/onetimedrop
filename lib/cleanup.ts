import { sessionManager } from "./sessionManager";

const CLEANUP_INTERVAL_MS = 60_000; // run cleanup every 60s

export function startCleanupWorker(): void {
  setInterval(() => {
    const expired = sessionManager.getExpiredSessions();
    for (const id of expired) {
      console.log(`[cleanup] Deleting expired session ${id}`);
      sessionManager.deleteSession(id);
    }
  }, CLEANUP_INTERVAL_MS);

  console.log("[cleanup] Worker started (interval: 60s)");
}
