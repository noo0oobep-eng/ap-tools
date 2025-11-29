// alphalog/full-report.js
(function () {
  const API_URL = "https://ap-alphalog-api.vercel.app/api/alphalog-full-report";

  // Mount the "Full AI report" section at the bottom of the .wrap card
  const wrap = document.querySelector(".wrap");
  if (!wrap) return;

  // Create the section only once
  let section = document.getElementById("alphalog-full-report-section");
  if (!section) {
    section = document.createElement("div");
    section.id = "alphalog-full-report-section";
    section.className = "results-section";
    section.innerHTML = `
      <h2>Full AI report (for paid users)</h2>
      <p class="muted">
        After running the preview above, click the button to generate a longer
        AI-written report (strengths, issues, and an action plan). This uses the
        stats already shown on this page.
      </p>
      <button id="generate-full-report-btn" type="button">
        Generate full AI report
      </button>
      <div id="alphalog-full-report-status"
           style="margin-top:8px; font-size:0.85rem; color:#9fb0c3;"></div>
      <pre id="alphalog-full-report-output"
           style="margin-top:10px; font-size:0.9rem; white-space:pre-wrap;"></pre>
    `;
    // Insert before the final "Back to AP Trading Tools" note if possible
    const backLink = wrap.querySelector('a[href="/"]');
    if (backLink && backLink.parentElement === wrap) {
      wrap.insertBefore(section, backLink);
    } else {
      wrap.appendChild(section);
    }
  }

  const btn = document.getElementById("generate-full-report-btn");
  const statusEl = document.getElementById("alphalog-full-report-status");
  const outputEl = document.getElementById("alphalog-full-report-output");

  if (!btn || !statusEl || !outputEl) return;

  // Helper: grab the preview "summary" block and turn it into summary + stats
  function getPreviewSummaryAndStats() {
    // Find the section whose heading contains "Preview summary"
    const heading = Array.from(document.querySelectorAll("h2, h3")).find((h) =>
      h.textContent.toLowerCase().includes("preview summary")
    );
    if (!heading) {
      return { summary: "", stats: null };
    }

    const section =
      heading.closest(".results-section") || heading.parentElement || heading;

    const summaryText = section.innerText.trim();
    if (!summaryText) {
      return { summary: "", stats: null };
    }

    // Build a very simple stats object from the bullet list
    const bulletTexts = Array.from(section.querySelectorAll("li")).map((li) =>
      li.innerText.trim()
    );

    const stats = {
      bullets: bulletTexts,
    };

    return { summary: summaryText, stats };
  }

  btn.addEventListener("click", async function () {
    const { summary, stats } = getPreviewSummaryAndStats();

    if (!summary || stats == null) {
      statusEl.textContent =
        "Run the preview analysis above first, then click this button again.";
      outputEl.textContent = "";
      return;
    }

    btn.disabled = true;
    const originalLabel = btn.textContent;
    btn.textContent = "Generating full report…";
    statusEl.textContent = "Contacting AI backend…";
    outputEl.textContent = "";

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary, stats }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      if (!data.advice || !data.advice.trim()) {
        statusEl.textContent = "No advice text was generated.";
        outputEl.textContent = "";
        return;
      }

      statusEl.textContent = "";
      outputEl.textContent = data.advice.trim();
    } catch (err) {
      statusEl.textContent =
        "Error: " + (err && err.message ? err.message : "Failed to fetch.");
      outputEl.textContent = "";
    } finally {
      btn.disabled = false;
      btn.textContent = originalLabel;
    }
  });
})();


