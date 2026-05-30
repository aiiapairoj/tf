"use client";

import { useMemo } from "react";
import Mascot from "./Mascot";
import ShareButtons from "./ShareButtons";
import Leaderboard from "./Leaderboard";
import type { ScoreResult } from "@/lib/score";
import { encourage } from "@/lib/score";
import type { Lang } from "@/lib/keyboards";
import { LEVEL_META, type Level, type Mode } from "@/lib/words";

const CONFETTI_COLORS = ["#FF6B35", "#F7931E", "#FFD23F", "#FF5FA2", "#8B5CF6", "#38BDF8", "#34D399"];

export default function ResultModal({
  name,
  result,
  level,
  lang,
  isRecord,
  onReplay,
  onHome,
}: {
  name: string;
  result: ScoreResult;
  level: Level;
  lang: Lang;
  mode: Mode;
  isRecord: boolean;
  onReplay: () => void;
  onHome: () => void;
}) {
  const confetti = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        left: Math.random() * 100,
        bg: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        dur: 1.6 + Math.random() * 1.4,
        delay: Math.random() * 0.4,
        rot: Math.random() * 360,
      })),
    []
  );

  return (
    <div className="overlay">
      <div className="modal p-6 md:p-7">
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[28px]">
          {confetti.map((c, i) => (
            <span
              key={i}
              className="confetti"
              style={{
                left: `${c.left}%`,
                background: c.bg,
                animationDuration: `${c.dur}s`,
                animationDelay: `${c.delay}s`,
                transform: `rotate(${c.rot}deg)`,
              }}
            />
          ))}
        </div>

        <button onClick={onHome} className="absolute top-4 right-4 iconbtn w-9 h-9 rounded-full grid place-items-center text-lg z-10" title="ปิด">✕</button>

        <div className="text-center relative z-10">
          {isRecord && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ background: "rgba(255,210,63,.25)", color: "var(--primary-dark)" }}>
              🏅 ทำลายสถิติเดิม!
            </div>
          )}

          <div className="flex justify-center mb-1">
            <Mascot size={110} mood="cheer" hat={false} />
          </div>

          <h2 className="fun text-3xl font-extrabold" style={{ color: "var(--primary-dark)" }}>
            {encourage(result.stars, name)}
          </h2>
          <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
            {LEVEL_META[level].emoji} ระดับ{LEVEL_META[level].th} · {lang === "th" ? "ภาษาไทย" : "English"}
          </p>

          <div className="mb-4">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`star s${i + 1}${i >= result.stars ? " dim" : ""}`}>⭐</span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5 text-left">
            <StatCard icon="⚡" v={String(result.wpm)} label="คำ/นาที (WPM)" color="var(--primary)" />
            <StatCard icon="🎯" v={`${Math.round(result.accuracy * 100)}%`} label="ความแม่นยำ" color="var(--green)" />
            <StatCard icon="⭐" v={result.score.toLocaleString()} label="คะแนนรวม" color="#FF5FA2" />
            <StatCard icon="⏱️" v={fmt(result.seconds)} label="เวลาที่ใช้" color="#8B5CF6" />
          </div>

          <div className="mb-5">
            <ShareButtons name={name} result={result} />
          </div>

          <div className="mb-5 text-left rounded-2xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <Leaderboard lang={lang} level={level} highlightName={name} compact />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={onHome} className="btn-ghost rounded-2xl py-3 text-base">🏠 หน้าแรก</button>
            <button onClick={onReplay} className="btn-primary fun rounded-2xl py-3 text-base">🔄 เล่นอีกครั้ง</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, v, label, color }: { icon: string; v: string; label: string; color: string }) {
  return (
    <div className="glass-soft rounded-2xl p-3 flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="fun text-2xl font-extrabold" style={{ color }}>{v}</div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</div>
      </div>
    </div>
  );
}

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
