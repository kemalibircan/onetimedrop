"use client";

import { useCallback } from "react";

const CONFETTI_COLORS = [
  "#FFB86B", "#FF8A3D", "#FFD9B5", "#FF6B35",
  "#FFF0D4", "#E06A1A", "#FFE4C4", "#F97316",
];

export function useConfetti() {
  const burst = useCallback((count = 60) => {
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.top = `-20px`;
      piece.style.backgroundColor =
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      piece.style.width = `${6 + Math.random() * 8}px`;
      piece.style.height = `${10 + Math.random() * 10}px`;
      piece.style.opacity = "1";
      piece.style.animationDuration = `${1.5 + Math.random() * 2}s`;
      piece.style.animationDelay = `${Math.random() * 0.5}s`;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 4000);
    }
  }, []);

  return { burst };
}
