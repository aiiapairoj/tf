import type { ScoreResult } from "./score";

export function siteUrl(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_SITE_URL || "https://typefun-kids.vercel.app";
}

export function buildShareText(name: string, r: ScoreResult): string {
  const stars = "⭐".repeat(r.stars) + "☆".repeat(3 - r.stars);
  return `${name} เล่นเกมพิมพ์สนุก ทำได้ ${r.score} คะแนน! ${stars}\n⚡ ${r.wpm} คำ/นาที · 🎯 แม่นยำ ${Math.round(
    r.accuracy * 100
  )}% — มาแข่งกันไหม? 🚀`;
}

// Facebook sharer (preview มาจาก OG tags ของหน้าเว็บ)
export function facebookUrl(url: string, quote: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}&quote=${encodeURIComponent(quote)}`;
}

// LINE — เปิดแชตพร้อมข้อความ + ลิงก์ (ส่งให้เพื่อน)
export function lineUrl(url: string, text: string): string {
  return `https://line.me/R/msg/text/?${encodeURIComponent(text + "\n" + url)}`;
}
