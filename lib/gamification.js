// lib/gamification.js
// Central gamification engine: XP, levels, badges, streaks

// ── XP & Levels ──────────────────────────────────────────────────────────────

// XP needed to reach each level (exponential curve)
export function xpForLevel(level) {
  return Math.floor(100 * Math.pow(1.4, level - 1));
}

// Total XP needed from level 1 to reach this level
export function totalXpForLevel(level) {
  let total = 0;
  for (let i = 1; i < level; i++) total += xpForLevel(i);
  return total;
}

// Calculate level from total XP
export function levelFromXp(totalXp) {
  let level = 1;
  let accumulated = 0;
  while (accumulated + xpForLevel(level) <= totalXp) {
    accumulated += xpForLevel(level);
    level++;
  }
  return level;
}

// XP progress within the current level (0–100 percent)
export function xpProgressPercent(totalXp) {
  const level      = levelFromXp(totalXp);
  const baseXp     = totalXpForLevel(level);
  const neededXp   = xpForLevel(level);
  const currentXp  = totalXp - baseXp;
  return Math.floor((currentXp / neededXp) * 100);
}

// XP within current level and XP needed for next level
export function xpInCurrentLevel(totalXp) {
  const level    = levelFromXp(totalXp);
  const baseXp   = totalXpForLevel(level);
  const neededXp = xpForLevel(level);
  return { current: totalXp - baseXp, needed: neededXp };
}

// Level tier name
export function levelTitle(level) {
  if (level >= 50) return "Legend";
  if (level >= 30) return "Expert";
  if (level >= 20) return "Advanced";
  if (level >= 10) return "Intermediate";
  if (level >= 5)  return "Apprentice";
  return "Beginner";
}

// Level tier color
export function levelColor(level) {
  if (level >= 50) return "text-red-400";
  if (level >= 30) return "text-purple-400";
  if (level >= 20) return "text-blue-400";
  if (level >= 10) return "text-teal-400";
  if (level >= 5)  return "text-green-400";
  return "text-gray-400";
}

// ── XP Rewards ────────────────────────────────────────────────────────────────
export const XP_REWARDS = {
  LESSON_COMPLETE:      50,
  QUIZ_PERFECT:         30,
  DAILY_CHALLENGE:      75,
  STREAK_7_DAYS:       150,
  STREAK_30_DAYS:      500,
  BADGE_EARNED:        100,
  COMMENT_UPVOTE:        5,
};

// ── Badges ────────────────────────────────────────────────────────────────────
export const ALL_BADGES = [
  // Onboarding
  { id: "first_lesson",   emoji: "🎯", name: "First Step",      desc: "Complete your first lesson",           tier: "bronze"   },
  { id: "first_quiz",     emoji: "📝", name: "Quiz Taker",      desc: "Complete your first quiz",             tier: "bronze"   },
  { id: "hello_world",    emoji: "👋", name: "Hello World",     desc: "Run your first Python program",        tier: "bronze"   },

  // Streaks
  { id: "streak_3",       emoji: "🔥", name: "On Fire",         desc: "Maintain a 3-day streak",              tier: "bronze"   },
  { id: "streak_7",       emoji: "⚡", name: "Week Warrior",    desc: "Maintain a 7-day streak",              tier: "silver"   },
  { id: "streak_30",      emoji: "💫", name: "Monthly Master",  desc: "Maintain a 30-day streak",             tier: "gold"     },

  // Course completion
  { id: "python_done",    emoji: "🐍", name: "Pythonista",      desc: "Complete the Python track",            tier: "silver"   },
  { id: "linux_done",     emoji: "🐧", name: "Terminal Pro",    desc: "Complete the Linux track",             tier: "silver"   },
  { id: "c_done",         emoji: "⚙️", name: "C Programmer",    desc: "Complete the C track",                 tier: "gold"     },
  { id: "cpp_done",       emoji: "🔷", name: "C++ Developer",   desc: "Complete the C++ track",               tier: "gold"     },
  { id: "all_tracks",     emoji: "🏆", name: "All-Rounder",     desc: "Complete all four language tracks",    tier: "platinum" },

  // XP milestones
  { id: "xp_100",         emoji: "✨", name: "Getting Started", desc: "Earn 100 XP",                         tier: "bronze"   },
  { id: "xp_500",         emoji: "🌟", name: "Rising Star",     desc: "Earn 500 XP",                         tier: "silver"   },
  { id: "xp_1000",        emoji: "💎", name: "Diamond Coder",   desc: "Earn 1,000 XP",                       tier: "gold"     },
  { id: "xp_5000",        emoji: "👑", name: "Elite",           desc: "Earn 5,000 XP",                       tier: "platinum" },

  // Challenges
  { id: "first_challenge",emoji: "⚔️", name: "Challenger",      desc: "Complete your first daily challenge", tier: "bronze"   },
  { id: "challenge_7",    emoji: "🎖️", name: "Challenge Streak","desc": "Complete 7 daily challenges",       tier: "silver"   },

  // Social
  { id: "first_comment",  emoji: "💬", name: "Commenter",       desc: "Leave your first comment",            tier: "bronze"   },
];

export const TIER_COLORS = {
  bronze:   { bg: "bg-orange-500/10",  border: "border-orange-500/30",  text: "text-orange-400"  },
  silver:   { bg: "bg-gray-400/10",    border: "border-gray-400/30",    text: "text-gray-300"    },
  gold:     { bg: "bg-yellow-500/10",  border: "border-yellow-500/30",  text: "text-yellow-400"  },
  platinum: { bg: "bg-purple-500/10",  border: "border-purple-500/30",  text: "text-purple-400"  },
};

// Check which new badges a user has earned based on their profile
export function checkNewBadges(profile) {
  const earned    = new Set(profile.badges ?? []);
  const newBadges = [];

  function check(id) {
    if (!earned.has(id)) { newBadges.push(id); earned.add(id); }
  }

  // XP milestones
  const xp = profile.xp ?? 0;
  if (xp >=    100) check("xp_100");
  if (xp >=    500) check("xp_500");
  if (xp >=   1000) check("xp_1000");
  if (xp >=   5000) check("xp_5000");

  // Streak milestones
  const streak = profile.streak ?? 0;
  if (streak >=  3) check("streak_3");
  if (streak >=  7) check("streak_7");
  if (streak >= 30) check("streak_30");

  return { newBadges, allBadges: [...earned] };
}

// ── Streaks ───────────────────────────────────────────────────────────────────

// Returns today's date as YYYY-MM-DD string
export function todayString() {
  return new Date().toISOString().split("T")[0];
}

// Returns yesterday's date as YYYY-MM-DD string
export function yesterdayString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

// Calculate new streak given last active date and current streak
export function calculateStreak(lastActiveDate, currentStreak) {
  const today     = todayString();
  const yesterday = yesterdayString();

  if (lastActiveDate === today)     return currentStreak;          // already active today
  if (lastActiveDate === yesterday) return currentStreak + 1;      // continuing streak
  return 1;                                                         // streak reset
}
