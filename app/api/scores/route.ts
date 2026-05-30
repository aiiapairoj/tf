import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_ANON_KEY;

function getClient() {
  if (!SB_URL || !SB_KEY) return null;
  return createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });
}

// GET /api/scores?lang=th&level=easy  → อันดับสูงสุด 20
export async function GET(req: Request) {
  const supabase = getClient();
  if (!supabase) return NextResponse.json({ configured: false, scores: [] });

  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang");
  const level = searchParams.get("level");

  let q = supabase
    .from("scores")
    .select("name, lang, level, mode, wpm, accuracy, score, created_at")
    .order("score", { ascending: false })
    .limit(20);

  if (lang) q = q.eq("lang", lang);
  if (level) q = q.eq("level", level);

  const { data, error } = await q;
  if (error) return NextResponse.json({ configured: true, scores: [], error: error.message }, { status: 200 });
  return NextResponse.json({ configured: true, scores: data ?? [] });
}

// POST /api/scores  → บันทึกคะแนน
export async function POST(req: Request) {
  const supabase = getClient();
  if (!supabase) return NextResponse.json({ configured: false });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  // sanitize + validate
  const name = String(body?.name ?? "ผู้เล่น").slice(0, 24).trim() || "ผู้เล่น";
  const lang = body?.lang === "en" ? "en" : "th";
  const level = ["easy", "medium", "hard"].includes(body?.level) ? body.level : "easy";
  const mode = ["practice", "time", "adventure"].includes(body?.mode) ? body.mode : "practice";
  const wpm = clampInt(body?.wpm, 0, 400);
  const accuracy = clampNum(body?.accuracy, 0, 1);
  const score = clampInt(body?.score, 0, 1_000_000);

  const { error } = await supabase
    .from("scores")
    .insert({ name, lang, level, mode, wpm, accuracy, score });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 200 });
  return NextResponse.json({ ok: true });
}

function clampInt(v: any, lo: number, hi: number): number {
  const n = Math.round(Number(v));
  if (!isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}
function clampNum(v: any, lo: number, hi: number): number {
  const n = Number(v);
  if (!isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}
