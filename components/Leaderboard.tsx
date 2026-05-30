"use client";

import { useEffect, useState } from "react";
import { fetchScores, type ScoreRow } from "@/lib/board";
import type { Lang } from "@/lib/keyboards";
import type { Level } from "@/lib/words";

export default function Leaderboard({
  lang,
  level,
  highlightName,
  compact = false,
}: {
  lang?: Lang;
  level?: Level;
  highlightName?: string;
  compact?: boolean;
}) {
  const [rows, setRows] = useState<ScoreRow[]>([]);
  const [remote, setRemote] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchScores(lang, level).then((r) => {
      if (!alive) return;
      setRows(r.rows);
      setRemote(r.remote);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [lang, level]);

  const medal = ["🥇", "🥈", "🥉"];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="fun font-bold flex items-center gap-1.5" style={{ color: "var(--text-primary)" }}>
          🏆 อันดับคะแนน
        </div>
        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          {remote ? "🌍 ทั่วโลก" : "💾 ในเครื่องนี้"}
        </span>
      </div>

      {loading ? (
        <div className="text-sm py-6 text-center" style={{ color: "var(--text-muted)" }}>
          กำลังโหลด...
        </div>
      ) : rows.length === 0 ? (
        <div className="text-sm py-6 text-center" style={{ color: "var(--text-muted)" }}>
          ยังไม่มีคะแนน — มาเป็นคนแรกกันเลย! ✨
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {rows.slice(0, compact ? 5 : 20).map((r, i) => {
            const me = highlightName && r.name === highlightName;
            return (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl px-3 py-2"
                style={{
                  background: me ? "var(--surface-hover)" : "var(--surface)",
                  border: me ? "2px solid var(--primary)" : "1px solid var(--border)",
                }}
              >
                <span className="w-7 text-center font-bold" style={{ color: "var(--text-secondary)" }}>
                  {medal[i] ?? i + 1}
                </span>
                <span className="flex-1 font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                  {r.name}
                </span>
                <span className="text-xs hidden sm:block" style={{ color: "var(--text-muted)" }}>
                  ⚡{r.wpm} · 🎯{Math.round(r.accuracy * 100)}%
                </span>
                <span className="fun font-extrabold" style={{ color: "var(--primary)" }}>
                  {r.score.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
