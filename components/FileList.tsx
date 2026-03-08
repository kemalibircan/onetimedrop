"use client";

import { FileRecord } from "@/hooks/useSocket";

interface FileListProps {
  files: FileRecord[];
  onDownload: (fileId: string) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fileIcon(mime: string): string {
  if (mime.startsWith("image/")) return "🖼️";
  if (mime === "application/pdf") return "📄";
  if (
    mime.includes("word") ||
    mime.includes("document")
  )
    return "📝";
  if (mime.includes("spreadsheet") || mime.includes("excel")) return "📊";
  if (mime.includes("presentation") || mime.includes("powerpoint")) return "📊";
  if (mime.startsWith("video/")) return "🎬";
  if (mime.startsWith("audio/")) return "🎵";
  if (mime.startsWith("text/")) return "📃";
  return "📎";
}

export default function FileList({ files, onDownload }: FileListProps) {
  return (
    <div
      className="card overflow-hidden p-0"
      role="list"
      aria-label="Received files"
    >
      {files.map((file, i) => (
        <div
          key={file.id}
          role="listitem"
          className={`flex items-center gap-4 px-5 py-4 hover:bg-[#FFB86B]/5 transition-colors
            ${i < files.length - 1 ? "border-b border-[var(--color-border)]" : ""}
            animate-slide-up`}
          style={{ animationDelay: `${i * 50}ms` }}
        >
          {/* Icon */}
          <div className="w-10 h-10 rounded-xl bg-[#FFB86B]/15 flex items-center justify-center text-xl flex-shrink-0">
            {fileIcon(file.mimeType)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{file.name}</p>
            <p className="text-xs text-[var(--color-muted)] mt-0.5">
              {formatBytes(file.size)} · {formatTime(file.uploadedAt)}
            </p>
          </div>

          {/* Status */}
          <div className="flex-shrink-0">
            {file.status === "ready" ? (
              <span className="badge-success">Ready</span>
            ) : (
              <span className="badge-error">Failed</span>
            )}
          </div>

          {/* Download */}
          {file.status === "ready" && (
            <button
              onClick={() => onDownload(file.id)}
              className="btn-primary text-sm py-2 px-4 flex-shrink-0"
              aria-label={`Download ${file.name}`}
            >
              ↓ Download
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
