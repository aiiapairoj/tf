import type { Lang } from "./keyboards";

export type Level = "easy" | "medium" | "hard";
export type Mode = "practice" | "time" | "adventure";

// คลังคำ/ประโยคสำหรับเด็ก — ใช้ตัวอักษรที่อยู่บนแป้นหลักเป็นหลัก
const BANK: Record<Lang, Record<Level, string[]>> = {
  th: {
    easy: ["แมว", "หมา", "ปลา", "นก", "ไก่", "ม้า", "ลิง", "งู", "หมู", "วัว", "ดาว", "ฟ้า", "บ้าน", "รถ", "เรือ", "ตา", "หู", "มือ", "ขา", "ผม"],
    medium: ["แมวน่ารัก", "กินข้าวกัน", "ไปโรงเรียน", "อ่านหนังสือ", "เล่นกับเพื่อน", "ดูทีวีสนุก", "วาดรูปสวย", "ร้องเพลงเพราะ", "วิ่งเล่นในสวน", "นอนหลับฝันดี"],
    hard: [
      "แมวน้อยนอนหลับอยู่บนเก้าอี้",
      "วันนี้อากาศดีท้องฟ้าสดใส",
      "ฉันชอบกินผลไม้และผักทุกวัน",
      "เด็กดีตั้งใจเรียนหนังสือเสมอ",
      "เราไปเที่ยวทะเลกับครอบครัว",
      "น้องหมาวิ่งเล่นอยู่ในสวนหลังบ้าน",
    ],
  },
  en: {
    easy: ["cat", "dog", "sun", "fish", "bird", "star", "tree", "book", "ball", "milk", "frog", "duck", "cake", "kite", "rain", "moon", "bear", "lion", "fox", "bee"],
    medium: ["happy day", "blue sky", "little cat", "big tree", "red apple", "good friend", "funny dog", "green frog", "sweet cake", "bright star"],
    hard: [
      "the quick brown fox jumps high",
      "i like to read fun books every day",
      "the sun is bright and the sky is blue",
      "my little dog loves to run and play",
      "we go to school to learn new things",
      "a happy bird sings a sweet song",
    ],
  },
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// จำนวนโจทย์ต่อรอบ
export const ROUND_PROMPTS: Record<Mode, number> = {
  practice: 5,
  adventure: 6,
  time: 60, // เตรียมเผื่อ — โหมดเวลาใช้จนกว่าหมดเวลา
};

// วินาทีของโหมดแข่งเวลา
export const TIME_LIMIT_SEC = 60;

// สร้างคิวโจทย์
export function buildQueue(lang: Lang, level: Level, mode: Mode): string[] {
  const pool = BANK[lang][level];
  const need = ROUND_PROMPTS[mode];
  let out: string[] = [];
  while (out.length < need) out = out.concat(shuffle(pool));
  return out.slice(0, need);
}

export const LEVEL_META: Record<Level, { emoji: string; th: string; desc: string }> = {
  easy: { emoji: "🐣", th: "เริ่มต้น", desc: "แป้นเหย้า" },
  medium: { emoji: "🦊", th: "ปานกลาง", desc: "คำสั้น ๆ" },
  hard: { emoji: "🦅", th: "เก่งแล้ว", desc: "ประโยค" },
};

export const MODE_META: Record<Mode, { emoji: string; th: string }> = {
  practice: { emoji: "📚", th: "ฝึกพิมพ์" },
  time: { emoji: "⏱️", th: "แข่งเวลา" },
  adventure: { emoji: "🗺️", th: "ผจญภัย" },
};
