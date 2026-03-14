"use client";

// components/LevelBar.js
// Shows current level, XP progress bar, and tier title

import { levelTitle, levelColor, xpInCurrentLevel, xpProgressPercent } from "@/lib/gamification";
import { Zap } from "lucide-react";

export default function LevelBar({ xp = 0, level = 1, compact = false }) {
  const { current, needed } = xpInCurrentLevel(xp);
  const percent             = xpProgressPercent(xp);
  const title               = levelTitle(level);
  const color               = levelColor(level);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 ${color}`}>
          Lv.{level}
        </div>
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden" style={{ minWidth: 60 }}>
          <div className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }} />
        </div>
        <span className="text-xs text-gray-400">{current}/{needed} XP</span>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-5 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-extrabold ${color}`}>Level {level}</span>
            <span className={`text-sm font-semibold px-2 py-0.5 rounded-full bg-white/5 ${color}`}>
              {title}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-0.5">
            {current} / {needed} XP to level {level + 1}
          </p>
        </div>
        <div className="flex items-center gap-1 text-yellow-400">
          <Zap className="w-4 h-4" />
          <span className="font-bold">{xp.toLocaleString()} total XP</span>
        </div>
      </div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${percent}%`,
            background: "linear-gradient(90deg, #2563eb, #7c3aed)",
          }}
        />
      </div>
      <p className="text-right text-xs text-gray-500 mt-1">{percent}%</p>
    </div>
  );
}
