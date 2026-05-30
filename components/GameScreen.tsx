"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Mascot from "./Mascot";
import ThemeToggle from "./ThemeToggle";
import Keyboard from "./Keyboard";
import ResultModal from "./ResultModal";
import type { GameConfig } from "./StartScreen";
import { buildQueue, TIME_LIMIT_SEC, LEVEL_META, MODE_META } from "@/lib/words";
import { computeScore, type ScoreResult } from "@/lib/score";
import { submitScore } from "@/lib/board";

const POPS = ["+10", "+15", "เยี่ยม!", "คอมโบ!", "+20", "สุดยอด!", "+10"];
const POP_COLORS = ["var(--primary)", "var(--pink)", "var(--purple)", "var(--green)", "var(--accent)"];

interface Pop {
  id: number;
  left: number;
  top: number;
  text: string;
  color: string;
  size: number;
}

export default function GameScreen({ config, onHome }: { config: GameConfig; onHome: () => void }) {
  const { lang, name, level, mode } = config;

  const [queue, setQueue] = useState<string[]>(() => buildQueue(lang, level, mode));
  const [promptIdx, setPromptIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [combo, setCombo] = useState(0);
  const [tick, setTick] = useState(0); // ขับเคลื่อน live timer
  const [hitChar, setHitChar] = useState<string | null>(null);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [isRecord, setIsRecord] = useState(false);
  const [pops, setPops] = useState<Pop[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const sentenceRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const startRef = useRef<number | null>(null);
  const correctRef = useRef(0);
  const wrongRef = useRef(0);
  const maxComboRef = useRef(0);
  const comboRef = useRef(0);
  const prevTypedRef = useRef("");
  const finishedRef = useRef(false);
  const popId = useRef(0);

  const prompt = queue[promptIdx] ?? "";
  const targetChars = useMemo(() => Array.from(prompt), [prompt]);
  const typedChars = useMemo(() => Array.from(typed), [typed]);
  const typedCount = typedChars.length;
  const nextChar = typedCount < targetChars.length ? targetChars[typedCount] : undefined;

  // ===== live stats =====
  const elapsedMs = startRef.current && !result ? Date.now() - startRef.current : 0;
  const live = computeScore({ correctChars: correctRef.current, mistakes: wrongRef.current, elapsedMs: Math.max(elapsedMs, 1), level });
  const remainingSec = mode === "time" && startRef.current ? Math.max(0, TIME_LIMIT_SEC - Math.floor(elapsedMs / 1000)) : 0;

  // ring + progress
  const promptProgress = targetChars.length ? typedCount / targetChars.length : 0;
  const ringPct =
    mode === "time"
      ? startRef.current ? remainingSec / TIME_LIMIT_SEC : 1
      : Math.min(1, (promptIdx + promptProgress) / queue.length);

  // ===== timer loop =====
  useEffect(() => {
    if (result) return;
    const id = setInterval(() => setTick((t) => t + 1), 150);
    return () => clearInterval(id);
  }, [result]);

  // จบเกมเมื่อหมดเวลา (โหมดแข่งเวลา)
  useEffect(() => {
    if (mode === "time" && startRef.current && !result && remainingSec <= 0) {
      endRound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  // โฟกัส input อัตโนมัติ
  useEffect(() => {
    if (!result) inputRef.current?.focus();
  }, [result, promptIdx]);

  const spawnPop = useCallback((index: number) => {
    requestAnimationFrame(() => {
      const el = charRefs.current.get(index);
      const box = sentenceRef.current;
      if (!el || !box) return;
      const id = popId.current++;
      const p: Pop = {
        id,
        left: el.offsetLeft,
        top: el.offsetTop - 6,
        text: POPS[index % POPS.length],
        color: POP_COLORS[index % POP_COLORS.length],
        size: 14 + Math.random() * 8,
      };
      setPops((cur) => [...cur, p]);
      setTimeout(() => setPops((cur) => cur.filter((x) => x.id !== id)), 1100);
    });
  }, []);

  function advance() {
    const next = promptIdx + 1;
    if (next >= queue.length) {
      endRound();
      return;
    }
    prevTypedRef.current = "";
    if (inputRef.current) inputRef.current.value = "";
    setTyped("");
    setPromptIdx(next);
  }

  function endRound() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const ms = startRef.current ? Date.now() - startRef.current : 0;
    const r = computeScore({ correctChars: correctRef.current, mistakes: wrongRef.current, elapsedMs: Math.max(ms, 1), level });

    // best ในเครื่อง → ตรวจสถิติใหม่
    const key = `tf-best-${lang}-${level}-${mode}`;
    let best = 0;
    try {
      best = Number(localStorage.getItem(key) || "0");
    } catch {}
    const record = r.score > best;
    if (record) {
      try {
        localStorage.setItem(key, String(r.score));
      } catch {}
    }
    setIsRecord(record);
    setResult(r);

    // ส่งขึ้น leaderboard (ไม่บล็อก)
    submitScore({ name, lang, level, mode, wpm: r.wpm, accuracy: r.accuracy, score: r.score });
  }

  function handleInput(e: React.FormEvent<HTMLInputElement>) {
    if (result) return;
    let v = e.currentTarget.value;
    // cap ตามความยาวเป้าหมาย (นับเป็น code point)
    let arr = Array.from(v);
    if (arr.length > targetChars.length) {
      arr = arr.slice(0, targetChars.length);
      v = arr.join("");
      e.currentTarget.value = v;
    }

    const prev = Array.from(prevTypedRef.current);
    // เริ่มจับเวลาเมื่อพิมพ์ตัวแรก
    if (!startRef.current && arr.length > 0) startRef.current = Date.now();

    // ตรวจตัวที่เพิ่งเพิ่ม (กรณีพิมพ์ทีละตัว)
    if (arr.length === prev.length + 1) {
      const p = arr.length - 1;
      const c = arr[p];
      if (c === targetChars[p]) {
        correctRef.current++;
        comboRef.current++;
        maxComboRef.current = Math.max(maxComboRef.current, comboRef.current);
        setCombo(comboRef.current);
        if (p % 2 === 0) spawnPop(p);
      } else {
        wrongRef.current++;
        comboRef.current = 0;
        setCombo(0);
      }
      setHitChar(c);
      setTimeout(() => setHitChar(null), 130);
    }

    prevTypedRef.current = v;
    setTyped(v);

    // เสร็จ prompt นี้แล้ว
    if (arr.length === targetChars.length && targetChars.length > 0) {
      setTimeout(advance, 120);
    }
  }

  function replay() {
    finishedRef.current = false;
    startRef.current = null;
    correctRef.current = 0;
    wrongRef.current = 0;
    maxComboRef.current = 0;
    comboRef.current = 0;
    prevTypedRef.current = "";
    if (inputRef.current) inputRef.current.value = "";
    setQueue(buildQueue(lang, level, mode));
    setPromptIdx(0);
    setTyped("");
    setCombo(0);
    setIsRecord(false);
    setResult(null);
    setPops([]);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  const counterLabel =
    mode === "time" ? `คำที่ ${promptIdx + 1}` : `ด่าน ${promptIdx + 1}/${queue.length}`;

  return (
    <>
      {/* ===== HUD ===== */}
      <header className="glass sticky top-0 z-40 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-3 flex-wrap justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onHome} className="iconbtn w-10 h-10 rounded-xl grid place-items-center text-lg" title="กลับหน้าแรก">←</button>
            <div className="flex items-center gap-2">
              <span className="text-xl">{LEVEL_META[level].emoji}</span>
              <div>
                <div className="fun font-extrabold text-sm leading-none">ระดับ{LEVEL_META[level].th}</div>
                <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {MODE_META[mode].emoji} {MODE_META[mode].th} · {counterLabel}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="stat glass-soft">
              <div className="ringbox">
                <svg width="48" height="48">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="var(--border)" strokeWidth="5" />
                  <circle cx="24" cy="24" r="20" fill="none" stroke="var(--primary)" strokeWidth="5" strokeLinecap="round" strokeDasharray={125.6} strokeDashoffset={125.6 * (1 - ringPct)} />
                </svg>
                <div className="absolute inset-0 grid place-items-center fun font-extrabold text-sm">
                  {mode === "time" ? `0:${String(remainingSec).padStart(2, "0")}` : fmtClock(elapsedMs)}
                </div>
              </div>
            </div>
            <div className="stat glass-soft">
              <span className="text-lg">⚡</span>
              <div><div className="v text-xl" style={{ color: "var(--primary)" }}>{live.wpm}</div><div className="text-[10px]" style={{ color: "var(--text-muted)" }}>คำ/นาที</div></div>
            </div>
            <div className="stat glass-soft">
              <span className="text-lg">🎯</span>
              <div><div className="v text-xl" style={{ color: "var(--green)" }}>{Math.round(live.accuracy * 100)}%</div><div className="text-[10px]" style={{ color: "var(--text-muted)" }}>แม่นยำ</div></div>
            </div>
            <div className="stat" style={{ background: "var(--gradient-primary)", color: "#fff" }}>
              <span className="text-lg">⭐</span>
              <div><div className="v text-xl">{live.score.toLocaleString()}</div><div className="text-[10px] opacity-90">คะแนน</div></div>
            </div>
            <ThemeToggle className="!w-10 !h-10 !rounded-xl !text-lg" />
          </div>
        </div>
      </header>

      {/* ===== PLAY AREA ===== */}
      <main className="max-w-5xl mx-auto px-4 py-6 relative">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="fun font-extrabold text-lg" style={{ color: "var(--primary)" }}>🔥 คอมโบ x{combo}</span>
            <div className="w-40 h-3 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
              <div className="combofill" style={{ width: `${Math.min(100, (combo % 10) * 10 + (combo > 0 ? 10 : 0))}%` }} />
            </div>
          </div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
            สูงสุด x{maxComboRef.current}
          </span>
        </div>

        <section className="glass rounded-[26px] p-6 md:p-8 relative overflow-hidden cursor-text" onClick={() => inputRef.current?.focus()}>
          <div className="absolute -top-2 right-4 hidden md:block">
            <Mascot size={92} mood={combo >= 5 ? "happy" : "idle"} hat={false} />
            <div className="text-center fun text-xs font-bold" style={{ color: "var(--primary-dark)" }}>สู้ ๆ นะ!</div>
          </div>

          <div className="text-sm font-semibold mb-2" style={{ color: "var(--text-muted)" }}>พิมพ์ตามนี้เลย 👇</div>

          <div ref={sentenceRef} className="sentence text-3xl md:text-4xl font-bold mb-2 min-h-[60px] relative">
            {targetChars.map((c, i) => {
              const cls =
                i < typedCount ? (typedChars[i] === c ? "done" : "err") : i === typedCount ? "cur" : "pending";
              return (
                <span
                  key={i}
                  ref={(el) => {
                    if (el) charRefs.current.set(i, el);
                  }}
                  className={`ch ${cls}`}
                >
                  {c === " " ? "\u00A0" : c}
                </span>
              );
            })}
            {pops.map((p) => (
              <div key={p.id} className="pop" style={{ left: p.left, top: p.top, color: p.color, fontSize: p.size }}>
                {p.text}
              </div>
            ))}
          </div>

          <div className="w-full h-2.5 rounded-full overflow-hidden mb-1" style={{ background: "var(--border)" }}>
            <div className="h-full rounded-full" style={{ width: `${Math.round(promptProgress * 100)}%`, background: "var(--gradient-primary)", transition: "width .15s" }} />
          </div>
          <div className="text-xs text-right" style={{ color: "var(--text-muted)" }}>{Math.round(promptProgress * 100)}%</div>

          {/* hidden capture input */}
          <input
            ref={inputRef}
            onInput={handleInput}
            maxLength={targetChars.length || 50}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            inputMode="text"
            aria-label="ช่องพิมพ์"
            className="absolute opacity-0 w-px h-px -z-10"
          />
        </section>

        <section className="glass rounded-[26px] p-4 md:p-6 mt-5">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>⌨️ แป้นพิมพ์ — ปุ่มถัดไปจะเรืองแสง</div>
            <div className="flex items-center gap-3 text-[11px]" style={{ color: "var(--text-muted)" }}>
              <span className="flex items-center gap-1"><i className="fdot" style={{ background: "var(--primary)" }} />นิ้วถัดไป</span>
              <span className="flex items-center gap-1"><i className="fdot" style={{ background: "var(--accent-warm)" }} />เพิ่งกด</span>
              <span className="flex items-center gap-1"><i className="fdot" style={{ background: "var(--border-strong)" }} />แป้นเหย้า •</span>
            </div>
          </div>
          <Keyboard lang={lang} nextChar={nextChar} hitChar={hitChar} />
        </section>

        <div className="text-center mt-5">
          <button onClick={endRound} className="btn-ghost rounded-2xl px-6 py-2.5 text-sm">⏹️ จบเกมตอนนี้</button>
        </div>
      </main>

      <footer className="text-center pb-6 text-sm" style={{ color: "var(--text-muted)" }}>
        © BUGpairoj Group • พัฒนาโดย AI Pairoj
      </footer>

      {result && (
        <ResultModal
          name={name}
          result={result}
          level={level}
          lang={lang}
          mode={mode}
          isRecord={isRecord}
          onReplay={replay}
          onHome={onHome}
        />
      )}
    </>
  );
}

function fmtClock(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
