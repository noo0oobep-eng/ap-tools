// api/alphalog-full-report.js
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  // --- CORS headers so the browser can call this from aptradingtools.com ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { summary, stats } = req.body || {};

    if (!summary || !stats) {
      return res.status(400).json({ error: "Missing summary or stats" });
    }

    // Build a single prompt string from the preview summary + stats
    const prompt = `
You are a trading performance coach. The user has uploaded a trade log.
You get two inputs:

1) Preview summary text:
${summary}

2) JSON stats:
${JSON.stringify(stats, null, 2)}

Write:
- 2–3 bullet points on strengths.
- 3–5 bullet points on key issues.
- A concrete action plan for the next 20 trades (numbered steps).

Keep it concise but specific. Do not repeat raw numbers back; interpret them.
`;

    const aiResponse = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    // Extract text from the Responses API result.
    let text = "";

    // Prefer the structured output field if present
    if (aiResponse.output && Array.isArray(aiResponse.output)) {
      const first = aiResponse.output[0];
      if (
        first &&
        first.content &&
        first.content[0] &&
        first.content[0].type === "output_text"
      ) {
        text = first.content[0].text;
      }
    }

    // Fallbacks for any other shapes
    if (!text && aiResponse.output_text) {
      text = aiResponse.output_text;
    }
    if (!text && aiResponse.content && Array.isArray(aiResponse.content)) {
      const c0 = aiResponse.content[0];
      if (c0 && c0.text) text = c0.text;
    }

    if (!text || !text.trim()) {
      return res
        .status(500)
        .json({ error: "AI response was empty", advice: "" });
    }

    return res.status(200).json({ advice: text.trim() });
  } catch (err) {
    console.error("alphalog-full-report error", err);
    const msg = err && err.message ? err.message : "Unknown error";
    return res.status(500).json({ error: "AI backend error: " + msg });
  }
};



