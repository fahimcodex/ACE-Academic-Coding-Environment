"use client";

// components/BadgeGrid.js
// Displays a grid of all badges — earned ones glow, locked ones are dimmed

import { ALL_BADGES, TIER_COLORS } from "@/lib/gamification";

export default function BadgeGrid({ earnedBadges = [], compact = false }) {
  const earnedSet = new Set(earnedBadges);

  if (compact) {
    // Show only earned badges, up to 6
    const earned = ALL_BADGES.filter(b => earnedSet.has(b.id)).slice(0, 6);
    if (!earned.length) return (
      <p className="text-sm text-gray-500">No badges earned yet. Complete lessons to earn your first!</p>
    );
    return (
      <div className="flex flex-wrap gap-2">
        {earned.map(badge => {
          const tier = TIER_COLORS[badge.tier];
          return (
            <div key={badge.id} title={`${badge.name} — ${badge.desc}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm ${tier.bg} ${tier.border} ${tier.text}`}>
              <span>{badge.emoji}</span>
              <span className="font-medium text-xs">{badge.name}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {ALL_BADGES.map(badge => {
        const isEarned = earnedSet.has(badge.id);
        const tier     = TIER_COLORS[badge.tier];
        return (
          <div key={badge.id}
            className={`rounded-xl p-4 border transition-all ${
              isEarned
                ? `${tier.bg} ${tier.border} shadow-lg`
                : "bg-white/[0.02] border-white/5 opacity-40"
            }`}>
            <div className="text-2xl mb-2">{badge.emoji}</div>
            <p className={`text-sm font-semibold ${isEarned ? tier.text : "text-gray-400"}`}>
              {badge.name}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{badge.desc}</p>
            {isEarned && (
              <div className={`mt-2 text-xs font-semibold uppercase tracking-wide ${tier.text}`}>
                {badge.tier}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
