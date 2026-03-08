import { randomBytes } from "crypto";
import { rmSync } from "fs";
import path from "path";

export interface FileRecord {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: number;
  status: "ready" | "failed";
  diskPath: string;
}

export interface Session {
  id: string;
  code: string;
  desktopToken: string;
  mobileToken: string;
  createdAt: number;
  expiresAt: number;
  files: FileRecord[];
  paired: boolean;
}

const SESSION_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_FILES_PER_SESSION = 20;
const UPLOAD_DIR = process.env.UPLOAD_DIR || "/tmp/onetimedrop";

const globalExt = globalThis as unknown as {
  __ORANGEDROP_SESSIONS: Map<string, Session>;
  __ORANGEDROP_CODES: Map<string, string>;
};

if (!globalExt.__ORANGEDROP_SESSIONS) {
  globalExt.__ORANGEDROP_SESSIONS = new Map<string, Session>();
}
if (!globalExt.__ORANGEDROP_CODES) {
  globalExt.__ORANGEDROP_CODES = new Map<string, string>();
}

const sessions = globalExt.__ORANGEDROP_SESSIONS;
const codeToSessionId = globalExt.__ORANGEDROP_CODES;

function generateCode(): string {
  const digits = randomBytes(4)
    .toString("hex")
    .replace(/[a-f]/g, (c) => String(parseInt(c, 16) % 10));
  return digits.padStart(8, "0").slice(0, 8);
}

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

function generateId(): string {
  return randomBytes(16).toString("hex");
}

export const sessionManager = {
  createSession(): Session {
    // Generate unique code
    let code = generateCode();
    while (codeToSessionId.has(code)) {
      code = generateCode();
    }

    const id = generateId();
    const now = Date.now();
    const session: Session = {
      id,
      code,
      desktopToken: generateToken(),
      mobileToken: generateToken(),
      createdAt: now,
      expiresAt: now + SESSION_TTL_MS,
      files: [],
      paired: false,
    };

    sessions.set(id, session);
    codeToSessionId.set(code, id);
    return session;
  },

  joinSession(code: string): Session | null {
    const normalized = code.replace(/\D/g, "");
    const sessionId = codeToSessionId.get(normalized);
    if (!sessionId) return null;

    const session = sessions.get(sessionId);
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      this.deleteSession(sessionId);
      return null;
    }

    session.paired = true;
    return session;
  },

  getSession(id: string): Session | null {
    const session = sessions.get(id);
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      this.deleteSession(id);
      return null;
    }
    return session;
  },

  getSessionByToken(sessionId: string, token: string): Session | null {
    const session = this.getSession(sessionId);
    if (!session) return null;
    if (session.desktopToken !== token && session.mobileToken !== token)
      return null;
    return session;
  },

  addFile(
    sessionId: string,
    token: string,
    fileRecord: FileRecord
  ): boolean {
    const session = this.getSessionByToken(sessionId, token);
    if (!session) return false;
    if (session.files.length >= MAX_FILES_PER_SESSION) return false;
    session.files.push(fileRecord);
    return true;
  },

  clearFiles(sessionId: string): void {
    const session = sessions.get(sessionId);
    if (!session) return;
    for (const f of session.files) {
      try {
        rmSync(f.diskPath, { force: true });
      } catch {}
    }
    session.files = [];
  },

  deleteSession(id: string): void {
    const session = sessions.get(id);
    if (!session) return;
    // Delete files
    for (const f of session.files) {
      try {
        rmSync(f.diskPath, { force: true });
      } catch {}
    }
    // Also try to remove session upload dir
    try {
      rmSync(path.join(UPLOAD_DIR, id), { recursive: true, force: true });
    } catch {}
    codeToSessionId.delete(session.code);
    sessions.delete(id);
  },

  getExpiredSessions(): string[] {
    const now = Date.now();
    const expired: string[] = [];
    for (const [id, session] of sessions) {
      if (now > session.expiresAt) expired.push(id);
    }
    return expired;
  },

  getAllSessions(): Map<string, Session> {
    return sessions;
  },

  getUploadDir(): string {
    return UPLOAD_DIR;
  },
};
