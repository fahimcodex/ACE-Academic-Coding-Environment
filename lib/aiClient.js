// lib/aiClient.js
// Client-side helper — calls /api/ai (server-side)
// The Gemini API key never touches the browser

async function callAI(action, params, uid) {
  const res = await fetch("/api/ai", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ action, uid, ...params }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
  return data.result;
}

export const explainCode      = (code, language, level, uid)                           => callAI("explain",       { code, language, level }, uid);
export const debugCode        = (code, language, error, uid)                           => callAI("debug",         { code, language, error }, uid);
export const getLearningPath  = (completedLessons, xp, level, weakAreas, uid)         => callAI("learning_path", { completedLessons, xp, level, weakAreas }, uid);
export const generatePractice = (topic, language, difficulty, completedProblems, uid) => callAI("practice",      { topic, language, difficulty, completedProblems }, uid);
