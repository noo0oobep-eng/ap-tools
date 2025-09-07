# AP BTC Session VWAP + Bands (MT5) — Quick Start

Purpose: plots session VWAP (Daily/Weekly/Anchored) with ±K standard deviation bands. Alerts on cross/touch. Non-trading indicator.

Install
1) Copy MQ5/EX5 to `MQL5/Indicators/` and restart MT5.
2) Attach to a BTC chart.
3) Choose Mode: Daily / Weekly / AnchorTime (e.g., 08:00).
4) Set Deviations (1.0, 2.0) and enable alerts if needed.

Notes
• Uses (H+L+C)/3 × volume; falls back to tick volume where real volumes are missing.  
• No DLLs/WebRequest. English inputs.
