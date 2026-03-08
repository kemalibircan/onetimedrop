import { NextRequest, NextResponse } from "next/server";
import archiver from "archiver";
import { PassThrough } from "stream";
import { sessionManager } from "@/lib/sessionManager";
import { Readable } from "stream";
import { ReadableStream as WebReadableStream } from "stream/web";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = sessionManager.getSessionByToken(sessionId, token);
  if (!session) {
    return NextResponse.json(
      { error: "Invalid or expired session" },
      { status: 401 }
    );
  }

  if (session.files.length === 0) {
    return NextResponse.json({ error: "No files to download" }, { status: 400 });
  }

  const passThrough = new PassThrough();
  const archive = archiver("zip", { zlib: { level: 6 } });
  archive.pipe(passThrough);

  for (const file of session.files) {
    if (file.status === "ready") {
      archive.file(file.diskPath, { name: file.name });
    }
  }

  archive.finalize();

  const webStream = Readable.toWeb(passThrough) as WebReadableStream<Uint8Array>;

  return new NextResponse(webStream as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="onetimedrop-session.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
