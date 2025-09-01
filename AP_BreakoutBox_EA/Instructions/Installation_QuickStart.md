# Install & Quick Start (MT5)

1) Copy `AP_BreakoutBox_EA.ex5` to **MQL5/Experts** and restart MT5.
2) Open **Navigator → Expert Advisors** and attach the EA to any chart.
3) Load a preset via **Inputs → Load** and choose one from `/Presets`:
   - `Validator_Conservative.set` (use for MQL5 Market validation/tests)
   - `TrendFilter_Conservative.set` (safer with 200‑EMA filter)
   - `Aggressive.set` (tighter box buffer, larger R)
4) Make sure **AutoTrading** is enabled (green icon).

## Tester (Strategy Test):
- Mode: 1M OHLC or Every tick (fast) is fine for validation.
- Symbols: EURUSD, XAUUSD, GER30/DE40, GBPUSD (Market may test multiple).
- Deposit: $10,000 (default).
- Spread: Current or fixed (try 2× spread for robustness).
- Modeling start: at least 6 months.

## Live tips
- Keep `UseFixedLots=true` for small accounts and consistency.
- Start with `FixedLots=0.01`, increase only after forward results.
- For volatile brokers/symbols, widen `BufferPoints` and `MaxSpreadPoints`.
