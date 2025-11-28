// api/alphalog-advice.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const summary = req.body || {};

    // Very light validation
    if (!summary || !summary.overview) {
      res.status(400).json({ error: "Missing summary.overview in request body" });
      return;
    }

    // Build a compact prompt – we’ll wire the client-side summary into this
    const prompt = `
You are a trading performance coach.

You receive a journal summary in JSON and must return practical advice.
Focus on:
- risk management and R-multiple
- symbol / session / day-of-week patterns
- what to stop doing, what to do more of next week

Return markdown with these sections:
1. Snapshot (2–3 bullets)
2. Strengths
3. Issues / risks
4. Concrete next steps (numbered list)

Journal summary JSON:
${JSON.stringify(summary, null, 2)}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a strict but helpful trading coach." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 800,
    });

    const advice = completion.choices[0]?.message?.content || "";

    res.status(200).json({ advice });
  } catch (err) {
    console.error("alphalog-advice error", err);
    res.status(500).json({ error: "AI advice service error" });
  }
}
