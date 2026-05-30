"use client";

import { useState } from "react";
import StartScreen, { type GameConfig } from "./StartScreen";
import GameScreen from "./GameScreen";

export default function GameApp() {
  const [config, setConfig] = useState<GameConfig | null>(null);

  if (config) {
    return <GameScreen key={JSON.stringify(config)} config={config} onHome={() => setConfig(null)} />;
  }
  return <StartScreen onStart={setConfig} />;
}
