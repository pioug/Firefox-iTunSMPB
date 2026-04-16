Bugzilla: https://bugzilla.mozilla.org/show_bug.cgi?id=2032263

# Minimal `decodeAudioData()` AAC offset repro

> Repository created with GPT-5.4

1. Start the static server:

```bash
node server.mjs 8081
```

2. Open [http://127.0.0.1:8081](http://127.0.0.1:8081) in Chrome and Firefox.
3. Wait for the page to finish. It runs automatically.
4. Compare `Lag vs WAV` for `AAC / M4A`.

## GitHub Pages

This repo is static and can be published directly with GitHub Pages.

1. Push the repo.
2. In GitHub, enable Pages for the default branch and the repository root.
3. Open the Pages URL in Chrome and Firefox.

`.nojekyll` is included so GitHub Pages serves the repo exactly as-is.

Files used:

- `fixtures/reportable-aac/clean-onsets.wav`
- `fixtures/reportable-aac/clean-onsets.m4a`

Repo contents:

- `index.html`: single-file repro page
- `server.mjs`: tiny static server
- `fixtures/reportable-aac/clean-onsets.wav`
- `fixtures/reportable-aac/clean-onsets.m4a`

Observed on this machine:

- Chrome: `0 (0.00 ms)`
- Firefox: `+2112 (+47.89 ms)`

## Detailed Observations

Chrome `147.0.0.0` on macOS `10.15.7`:

- WAV baseline: `26460 samples`
- AAC / M4A: `26560 samples`
- WAV first strong sample: `4530`
- AAC first strong sample: `4530`
- WAV peak sample: `4930`
- AAC peak sample: `4930`
- Lag vs WAV: `0 (0.00 ms)`

Firefox `149.0.2` on macOS:

- WAV baseline: `26460 samples`
- AAC / M4A: `28672 samples`
- WAV first strong sample: `4530`
- AAC first strong sample: `6642`
- WAV peak sample: `4930`
- AAC peak sample: `7042`
- Lag vs WAV: `+2112 (+47.89 ms)`

## File Metadata

`ffprobe` reports for `clean-onsets.m4a`:

- `start_pts=2112`
- `start_time=0.047891`
- `iTunSMPB= 00000000 00000840 00000064 000000000000675C ...`

Important value:

- `0x840` = `2112`

That matches the exact extra leading offset returned by Firefox.

The metadata item name is `iTunSMPB`.
In MP4/M4A, this is typically stored as a freeform `----` metadata atom under `com.apple.iTunes`.
