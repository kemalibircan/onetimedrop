"use client";

import { useState, useCallback, useRef } from "react";
import { useSocket, FileRecord, SessionData } from "@/hooks/useSocket";
import { useToast } from "@/components/ui/ToastProvider";

interface FileUploadState {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
  result?: FileRecord;
}

interface MobileSessionProps {
  initialCode?: string;
  dict: any;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function fileIcon(mime: string): string {
  if (mime.startsWith("image/")) return "🖼️";
  if (mime === "application/pdf") return "📄";
  if (mime.includes("word")) return "📝";
  if (mime.startsWith("video/")) return "🎬";
  if (mime.startsWith("audio/")) return "🎵";
  return "📎";
}

export default function MobileSession({ initialCode, dict }: MobileSessionProps) {
  const [joinCode, setJoinCode] = useState(initialCode || "");
  const [session, setSession] = useState<SessionData | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isPaired, setIsPaired] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<FileUploadState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleSessionJoined = useCallback((data: SessionData) => {
    setSession(data);
    setIsPaired(true);
    setIsJoining(false);
    addToast("Connected to desktop!", "success");
  }, [addToast]);

  const handleError = useCallback(
    (message: string) => {
      setIsJoining(false);
      addToast(message, "error");
    },
    [addToast]
  );

  const { emit } = useSocket({
    role: "mobile",
    onSessionJoined: handleSessionJoined,
    onError: handleError,
    onSessionExpired: () => {
      addToast("Session expired", "warning");
      setIsPaired(false);
      setSession(null);
    },
    onSessionClosed: () => {
      addToast("Session closed.", "info");
      setTimeout(() => window.location.reload(), 1000);
    },
  });

  const closeSession = useCallback(() => {
    if (!session) return;
    if (confirm("Are you sure you want to close this session? Desktop will also be disconnected.")) {
      emit("session:close", { token: session.token });
    }
  }, [emit, session]);

  const joinSession = useCallback(() => {
    const code = joinCode.replace(/\D/g, "");
    if (code.length !== 8) {
      addToast("Please enter an 8-digit code", "error");
      return;
    }
    setIsJoining(true);
    emit("session:join", { code });
  }, [joinCode, emit, addToast]);

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (!session) return;

      const newItems: FileUploadState[] = files.map((f) => ({
        file: f,
        progress: 0,
        status: "pending",
      }));
      setUploadQueue((prev) => [...prev, ...newItems]);

