# FAQ — AP London Breakout PRO (MT5)

**Q: Which timeframe is best?**  
A: M5 or M15 for box construction; entries are pending orders so TF mainly affects box accuracy.

**Q: My broker’s server time isn’t UTC.**  
A: The EA uses *server* time. Convert 07:00–08:00 London window to your server time. Confirm on the chart.

**Q: Both pendings placed but only one gets filled. What about the other?**  
A: By default we rely on time expiry (`InpPendingExpiryHours`). You can enable `InpCancelOppOnFill=true` if you prefer immediate removal (keep OFF for validator).

**Q: Risk percent vs fixed lots?**  
A: Set `InpUseFixedLots=false` to let `% risk` sizing (`InpRiskPercent`) compute lots from the SL distance.

**Q: No trades in Strategy Tester.**  
A: Check filters: min/max box size, trend filter, spread. Also ensure the backtest feed includes the session window with realistic ticks.

**Q: Can I run multiple symbols?**  
A: Yes, attach the EA to multiple charts/symbols. Keep unique magics if you need to distinguish orders.
