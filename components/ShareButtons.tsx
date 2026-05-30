"use client";

import { useEffect, useState } from "react";
import type { ScoreResult } from "@/lib/score";
import { buildShareText, facebookUrl, lineUrl, siteUrl } from "@/lib/share";

export default function ShareButtons({ name, result }: { name: string; result: ScoreResult }) {
  const [copied, setCopied] = useState(false);
  const [canNative, setCanNative] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(siteUrl());
    setCanNative(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const text = buildShareText(name, result);

  function open(href: string) {
    window.open(href, "_blank", "noopener,noreferrer,width=620,height=640");
  }

  async function native() {
    try {
      await navigator.share({ title: "พิมพ์สนุก · TypeFun Kids", text, url });
    } catch {
      /* ผู้ใช้ยกเลิก */
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-2xl p-4" style={{ background: "var(--surface)", border: "1px dashed var(--border-strong)" }}>
      <div className="fun font-bold mb-3" style={{ color: "var(--text-primary)" }}>
        📣 อวดคะแนนให้เพื่อน ๆ!
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        <button
          onClick={() => open(facebookUrl(url, text))}
          className="share-btn share-fb rounded-xl py-3 flex items-center justify-center gap-2 font-bold text-sm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
          </svg>
          แชร์ Facebook
        </button>
        <button
          onClick={() => open(lineUrl(url, text))}
          className="share-btn share-line rounded-xl py-3 flex items-center justify-center gap-2 font-bold text-sm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 10.3C24 4.94 18.62.6 12 .6S0 4.94 0 10.3c0 4.8 4.26 8.82 10.02 9.58.39.08.92.26 1.05.59.12.3.08.77.04 1.07l-.17 1.02c-.05.3-.24 1.18 1.04.64s6.87-4.04 9.37-6.92C23.13 14.55 24 12.55 24 10.3zM7.7 13.4H5.31a.63.63 0 0 1-.63-.63V8a.63.63 0 1 1 1.26 0v4.14H7.7a.63.63 0 1 1 0 1.26zm2.48-.63a.63.63 0 1 1-1.26 0V8a.63.63 0 1 1 1.26 0zm5.65 0a.63.63 0 0 1-.43.6.65.65 0 0 1-.2.03.63.63 0 0 1-.51-.25l-2.45-3.33v2.95a.63.63 0 1 1-1.26 0V8a.63.63 0 0 1 .43-.6.63.63 0 0 1 .71.22l2.45 3.34V8a.63.63 0 1 1 1.26 0zm3.8-3.14a.63.63 0 1 1 0 1.26h-1.76v1.13h1.76a.63.63 0 1 1 0 1.26h-2.39a.63.63 0 0 1-.63-.63V8a.63.63 0 0 1 .63-.63h2.39a.63.63 0 1 1 0 1.26h-1.76v1.13z" />
          </svg>
          ส่งใน LINE
        </button>
      </div>

      {canNative && (
        <button
          onClick={native}
          className="share-btn w-full rounded-xl py-2.5 mb-2.5 flex items-center justify-center gap-2 font-semibold text-sm text-white"
          style={{ background: "var(--gradient-primary)" }}
        >
          📲 แชร์ไปแอปอื่น
        </button>
      )}

      <button
        onClick={copy}
        className="share-btn w-full rounded-xl py-2.5 flex items-center justify-center gap-2 font-semibold text-sm"
        style={{ background: "var(--surface-hover)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
      >
        🔗 {copied ? "คัดลอกแล้ว! ✓" : "คัดลอกลิงก์อวดคะแนน"}
      </button>
    </div>
  );
}
