import http from "http";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import { sessionManager } from "./lib/sessionManager";
import { startCleanupWorker } from "./lib/cleanup";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = http.createServer(handler);

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    maxHttpBufferSize: 1e8, // 100MB for socket messages
  });

  // Rate limiting: track join attempts per IP
  const joinAttempts = new Map<string, { count: number; resetAt: number }>();
  const MAX_JOIN_ATTEMPTS = 10;
  const JOIN_WINDOW_MS = 60_000;

  function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = joinAttempts.get(ip);
    if (!record || now > record.resetAt) {
      joinAttempts.set(ip, { count: 1, resetAt: now + JOIN_WINDOW_MS });
      return true;
    }
    if (record.count >= MAX_JOIN_ATTEMPTS) return false;
    record.count++;
    return true;
  }

  io.on("connection", (socket) => {
    const clientIp =
      (socket.handshake.headers["x-forwarded-for"] as string) ||
      socket.handshake.address;

    // ── Desktop: Create a new session ──────────────────────────────────────
    socket.on("session:create", () => {
      const session = sessionManager.createSession();
      socket.join(session.id);
      socket.data.sessionId = session.id;
      socket.data.role = "desktop";

      socket.emit("session:created", {
        sessionId: session.id,
        code: session.code,
        token: session.desktopToken,
        expiresAt: session.expiresAt,
      });
    });

    // ── Mobile: Join existing session ───────────────────────────────────────
    socket.on("session:join", ({ code }: { code: string }) => {
      if (!checkRateLimit(clientIp)) {
        socket.emit("session:error", {
          message: "Too many attempts. Please wait a minute.",
          code: "RATE_LIMITED",
        });
        return;
      }

      const session = sessionManager.joinSession(code);
      if (!session) {
        socket.emit("session:error", {
          message: "Invalid or expired code. Please check and try again.",
          code: "INVALID_CODE",
        });
        return;
      }

      socket.join(session.id);
      socket.data.sessionId = session.id;
      socket.data.role = "mobile";

      socket.emit("session:joined", {
        sessionId: session.id,
        token: session.mobileToken,
        expiresAt: session.expiresAt,
        files: session.files,
      });

      // Notify desktop that mobile has connected
      socket.to(session.id).emit("session:paired", {
        deviceName: "Mobile Device",
      });
    });

    // ── File added notification (from upload API) ───────────────────────────
    socket.on(
      "file:notify",
      ({ sessionId, token, file }: { sessionId: string; token: string; file: unknown }) => {
        const session = sessionManager.getSession(sessionId);
        if (!session || session.mobileToken !== token) return;

        io.to(sessionId).emit("file:added", { file });
      }
    );

    // ── Session: clear all files ────────────────────────────────────────────
    socket.on(
      "session:clearFiles",
      ({ token }: { token: string }) => {
        const sessionId = socket.data.sessionId as string;
        if (!sessionId) return;
        const session = sessionManager.getSession(sessionId);
        if (!session) return;
        if (
          session.desktopToken !== token &&
          session.mobileToken !== token
        )
          return;
        sessionManager.clearFiles(sessionId);
        io.to(sessionId).emit("session:filesCleared", {});
      }
    );

    // ── Session: close session ──────────────────────────────────────────────
    socket.on(
      "session:close",
      ({ token }: { token: string }) => {
        const sessionId = socket.data.sessionId as string;
        if (!sessionId) return;
        const session = sessionManager.getSession(sessionId);
        if (!session) return;
        if (
          session.desktopToken !== token &&
          session.mobileToken !== token
        )
          return;
          
        sessionManager.deleteSession(sessionId);
        io.to(sessionId).emit("session:closed", {});
        // Disconnect all sockets in the room
        io.in(sessionId).disconnectSockets(true);
      }
    );

    // ── Disconnect ──────────────────────────────────────────────────────────
    socket.on("disconnect", () => {
      const sessionId = socket.data.sessionId as string;
      const role = socket.data.role as string;
      if (!sessionId) return;

      // Notify the other side
      socket.to(sessionId).emit("session:deviceDisconnected", { role });
    });
  });

  // Expose io to Next.js route handlers via globalThis
  (globalThis as unknown as { _io: SocketIOServer })._io = io;

  startCleanupWorker();

  httpServer.listen(port, () => {
    console.log(`\x1b[32m✓\x1b[0m OneTimeDrop ready on http://${hostname}:${port}`);
  });
});
