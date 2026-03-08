import { NextRequest, NextResponse } from "next/server";
import { createReadStream, statSync } from "fs";
import path from "path";
import { sessionManager } from "@/lib/sessionManager";
import { Readable } from "stream";
import { ReadableStream as WebReadableStream } from "stream/web";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;
  const sessionId = req.headers.get("x-session-id");
  const token = req.headers.get("x-session-token");

  // Also support query params for direct link downloads
  const url = new URL(req.url);
  const qSessionId = url.searchParams.get("sid") || sessionId;
  const qToken = url.searchParams.get("token") || token;

  if (!qSessionId || !qToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = sessionManager.getSessionByToken(qSessionId, qToken);
  if (!session) {
    return NextResponse.json(
      { error: "Invalid or expired session" },
      { status: 401 }
    );
  }

  const file = session.files.find((f) => f.id === fileId);
  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  try {
    const stat = statSync(file.diskPath);
    const nodeStream = createReadStream(file.diskPath);
    const webStream = Readable.toWeb(nodeStream) as WebReadableStream<Uint8Array>;

    const ext = path.extname(file.name);
    const safeFilename = encodeURIComponent(file.name);

    return new NextResponse(webStream as unknown as BodyInit, {
      headers: {
        "Content-Type": file.mimeType,
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
        "Content-Length": stat.size.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not available" }, { status: 404 });
  }
}
