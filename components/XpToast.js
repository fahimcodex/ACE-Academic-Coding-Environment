"use client";

// components/XpToast.js
// Animated toast notification for XP gains, level-ups, and badge awards

import { useEffect, useState } from "react";
import { Zap, TrendingUp, Award } from "lucide-react";

export default function XpToast({ event, onDone }) {
  const [visible, setVisible] = useState(false);
  const [displayXp, setDisplayXp] = useState(0);

  useEffect(() => {
    if (!event) return;
    setVisible(true);

    if (event.xp) {
      let current = 0;
      const target = event.xp;
      const step = Math.max(1, Math.floor(target / 20));

      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          setDisplayXp(target);
          clearInterval(interval);
        } else {
          setDisplayXp(current);
        }
      }, 50);

      const t = setTimeout(() => {
        setVisible(false);
        setTimeout(onDone, 300);
        clearInterval(interval);
      }, 3000);

      return () => {
        clearTimeout(t);
        clearInterval(interval);
      };
    } else {
      const t = setTimeout(() => {
        setVisible(false);
        setTimeout(onDone, 300);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [event, onDone]);

  if (!event) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex flex-col gap-2 min-w-[220px]">
        {/* XP gain */}
        {event.xp > 0 && (
          <div className="flex items-center gap-3 glass border border-yellow-500/30 rounded-xl px-4 py-3 shadow-xl">
            <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-bold text-yellow-400">
                +{displayXp} XP
              </p>
              <p className="text-xs text-gray-400">{event.reason}</p>
            </div>
          </div>
        )}

        {/* Level up */}
        {event.leveledUp && (
          <div className="flex items-center gap-3 glass border border-blue-500/30 rounded-xl px-4 py-3 shadow-xl">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-400">Level Up! 🎉</p>
              <p className="text-xs text-gray-400">
                You reached level {event.newLevel}
              </p>
            </div>
          </div>
        )}

        {/* New badges */}
        {event.newBadges?.map((badgeId) => (
          <div
            key={badgeId}
            className="flex items-center gap-3 glass border border-purple-500/30 rounded-xl px-4 py-3 shadow-xl"
          >
            <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-purple-400">Badge Earned!</p>
              <p className="text-xs text-gray-400">
                {badgeId.replace(/_/g, " ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
