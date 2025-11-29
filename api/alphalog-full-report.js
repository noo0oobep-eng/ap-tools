// api/alphalog-full-report.js

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function handler(req, res) {
  // --- CORS headers (important) ---
  const allowedOrigin = "https://aptradingtools.com"; // use "*" temporarily if needed

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  // Only allow POST for actual work
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { summary, stats } = req.body || {};

    if (!summary || !stats) {
      res.status(400).json({ error: "Missing summary or stats" });
      return;
    }

    // Build prompt from the summary + stats we already compute in the browser
    const prompt = `
You are a trading performance coach. The user has uploaded a short trade log.
Here is a compact stats snapshot and bullet summary:

STATS:
${JSON.stringify(stats, null, 2)}

SUMMARY:
${summary}

Write a structured, plain-English diagnostic report with:
1. Overall assessment (1 short paragraph)
2. Key strengths (3–6 bullet points)
3. Key issues / risks (3–6 bullet points)
4. Concrete next-step plan (3–8 clear action bullets)
Keep language clear, specific, and practical. Do not repeat the raw numbers.
    `.trim();

    const aiResponse = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    // Extract text from the new Responses API shape
    let reportText = "";

    try {
      const firstOutput = aiResponse.output?.[0];
      const firstContent = firstOutput?.content?.[0];
      // openai-node 4.x: firstContent.text is an object with .value
      reportText =
        firstContent?.text?.value ||
        firstContent?.text ||
        JSON.stringify(aiResponse);
    } catch (e) {
      reportText = "Unable to read AI response payload.";
    }

    res.status(200).json({ report: reportText });
  } catch (err) {
    console.error("alphalog-full-report error", err);
    res.status(500).json({ error: "Server error" });
  }
};



