# AP London Breakout PRO (MT5) — Quick Start

**Time window:** 07:00–08:00 (broker server time).  
**Symbol/TF:** Any symbol; box is scanned on `InpBoxTF` (default M5).

## Install
1. Copy the EA to `MQL5/Experts` and restart MT5.
2. Enable **Algo Trading**. Allow live trading on the chart.
3. Attach to your target symbol and timeframe.

## Basic settings
- **Session start/end:** default 07:00–08:00 (server). Adjust if your broker’s London open differs.
- **Buffer (points):** distance added to high/low for pending entries.
- **SL extra (points):** small extra beyond the opposite side of the box.
- **TP R multiple:** e.g., 1.5 places TP at 1.5 * risk (entry→SL).
- **One set per session:** leave ON to avoid duplicate placements.

## Risk
- Use **fixed lots** or **risk%** (risk% uses account balance, point value per lot, and stop distance).

## Filters & guards
- **Trend filter (optional):** EMA 200 on M15 by default.
- **Min/Max box size:** skip tiny or huge boxes if needed.
- **Max spread:** validator-friendly default; tighten for live.

## Quick exit (optional)
- Close after **N mins** in market or at **0.5R** (with a minimum points floor).

## Tips
- Forward test in demo to confirm the server-time window and SL/TP behaviour.
- Tighten spread and box filters for your broker.
