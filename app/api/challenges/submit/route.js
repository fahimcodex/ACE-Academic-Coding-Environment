import { NextResponse } from "next/server";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  writeBatch,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  calculateStreak,
  checkNewBadges,
  levelFromXp,
  todayString,
  XP_REWARDS,
} from "@/lib/gamification";

function decodeTokenPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Invalid token format");
    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
    return payload;
  } catch {
    return null;
  }
}

const LANGUAGE_IDS = {
  python: 71,
  c: 50,
  cpp: 54,
};

const JUDGE0_URL =
  "https://ce.judge0.com/submissions?base64_encoded=false&wait=true";

function normalizeLanguage(language) {
  const raw = String(language ?? "python").toLowerCase();
  if (raw === "c++") return "cpp";
  if (raw === "python" || raw === "c" || raw === "cpp") return raw;
  return "python";
}

function normalizeOutput(text) {
  return String(text ?? "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

async function runWithJudge0(code, lang, stdin = "") {
  const languageId = LANGUAGE_IDS[lang];
  if (!languageId) {
    return { output: "", error: `Unsupported language: ${lang}` };
  }

  const response = await fetch(JUDGE0_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source_code: code,
      language_id: languageId,
      stdin,
      cpu_time_limit: 5,
      memory_limit: 128000,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    return {
      output: "",
      error: `Judge0 API error ${response.status}: ${text}`,
    };
  }

  const result = await response.json();

  if (result.compile_output) {
    return {
      output: "",
      error: `Compilation Error:\n${result.compile_output}`,
    };
  }

  if (result.stderr) {
    return {
      output: result.stdout ?? "",
      error: `Runtime Error:\n${result.stderr}`,
    };
  }

  if (result.status?.id === 5) {
    return { output: "", error: "Time Limit Exceeded (5 seconds)" };
  }

  return {
    output: result.stdout ?? "",
    error: "",
  };
}

function getBearerToken(request) {
  const authHeader = request.headers.get("authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) return "";
  return authHeader.slice("Bearer ".length).trim();
}

async function verifyRequestUser(request) {
  const token = getBearerToken(request);
  if (!token) {
    const error = new Error("Missing auth token");
    error.status = 401;
    throw error;
  }

  // Decode JWT payload to extract uid
  console.log("Verifying token via JWT payload decoding");
  const payload = decodeTokenPayload(token);
  console.log("Decoded token payload:", payload);

  if (payload) {
    const uid = payload.uid || payload.sub;
    if (uid) {
      console.log("Using uid from token payload:", uid);
      return uid;
    }
  }

  const error = new Error("Invalid or expired auth token");
  error.status = 401;
  throw error;
}

export async function POST(request) {
  try {
    const uid = await verifyRequestUser(request);
    const body = await request.json();
    const code = String(body?.code ?? "");
    const challengeId = todayString();

    if (body?.challengeId && String(body.challengeId) !== challengeId) {
      return NextResponse.json(
        { error: "Only today's challenge can be submitted." },
        { status: 400 },
      );
    }

    if (!code.trim()) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const completionId = `${uid}_${challengeId}`;
    const challengeRef = doc(db, "challenges", challengeId);
    const completionRef = doc(db, "challengeCompletions", completionId);

    const challengeSnap = await getDoc(challengeRef);
    if (!challengeSnap.exists()) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 },
      );
    }

    const challenge = challengeSnap.data() ?? {};
    const language = normalizeLanguage(challenge.language);
    const expectedOutput = normalizeOutput(challenge.expectedOutput);

    if (
      !expectedOutput ||
      expectedOutput === "MANUAL_REVIEW_REQUIRED" ||
      expectedOutput === "FIXME" ||
      expectedOutput === "MANUAL_REVIEW_REQUIRED\n" ||
      expectedOutput === normalizeOutput("MANUAL_REVIEW_REQUIRED")
    ) {
      // Just mark it as completed to avoid blocking the user
      const userRef = doc(db, "users", uid);
      const xpEventRef = doc(db, "xpEvents", `${uid}_${Date.now()}`);
      const batch = writeBatch(db);

      const userSnap = await getDoc(userRef);
      const profile = userSnap.exists() ? userSnap.data() : {};
      const oldXp = profile.xp ?? 0;
      const baseXp = Number(challenge.xpReward ?? XP_REWARDS.DAILY_CHALLENGE);
      const tentativeXp = oldXp + baseXp;
      const newStreak = calculateStreak(
        profile.lastActiveDate ?? "",
        profile.streak ?? 0,
      );
      const badgeCalc = checkNewBadges({
        ...profile,
        xp: tentativeXp,
        streak: newStreak,
      });
      const finalXp =
        tentativeXp + badgeCalc.newBadges.length * XP_REWARDS.BADGE_EARNED;
      const finalLevel = levelFromXp(finalXp);

      batch.set(completionRef, {
        userId: uid,
        challengeId,
        date: todayString(),
        completedAt: new Date().toISOString(),
        score: baseXp,
        language,
        code,
        autoGraded: false,
      });

      batch.update(userRef, {
        xp: finalXp,
        level: finalLevel,
        streak: newStreak,
        lastActiveDate: todayString(),
        badges: badgeCalc.allBadges,
      });

      badgeCalc.newBadges.forEach((badgeId, i) => {
        batch.set(doc(db, "badges", `${uid}_${badgeId}_${Date.now()}_${i}`), {
          userId: uid,
          badgeId: badgeId,
          earnedAt: new Date().toISOString(),
        });
      });

      await batch.commit();

      return NextResponse.json({
        correct: true,
        message: "Solution submitted for manual review!",
        output: "✅ Saved! (Expected output not configured for auto-grading)",
      });
    }

    const exec = await runWithJudge0(
      code,
      language,
      String(challenge.stdin ?? ""),
    );

    if (exec.error) {
      return NextResponse.json({
        correct: false,
        message: exec.error,
        output: exec.output,
      });
    }

    const actualOutput = normalizeOutput(exec.output);
    const isCorrect = actualOutput === expectedOutput;

    if (!isCorrect) {
      return NextResponse.json({
        correct: false,
        message: "Incorrect output. Please try again.",
        output: actualOutput,
      });
    }

    const userRef = doc(db, "users", uid);
    const xpEventRef = doc(db, "xpEvents", `${uid}_${Date.now()}`);

    // Use writeBatch for atomic updates
    const batch = writeBatch(db);

    // Check if already completed (need to get first)
    const existingCompletion = await getDoc(completionRef);
    if (existingCompletion.exists()) {
      return NextResponse.json({
        correct: true,
        alreadyCompleted: true,
        message: "Challenge already completed.",
      });
    }

    // Get user profile
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      throw new Error("User profile not found");
    }

    const profile = userSnap.data() ?? {};
    const oldXp = profile.xp ?? 0;
    const oldLevel = profile.level ?? 1;
    const baseXp = Number(challenge.xpReward ?? XP_REWARDS.DAILY_CHALLENGE);

    const tentativeXp = oldXp + baseXp;
    const newStreak = calculateStreak(
      profile.lastActiveDate ?? "",
      profile.streak ?? 0,
    );
    const badgeCalc = checkNewBadges({
      ...profile,
      xp: tentativeXp,
      streak: newStreak,
    });
    const badgeBonus = badgeCalc.newBadges.length * XP_REWARDS.BADGE_EARNED;
    const finalXp = tentativeXp + badgeBonus;
    const finalLevel = levelFromXp(finalXp);

    // Add batch operations
    batch.update(userRef, {
      xp: finalXp,
      level: finalLevel,
      streak: newStreak,
      badges: badgeCalc.allBadges,
      lastActiveDate: todayString(),
      lastActive: new Date(),
    });

    batch.set(completionRef, {
      userId: uid,
      challengeId,
      language,
      isCorrect: true,
      xpEarned: baseXp,
      completedAt: new Date(),
    });

    batch.set(xpEventRef, {
      userId: uid,
      amount: baseXp,
      reason: "daily_challenge",
      timestamp: new Date(),
    });

    // Commit batch
    await batch.commit();

    const reward = {
      xp: baseXp,
      newXp: finalXp,
      newLevel: finalLevel,
      leveledUp: finalLevel > oldLevel,
      newBadges: badgeCalc.newBadges,
      newStreak,
    };

    return NextResponse.json({
      correct: true,
      message: "Correct output! Challenge completed.",
      reward,
    });
  } catch (err) {
    console.error("Challenge submit error:", err);
    const status = Number(err?.status) || 500;
    const message = err.message || "Submission failed";
    console.error("Full error details:", { message, stack: err.stack });
    return NextResponse.json({ error: message }, { status });
  }
}
