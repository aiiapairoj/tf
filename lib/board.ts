import type { Lang } from "./keyboards";
import type { Level, Mode } from "./words";

export interface ScoreRow {
  name: string;
  lang: Lang;
  level: Level;
  mode: Mode;
  wpm: number;
  accuracy: number;
  score: number;
  created_at?: string;
}

const LS_KEY = "tf-scores";

function readLocal(): ScoreRow[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}
function writeLocal(rows: ScoreRow[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(rows.slice(0, 100)));
}

// บันทึกคะแนน — คืน true ถ้าเก็บบน Supabase สำเร็จ
export async function submitScore(entry: ScoreRow): Promise<{ remote: boolean }> {
  try {
    const res = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    const data = await res.json();
    if (data?.ok) return { remote: true };
  } catch {
    /* offline — เก็บ local */
  }
  // fallback local
  const rows = readLocal();
  rows.push({ ...entry, created_at: new Date().toISOString() });
  rows.sort((a, b) => b.score - a.score);
  writeLocal(rows);
  return { remote: false };
}

// ดึงอันดับ
export async function fetchScores(lang?: Lang, level?: Level): Promise<{ rows: ScoreRow[]; remote: boolean }> {
  try {
    const qs = new URLSearchParams();
    if (lang) qs.set("lang", lang);
    if (level) qs.set("level", level);
    const res = await fetch(`/api/scores?${qs.toString()}`, { cache: "no-store" });
    const data = await res.json();
    if (data?.configured) return { rows: data.scores ?? [], remote: true };
  } catch {
    /* offline */
  }
  // fallback local
  let rows = readLocal();
  if (lang) rows = rows.filter((r) => r.lang === lang);
  if (level) rows = rows.filter((r) => r.level === level);
  rows.sort((a, b) => b.score - a.score);
  return { rows: rows.slice(0, 20), remote: false };
}
