---
title: IndicXlit API
emoji: 🔤
colorFrom: red
colorTo: gray
sdk: docker
app_port: 7860
startup_duration_timeout: 1h
pinned: false
license: mit
---

# IndicXlit transliteration API

The backend for the Lipi frontend: AI4Bharat's IndicXlit model, served by Flask/gevent.
It transliterates between the Roman alphabet and 21 Indic scripts.

| Method | Path | |
|---|---|---|
| GET | `/languages` | Supported languages |
| GET | `/tl/{lang}/{word}` | Roman → native, top-k suggestions |
| GET | `/rtl/{lang}/{word}` | Native → Roman |
| POST | `/transliterate` | Batch / sentence endpoint (ULCA format) |

Example: `GET /tl/hi/namaste`

Source: https://github.com/sahilmeenameena001-boop/Btech-project · Model: https://github.com/AI4Bharat/IndicXlit (MIT)
