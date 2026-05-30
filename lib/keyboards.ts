// แป้นพิมพ์สำหรับไฮไลต์ปุ่มถัดไป
// TH = Kedmanee (เกษมณี) แป้นไม่กด Shift, EN = QWERTY

export type Lang = "th" | "en";

export const LAYOUTS: Record<Lang, string[][]> = {
  en: [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ],
  th: [
    ["ๆ", "ไ", "ำ", "พ", "ะ", "ั", "ี", "ร", "น", "ย", "บ", "ล"],
    ["ฟ", "ห", "ก", "ด", "เ", "้", "่", "า", "ส", "ว", "ง"],
    ["ผ", "ป", "แ", "อ", "ิ", "ื", "ท", "ม", "ใ", "ฝ"],
  ],
};

// ปุ่มแป้นเหย้า (home row) ที่นิ้วชี้วาง
export const HOME_KEYS: Record<Lang, string[]> = {
  en: ["F", "J"],
  th: ["ด", "่"],
};

// แม็พสีนิ้ว (แบ่งตามคอลัมน์โดยประมาณ) — index ของปุ่มในแถว → สีนิ้ว
export const FINGER_COLORS = [
  "#FF6B35", // pinkie/ring left
  "#F7931E",
  "#FFD23F",
  "#34D399",
  "#38BDF8", // index
  "#38BDF8",
  "#34D399",
  "#FFD23F",
  "#F7931E",
  "#FF6B35",
  "#8B5CF6",
  "#FF5FA2",
];

// หาปุ่มจากตัวอักษรเป้าหมาย (EN ใช้ uppercase, TH ใช้ glyph ตรง ๆ)
export function keyForChar(ch: string | undefined, lang: Lang): string | null {
  if (ch == null) return null;
  if (ch === " ") return " ";
  const target = lang === "en" ? ch.toUpperCase() : ch;
  for (const row of LAYOUTS[lang]) {
    if (row.includes(target)) return target;
  }
  // ตัวที่ต้องกด Shift หรือไม่อยู่บนแป้นหลัก → ไม่ไฮไลต์
  return null;
}
