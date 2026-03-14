// app/api/ai/route.js
// Uses Groq API — free, fast, no region restrictions

import { NextResponse } from "next/server";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant"; // free model on Groq

const rateLimitMap = new Map();
function checkRateLimit(uid) {
  const now = Date.now();
  const entry = rateLimitMap.get(uid);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(uid, { count: 1, resetAt: now + 3600_000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

async function callGroq(systemPrompt, userMessage) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not set.\n\n" +
        "Get a free key at https://console.groq.com → API Keys\n" +
        "Then add GROQ_API_KEY=your_key to your .env.local file.",
    );
  }

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

// ── Handlers ──────────────────────────────────────────────────────────────────

async function handleExplain({ code, language, level = "beginner" }) {
  const system = `You are a patient and encouraging coding tutor on CodePath, an interactive learning platform.
Explain code clearly for a ${level} learner. Use simple language and helpful analogies.
Format your response with:
1. A one-sentence summary of what the code does
2. A line-by-line breakdown in plain English
3. One tip for improvement or a concept to explore next
Keep it under 300 words.`;

  const user = `Please explain this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``;
  return callGroq(system, user);
}

async function handleDebug({ code, language, error }) {
  const system = `You are an expert ${language} debugger on CodePath.
Help the learner find and fix their bug. Be encouraging.

Structure your response EXACTLY as:

🐛 **Bug Found:**
[One sentence describing the bug]

📍 **Location:**
[Which line has the issue]

💡 **Why This Happens:**
[Brief plain-English explanation]

✅ **Fixed Code:**
\`\`\`${language}
[The corrected code]
\`\`\`

🎓 **What to Remember:**
[One sentence learning takeaway]`;

  const user = `Here is my ${language} code:\n\`\`\`${language}\n${code}\n\`\`\`\n\n${
    error
      ? `Error message:\n${error}`
      : "The code does not produce the expected output."
  }\n\nPlease help me find and fix the bug.`;
  return callGroq(system, user);
}

async function handleLearningPath({ completedLessons, xp, level, weakAreas }) {
  const system = `You are a personalized learning advisor on CodePath, a coding education platform.
Suggest a focused weekly study plan based on learner data.
Format as:
- A 2-sentence assessment of where they are
- 3-5 specific topic recommendations in priority order
- One daily habit tip
- One motivational closing sentence
Keep it under 250 words. Be specific and actionable.`;

  const user = `Learner data:
- Total XP: ${xp}
- Level: ${level}
- Completed lessons: ${completedLessons.join(", ") || "none yet"}
- Topics they struggle with: ${weakAreas.join(", ") || "not identified yet"}

Please suggest a personalized learning path for this week.`;
  return callGroq(system, user);
}

async function handlePractice({
  topic,
  language,
  difficulty,
  completedProblems,
}) {
  const system = `You are a coding challenge creator on CodePath.
Generate a single well-defined practice problem. It must be solvable in under 20 lines.

Format EXACTLY as:

**Problem Title:** [short title]

**Description:**
[2-3 sentence problem statement]

**Example:**
Input: [example]
Output: [expected output]

**Starter Code:**
\`\`\`${language}
[starter code with helpful comments — do NOT solve it]
\`\`\`

**Hint:** [one sentence hint]`;

  const user = `Generate a ${difficulty} ${language} practice problem about: ${topic}
Problems already done: ${completedProblems.join(", ") || "none"}
Make it different from those.`;
  return callGroq(system, user);
}

// ── Main handler ──────────────────────────────────────────────────────────────

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
        { status: 429 },
      );
    }

    let result = "";
    switch (action) {
      case "explain":
        result = await handleExplain(params);
        break;
      case "debug":
        result = await handleDebug(params);
        break;
      case "learning_path":
        result = await handleLearningPath(params);
        break;
      case "practice":
        result = await handlePractice(params);
        break;
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 },
        );
    }

    return NextResponse.json({ result });
  } catch (err) {
    console.error("AI route error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
