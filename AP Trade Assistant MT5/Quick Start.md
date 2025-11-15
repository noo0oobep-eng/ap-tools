# AP Trade Assistant — 60-second Quick Start

## 1. Attach & enable

- Attach **AP Trade Assistant** to a chart.
- Enable **Algo Trading** in MT5 and on the chart.

---

## 2. Size your trade

- Toggle between **Risk%** or **Lots** on the panel.
- The **MDB** (Main Display Box) shows cash risk and R multiple.

---

## 3. Compose with Lines

- Press **Lines**.
- Drag **ENTRY / SL / TP** on the chart.
- Use **Snap/Step** controls to keep prices clean.
- Minimum distances and broker limits are enforced automatically.

---

## 4. Place the order

- Press **PLACE**.
- If ENTRY is beyond Bid/Ask → a **pending order** is sent  
  (Stop vs Limit is auto-chosen).
- If ENTRY crosses the market → a **market order** is sent.

---

## 5. Manage the position

- **BE** moves SL to entry + offset.
- **Trail** selects a trailing method and ratchets (never loosens).
- **Partials 25/50/75** close part of the position volume.

---

## 6. Advanced sends

- **OCO**  
  Paired pendings: when one fills, the sibling is cancelled.
- **Bracket**  
  After a market fill, auto-attach SL/TP using your current lines.

---

## 7. Hindsight & exports

- **Hindsight**: snapshot a closed trade with context notes.
- **Export (More)**: write CSV logs to  
  `\MQL5\Files\APTA_Reports\` for later review.

---

## 8. Tips

- **News** panel shows upcoming events (informational only, no auto-blocking).
- **Manage** drawer shows a live table of tickets for fast control.
- **More** drawer contains utilities, preferences and export options.
