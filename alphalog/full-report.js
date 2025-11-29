      html += '</ul>';
      html += '<p class="muted">This advice preview is generated locally from the basic stats above. The full AP AlphaLog AI report will expand this into a longer narrative with concrete action items.</p>';
      html += '</div>';

      // ---------- Save summary + stats for the full AI report ----------
      const statsForReport = {
        totalTrades: total,
        wins,
        losses,
        winrate,
        net,
        avgR,
        bestR,
        worstR,
        bySymbol,
        bySession,
        byDOW
      };

      const summaryLines = [
        `Total closed trades: ${total}`,
        `Wins / Losses: ${wins} / ${losses}`,
        `Winrate: ${winrate.toFixed(1)}%`,
        `Net result (account currency): ${net.toFixed(2)}`,
        `Avg R (trades with SL): ${avgR.toFixed(2)}`,
        `Best R / Worst R: ${bestR.toFixed(2)} / ${worstR.toFixed(2)}`,
        "",
        "Key local advice:",
        ...adviceLines
      ];

      window.alphalogPreview = {
        summary: summaryLines.join("\n"),
        stats: statsForReport
      };

      outEl.innerHTML = html;

      // draw equity curve
      drawEquity(eqPoints);

