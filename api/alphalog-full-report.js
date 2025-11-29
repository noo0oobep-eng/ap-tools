// api/alphalog-full-report.js

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Try to parse any JSON body we get
    let parsed = {};
    try {
      parsed = req.body ? JSON.parse(req.body) : {};
    } catch (e) {
      parsed = {};
    }

    const summary = parsed.summary || "";
    const stats = parsed.stats || null;

    // Build a safe prompt even if summary / stats are missing
    const safeSummary =
      summary ||
      "No structured performance summary was provided. Give a general but concrete trading performance review and improvement plan.";

    const safeStatsText = stats
      ? JSON.stringify(stats, null, 2)
      : "No numeric stats object was provided; base your advice only on the textual summary.";

    const prompt = `
You are AP AlphaLog AI, a trading performance coach.

Write a clear, structured report for a retail trader based on the information below.
Focus on:
- strengths
- weaknesses / issues
- concrete next steps and risk management advice
- ideas for how to turn this into an ongoing playbook.

Textual summary:
${safeSummary}

Raw stats (if any):
${safeStatsText}

Write the report in plain English, using short sections and bullet points where helpful.
`;

    const aiResponse = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
      max_output_tokens: 900,
    });

    // Extract plain text from the response
    const text =
      aiResponse.output
        ?.flatMap((item) =>
          item.content?.map((c) => (c.text && c.text.value) || "").filter(Boolean)
        )
        .join("\n\n") || "No report text returned.";

    return res.status(200).json({ report: text });
  } catch (err) {
    console.error("alphalog-full-report error:", err);
    const msg =
      (err && err.error && err.error.message) ||
      err.message ||
      "Unknown server error";
    return res.status(500).json({ error: msg });
  }
};




