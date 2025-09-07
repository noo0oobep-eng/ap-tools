# Inputs Reference — AP London Breakout PRO (MT5)

**Version / tag**
- `InpVersionTag` — internal label printed to Journal.

**London window (server time)**
- `InpSessionStartHour`, `InpSessionStartMinute` — default 07:00 (server).
- `InpSessionEndHour`, `InpSessionEndMinute` — default 08:00 (server).
- `InpBoxTF` — timeframe for measuring box high/low (default M5).

**Trading days**
- `InpTradeMonday` .. `InpTradeFriday` — choose active weekdays.

**Placement**
- `InpBufferPoints` — entry buffer above/below box (points).
- `InpSLExtraPoints` — SL extra beyond the opposite side (points).
- `InpTP_R_Multiple` — TP as R multiple (e.g., 1.5R).
- `InpPendingExpiryHours` — pending order expiration.
- `InpCancelOppOnFill` — (default OFF for validator). If ON, removes opposite pending on fill.
- `InpOneSetPerSession` — only one placement per completed window.

**Risk / lots**
- `InpUseFixedLots` + `InpFixedLots` — fixed lot sizing.
- `InpRiskPercent` — percent risk sizing (used if `InpUseFixedLots=false`).

**Filters & guards**
- `InpUseTrendFilter` — EMA200 trend filter on `InpTrendTF` (method `InpTrendMAMethod`, period `InpTrendMAPeriod`).
- `InpMaxSpreadPoints` — skip if spread too high.
- `InpMinBoxPoints` / `InpMaxBoxPoints` — optional min/max box size filters (0 = disabled).

**Housekeeping**
- `InpMagic` — magic number for orders.
- `InpOrderComment` — order comment tag.
- `InpLogLevel` — 0=quiet, 1=normal, 2=verbose.

**Quick exit (optional)**
- `InpQuickExitEnabled` — enable time/R‑based early exit.
- `InpQuickExitMins` — close after N minutes in the market.
- `InpQuickTP_R` — take profit at R ratio (if SL exists).
- `InpQuickTP_MinPoints` — minimum TP (points) for quick exit.

Implementation notes:
- Pending orders: BuyStop above box high + buffer, SellStop below box low + buffer.
- SL sits beyond the opposite side (+extra); TP = R multiple.
- Strict `OrderCheck` and `OrderCalcMargin` checks, plus spread and stop‑level handling.
