# Inputs Reference — AP London Breakout PRO (MT5)

## Session & scanning
- `InpSessionStartHour/Minute` — start of the London box (server time).
- `InpSessionEndHour/Minute` — end of the window.
- `InpBoxTF` — timeframe used to compute the box high/low (default `PERIOD_M5`).
- `InpOneSetPerSession` — place at most one set per completed window.

## Trading days
- `InpTradeMonday` … `InpTradeFriday` — enable per weekday.

## Placement
- `InpBufferPoints` — points added to the high/low for entry.
- `InpSLExtraPoints` — extra points beyond the opposite side for SL.
- `InpTP_R_Multiple` — TP by R multiple (e.g., `1.5`).
- `InpPendingExpiryHours` — pending orders expiry (same-day by default).
- `InpCancelOppOnFill` — remove opposite pending after a fill (OFF for validator).

## Risk / lots
- `InpUseFixedLots` — true = fixed lots, false = risk%.
- `InpFixedLots` — lot size when fixed lots is on.
- `InpRiskPercent` — percent of balance risked when using risk%.

## Filters & guards
- `InpUseTrendFilter` — enable EMA trend filter.
- `InpTrendMAPeriod`, `InpTrendMAMethod`, `InpTrendTF` — EMA settings.
- `InpMaxSpreadPoints` — maximum spread allowed.
- `InpMinBoxPoints` / `InpMaxBoxPoints` — skip boxes outside this size.

## Housekeeping
- `InpMagic` — magic number.
- `InpOrderComment` — comment tag.
- `InpLogLevel` — log verbosity.

## Quick exit (optional)
- `InpQuickExitEnabled` — enable quick exit.
- `InpQuickExitMins` — close after N minutes in market.
- `InpQuickTP_R` — bank at R multiple if SL exists (e.g., `0.5`).
- `InpQuickTP_MinPoints` — minimum points to bank when using quick TP.
