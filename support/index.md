---
title: Support
layout: default
---
<p class="crumb"><a href="/">← Back to AP Trading Tools</a></p>

# Support

Need help with an EA or order? I’m happy to help.

**Email:** noo0oobep@gmail.com  
**Hours:** Mon–Fri, 10:00–18:00 (Thailand time)

---

## Order & downloads
- Retrieve your Lemon Squeezy orders: https://app.lemonsqueezy.com/my-orders  
- Use the same email you used at checkout.

Please include in your email:  
- Order number, product name, platform (MT5 or MT4)  
- Broker + symbol + timeframe  
- What you expected vs. what happened  
- Screenshots and any errors from the **Experts** tab

---

## Install (MT5)
1. MT5 → **File → Open Data Folder**  
2. Copy the EA `.ex5` to **MQL5/Experts/**  
3. Restart MT5 → enable **Algo Trading** → attach EA to chart  
4. Load a preset (`.set`) if provided

**Tip:** Use “Every tick based on real ticks” for the best backtests.

---

## Common fixes
- Check **Journal/Experts** tabs for errors (missing rights, invalid stops, etc.)  
- Spread too high? Set **MaxSpreadPoints** in inputs.  
- Pending orders rejected? Broker may restrict **stops level**—increase buffers.  
- Validator mode (strategy tester) can block some operations; try live demo.

---

## Updates
Changelogs are inside each product ZIP (`/Docs/Changelog.txt`).  
If you need an older version, email me with your order number.
