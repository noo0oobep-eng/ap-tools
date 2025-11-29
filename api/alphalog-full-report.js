// api/alphalog-full-report.js

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function handler(req, res) {
  // Only allow POST from the browser
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body || {};

    // These are the fields the frontend may send.
    // If you ever add more, we still include them in the blob below.
    const {
      summary,          // preview summary block
      advicePreview,    // bullet list of local advice
      symbolTableText,  // plain-text version of symbol table
      sessionTableText, // plain-text version of session table
      dowTableText,     // plain-text version of day-of-week table
    } = body;

    // Require *something* to work with
    const hasAnyStats =
      (summary && summary.trim()) ||
      (advicePreview && advicePreview.trim()) ||
      (symbolTableText && symbolTableText.trim()) ||
      (sessionTableText && sessionTableText.trim()) ||
      (dowTableText && dowTableText.trim());

    if (!hasAnyStats) {
      return res
        .status(400)
        .json({ error: "Missing summary or stats from the browser." });
    }

    // Build a single text blob containing everything we know.
    let statsBlob = "";
    if (summary) {
      statsBlob += "=== PREVIEW SUMMARY ===\n" + summary.trim() + "\n\n";
    }
    if (advicePreview) {
      statsBlob += "=== LOCAL ADVICE PREVIEW ===\n" +
        advicePreview.trim() +
        "\n\n";
    }
    if (symbolTableText) {
      statsBlob += "=== SYMBOL BREAKDOWN ===\n" +
        symbolTableText.trim() +
        "\n\n";
    }
    if (sessionTableText) {
      statsBlob += "=== SESSION BREAKDOWN ===\n" +
        sessionTableText.trim() +
        "\n\n";
    }
    if (dowTableText) {
      statsBlob += "=== DAY OF WEEK BREAKDOWN ===\n" +
        dowTableText.trim() +
        "\n\n";
    }

    // As a fallback, include the raw JSON so the model always has context.
    statsBlob += "=== RAW JSON FROM FRONTEND ===\n" +
      JSON.stringify(body, null, 2);

    const systemPrompt = `
You are "AP AlphaLog AI", a trading performance analyst.

The user has uploaded a trading journal. They already see a basic local
preview (winrate, R-multiple, per-symbol/session breakdowns, etc.).
Using ONLY the stats provided, produce a full diagnostic report that includes:

1) A clear high-level summary (1–2 paragraphs)
2) Strengths and weaknesses
3) Risk and R-multiple quality discussion
4) Symbol / session / day-of-week insights if present
5) A concrete, numbered action plan (5–10 items) they can follow next month

Be direct and practical. Avoid fluff and don't repeat raw tables; interpret them.
Write in UK English.
    `.trim();

    const userPrompt = `
Here are the stats exported from the user's AP AlphaLog preview:

${statsBlob}
    `.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5,
    });

    const planText =
      completion.choices &&
      completion.choices[0] &&
      completion.choices[0].message &&
      (completion.choices[0].message.content || "").trim();

    if (!planText) {
      // We got a response but no text – signal this clearly to the frontend
      return res.status(200).json({
        planText: "",
        warning: "Model returned an empty message.",
      });
    }

    // This is exactly what the frontend expects.
    return res.status(200).json({ planText });
  } catch (err) {
    console.error("alphalog-full-report error:", err);

    const message =
      (err && err.message) ||
      "Unexpected error when generating full report.";

    return res.status(err.status || 500).json({
      error: message,
    });
  }
};
