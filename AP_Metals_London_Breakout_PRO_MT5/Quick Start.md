# Quick Start

**EA:** AP Metals London Breakout PRO (MT5) — Asian-session box breakout for metals.

## Install
1. Copy the EA file to **MQL5/Experts/** and restart MT5.
2. In MT5, open **Navigator → Expert Advisors**, drag the EA onto your metals chart (e.g., XAUUSD, XAGUSD).
3. Load a preset from **`./presets/`** (XAU/XAG/XPT/XPD).

## Recommended defaults
- **TradeOnlyMetals = true** (safety)
- **UseMetalProfiles = true**, **UseATRAdaptive = true**
- **AutoFitToStops = true**, **StopsCushionPts = 5–10**
- Start with **Lots = 0.10** (or your risk) and forward-test 2–4 weeks per symbol.

## Session
- Builds box **[00:00 → 07:00] server time**. After 07:00, places BUY/SELL STOP with a buffer.
- Cancels the opposite side on first fill; enforces cooldown / daily cap and session cutoff.

## Validator-safe
- No DLL/WebRequest/File I/O.
- All orders run **OrderCheck → OrderSend** with tick-grid & Stops/Freeze checks.

---
**Files in this folder**
- `./index.html`
- `./Inputs.md`
- `./Changelog.md`
- `./presets/`
