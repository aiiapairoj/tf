import type { Metadata, Viewport } from "next";
import { Prompt, Baloo_2 } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-prompt",
  display: "swap",
});

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://typefun-kids.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "พิมพ์สนุก · TypeFun Kids — เกมฝึกพิมพ์สัมผัสสำหรับเด็ก",
  description: "เกมฝึกพิมพ์ดีดสำหรับเด็ก รองรับภาษาไทยและอังกฤษ มีแอนิเมชันสนุก เก็บดาว สะสมคะแนน และแชร์ผลคะแนนใน Facebook / LINE ได้",
  applicationName: "TypeFun Kids",
  authors: [{ name: "AI Pairoj — BUGpairoj Group" }],
  openGraph: {
    title: "พิมพ์สนุก · TypeFun Kids",
    description: "เกมฝึกพิมพ์สัมผัสสำหรับเด็ก ไทย/อังกฤษ — เก็บดาว สะสมคะแนน แชร์อวดเพื่อนได้!",
    type: "website",
    locale: "th_TH",
    siteName: "TypeFun Kids",
  },
  twitter: {
    card: "summary_large_image",
    title: "พิมพ์สนุก · TypeFun Kids",
    description: "เกมฝึกพิมพ์สัมผัสสำหรับเด็ก ไทย/อังกฤษ — แชร์คะแนนอวดเพื่อนได้!",
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#FF6B35",
  width: "device-width",
  initialScale: 1,
};

// ตั้งธีมก่อน hydration กัน flash
const themeScript = `(function(){try{var t=localStorage.getItem('tf-theme')||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${prompt.variable} ${baloo.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
