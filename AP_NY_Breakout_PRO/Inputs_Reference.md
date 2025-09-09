# Inputs Reference

## Window & Box
- `InpSessionStartHour/Minute`, `InpSessionEndHour/Minute` – 13:30 → 14:30 by default.
- `InpBoxTF` – timeframe to read highs/lows for the box (default M5).

## Placement
- `InpBufferPoints` – entry buffer in points.
- `InpSLExtraPoints` – extra points beyond the opposite side for SL.
- `InpTP_R_Multiple` – R-multiple for TP.
- `InpPendingExpiryHours` – pending expiry (same day).
- `InpCancelOppOnFill` – keep **OFF** for validator; rely on expiry.
- `InpOneSetPerSession` – one placement per completed window.

## Risk
- `InpUseFixedLots`, `InpFixedLots` – fixed-lot mode.
- `InpRiskPercent` – % balance risk (used when fixed lots = false).

## Filters & Guards
- `InpUseTrendFilter`, `InpTrendMAPeriod`, `InpTrendMAMethod`, `InpTrendTF` – EMA filter.
- `InpMaxSpreadPoints` – hard spread cap.
- `InpMinBoxPoints`, `InpMaxBoxPoints` – optional size limits.

## Quick Exit (optional)
- `InpQuickExitEnabled` – enable/disable.
- `InpQuickExitMins` – close after N minutes in market.
- `InpQuickTP_R`, `InpQuickTP_MinPoints` – take quick profit at 0.5R or some min points.

## Housekeeping
- `InpMagic` – magic number.
- `InpOrderComment` – comment.
- `InpLogLevel` – print verbosity.
