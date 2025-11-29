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
    const { stats } = req.body;

    if (!stats) {
      return res.status(400).json({ error: "Missing stats in request body" });
    }

    // Build the prompt from the stats we already calculated in the browser
    const prompt = `
You are a professional trading performance coach.

You will receive summary stats from a single trading log.
Write a detailed, plain-English diagnostic report for the trader.

Focus on:
- Overall verdict (but remind them sample size may be small)
- Strengths to keep doing
- Problems / leaks to fix
- Concrete next-step action plan

Keep it practical, not fluffy.

Here are the stats (JSON):
${JSON.stringify(stats, null, 2)}
`;

    const aiResponse = await client.responses.create({
      model: "gpt-4.1-mini",           // <- use this model
      input: prompt,
      max_output_tokens: 900,          // enough for a detailed report
      temperature: 0.6,
    });

    // New Responses API: first output item, first content block, text
    const aiText =
      aiResponse.output[0].content[0].text ||
      "AI generated an empty response.";

    return res.status(200).json({ advice: aiText });
  } catch (err) {
    console.error("alphalog-full-report error:", err);

    // Try to surface useful info to the page
    const status = err.status || 500;

    // Special message for quota/billing issues
    if (err.code === "insufficient_quota") {
      return res.status(503).json({
        error:
          "AI quota / billing issue on the OpenAI account (insufficient_quota). The AP server is fine; please check OpenAI billing or wait a bit and try again.",
      });
    }

    return res.status(status).json({
      error:
        "AI server error: " +
        (err?.error?.message || err.message || "Unknown error"),
    });
  }
};


