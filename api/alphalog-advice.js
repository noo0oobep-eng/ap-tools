// api/alphalog-advice.js
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  // CORS so the static alphalog page can call this
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
    const { summary } = req.body || {};

    if (!summary || typeof summary !== "string" || !summary.trim()) {
      return res.status(400).json({ error: "Missing summary" });
    }

    const prompt = `
You are a trading performance coach.

Here is a short stats/preview summary from the user's trade log:

${summary}

Write:
- A short paragraph describing what this trader is doing reasonably well.
- 3–5 bullet points on the main problems you see.
- 5–8 very concrete, practical next steps for the next 10–20 trades.

Be concise but specific. Do not repeat raw numbers; interpret them in plain English.
`;

    const aiResponse = await client.responses.create({
      model: "gpt-4.1-mini",   // <-- updated model
      input: prompt,
    });

    let text = "";

    // New Responses API shape
    if (aiResponse.output && Array.isArray(aiResponse.output)) {
      const first = aiResponse.output[0];
      if (
        first &&
        Array.isArray(first.content) &&
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
    if (!text && Array.isArray(aiResponse.content)) {
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
    console.error("alphalog-advice error", err);
    const msg = err && err.message ? err.message : "Unknown error";
    return res.status(500).json({ error: "AI backend error: " + msg });
  }
};


