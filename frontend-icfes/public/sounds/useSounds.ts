"use client";

export function playSound(src: string, volume = 0.8) {
  if (typeof window === "undefined") return;

  const audio = new Audio(src);
  audio.volume = volume;
  audio.play().catch(() => {
    // evita errores si el navegador bloquea autoplay
  });
}
