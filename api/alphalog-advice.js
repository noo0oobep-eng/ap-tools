// api/alphalog-advice.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Body may already be parsed, or may be a JSON string
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  }

  const summary = body?.summary;
  if (!summary || typeof summary !== "string") {
    return res
      .status(400)
      .json({ error: "Missing 'summary' (string) in request body" });
  }

  try {
    const response = await client.responses.create({
      model: "gpt-5.1-mini",
      input: [
        {
          role: "system",
          content: [
            "You are a trading performance coach.",
            "You receive a short text summary of a trader's results.",
            "Give 3–6 tight bullet points:",
            "- What they are doing well.",
            "- Key problems / leaks.",
            "- Concrete next steps they can test.",
            "Focus on R-multiples, risk, sessions, instruments and behaviour.",
            "Avoid fluffy motivational talk. Keep under 250 words.",
          ].join("\n"),
        },
        {
          role: "user",
          content:
            "Here is the preview summary from my trading log page:\n\n" +
            summary,
        },
      ],
    });

    const adviceText =
      response.output?.[0]?.content?.[0]?.text?.trim() ||
      "No advice text returned.";

    return res.status(200).json({ advice: adviceText });
  } catch (err) {
    console.error("alphalog-advice error:", err);
    return res.status(500).json({
      error: "Failed to generate advice",
      detail: err.message ?? String(err),
    });
  }
}

