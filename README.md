# 🎮 พิมพ์สนุก · TypeFun Kids

เกมฝึกพิมพ์สัมผัสสำหรับเด็ก รองรับ **ภาษาไทย (เกษมณี) + อังกฤษ (QWERTY)**
สร้างด้วย **Next.js 14 + TypeScript + Tailwind** · พร้อม deploy บน **Vercel** ทันที

> พัฒนาโดย **AI Pairoj — BUGpairoj Group**

---

## ✨ ฟีเจอร์

- ⌨️ **Typing engine จริง** — จับการพิมพ์ทีละตัวอักษร (ไทย/อังกฤษ), ไฮไลต์ตัวถูก/ผิด, แก้ด้วย Backspace ได้
- 🎹 **แป้นพิมพ์ on-screen** — ปุ่มถัดไปเรืองแสง + จุดแป้นเหย้า ช่วยสอนวางนิ้ว
- 📊 **คะแนนสด** — WPM, ความแม่นยำ, คะแนนรวม, คอมโบ
- ⭐ **ระบบดาว 3 ดวง** + 3 โหมด (ฝึกพิมพ์ / แข่งเวลา / ผจญภัย) + 3 ระดับ
- 🏆 **Leaderboard** — ใช้ Supabase (ทั่วโลก) หรือ fallback เป็น localStorage อัตโนมัติถ้ายังไม่ตั้งค่า
- 📣 **แชร์คะแนน** Facebook / LINE / Web Share API + คัดลอกลิงก์
- 🌗 **โหมดสว่าง/มืด** จำค่าไว้, 📱 mobile-first, ♿ รองรับ `prefers-reduced-motion`

---

## 🚀 Deploy บน Vercel (3 ขั้น)

### 1) push ขึ้น GitHub
```bash
git init && git add . && git commit -m "TypeFun Kids"
git branch -M main
git remote add origin https://github.com/<you>/typefun-kids.git
git push -u origin main
```

### 2) import เข้า Vercel
- ไปที่ [vercel.com/new](https://vercel.com/new) → เลือก repo นี้
- Framework จะถูกตรวจเป็น **Next.js** อัตโนมัติ → กด **Deploy**
- เท่านี้ก็เล่นได้แล้ว! (leaderboard จะใช้ localStorage ไปก่อน)

### 3) (ทางเลือก) เปิด Leaderboard ทั่วโลกด้วย Supabase
1. สร้างโปรเจกต์ที่ [supabase.com](https://supabase.com)
2. ไปที่ **SQL Editor** → รันไฟล์ [`supabase/schema.sql`](supabase/schema.sql)
3. ที่ Vercel → **Settings → Environment Variables** ใส่:

| Key | ค่า |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | anon public key |
| `NEXT_PUBLIC_SITE_URL` | `https://<your-app>.vercel.app` |

4. **Redeploy** → leaderboard เปลี่ยนเป็น 🌍 "ทั่วโลก" ทันที

---

## 💻 รันบนเครื่อง (Local)

```bash
npm install
cp .env.local.example .env.local   # (ทางเลือก) ใส่คีย์ Supabase
npm run dev                         # http://localhost:3000
```

```bash
npm run build && npm start          # ทดสอบโหมด production
```

---

## 🗂️ โครงสร้างโปรเจกต์

```
app/
  layout.tsx          ฟอนต์ Prompt/Baloo, metadata, OG, theme script
  page.tsx            render <GameApp/>
  globals.css         ธีม Glassmorphism Orange + คอมโพเนนต์ทั้งหมด
  api/scores/route.ts API leaderboard (Supabase, fallback ในตัว)
components/
  GameApp.tsx         state machine start ↔ play
  StartScreen.tsx     หน้าแรก (ภาษา/ชื่อ/ระดับ/โหมด)
  GameScreen.tsx      ⭐ typing engine + HUD
  Keyboard.tsx        แป้นพิมพ์ไทย/อังกฤษ + ไฮไลต์
  ResultModal.tsx     ผลคะแนน + ดาว + แชร์ + leaderboard
  Leaderboard.tsx     ตารางอันดับ
  ShareButtons.tsx    ปุ่มแชร์ FB/LINE/Native
  Mascot.tsx          มาสคอต "น้องคีย์" (SVG)
  ThemeToggle.tsx     สลับธีม
lib/
  keyboards.ts  words.ts  score.ts  share.ts  board.ts
supabase/schema.sql   ตาราง scores + RLS
```

---

## ⚙️ ปรับแต่งง่าย ๆ

- **เพิ่มคำ/ประโยค** → `lib/words.ts` (แยกตามภาษา/ระดับ)
- **เกณฑ์คะแนน & ดาว** → `lib/score.ts`
- **สี/ธีม** → ตัวแปร CSS ใน `app/globals.css` (`:root`, `[data-theme="dark"]`)
- **เวลาโหมดแข่ง / จำนวนโจทย์** → `TIME_LIMIT_SEC`, `ROUND_PROMPTS` ใน `lib/words.ts`

---

© BUGpairoj Group • พัฒนาโดย AI Pairoj
