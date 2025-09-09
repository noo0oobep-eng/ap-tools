# Quick Start — AP NY Breakout PRO (MT5)

**Focus:** 13:30–14:30 (server) NY box breakout on any FX/Index/CFD symbol with sensible spread.

## 1) Install
1. Copy the **ex5** to `MQL5/Experts/…`.
2. Restart MetaTrader 5, or right-click **Experts** → *Refresh*.
3. Enable **Algo Trading**.

## 2) Attach
1. Open the symbol/timeframe you want (box is read from `InpBoxTF`, default M5).
2. Drag **AP NY Breakout PRO** onto the chart.

## 3) Preset
Pick one of the `.set` files:
- **Balanced** – defaults tuned for general use.
- **Safe** – wider buffer, trend filter ON, lower risk.
- **Aggressive** – tighter buffer, higher TP R, % risk.

> In MT5: **Inputs → Load…** and select the preset.

## 4) How it works
- After **14:30 server** (window end), EA reads the 13:30–14:30 box on the chosen TF (default M5).
- Places **Buy Stop** above high (+buffer) and/or **Sell Stop** below low (–buffer).
- **SL**: opposite side + extra; **TP**: by **R-multiple**.
- One placement per completed window; pendings **auto-expire** (same day).

## 5) Safety
- Uses **OrderCheck**, broker **stops level**, and **margin gates** before sending.
- `Cancel opposite on fill` is **OFF** by default for validator friendliness (use expiry).

## 6) Backtest tips
- Model on **Every tick based on real ticks** if available.
- Set broker **server time** correctly if you control it; window is server-based.

## 7) Live tips
- Align the session times with your broker’s server time.
- Tighten **MaxSpread** for live trading.
- Review **box size filters** (min/max points) per symbol.

Support: via MQL5 messages/comments.
