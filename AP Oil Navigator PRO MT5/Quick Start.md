# Quick Start — AP Oil Navigator PRO (MT5)

**Symbol/timeframe:** XTIUSD/USOIL on **M30**  
**Style:** EMA trend + pullback breakout with ATR SL/TP

## Install
1. Copy the EA to `MQL5/Experts` and restart MT5.
2. Attach to **XTIUSD/USOIL, M30**.
3. Enable Algo Trading.

## Minimal inputs
- **Session:** `Start=13:00`, `End=22:59` (server time). Adjust to your broker if needed.
- **Trend:** `Fast EMA = 20`, `Slow EMA = 200` (default).
- **ATR stops:** `ATR(14)`, `SL = 2.0×ATR`, `TP = 1.5R`.
- **Sizing:** choose `FixedLots` *or* set `RiskPercent` (e.g., `0.5`).

## First run checklist
- Spread under `InpMaxSpreadPoints` (default 120).
- Only **one** working pending per symbol; pendings auto-expire after `InpPendingExpiryHours`.
- Daily guard pauses new orders if loss cap is hit (default 5%).

## Notes
- In **live** accounts the EA trades only symbols whose name contains `XTI`, `USOIL`, `WTI` or `OIL` (configurable).
- In **tester**, gates can be relaxed and a fallback entry can be used if indicators are not ready on the first bars.
