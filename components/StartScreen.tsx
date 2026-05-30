"use client";

import { useState } from "react";
import Mascot from "./Mascot";
import ThemeToggle from "./ThemeToggle";
import Leaderboard from "./Leaderboard";
import type { Lang } from "@/lib/keyboards";
import { LEVEL_META, MODE_META, type Level, type Mode } from "@/lib/words";

export interface GameConfig {
  lang: Lang;
  name: string;
  level: Level;
  mode: Mode;
}

export default function StartScreen({ onStart }: { onStart: (c: GameConfig) => void }) {
  const [lang, setLang] = useState<Lang>("th");
  const [name, setName] = useState("น้องมุก");
  const [level, setLevel] = useState<Level>("easy");
  const [mode, setMode] = useState<Mode>("practice");
  const [showBoard, setShowBoard] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  function start() {
    onStart({ lang, name: name.trim() || "ผู้เล่น", level, mode });
  }

  return (
    <>
      {/* background decor */}
      <div className="blob" style={{ width: 220, height: 220, background: "#FFD23F", top: "8%", left: "6%" }} />
      <div className="blob" style={{ width: 180, height: 180, background: "#FF5FA2", bottom: "10%", left: "4%" }} />
      <div className="blob" style={{ width: 200, height: 200, background: "#38BDF8", top: "14%", right: "7%" }} />
      <div className="blob" style={{ width: 160, height: 160, background: "#34D399", bottom: "8%", right: "10%" }} />
      <div className="floaty keycap" style={{ top: "18%", left: "12%", width: 54, height: 54, fontSize: 24, animationDuration: "7s" }}>ก</div>
      <div className="floaty keycap" style={{ top: "62%", left: "8%", width: 48, height: 48, fontSize: 22, animationDuration: "9s", animationDelay: "1s" }}>A</div>
      <div className="floaty keycap" style={{ top: "24%", right: "14%", width: 50, height: 50, fontSize: 23, animationDuration: "8s", animationDelay: ".5s" }}>ม</div>
      <div className="floaty keycap" style={{ top: "70%", right: "10%", width: 56, height: 56, fontSize: 25, animationDuration: "10s", animationDelay: "1.5s" }}>K</div>
      <div className="floaty" style={{ top: "42%", left: "5%", fontSize: 38, animationDuration: "6s", color: "#FFD23F" }}>★</div>
      <div className="floaty" style={{ top: "30%", right: "6%", fontSize: 30, animationDuration: "7.5s", color: "#FF5FA2" }}>✦</div>

      <header className="relative z-10 max-w-6xl mx-auto px-5 pt-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl grid place-items-center text-white text-xl shadow-lg" style={{ background: "var(--gradient-primary)" }}>⌨️</div>
          <span className="fun text-lg font-extrabold" style={{ color: "var(--primary-dark)" }}>พิมพ์สนุก</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-5 pb-10 pt-3 grid lg:grid-cols-[1fr_1.15fr] gap-7 items-center">
        {/* LEFT */}
        <section className="text-center lg:text-left pop-in">
          <div className="inline-flex items-center gap-2 glass-soft px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ color: "var(--primary-dark)" }}>
            🎮 เกมฝึกพิมพ์สัมผัส · ไทย + อังกฤษ
          </div>
          <div className="flex justify-center lg:justify-start mb-3">
            <Mascot size={200} mood="idle" />
          </div>
          <h1 className="fun text-5xl md:text-6xl font-extrabold leading-tight">
            <span style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>พิมพ์สนุก</span>
          </h1>
          <p className="fun text-xl font-bold mt-1" style={{ color: "var(--text-secondary)" }}>TypeFun Kids 🚀</p>
          <p className="mt-3 text-base md:text-lg max-w-md mx-auto lg:mx-0" style={{ color: "var(--text-muted)" }}>
            ฝึกพิมพ์ดีดแบบสนุก ๆ กับน้องคีย์! เก็บดาว สะสมคะแนน แล้วอวดเพื่อนได้เลย ✨
          </p>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start mt-5">
            <Stat v="2" c="ภาษา" color="var(--primary)" />
            <Stat v="120+" c="ด่านฝึก" color="#FF5FA2" />
            <Stat v="⭐⭐⭐" c="สะสมดาว" color="#8B5CF6" />
          </div>
        </section>

        {/* RIGHT */}
        <section className="glass rounded-[26px] p-6 md:p-7 pop-in delay2">
          <h2 className="fun text-2xl font-extrabold mb-1">เริ่มเล่นกันเลย!</h2>
          <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>เลือกการตั้งค่าแล้วกดปุ่มเริ่มเล่น</p>

          <label className="block text-sm font-semibold mb-2">เลือกภาษา</label>
          <div className={`segwrap mb-5${lang === "en" ? " seg-en" : ""}`}>
            <div className="segpill" />
            <div className={`seg${lang === "th" ? " on" : ""}`} onClick={() => setLang("th")}>🇹🇭 ภาษาไทย</div>
            <div className={`seg${lang === "en" ? " on" : ""}`} onClick={() => setLang("en")}>🇬🇧 English</div>
          </div>

          <label className="block text-sm font-semibold mb-2">ชื่อนักพิมพ์</label>
          <div className="relative mb-5">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🧒</span>
            <input
              type="text"
              value={name}
              maxLength={20}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl pl-12 pr-4 py-3 outline-none font-medium"
              style={{ background: "var(--surface-hover)", border: "2px solid var(--border)", color: "var(--text-primary)" }}
              placeholder="พิมพ์ชื่อของหนู..."
            />
          </div>

          <label className="block text-sm font-semibold mb-2">เลือกระดับความยาก</label>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {(Object.keys(LEVEL_META) as Level[]).map((lv) => (
              <div key={lv} className={`pick rounded-2xl p-3 text-center relative${level === lv ? " active" : ""}`} onClick={() => setLevel(lv)}>
                <div className="tick absolute top-1.5 right-1.5 w-5 h-5 rounded-full grid place-items-center text-white text-[11px]" style={{ background: "var(--primary)" }}>✓</div>
                <div className="text-3xl mb-1">{LEVEL_META[lv].emoji}</div>
                <div className="fun font-bold text-sm">{LEVEL_META[lv].th}</div>
                <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{LEVEL_META[lv].desc}</div>
              </div>
            ))}
          </div>

          <label className="block text-sm font-semibold mb-2">โหมดการเล่น</label>
          <div className="flex flex-wrap gap-2 mb-6">
            {(Object.keys(MODE_META) as Mode[]).map((m) => (
              <div key={m} className={`chip rounded-full px-4 py-2 text-sm font-semibold${mode === m ? " on" : ""}`} onClick={() => setMode(m)}>
                {MODE_META[m].emoji} {MODE_META[m].th}
              </div>
            ))}
          </div>

          <button onClick={start} className="btn-play fun w-full rounded-2xl py-4 text-xl font-extrabold flex items-center justify-center gap-2 relative overflow-hidden">
            <span className="shine absolute inset-0" />
            <span className="relative">เริ่มเล่น!</span>
            <span className="relative text-2xl">▶</span>
          </button>

          <div className="flex items-center justify-center gap-5 mt-4 text-sm">
            <button onClick={() => setShowBoard(true)} className="flex items-center gap-1.5 font-medium" style={{ color: "var(--text-secondary)" }}>🏆 อันดับคะแนน</button>
            <span style={{ color: "var(--border-strong)" }}>•</span>
            <button onClick={() => setShowHelp(true)} className="flex items-center gap-1.5 font-medium" style={{ color: "var(--text-secondary)" }}>❓ วิธีเล่น</button>
          </div>
        </section>
      </main>

      {showBoard && (
        <Overlay onClose={() => setShowBoard(false)}>
          <Leaderboard lang={lang} level={level} />
        </Overlay>
      )}
      {showHelp && (
        <Overlay onClose={() => setShowHelp(false)}>
          <h3 className="fun text-xl font-extrabold mb-3">วิธีเล่น 🎯</h3>
          <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <li>1) วางนิ้วบนแป้นเหย้า (ปุ่มที่มีขีดสีส้ม)</li>
            <li>2) พิมพ์ตามตัวอักษรที่เห็น — ปุ่มถัดไปจะ<b>เรืองแสง</b>ช่วยบอก</li>
            <li>3) พิมพ์ถูกตัวอักษรจะเป็น<span style={{ color: "var(--green)" }}>สีเขียว</span> พิมพ์ผิดเป็น<span style={{ color: "#EF4444" }}>สีแดง</span> (กด Backspace แก้ได้)</li>
            <li>4) ยิ่งเร็วและแม่นยำ ยิ่งได้คะแนนและดาวเยอะ ⭐</li>
            <li>5) จบเกมแล้วแชร์คะแนนอวดเพื่อนใน Facebook / LINE ได้เลย!</li>
          </ul>
        </Overlay>
      )}

      <footer className="relative z-10 text-center pb-6 text-sm" style={{ color: "var(--text-muted)" }}>
        © BUGpairoj Group • พัฒนาโดย AI Pairoj
      </footer>
    </>
  );
}

function Stat({ v, c, color }: { v: string; c: string; color: string }) {
  return (
    <div className="glass-soft rounded-2xl px-4 py-3 text-center">
      <div className="fun text-2xl font-extrabold" style={{ color }}>{v}</div>
      <div className="text-xs" style={{ color: "var(--text-muted)" }}>{c}</div>
    </div>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 iconbtn w-9 h-9 rounded-full grid place-items-center text-lg z-10" title="ปิด">✕</button>
        <div className="relative z-0 mt-2">{children}</div>
      </div>
    </div>
  );
}
