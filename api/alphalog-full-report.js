// api/alphalog-full-report.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // CORS preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    // Read raw body (works in plain Vercel serverless functions)
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const bodyStr = Buffer.concat(chunks).toString("utf8") || "{}";
    const data = JSON.parse(bodyStr);

    const snapshotText = (data.snapshotText || "").toString().trim();

    if (!snapshotText) {
      res.status(400).json({ error: "snapshotText is required" });
      return;
    }

    const response = await client.responses.create({
      model: "gpt-5.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are a trading performance coach. You receive a plain-text " +
            "snapshot of stats from a trade log (winrate, R-multiple, per-symbol " +
            "results, sessions, days of week, etc.). " +
            "Write a detailed but practical performance report for a discretionary trader. " +
            "Structure the answer with short headings:\n\n" +
            "1) High-level summary\n" +
            "2) What is working\n" +
            "3) Key problems / risks\n" +
            "4) Concrete action plan (3–7 bullet points)\n" +
            "5) Notes on sample size / expectations.\n\n" +
            "Do NOT invent numbers. Refer to the stats qualitatively only " +
            "(e.g. 'winrate is under 40%' rather than quoting exact figures). " +
            "Keep tone calm, realistic and non-hype.",
        },
        {
          role: "user",
          content:
            "Here is the text snapshot copied from the on-screen preview:\n\n" +
            snapshotText +
            "\n\nWrite the full report now.",
        },
      ],
      max_output_tokens: 900,
    });

    const reportText =
      response.output?.[0]?.content?.[0]?.text?.trim() ||
      "No report text returned.";

    res.status(200).json({ report: reportText });
  } catch (err) {
    console.error("alphalog-full-report error", err);
    res
      .status(500)
      .json({ error: "AI_error", details: err.message || String(err) });
  }
}
