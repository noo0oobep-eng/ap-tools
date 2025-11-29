// alphalog/full-report.js
document.addEventListener("DOMContentLoaded", () => {
  // Try to attach the full-report section inside the main card
  const wrap = document.querySelector(".wrap") || document.body;

  const section = document.createElement("section");
  section.style.marginTop = "24px";
  section.innerHTML = `
    <hr style="margin:24px 0;border:none;border-top:1px solid #1d2633;">
    <h2 style="margin:0 0 6px;font-size:20px;">Full AI report (for paid users)</h2>
    <p style="margin:0 0 10px;font-size:0.9rem;color:#9fb0c3;">
      After running the preview above, click the button to generate a longer
      AI-written report (strengths, issues, and an action plan). This uses the
      stats already shown on this page.
    </p>
    <button id="alphalog-full-btn"
            style="margin-top:6px;padding:8px 14px;border-radius:8px;
                   border:none;cursor:pointer;background:#00d3a7;
                   color:#00110c;font-weight:600;">
      Generate full AI report
    </button>
    <div id="alphalog-full-status"
         style="margin-top:8px;font-size:0.85rem;color:#9fb0c3;"></div>
    <div id="alphalog-full-output"
         style="margin-top:12px;padding:12px;border-radius:10px;
                border:1px solid #1d2633;background:#05070b;
                white-space:pre-wrap;font-size:0.9rem;"></div>
    <button id="alphalog-full-download"
            style="margin-top:10px;display:none;padding:6px 12px;
                   border-radius:8px;border:1px solid #1d2633;
                   background:transparent;color:#9fb0c3;cursor:pointer;
                   font-size:0.85rem;">
      Download report (.txt)
    </button>
  `;
  wrap.appendChild(section);

  const btn = document.getElementById("alphalog-full-btn");
  const status = document.getElementById("alphalog-full-status");
  const out = document.getElementById("alphalog-full-output");
  const dl = document.getElementById("alphalog-full-download");

  btn.addEventListener("click", async () => {
    // Take a text snapshot of the card contents as the AI input
    const snapshotText = wrap.innerText || "";

    if (!snapshotText.includes("Preview summary")) {
      status.textContent = "Run the preview analysis first, then try again.";
      return;
    }

    btn.disabled = true;
    status.textContent = "Generating full report…";
    out.textContent = "";
    dl.style.display = "none";

    try {
      const resp = await fetch(
        "https://ap-alphalog-api.vercel.app/api/alphalog-full-report",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ snapshotText }),
        }
      );

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Request failed");
      }

      const report = data.report || "No report text returned.";
      out.textContent = report;
      status.textContent = "Done.";
      btn.disabled = false;
      dl.style.display = "inline-block";

      dl.onclick = () => {
        const blob = new Blob([report], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "AP_AlphaLog_full_report.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };
    } catch (err) {
      console.error(err);
      status.textContent = "Error: " + err.message;
      btn.disabled = false;
    }
  });
});
