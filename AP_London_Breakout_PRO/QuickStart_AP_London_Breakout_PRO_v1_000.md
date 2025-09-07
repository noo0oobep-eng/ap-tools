# AP London Breakout PRO (MT5) — Quick Start (v1.000)

**Idea:** Box the London 07:00–08:00 (server time) range. Place BuyStop above the high and SellStop below the low with a configurable buffer. TP by R‑multiple, SL beyond the opposite side (+extra).

## 1) Install from MQL5 Market
- In **MetaTrader 5**, open **Market**, rent/install **AP London Breakout PRO (MT5)**.
- Restart MT5 so it appears under **Navigator → Market**.

## 2) Attach to a chart
- Symbol/timeframe: works on majors and gold; most users prefer **M5** or **M15**.
- Drag EA onto the chart → **Common**: Allow algo trading → **AutoTrading** should be **green**.

## 3) Session window (server time!)
- Default is **07:00–08:00** server time.
- If your broker is UTC+2, that window equals **09:00–10:00 UTC**.
- Convert first; confirm by candle timestamps on the chart.

## 4) Key inputs
- `InpBufferPoints` — breakout offset above/below box.
- `InpSLExtraPoints` — add to the opposite side for SL.
- `InpTP_R_Multiple` — TP as a multiple of initial risk (R).
- `InpPendingExpiryHours` — pending order expiry; same‑day logic.
- Risk: `InpUseFixedLots + InpFixedLots` **or** `% risk` via `InpRiskPercent`.
- Filters: `InpUseTrendFilter` (EMA200 on `InpTrendTF`), box size min/max, spread guard.

## 5) Presets
- Load a preset from **Presets/**: Safe / Balanced / Aggressive / ValidatorTest.
- Verify every value (especially times) then save your own `.set` per broker.

## 6) First run checklist
- Box is drawn correctly over 07:00–08:00 (server).
- After session completes, pending orders appear with your buffer.
- No red errors in **Experts/Journal**.
- Spread <= `InpMaxSpreadPoints`; margin free enough for lots size.

## 7) VPS (recommended)
- Use MT5 VPS or a Windows VPS. After any input change, **migrate** again (Account → Migrate).

## 8) Support
- Send preset `.set`, broker/symbol/TF, Experts/Journal excerpts, and a chart screenshot.
— Allan | AP TRADING TOOLS
