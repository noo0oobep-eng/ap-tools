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

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { summary, stats } = req.body || {};

    if (!summary && !stats) {
      return res
        .status(400)
        .json({ error: "Missing summary and stats in request body." });
    }

    if (!summary || typeof summary !== "string" || !summary.trim()) {
      return res.status(400).json({ error: "Missing summary text." });
    }

    if (!stats || typeof stats !== "object") {
      return res.status(400).json({ error: "Missing stats object." });
    }

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

    let text = "";

    // Primary extraction path (Responses API typical shape)
    try {
      if (aiResponse.output && Array.isArray(aiResponse.output)) {
        const first = aiResponse.output[0];
        if (first && first.content && Array.isArray(first.content)) {
          const firstContent = first.content[0];
          if (firstContent && typeof firstContent.text === "string") {
            text = firstContent.text;
          }
        }
      }
    } catch (e) {
      console.error("Error extracting text from aiResponse.output", e);
    }

    // Possible alternate shapes
    if (!text && aiResponse.output_text) {
      text = aiResponse.output_text;
    }
    if (!text && aiResponse.content && Array.isArray(aiResponse.content)) {
      const c0 = aiResponse.content[0];
      if (c0 && typeof c0.text === "string") {
        text = c0.text;
      }
    }

    // Last resort: dump the whole response JSON so we never return empty
    if (!text || !text.trim()) {
      text = "Raw model response:\n\n" + JSON.stringify(aiResponse, null, 2);
    }

    return res.status(200).json({ advice: text.trim() });
  } catch (err) {
    console.error("alphalog-full-report error", err);
    const msg = err && err.message ? err.message : "Unknown error";
    return res.status(500).json({ error: "AI backend error: " + msg });
  }
};