      for (let i = 0; i < newItems.length; i++) {
        const item = newItems[i];

        setUploadQueue((prev) =>
          prev.map((q) =>
            q.file === item.file ? { ...q, status: "uploading", progress: 10 } : q
          )
        );

        addToast(`📤 Uploading ${item.file.name}…`, "info");

        const formData = new FormData();
        formData.append("files", item.file);

        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: {
              "x-session-id": session.sessionId,
              "x-session-token": session.token,
            },
            body: formData,
          });

          const data = await res.json();

          if (!res.ok) {
            setUploadQueue((prev) =>
              prev.map((q) =>
                q.file === item.file
                  ? { ...q, status: "error", error: data.error || "Upload failed", progress: 0 }
                  : q
              )
            );
            addToast(`❌ ${item.file.name}: ${data.error}`, "error");
          } else {
            const fileResult = data.files?.[0];
            setUploadQueue((prev) =>
              prev.map((q) =>
                q.file === item.file
                  ? { ...q, status: "done", progress: 100, result: fileResult }
                  : q
              )
            );
            addToast(`✓ ${item.file.name} sent!`, "success");

            // Notify desktop via socket
            if (fileResult?.status === "ready") {
              emit("file:notify", {
                sessionId: session.sessionId,
                token: session.token,
                file: fileResult,
              });
            }
          }
        } catch {
          setUploadQueue((prev) =>
            prev.map((q) =>
              q.file === item.file
                ? { ...q, status: "error", error: "Network error", progress: 0 }
                : q
            )
          );
          addToast(`❌ Failed to upload ${item.file.name}`, "error");
        }
      }
    },
    [session, emit, addToast]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length) uploadFiles(files);
      e.target.value = "";
    },
    [uploadFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length) uploadFiles(files);
    },
    [uploadFiles]
  );

  /* ── Join screen ── */
  if (!isPaired) {
    return (
      <div className="max-w-md mx-auto px-4 py-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🍊</div>
          <h1 className="text-2xl font-bold">{dict.join_title}</h1>
          <p className="text-[var(--color-muted)] mt-2">
            {dict.join_subtitle}
          </p>
        </div>

        <div className="card space-y-5">
          <div>
            <label htmlFor="code-input" className="block text-sm font-medium mb-2">
              {dict.session_code}
            </label>
            <input
              id="code-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9 ]*"
              placeholder="1234 5678"
              value={joinCode}
              maxLength={9}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
                const formatted =
                  raw.length > 4
                    ? `${raw.slice(0, 4)} ${raw.slice(4)}`
                    : raw;
                setJoinCode(formatted);
              }}
              onKeyDown={(e) => e.key === "Enter" && joinSession()}
              className="input-field text-center text-2xl font-mono tracking-widest"
              aria-describedby="code-help"
            />
            <p id="code-help" className="text-xs text-[var(--color-muted)] mt-1.5">
              {dict.desktop_screen}
            </p>
          </div>

          <button
            onClick={joinSession}
            disabled={isJoining || joinCode.replace(/\D/g, "").length !== 8}
            className="btn-primary w-full"
          >
            {isJoining ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {dict.connecting}
              </>
            ) : (
              dict.connect
            )}
          </button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-[var(--color-border)]" />
            <span className="text-sm text-[var(--color-muted)]">{dict.or}</span>
            <div className="flex-1 h-px bg-[var(--color-border)]" />
          </div>

          <a
            href="/join"
            className="btn-secondary w-full text-center"
          >
            {dict.scan_qr}
          </a>
        </div>
      </div>
    );
  }

  /* ── Upload screen ── */
  return (
    <div className="max-w-md mx-auto px-4 py-8 animate-fade-in space-y-6">
      {/* Status */}
      <div className="card flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse-dot flex-shrink-0" />
          <div>
            <p className="font-semibold text-emerald-700 dark:text-emerald-400">
              {dict.connected}
            </p>
            <p className="text-xs text-[var(--color-muted)]">{dict.appear_instantly}</p>
          </div>
        </div>
        <button
          onClick={closeSession}
          className="btn-ghost text-xs text-red-500 hover:text-red-600 px-3 py-1.5 min-h-[32px] md:min-h-0"
          title={dict.close}
        >
          {dict.close}
        </button>
      </div>

      {/* Drop / Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload files — click or drag and drop"
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        className={`
          card flex flex-col items-center gap-4 py-12 cursor-pointer border-2 border-dashed
          transition-all duration-200 select-none
          ${isDragging
            ? "border-[#FF8A3D] bg-[#FFB86B]/10"
            : "border-[var(--color-border)] hover:border-[#FFB86B] hover:bg-[#FFB86B]/5"
          }
        `}
      >
        <div className="text-5xl">{isDragging ? "✨" : "📤"}</div>
        <div className="text-center">
          <p className="font-semibold">{dict.tap_choose}</p>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            {dict.limits}
          </p>
        </div>
        <span className="btn-primary pointer-events-none">{dict.select_files}</span>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept="image/*,application/pdf,application/msword,application/vnd.*,text/*,video/*,audio/*"
          onChange={handleFileSelect}
        />
      </div>

      {/* Upload queue */}
      {uploadQueue.length > 0 && (
        <div className="card p-0 overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
            <h2 className="font-semibold text-sm">{dict.uploads}</h2>
            <span className="text-xs text-[var(--color-muted)]">
              {uploadQueue.filter((q) => q.status === "done").length}/
              {uploadQueue.length} {dict.done}
            </span>
          </div>
          {uploadQueue.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-5 py-3.5 ${
                i < uploadQueue.length - 1
                  ? "border-b border-[var(--color-border)]"
                  : ""
              }`}
            >
              <span className="text-xl flex-shrink-0">
                {fileIcon(item.file.type)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.file.name}</p>
                <p className="text-xs text-[var(--color-muted)]">
                  {formatBytes(item.file.size)}
                </p>
                {item.status === "uploading" && (
                  <div className="mt-1.5 h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FF8A3D] rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
                {item.status === "error" && (
                  <p className="text-xs text-red-500 mt-0.5">{item.error}</p>
                )}
              </div>
              <span className="flex-shrink-0 text-lg">
                {item.status === "done" && "✅"}
                {item.status === "uploading" && (
                  <span className="w-5 h-5 border-2 border-[#FF8A3D] border-t-transparent rounded-full animate-spin block" />
                )}
                {item.status === "error" && "❌"}
                {item.status === "pending" && "⏳"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
