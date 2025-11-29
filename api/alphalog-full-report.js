// api/alphalog-full-report.js
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  // --- CORS so the browser can call this from aptradingtools.com ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Pre-flight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { summary, stats } = req.body || {};

    // Both must be present (stats can be any non-null object)
    if (!summary || stats == null) {
      return res.status(400).json({ error: "Missing summary or stats" });
    }

    const userPrompt = `
You are a trading performance coach. The trader has uploaded a journal
and you have:

1) A preview text summary (what their on-screen stats look like).
2) A small JSON object with some extracted stats.

Use this information to write:

- 2–3 bullet points on strengths.
- 3–5 bullet points on key issues / risks.
- A numbered action plan for the next 20 trades.

Focus on position sizing, trade selection, risk management and behaviour.
Do not just repeat the numbers back; interpret what they mean for the trader.

Preview summary:
${summary}

Stats JSON:
${JSON.stringify(stats, null, 2)}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an experienced trading performance coach who writes concise, practical feedback.",
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const text =
      completion &&
      completion.choices &&
      completion.choices[0] &&
      completion.choices[0].message &&
      completion.choices[0].message.content
        ? completion.choices[0].message.content.trim()
        : "";

    if (!text) {
      return res
        .status(500)
        .json({ error: "AI response was empty", advice: "" });
    }

    return res.status(200).json({ advice: text });
  } catch (err) {
    console.error("alphalog-full-report error", err);
    const msg = err && err.message ? err.message : "Unknown error";
    return res.status(500).json({ error: "AI backend error: " + msg });
  }
};




