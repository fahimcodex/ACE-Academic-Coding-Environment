// lib/notifications.js
import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";

export async function createNotification(userId, type, message) {
  try {
    await addDoc(collection(db, "notifications"), {
      userId,
      type,
      message,
      read:      false,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to create notification:", err);
  }
}

export const notify = {
  xp:        (userId, amount, reason)          => createNotification(userId, "xp",        `+${amount} XP earned — ${reason}`),
  levelUp:   (userId, level)                   => createNotification(userId, "xp",        `🎉 You reached Level ${level}!`),
  badge:     (userId, badgeName)               => createNotification(userId, "badge",     `🏅 New badge earned: ${badgeName}`),
  streak:    (userId, days)                    => createNotification(userId, "streak",    `🔥 ${days}-day streak! Keep it up!`),
  follow:    (userId, followerName)            => createNotification(userId, "follow",    `${followerName} started following you`),
  comment:   (userId, commenterName, lesson)   => createNotification(userId, "comment",   `${commenterName} replied on "${lesson}"`),
  challenge: (userId, xp)                      => createNotification(userId, "challenge", `✅ Daily challenge complete! +${xp} XP`),
};
