// lib/xpService.js
// Handles all XP, badge, and streak updates in Firestore

import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import {
  levelFromXp, checkNewBadges, calculateStreak,
  todayString, XP_REWARDS,
} from "./gamification";

/**
 * Award XP to a user and handle all side effects:
 * level-ups, badge checks, streak updates.
 *
 * @param {string} userId
 * @param {number} xpAmount
 * @param {string} reason   - e.g. "lesson_complete", "quiz_perfect"
 * @returns {object} { newXp, newLevel, leveledUp, newBadges, newStreak }
 */
export async function awardXP(userId, xpAmount, reason = "") {
  const userRef  = doc(db, "users", userId);
  const snap     = await getDoc(userRef);
  if (!snap.exists()) return null;

  const profile  = snap.data();
  const oldXp    = profile.xp    ?? 0;
  const oldLevel = profile.level ?? 1;

  const newXp    = oldXp + xpAmount;
  const newLevel = levelFromXp(newXp);
  const leveledUp = newLevel > oldLevel;

  // ── Streak update ──────────────────────────────────────────────────────────
  const lastActive  = profile.lastActiveDate ?? "";
  const newStreak   = calculateStreak(lastActive, profile.streak ?? 0);
  const today       = todayString();

  // ── Badge check ────────────────────────────────────────────────────────────
  const updatedProfile  = { ...profile, xp: newXp, streak: newStreak };
  const { newBadges, allBadges } = checkNewBadges(updatedProfile);

  // XP bonus for new badges
  const badgeXpBonus = newBadges.length * XP_REWARDS.BADGE_EARNED;
  const finalXp      = newXp + badgeXpBonus;
  const finalLevel   = levelFromXp(finalXp);

  // ── Write to Firestore ─────────────────────────────────────────────────────
  await updateDoc(userRef, {
    xp:             finalXp,
    level:          finalLevel,
    streak:         newStreak,
    badges:         allBadges,
    lastActiveDate: today,
    lastActive:     serverTimestamp(),
  });

  // Log XP event
  await setDoc(doc(db, "xpEvents", `${userId}_${Date.now()}`), {
    userId,
    amount:    xpAmount,
    reason,
    timestamp: serverTimestamp(),
  });

  return {
    newXp:     finalXp,
    newLevel:  finalLevel,
    leveledUp,
    newBadges,
    newStreak,
  };
}

/**
 * Mark a lesson as complete and award XP.
 */
export async function completeLesson(userId, lessonId, courseId, xpReward) {
  // Prevent double-awarding
  const progressRef = doc(db, "progress", `${userId}_${lessonId}`);
  const existing    = await getDoc(progressRef);
  if (existing.exists()) return null;

  // Record completion
  await setDoc(progressRef, {
    userId, lessonId, courseId,
    xpEarned:    xpReward,
    completedAt: serverTimestamp(),
  });

  return awardXP(userId, xpReward, "lesson_complete");
}


export async function markLessonComplete(userId, lang, currentLessonOrder) {
  // We store progress in: users/{userId}/progress/{lang}
  const progressRef = doc(db, "users", userId, "progress", lang);
  const progressSnap = await getDoc(progressRef);
  
  let highestCompleted = 0;
  if (progressSnap.exists()) {
    highestCompleted = progressSnap.data().highestCompletedOrder || 0;
  }

  // Only update if this is a new, higher lesson
  if (currentLessonOrder > highestCompleted) {
    await setDoc(progressRef, {
      highestCompletedOrder: currentLessonOrder
    }, { merge: true });
  }
}

export async function updateLessonProgress(userId, lang, currentLessonOrder) {
  // Store course progress at: users/{userId}/courseProgress/{lang}
  const progressRef = doc(db, "users", userId, "courseProgress", lang);
  const snap = await getDoc(progressRef);
  
  let highestCompleted = 0;
  if (snap.exists()) {
    highestCompleted = snap.data().highestCompletedOrder || 0;
  }

  // Only update the database if this lesson is higher than their previous best
  if (currentLessonOrder > highestCompleted) {
    await setDoc(progressRef, {
      highestCompletedOrder: currentLessonOrder
    }, { merge: true });
  }
}