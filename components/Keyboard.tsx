"use client";

import { LAYOUTS, HOME_KEYS, keyForChar, type Lang } from "@/lib/keyboards";

export default function Keyboard({
  lang,
  nextChar,
  hitChar,
}: {
  lang: Lang;
  nextChar?: string;
  hitChar?: string | null;
}) {
  const nextKey = keyForChar(nextChar, lang);
  const hitKey = keyForChar(hitChar ?? undefined, lang);

  return (
    <div className="kb">
      {LAYOUTS[lang].map((row, ri) => (
        <div className="kb-row" key={ri}>
          {row.map((k) => {
            const isHome = HOME_KEYS[lang].includes(k);
            const isNext = nextKey === k;
            const isHit = !isNext && hitKey === k;
            return (
              <div
                key={k}
                className={`key${isHome ? " home" : ""}${isNext ? " next" : ""}${isHit ? " hit" : ""}`}
              >
                <span className="face" />
                {k}
              </div>
            );
          })}
        </div>
      ))}
      <div className="kb-row">
        <div className={`key wide${nextKey === " " ? " next" : ""}${nextKey !== " " && hitKey === " " ? " hit" : ""}`}>
          <span className="face" />
          เว้นวรรค
        </div>
      </div>
    </div>
  );
}
