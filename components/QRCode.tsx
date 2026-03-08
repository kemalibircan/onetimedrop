"use client";

import { useEffect, useRef } from "react";

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

// Simple minimal QR code renderer using the qrcode library
export default function QRCode({ value, size = 200, className }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    async function draw() {
      try {
        const QRCodeLib = (await import("qrcode")).default;
        const canvas = canvasRef.current;
        if (!canvas) return;

        await QRCodeLib.toCanvas(canvas, value, {
          width: size,
          margin: 2,
          color: {
            dark: "#111827",
            light: "#FFFFFF",
          },
          errorCorrectionLevel: "M",
        });
      } catch (err) {
        console.error("QR generation failed", err);
      }
    }

    draw();
  }, [value, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={`rounded-2xl ${className ?? ""}`}
      aria-label={`QR code for: ${value}`}
      role="img"
    />
  );
}
