# MQL5 Validation Checklist (Pass Guide)

1) **No NO_MONEY spam**: EA uses dual margin gate (pending + market at trigger) and OrderCheck dry-run.
2) **No invalid cancels**: EA only removes *placed* pendings with matching magic/symbol.
3) **Low log volume**: LogLevel defaults to 0 for Market. One placement per session.
4) **Stops-level safe**: SL/TP auto-adjusted to broker `SYMBOL_TRADE_STOPS_LEVEL` and tick size.
5) **Default preset**: uses `FixedLots=0.01`, generous `MaxSpreadPoints=1500–2000`, and `CancelOppOnFill=false`.

### Local quick test
- Load `Presets/Validator_Conservative.set`
- EURUSD H1, 2022–2023, $10k
- Expect: no “not enough money” or “invalid request” spam; a modest number of trades; clean finish.
