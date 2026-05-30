import type { Level } from "./words";

export interface RoundStats {
  correctChars: number; // จำนวนตัวอักษรที่พิมพ์ถูก (สะสมทั้งรอบ)
  mistakes: number; // จำนวนครั้งที่พิมพ์ผิด
  elapsedMs: number; // เวลาที่ใช้จริง
  level: Level;
}

export interface ScoreResult {
  wpm: number;
  accuracy: number; // 0..1
  score: number;
  stars: number; // 0..3
  seconds: number;
}

const LEVEL_MULT: Record<Level, number> = { easy: 1, medium: 1.3, hard: 1.6 };
const WPM_FOR_3: Record<Level, number> = { easy: 15, medium: 20, hard: 25 };

export function computeScore(s: RoundStats): ScoreResult {
  const minutes = Math.max(s.elapsedMs / 60000, 1 / 60000);
  // WPM มาตรฐาน: (ตัวอักษรถูก / 5) ต่อนาที
  const wpm = Math.round(s.correctChars / 5 / minutes);

  const typed = s.correctChars + s.mistakes;
  const accuracy = typed > 0 ? s.correctChars / typed : 1;

  const accFactor = 0.5 + 0.5 * accuracy;
  const score = Math.round(
    s.correctChars * 10 * LEVEL_MULT[s.level] * accFactor
  );

  let stars = 1;
  if (accuracy >= 0.85) stars = 2;
  if (accuracy >= 0.95 && wpm >= WPM_FOR_3[s.level]) stars = 3;

  return {
    wpm: isFinite(wpm) ? Math.max(0, wpm) : 0,
    accuracy: Math.min(1, Math.max(0, accuracy)),
    score: Math.max(0, score),
    stars,
    seconds: Math.round(s.elapsedMs / 1000),
  };
}

export function encourage(stars: number, name: string): string {
  if (stars >= 3) return `สุดยอดไปเลย ${name}! 🌟`;
  if (stars === 2) return `เก่งมาก ${name}! 🎉`;
  return `ดีมาก ${name}! ลองอีกครั้งนะ 💪`;
}
