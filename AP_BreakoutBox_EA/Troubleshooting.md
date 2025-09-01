# Troubleshooting

**“There are no trading operations” in Market test**
- Validator uses multiple symbols and may skip sessions with no valid setup. This is OK.

**“Invalid request” on cancel**
- Ensure `CancelOppOnFill=false` for validator (Market sim doesn’t like multi‑step order management).
- Our code removes only *placed* pendings with our magic; logs will show each targeted ticket.

**“Not enough money”**
- Use `FixedLots=0.01` and keep `BufferPoints` reasonable.
- Ensure preset: `MaxSpreadPoints ≥ 1500` on volatile symbols.
- Dual margin gate + OrderCheck avoid NO_MONEY spam by design.

**Huge log / test aborted**
- Set `LogLevel=0` for validation, `OneSetPerSession=true`.
