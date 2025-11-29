// api/alphalog-full-report.js

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Only allow your site to call this
const ALLOWED_ORIGIN = "https://aptradingtools.com";

module.exports = async function handler(req, res) {
  // --- CORS headers (needed for browser -> Vercel) ---
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");

  // Preflight request
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  // Only POST is allowed
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const payload = req.body || {};

    // Be tolerant about field names
    const summaryText =
      payload.summaryText || payload.summary || payload.previewSummary || "";
    const stats =
      payload.stats || payload.basicStats || payload.metrics || null;
    const advicePreview = payload.advicePreview || payload.previewAdvice || "";

    if (!summaryText) {
      res.status(400).json({ error: "Missing summary text" });
      return;
    }

    const prompt = buildPrompt(summaryText, stats, advicePreview);

    const aiResponse = await client.responses.create({
      model: "gpt-5-mini", // from your models screen
      input: prompt,
    });

    // Extract plain text from the Responses API
    let fullText = "";
    if (aiResponse.output && aiResponse.output[0] && aiResponse.output[0].content) {
      fullText = aiResponse.output[0].content
        .map((part) => (part.text && part.text.value) || "")
        .join("")
        .trim();
    }

    if (!fullText) {
      fullText = "No advice text was generated.";
    }

    res.status(200).json({ fullReport: fullText });
  } catch (err) {
    console.error("alphalog-full-report error:", err);
    const statusCode = err.status || 500;
    res.status(statusCode).json({
      error:
        "AI backend error: " +
        (err.message || "Unexpected error (check Vercel logs for details)."),
    });
  }
};

function buildPrompt(summaryText, stats, advicePreview) {
  return `
You are an experienced trading performance coach.

The user has uploaded a trading log from their MT5 EA.
Below is the preview summary and basic stats from their tool.

SHORT SUMMARY FROM TOOL:
${summaryText}

RAW STATS (JSON, may be null):
${stats ? JSON.stringify(stats, null, 2) : "none provided"}

BASIC ADVICE PREVIEW THAT THE USER ALREADY SAW:
${advicePreview || "none"}

TASK:
Write a detailed but concise performance report (around 600–900 words) with the following sections:

1. Headline verdict (one short sentence).
2. Strengths (bullet list).
3. Main issues (bullet list).
4. Action plan for the next 20–30 trades (numbered steps, very concrete).
5. Risk and psychology notes (short paragraph).

Use friendly but direct language.
Do NOT repeat large tables or raw numbers; just refer to key values where it helps.
Do NOT mention that you are an AI model.
`;
}





