# Inputs Reference (MT4)

- **SessionStart/End** — server-time window for the London box.
- **EntryBufferPoints** — points added above/below box for pending orders.
- **ATR_Period / ATR_SL_Mult / TP_R_Mult** — ATR-based SL and R-multiple TP.
- **Trend/Filters** — optional filters (spread, size guards).
- **Risk / FixedLots** — choose % risk or fixed lot size.
- **CancelOppositeOnFill** — OFF by default (validator-friendly). Pending expires same day.
