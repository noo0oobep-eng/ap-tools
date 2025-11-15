# AP ATR Trail (MT5) — 60-second Quick Start

## 1. Attach & basic checks

- Attach **AP ATR Trail (MT5)** to any chart.
- Use it on the timeframe you want the trail to follow (M5, H1, H4, etc.).
- Make sure the symbol has normal history loaded so ATR can calculate.

---

## 2. Set trail distance

- **ATR period (`InpATRPeriod`)**  
  Typical range: `10–20`. Higher = smoother, slower trail.

- **ATR multiplier (`InpATRMult`)**  
  Controls how far the trail sits from price.  
  - Tight: `2.0–2.5`  
  - Medium: `3.0`  
  - Loose: `3.5–4.0+`

Start with the defaults (14 / 3.0) and adjust after a few sessions.

---

## 3. Read the trail

- In an **uptrend**, only the **green “UP” trail** plots below price.
- In a **downtrend**, only the **red “DOWN” trail** plots above price.
- When price closes through the trail, the state **flips** and the opposite trail becomes active.
- You can use the active trail as:
  - A visual **stop guide**, or
  - A simple **directional filter** (only trade in trail direction).

---

## 4. Configure alerts

- **`InpAlertOnFlip`** — alert when the trail flips UP ↔ DOWN.
- **`InpAlertOnRetouch`** — alert when price retouches the active trail.
- Delivery switches:
  - `InpAlertPopup` — platform popup
  - `InpAlertSound` + `InpAlertSoundFile` — sound
  - `InpAlertPush` — mobile push (MetaQuotes ID required)

By default, alerts are muted in the Strategy Tester via `InpSilenceInTester`.

---

## 5. Suggested starting recipes

- **Swing trading (H1–H4)**  
  `ATRPeriod = 14`, `ATRMult = 3.0–4.0`.

- **Intraday (M5–M15)**  
  `ATRPeriod = 10–14`, `ATRMult = 2.2–2.5`.

- **Very volatile symbols**  
  Increase the ATR period and/or multiplier to keep noise down.

---

## 6. Practical use

- Place your own entries (manual or via EA) and let the trail guide exits.
- Combine the trail with your other tools (support/resistance, sessions, etc.).
- Optionally, read the trail buffer from your own EA to automate exits.

Indicator only — it does not open or manage trades by itself.
