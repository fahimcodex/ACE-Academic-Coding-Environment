"use client";

// components/StreakWidget.js

import { Flame, Shield } from "lucide-react";

export default function StreakWidget({ streak = 0, compact = false }) {
  const milestones = [3, 7, 14, 30, 60, 100];
  const next = milestones.find(m => m > streak) ?? 100;
  const progress = Math.min((streak / next) * 100, 100);

  const flameColor =
    streak >= 30 ? "text-red-400"    :
    streak >= 7  ? "text-orange-400" :
    streak >= 3  ? "text-yellow-400" :
                   "text-gray-500";

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <Flame className={`w-4 h-4 ${flameColor}`} />
        <span className={`font-bold text-sm ${flameColor}`}>{streak}</span>
        <span className="text-xs text-gray-400">day streak</span>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-5 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className={`w-6 h-6 ${flameColor}`} />
          <span className="font-bold text-lg">Daily Streak</span>
        </div>
        <div className={`text-3xl font-extrabold ${flameColor}`}>{streak}</div>
      </div>

      <p className="text-sm text-gray-400 mb-3">
        {streak === 0
          ? "Complete a lesson today to start your streak!"
          : streak >= 30
            ? "🔥 You're on fire! Keep it going!"
            : `Next milestone: ${next} days`}
      </p>

      {/* Progress to next milestone */}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-1">
        <div className="h-full bg-orange-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }} />
      </div>
      <p className="text-xs text-gray-500">{streak} / {next} days to next milestone</p>

      {/* Milestone dots */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {milestones.map(m => (
          <div key={m}
            className={`text-xs px-2 py-0.5 rounded-full border ${
              streak >= m
                ? "border-orange-500/50 text-orange-400 bg-orange-500/10"
                : "border-white/10 text-gray-500"
            }`}>
            {m}d
          </div>
        ))}
      </div>

      {/* Freeze info */}
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
        <Shield className="w-3.5 h-3.5 text-blue-400" />
        <span>1 streak freeze available per week</span>
      </div>
    </div>
  );
}
