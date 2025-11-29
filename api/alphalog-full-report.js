// api/alphalog-full-report.js
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper: ensure we always get a JSON object from the request body
function readJsonBody(req) {
  return new Promise((resolve) => {
    // If Vercel / micro already parsed JSON, just use it
    if (req.body && typeof req.body === "object") {
      return resolve(req.body);
    }

    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        const json = JSON.parse(data);
        resolve(json || {});
      } catch (e) {
        console.error("alphalog-full-report JSON parse error:", e);
        resolve({});
      }
    });
    req.on("error", (err) => {
      console.error("alphalog-full-report body read error:", err);
      resolve({});
    });
  });
}

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
    const body = await readJsonBody(req);
    const summary = body.summary;
    const stats = body.stats;

    // We only *require* the summary. Stats are optional.
    if (!summary || typeof summary !== "string") {
      return res.status(400).json({ error: "Missing summary" });
    }

    const statsBlock = stats
      ? `
2) JSON stats object:
${JSON.stringify(stats, null, 2)}

`
      : `
2) JSON stats object:
(Stats were not provided. Use only the preview summary text.)

`;

    const prompt = `
You are a trading performance coach. The user has uploaded a trade log.
You get two inputs:

1) Preview summary text:
${summary}

${statsBlock}
Write:
- 2–3 bullet points on strengths.
- 3–5 bullet points on key issues.
- A concrete action plan for the next 20 trades (numbered steps).

Keep it concise but specific. Do not just repeat raw numbers; interpret them.
`;

    const aiResponse = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    // Extract plain text from the Responses API result
    let text = "";
    try {
      if (
        aiResponse &&
        Array.isArray(aiResponse.output) &&
        aiResponse.output[0] &&
        Array.isArray(aiResponse.output[0].content) &&
        aiResponse.output[0].content[0] &&
        typeof aiResponse.output[0].content[0].text === "string"
      ) {
        text = aiResponse.output[0].content[0].text;
      }
    } catch (e) {
      console.error("alphalog-full-report: output parse error:", e);
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





