import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { sessionManager } from "@/lib/sessionManager";

const MAX_FILE_SIZE = 250 * 1024 * 1024; // 250MB
const ALLOWED_MIME_PREFIXES = [
  "image/",
  "application/pdf",
  "application/msword",
  "application/vnd.",
  "text/",
  "video/",
  "audio/",
];

function isAllowedMime(mime: string): boolean {
  return ALLOWED_MIME_PREFIXES.some((p) => mime.startsWith(p));
}

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.headers.get("x-session-id");
    const token = req.headers.get("x-session-token");

    if (!sessionId || !token) {
      return NextResponse.json(
        { error: "Missing session credentials" },
        { status: 401 }
      );
    }

    const session = sessionManager.getSessionByToken(sessionId, token);
    if (!session) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    if (session.files.length >= 20) {
      return NextResponse.json(
        { error: "Session file limit (20) reached" },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as unknown as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadBase = sessionManager.getUploadDir();
    const sessionDir = path.join(uploadBase, sessionId);
    await mkdir(sessionDir, { recursive: true });

    const addedFiles = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        addedFiles.push({
          name: file.name,
          status: "failed",
          error: "File exceeds 250MB limit",
        });
        continue;
      }

      const mime = file.type || "application/octet-stream";
      if (!isAllowedMime(mime)) {
        addedFiles.push({
          name: file.name,
          status: "failed",
          error: "File type not allowed",
        });
        continue;
      }

      const fileId = randomBytes(16).toString("hex");
      const ext = path.extname(file.name) || "";
      const diskPath = path.join(sessionDir, fileId + ext);

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(diskPath, buffer);

      const fileRecord = {
        id: fileId,
        name: file.name,
        size: file.size,
        mimeType: mime,
        uploadedAt: Date.now(),
        status: "ready" as const,
        diskPath,
      };

      const ok = sessionManager.addFile(sessionId, token, fileRecord);
      if (!ok) {
        addedFiles.push({
          name: file.name,
          status: "failed",
          error: "Could not add file to session",
        });
        continue;
      }

      addedFiles.push({
        id: fileId,
        name: file.name,
        size: file.size,
        mimeType: mime,
        uploadedAt: fileRecord.uploadedAt,
        status: "ready",
      });

      // Notify desktop via Socket.IO
      const io = (globalThis as unknown as { _io?: { to: (room: string) => { emit: (ev: string, data: unknown) => void } } })._io;
      if (io) {
        io.to(sessionId).emit("file:added", { file: fileRecord });
      }
    }

    return NextResponse.json({ files: addedFiles });
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
