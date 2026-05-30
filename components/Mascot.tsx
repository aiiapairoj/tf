"use client";

export type Mood = "idle" | "happy" | "cheer";

export default function Mascot({
  size = 200,
  mood = "idle",
  hat = true,
  className = "",
}: {
  size?: number;
  mood?: Mood;
  hat?: boolean;
  className?: string;
}) {
  const gid = `mbody-${size}-${mood}`;
  // ปากตาม mood
  const mouth =
    mood === "cheer"
      ? "M82 142 q18 22 36 0"
      : mood === "happy"
      ? "M84 143 q16 16 32 0"
      : "M86 144 q14 14 28 0";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={`mascot ${className}`}
      role="img"
      aria-label="น้องคีย์ มาสคอต"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FF8B5E" />
          <stop offset="1" stopColor="#FF6B35" />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="186" rx="52" ry="9" fill="rgba(0,0,0,.12)" />

      {hat && (
        <g>
          <rect x="78" y="22" width="44" height="36" rx="10" fill="#fff" stroke="#FF6B35" strokeWidth="3" />
          <text x="100" y="48" textAnchor="middle" fontFamily="var(--font-baloo)" fontSize="22" fontWeight="800" fill="#E85A24">
            A
          </text>
          <rect x="96" y="56" width="8" height="14" rx="3" fill="#E85A24" />
        </g>
      )}

      <rect x="40" y="66" width="120" height="112" rx="40" fill={`url(#${gid})`} />

      {/* arms — ยกขึ้นเมื่อ cheer */}
      {mood === "cheer" ? (
        <>
          <circle cx="34" cy="80" r="12" fill="#FF8B5E" />
          <circle cx="166" cy="80" r="12" fill="#FF8B5E" />
        </>
      ) : (
        <>
          <circle cx="38" cy="150" r="11" fill="#FF8B5E" />
          <circle cx="162" cy="150" r="11" fill="#FF8B5E" />
        </>
      )}

      <circle cx="64" cy="132" r="13" fill="#FF5FA2" opacity=".55" />
      <circle cx="136" cy="132" r="13" fill="#FF5FA2" opacity=".55" />

      <g className="blink">
        <ellipse cx="80" cy="112" rx="17" ry="19" fill="#fff" />
        <ellipse cx="120" cy="112" rx="17" ry="19" fill="#fff" />
        <circle cx="83" cy="115" r="8.5" fill="#2A2018" />
        <circle cx="123" cy="115" r="8.5" fill="#2A2018" />
        <circle cx="86" cy="111" r="3" fill="#fff" />
        <circle cx="126" cy="111" r="3" fill="#fff" />
      </g>

      <path d={mouth} stroke="#2A2018" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
