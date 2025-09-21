---
title: AP DayTrader Impulse Box (MT5)
layout: default
---

# AP DayTrader Impulse Box (MT5)

Two engines in one EA for intraday trading:

**Momentum Pullback (M15)** — aligns Fast/Slow EMAs with **MA200** and **RSI** (buy ≥55 / sell ≤45).  
**Session Breakout (M5 box)** — time-box (default **07:00–09:00 server**); buffered Buy Stop/Sell Stop; SL opposite side (+ extra), **TP = R-multiple**.

---

## Requirements
- Platform: **MetaTrader 5**
- Trend TF: **M15** (signals) · Box TF: **M5**
- Symbols: majors recommended (e.g., EURUSD)
- Broker: reasonable spreads; respect **minimum stop distance**
- VPS / algo trading recommended

## Installation
1. MT5 → **File → Open Data Folder**.  
2. Copy `AP_DayTrader_Impulse_Box_MT5.ex5` to **MQL5/Experts**.  
3. Restart MT5, enable **Algo Trading**, attach to chart.

## Key Inputs (summary)
- **Mode**: Momentum / Breakout / Both / Auto  
- **EMAs & RSI**: Fast/Slow EMA, MA200, RSI thresholds  
- **Session box**: Start `07:00`, End `09:00`, entry buffer, min/max box size  
- **Stops/Targets**: Fixed points **or** ATR (`ATRPeriod`, `SL_ATR_Mult`, `TP_ATR_Mult`)  
- **BE & Trailing**: breakeven trigger/buffer, ATR trailing  
- **Risk**: fixed lots or % per trade  
- **Guards**: max spread, min secs between trades, daily caps, cooldown

> Tip: confirm broker **server time** & **stop level**; tune EntryBufferPoints and SL extras accordingly. Start on demo.

---

**Support:** noo0oobep@gmail.com
**Changelog:** /changelog/ap-daytrader-impulse-box (add later)

[← Back to Home](/)
