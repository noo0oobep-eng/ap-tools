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

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ---- Make sure we actually have a parsed JSON body ----
    let body = req.body;

    // Sometimes body is an empty object or undefined in Vercel Node functions.
    const isEmptyObject =
      body && typeof body === "object" && !Array.isArray(body) && !Object.keys(body).length;

    if (!body || isEmptyObject) {
      // Read raw request stream and parse it ourselves
      let raw = "";
      await new Promise((resolve, reject) => {
        req.on("data", (chunk) => {
          raw += chunk;
        });
        req.on("end", resolve);
        req.on("error", reject);
      });

      if (raw) {
        try {
          body = JSON.parse(raw);
        } catch (e) {
          console.error("alphalog-full-report: could not parse raw JSON body:", raw, e);
          return res.status(400).json({ error: "Request body was not valid JSON" });
        }
      }
    }

    // If for some reason it's still a string
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error("alphalog-full-report: body was string but not JSON:", body, e);
        return res.status(400).json({ error: "Request body was not valid JSON" });
      }
    }

    const { summary, stats } = body || {};

    if (!summary) {
      return res.status(400).json({ error: "Missing summary" });
    }
    if (!stats) {
      return res.status(400).json({ error: "Missing stats" });
    }

    // ---- Build prompt from preview summary + stats ----
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

    // ---- Extract text from Responses API result ----
    let text = "";

    // Preferred shape
    if (
      aiResponse.output &&
      Array.isArray(aiResponse.output) &&
      aiResponse.output[0] &&
      aiResponse.output[0].content &&
      Array.isArray(aiResponse.output[0].content) &&
      aiResponse.output[0].content[0] &&
      typeof aiResponse.output[0].content[0].text === "string"
    ) {
      text = aiResponse.output[0].content[0].text;
    }

    // Fallbacks (just in case the SDK changes shape)
    if (!text && typeof aiResponse.output_text === "string") {
      text = aiResponse.output_text;
    }
    if (
      !text &&
      aiResponse.content &&
      Array.isArray(aiResponse.content) &&
      aiResponse.content[0] &&
      typeof aiResponse.content[0].text === "string"
    ) {
      text = aiResponse.content[0].text;
    }

    if (!text || !text.trim()) {
      console.error("alphalog-full-report: AI response was empty or unparseable", aiResponse);
      return res.status(500).json({ error: "AI response was empty", advice: "" });
    }

    return res.status(200).json({ advice: text.trim() });
  } catch (err) {
    console.error("alphalog-full-report error", err);
    const msg = err && err.message ? err.message : "Unknown error";
    return res.status(500).json({ error: "AI backend error: " + msg });
  }
};






