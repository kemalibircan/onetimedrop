"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface FileRecord {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: number;
  status: "ready" | "failed";
  diskPath?: string;
}

export interface SessionData {
  sessionId: string;
  code?: string;
  token: string;
  expiresAt: number;
  files?: FileRecord[];
}

export type SocketStatus =
  | "connecting"
  | "connected"
  | "paired"
  | "error"
  | "disconnected"
  | "expired";

interface UseSocketOptions {
  role: "desktop" | "mobile";
  onSessionCreated?: (data: SessionData) => void;
  onSessionJoined?: (data: SessionData) => void;
  onPaired?: (deviceName: string) => void;
  onFileAdded?: (file: FileRecord) => void;
  onFilesCleared?: () => void;
  onError?: (message: string, code?: string) => void;
  onSessionExpired?: () => void;
  onDeviceDisconnected?: (role: string) => void;
  onSessionClosed?: () => void;
}

export function useSocket(options: UseSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState<SocketStatus>("connecting");

  const emit = useCallback((event: string, data?: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  useEffect(() => {
    const socket = io({
      path: "/socket.io",
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setStatus("connected");
      if (options.role === "desktop") {
        socket.emit("session:create");
      }
    });

    socket.on("session:created", (data: SessionData) => {
      options.onSessionCreated?.(data);
    });

    socket.on("session:joined", (data: SessionData) => {
      setStatus("paired");
      options.onSessionJoined?.(data);
    });

    socket.on("session:paired", ({ deviceName }: { deviceName: string }) => {
      setStatus("paired");
      options.onPaired?.(deviceName);
    });

    socket.on("file:added", ({ file }: { file: FileRecord }) => {
      options.onFileAdded?.(file);
    });

    socket.on("session:filesCleared", () => {
      options.onFilesCleared?.();
    });

    socket.on("session:error", ({ message, code }: { message: string; code?: string }) => {
      setStatus("error");
      options.onError?.(message, code);
    });

    socket.on("session:expired", () => {
      setStatus("expired");
      options.onSessionExpired?.();
    });

    socket.on("session:deviceDisconnected", ({ role }: { role: string }) => {
      options.onDeviceDisconnected?.(role);
    });

    socket.on("session:closed", () => {
      setStatus("disconnected");
      options.onSessionClosed?.();
    });

    socket.on("disconnect", () => {
      setStatus("disconnected");
    });

    socket.on("connect_error", () => {
      setStatus("error");
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.role]);

  return { status, emit };
}
