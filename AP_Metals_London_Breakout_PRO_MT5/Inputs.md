# Inputs (grouped)

## Setup
- **InpMagic** — Magic number (unique per symbol).
- **InpLots** — Fixed lots (floored to min/step/max).

## Box & orders
- **InpBoxStartHour / InpBoxEndHour** — Asian box window (server time).
- **InpNoNewAfterHour** — Do not place new orders after this hour.
- **InpEntryBufferPoints / InpSL_Points / InpTP_Points** — Base distances (points).
- **InpExpirationMinutes** — Pending expiry (0 = GTC).

## Metals & adaptation
- **InpTradeOnlyMetals** — Restrict to XAU/XAG/XPT/XPD (and aliases).
- **InpUseMetalProfiles** — Per-metal baseline multipliers.
- **InpUseATRAdaptive** — Add ATR floors to buffer/SL/TP.
- **InpATRPeriod / InpATR_*_Frac / InpMin*Pts** — ATR settings & floors.

## Risk & guards
- **InpCooldownMinutes / InpMaxDayTrades** — Lifecycle limits.
- **InpDeviation** — Max slippage (points).
- **InpAutoFitToStops / InpStopsCushionPts** — Meet broker Stops/Freeze.
- **InpMaxSpreadPoints** — Skip if spread exceeds this.
- **InpSkipIfLowATR / InpMinATRPts** — Optional low-vol filter.

## Equity
- **InpDailyEquityGuardOn / InpDailyLossLimitPct / InpDailyLossLimitMoney** — Daily drawdown lockout.
- **InpEquityGuardClosePositions** — Close current position when tripped.

## Management
- **InpBE_Enable / InpBE_TriggerPts / InpBE_OffsetPts** — Break-even move.
- **InpTrail_Enable / InpTrailStartPts / InpTrailStepPts** — Trailing stop.
- **InpMaxPositionMinutes** — Time stop (0 = off).

## Tester
- **InpShimEnable / InpShimLots / InpShimTP/SL** — Minimal trade on non-metals in Strategy Tester only.

## Logging
- **InpLogLevel** — 0 = quiet, 1 = info, 2 = verbose.

---
**Files in this folder**
- `./index.html`
- `./Quick Start.md`
- `./Changelog.md`
- `./presets/`
