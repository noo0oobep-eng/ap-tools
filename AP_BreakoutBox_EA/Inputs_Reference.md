# Inputs Reference

**Session window**
- `SessionStartHour/Minute` – start of the Asian box (server time)
- `SessionEndHour/Minute` – end of the box (can cross midnight)
- `BoxTF` – timeframe used to build the box (default M5)

**Placement**
- `BufferPoints` – entry buffer above/below box (points)
- `SLExtraPoints` – extra SL padding beyond the opposite side (points)
- `TP_R_Multiple` – TP = R multiple (R = distance entry→SL)
- `PendingExpiryHours` – time-out for pendings
- `CancelOppOnFill` – cancel opposite after a fill (set **false** for Market validator)
- `OneSetPerSession` – place at most one set per session

**Risk & Lots**
- `UseFixedLots` – if true, use fixed volume
- `FixedLots` – fixed lot size
- `RiskPercent` – used only if `UseFixedLots=false` (risk per trade)

**Filters**
- `UseTrendFilter` – if true, require price relative to a trend MA
- `TrendMAPeriod`, `TrendMAMethod`, `TrendTF` – EMA 200 on M15 by default

**Protections**
- `MaxSpreadPoints` – skip if spread exceeds this (points)

**Misc**
- `Magic`, `OrderComment`, `LogLevel` (0 quiet, 1 normal, 2 verbose)
