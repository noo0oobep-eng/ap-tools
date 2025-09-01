# Change Log

## v5.2
- Validator‑safe cancel logic (only placed pendings, magic/symbol match)
- Dual margin gate (pending + market at trigger) before send
- OrderCheck dry‑run; fallback for INVALID_STOPS
- Stops‑level auto‑adjust to broker constraints
- One‑set‑per‑session guard; quieter logs at LogLevel=0
