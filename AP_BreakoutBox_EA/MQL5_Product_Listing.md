# MQL5 Product Listing Copy

## Short
**AP Breakout Box EA (MT5)** — classic Asian session breakout with pending Buy/Sell Stops, R‑multiple targets and smart broker‑safe execution. Pending‑margin sizing, dual margin gate (pending + market at trigger), OrderCheck dry‑run, auto stops‑level adjustment, and clean cancel logic for reliable validation and live trading.

## Long
The EA draws an Asian session box, then places a **Buy Stop** above and a **Sell Stop** below the range with:
- SL beyond the opposite side (+ optional padding)
- TP as a user‑defined **R multiple**
- Optional **EMA trend filter** (e.g., EMA‑200 on M15)

### What makes it robust
- **Pending‑aware sizing**: calculates margin for pendings (not just market).
- **Dual margin gate**: must afford both the pending and the market position at the trigger price → prevents “not enough money” spam.
- **OrderCheck dry‑run** with **INVALID_STOPS** fallback: place without SL/TP if the broker forbids stops on pendings, then manage after.
- **Stops‑level auto‑adjustment** to broker min distances and tick size.
- **Safe cancel routine**: only cancels *placed* pendings with our magic + symbol.

### Quick start (validator‑friendly)
- `UseFixedLots=true`, `FixedLots=0.01`
- `CancelOppOnFill=false`, `OneSetPerSession=true`
- `MaxSpreadPoints=1500–2000`
- `Trend filter OFF` for validation; enable for live if desired.

**AP TRADING TOOLS** — If you enjoy this EA, a positive review means the world to us! 💙
