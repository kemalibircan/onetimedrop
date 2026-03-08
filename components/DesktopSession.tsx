"use client";

import { useEffect, useState, useCallback } from "react";
import { useSocket, FileRecord, SessionData } from "@/hooks/useSocket";
import { useToast } from "@/components/ui/ToastProvider";
import { useConfetti } from "@/hooks/useConfetti";
import QRCode from "@/components/QRCode";
import FileList from "@/components/FileList";

const BASE_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : "https://onetimedrop.io";

export default function DesktopSession() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isPaired, setIsPaired] = useState(false);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const { addToast } = useToast();
  const { burst } = useConfetti();

  const handleSessionCreated = useCallback((data: SessionData) => {
    setSession(data);
  }, []);

  const handlePaired = useCallback(
    (deviceName: string) => {
      setIsPaired(true);
      burst();
      addToast(`${deviceName} connected! Ready to receive files.`, "success");
    },
    [addToast, burst]
  );

  const handleFileAdded = useCallback(
    (file: FileRecord) => {
      setFiles((prev) => {
        if (prev.some((f) => f.id === file.id)) return prev;
        return [file, ...prev];
      });
      addToast(`📎 ${file.name} received`, "success");
    },
    [addToast]
  );

  const handleFilesCleared = useCallback(() => {
    setFiles([]);
    addToast("Session files cleared", "info");
  }, [addToast]);

  const handleError = useCallback(
    (message: string) => {
      addToast(message, "error");
    },
    [addToast]
  );

  const handleDeviceDisconnected = useCallback(
    (role: string) => {
      if (role === "mobile") {
        setIsPaired(false);
        addToast("Mobile device disconnected", "warning");
      }
    },
    [addToast]
  );

  const { status, emit } = useSocket({
    role: "desktop",
    onSessionCreated: handleSessionCreated,
    onPaired: handlePaired,
    onFileAdded: handleFileAdded,
    onFilesCleared: handleFilesCleared,
    onError: handleError,
    onDeviceDisconnected: handleDeviceDisconnected,
    onSessionExpired: () => {
      addToast("Session expired. Refreshing...", "warning");
      setTimeout(() => window.location.reload(), 2000);
    },
    onSessionClosed: () => {
      addToast("Session closed.", "info");
      setTimeout(() => window.location.reload(), 1000);
    },
  });

  // Countdown timer
  useEffect(() => {
    if (!session?.expiresAt) return;
    const update = () => {
      const left = session.expiresAt - Date.now();
      if (left <= 0) {
        setTimeLeft("Expired");
        return;
      }
      const m = Math.floor(left / 60000);
      const s = Math.floor((left % 60000) / 1000);
      setTimeLeft(`${m}:${s.toString().padStart(2, "0")}`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [session?.expiresAt]);

  const clearFiles = useCallback(() => {
    if (!session) return;
    emit("session:clearFiles", { token: session.token });
  }, [emit, session]);

  const closeSession = useCallback(() => {
    if (!session) return;
    if (confirm("Are you sure you want to close this session? All files will be deleted.")) {
      emit("session:close", { token: session.token });
    }
  }, [emit, session]);

  const downloadFile = useCallback(
    (fileId: string) => {
      if (!session) return;
      const url = `/api/download/${fileId}?sid=${session.sessionId}&token=${session.token}`;
      const a = document.createElement("a");
      a.href = url;
      a.download = "";
      a.click();
      addToast("Download started", "success");
    },
    [session, addToast]
  );

  const downloadAll = useCallback(() => {
    if (!session) return;
    const url = `/api/download-all/${session.sessionId}?token=${session.token}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = "onetimedrop-files.zip";
    a.click();
    addToast("Downloading all files as ZIP...", "success");
  }, [session, addToast]);

  const joinUrl = session
    ? `${BASE_URL}/join?code=${session.code}`
    : "";

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === "connecting") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-[#FFB86B] border-t-transparent rounded-full animate-spin" />
        <p className="text-[var(--color-muted)]">Setting up your session…</p>
      </div>
    );
  }

  if (status === "error" || status === "disconnected") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="text-5xl">⚠️</div>
        <h2 className="text-xl font-semibold">Connection issue</h2>
        <p className="text-[var(--color-muted)]">
          Unable to connect to the server. Please refresh the page.
        </p>
        <button onClick={() => window.location.reload()} className="btn-primary">
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="badge-orange mb-3">Desktop Session</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mt-2">
          {isPaired ? "📱 Phone connected!" : "Scan to connect your phone"}
        </h1>
        <p className="text-[var(--color-muted)] mt-2">
          {isPaired
            ? "Files from your phone will appear below instantly."
            : "Point your phone camera at the QR code, or type the code manually."}
        </p>
      </div>

      {!isPaired && session ? (
        /* ── Pairing State ── */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QR Code */}
          <div className="card flex flex-col items-center gap-6 py-10">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-[#FFB86B]/10 blur-xl" />
              <div className="relative bg-white p-4 rounded-2xl shadow-card">
                {joinUrl && <QRCode value={joinUrl} size={200} />}
              </div>
            </div>
            <p className="text-sm text-[var(--color-muted)] text-center">
              Scan with your phone camera
            </p>
          </div>

          {/* Code display */}
          <div className="card flex flex-col items-center justify-center gap-6 py-10">
            <div>
              <p className="text-sm text-[var(--color-muted)] text-center mb-3 font-medium uppercase tracking-wider">
                Or type this code on your phone
              </p>
              <div className="code-display" aria-label="Session code">
                {session.code
                  ? `${session.code.slice(0, 4)} ${session.code.slice(4)}`
                  : "—"}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse-dot" />
              <span>Expires in</span>
              <span className="font-mono font-semibold text-[var(--color-text)]">
                {timeLeft}
              </span>
            </div>

            <a
              href={joinUrl}
              className="btn-ghost text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Copy join link →
            </a>
          </div>
        </div>
      ) : isPaired && session ? (
        /* ── Paired / File Manager State ── */
        <div className="space-y-6">
          {/* Status bar */}
          <div className="card flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse-dot" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                Phone connected
              </span>
              <span className="text-[var(--color-muted)] text-sm">
                · Session expires in{" "}
                <span className="font-mono">{timeLeft}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {files.length > 1 && (
                <button onClick={downloadAll} className="btn-secondary text-sm py-2 px-4">
                  ↓ Download all (ZIP)
                </button>
              )}
              <button
                onClick={closeSession}
                className="btn-ghost text-sm text-red-500 flex items-center gap-1 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                title="End session and delete all files"
              >
                <div className="w-2 h-2 rounded-full border-2 border-red-500 shrink-0" />
                Close session
              </button>
            </div>
          </div>

          {/* Search */}
          {files.length > 3 && (
            <div>
              <input
                type="search"
                placeholder="Search files…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                aria-label="Search files"
              />
            </div>
          )}

          {/* File list */}
          {files.length === 0 ? (
            <div className="card flex flex-col items-center gap-4 py-16 text-center">
              <div className="text-5xl opacity-30">📭</div>
              <p className="text-[var(--color-muted)]">
                No files yet. Upload from your phone to see them here.
              </p>
            </div>
          ) : (
            <FileList
              files={filteredFiles}
              onDownload={downloadFile}
            />
          )}
        </div>
      ) : null}
    </div>
  );
}
