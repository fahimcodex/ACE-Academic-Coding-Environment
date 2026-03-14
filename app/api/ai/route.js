// app/api/ai/route.js
// Server-side AI route using Google Gemini (free, no card needed)
// Add GEMINI_API_KEY to your .env.local

import { NextResponse } from "next/server";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// Rate limit: 20 requests per user per hour (in-memory)
const rateLimitMap = new Map();

function checkRateLimit(uid) {
  const now   = Date.now();
  const entry = rateLimitMap.get(uid);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(uid, { count: 1, resetAt: now + 3600_000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set.\n\n" +
      "Get a free key at https://aistudio.google.com → Get API Key\n" +
      "Then add GEMINI_API_KEY=your_key to your .env.local file."
    );
  }

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 1024,
        temperature:     0.7,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

// ── Handlers ──────────────────────────────────────────────────────────────────

async function handleExplain({ code, language, level = "beginner" }) {
  const prompt = `You are a patient and encouraging coding tutor on CodePath, an interactive learning platform.
Explain the following ${language} code clearly for a ${level} learner.

Format your response with:
1. A one-sentence summary of what the code does
2. A line-by-line breakdown using plain English
3. One tip for improvement or a related concept to explore next

Keep it under 300 words. Be friendly and encouraging.

Code to explain:
\`\`\`${language}
${code}
\`\`\``;
  return callGemini(prompt);
}

async function handleDebug({ code, language, error }) {
  const prompt = `You are an expert ${language} debugger on CodePath, an interactive learning platform.
Help the learner understand and fix their bug. Be encouraging — bugs are how we learn!

Structure your response EXACTLY as follows:

🐛 **Bug Found:**
[One clear sentence describing the bug]

📍 **Location:**
[Which line or part of the code has the issue]

💡 **Why This Happens:**
[Brief explanation of the root cause in plain English]

✅ **Fixed Code:**
\`\`\`${language}
[The corrected code]
\`\`\`

🎓 **What to Remember:**
[One sentence learning takeaway]

Here is the code:
\`\`\`${language}
${code}
\`\`\`

${error ? `Error message or problem description:\n${error}` : "The code does not produce the expected output."}`;
  return callGemini(prompt);
}

async function handleLearningPath({ completedLessons, xp, level, weakAreas }) {
  const prompt = `You are a personalized learning advisor on CodePath, a coding education platform.
Based on the learner's data below, suggest a focused weekly study plan.

Learner data:
- Total XP: ${xp}
- Current Level: ${level}
- Lessons completed: ${completedLessons.join(", ") || "none yet"}
- Topics they find difficult: ${weakAreas.join(", ") || "not identified yet"}

Format your response as:
- A 2-sentence assessment of where they currently are
- 3-5 specific lesson or topic recommendations in priority order
- One daily habit tip to build consistency
- One short motivational closing sentence

Keep it under 250 words. Be specific and actionable.`;
  return callGemini(prompt);
}

async function handlePractice({ topic, language, difficulty, completedProblems }) {
  const prompt = `You are a coding challenge creator on CodePath, a coding education platform.
Generate a single, well-defined ${difficulty} ${language} practice problem about: ${topic}

Problems this learner has already completed: ${completedProblems.join(", ") || "none yet"}
Make this problem fresh and different from those.

Format your response EXACTLY as:

**Problem Title:** [short descriptive title]

**Description:**
[2-3 sentence clear problem statement]

**Example:**
Input: [example input]
Output: [expected output]

**Starter Code:**
\`\`\`${language}
[starter code with comments guiding the learner — do not solve it]
\`\`\`

**Hint:** [one sentence hint that doesn't give away the solution]`;
  return callGemini(prompt);
}

// ── Main route handler ────────────────────────────────────────────────────────

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, uid, ...params } = body;

    if (!uid) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!checkRateLimit(uid)) {
      return NextResponse.json(
        { error: "Rate limit reached. You can make 20 AI requests per hour." },
        { status: 429 }
      );
    }

    let result = "";
    switch (action) {
      case "explain":       result = await handleExplain(params);       break;
      case "debug":         result = await handleDebug(params);         break;
      case "learning_path": result = await handleLearningPath(params);  break;
      case "practice":      result = await handlePractice(params);      break;
      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    return NextResponse.json({ result });

  } catch (err) {
    console.error("AI route error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
