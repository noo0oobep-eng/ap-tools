# AP BTC Spread Radar (MT5 Indicator)

**What it does**  
Plots the *current live spread* (in points) and a moving average of the spread in a separate window. Designed for BTCUSD/XBTUSD but works on any symbol.

**How to install**  
1. Open **MT5 → File → Open Data Folder**  
2. Put `AP_BTC_Spread_Radar.mq5` into **MQL5/Indicators**  
3. In MetaEditor click **Compile**, then attach the indicator to your chart (BTCUSD recommended).

**Inputs (recommended defaults)**
- `MAPeriod = 50` – smoothing window for the spread MA  
- `UseEMA = false` – use SMA by default; toggle to EMA if you prefer  
- `MaxHistory = 5000` – number of bars to retain internally  
- `ShowComment = true` – small HUD with live/avg spread (points)  
- `CommentEvery = 3` – update HUD every N ticks  
- `VerboseLog = false` – keep false for quiet operation

**Tips**
- If your broker uses non-standard point size, the indicator still works: it reads `SYMBOL_POINT` and shows points accordingly.
- For BTC, a rough quick map at many brokers: **10,000 points ≈ $1 at 0.01 lots** — *verify in your terminal as brokers differ*.
- This is a **pure indicator**: it never sends orders.

**Support**  
Support is via MQL5 messages/comments only. To get presets or help, send a message on MQL5.
