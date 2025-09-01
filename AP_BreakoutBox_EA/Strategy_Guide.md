# Strategy Guide – Asian Breakout Box

1) Build a volatility box over the Asian session (`SessionStart → SessionEnd`).
2) Place **Buy Stop** at `boxHigh + BufferPoints*Point`, and **Sell Stop** at `boxLow - BufferPoints*Point`.
3) `SL` beyond the opposite side (+ `SLExtraPoints`); `TP` = `TP_R_Multiple × R`.
4) Optional trend filter: allow only the direction aligned with EMA (e.g., 200 EMA on M15).
5) Risk: start with `FixedLots=0.01`. For dynamic risk, disable fixed lots and set `RiskPercent`.

### Good defaults
- Session: 00:00 → 08:00 (server time), `BoxTF=M5`
- Buffer: 40–80 points on majors, larger on indices/metals
- TP multiple: 1.2–2.0 (1.5 default)
- Trend filter: OFF for validation, ON for live on choppy symbols
