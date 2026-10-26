# Implementation validation — 21 October 2026

## Executed checks

- Strict application TypeScript and separate test/tool TypeScript checks: pass.
- Expo ESLint: pass, no errors or warnings.
- Automated tests: 15 pass. Covers MIDI pitch/distance, interval/root/instrument/mode and answer-position diversity, all choice counts, one submission, non-predictable two-choice repetition control, melodic direction, range validation, configurable stars, non-regressing best results, persistence and storage failure recovery, exact chapter thresholds, sequential unlocks, a complete 100-level/300-star run, replay, cancellation, and harmonic voice readiness/order.
- Level validation: exactly 100 explicit configurations; 30,000 seeded randomized questions; 9,532 exhaustive configured instrument/root/interval combinations. Every allowed correct interval is also forced through the generator to verify reachability. Required note banks and static manifest references exist.
- Asset validation: 128 checksummed AAC/M4A banks with 4,760 individually rendered note slots; all hashes and containers pass. Bundled audio totals **48,290,798 bytes (46.05 MiB)**.
- FFmpeg full decoding: every bank and every note slot passes silence, clipping and length checks. Representative concert-pitch checks: 14 piano/guitar/flute notes, largest measured difference about 15.1 cents after AAC encoding. Full metrics are in `assets/audio/verification.json`; rendering provenance, peak/RMS values and hashes are in `assets/audio/render-report.json`.
- Production exports: Android and iOS Hermes bundles and web JavaScript bundles all succeed. Two Metro workers limit memory pressure. The initial per-note asset layout hit Windows EMFILE; per-instrument banks resolved it without reducing coverage.
- Expo Doctor: 20/20 checks pass.
- Generated service worker and registration script: JavaScript syntax checks pass. The web cache excludes duplicate native assets from the combined export.

## Browser checks performed

Tested the actual production export through the in-app Chromium browser, using visible controls rather than injecting game state:

1. Opened home and entered level 1. The question loaded, audio playback completed, and answer buttons became available. No browser error/warning logs were recorded during this initial flow.
2. Replayed the same question. Answer choices remained the same and no solution appeared before submission.
3. Completed all ten questions using the visible controls. Four observed correct feedback messages produced exactly 4/10 on the results screen, with zero stars, previous best 0/10 and new best 4/10. Level 2 correctly remained locked.
4. Reopened the app after the cached build update. The map showed Best: 4/10, and all 100 level buttons existed, with later levels locked.
5. Inspected home and exercise layouts at normal browser width, and the home layout at 390 × 844. No horizontal overflow was observed at phone width. Screenshots are saved locally under ignored `artifacts/`.
6. Waited for Ready to play offline, then stopped the local HTTP server. Reloaded the level-map deep link successfully, retained Best: 4/10, navigated into level 1, completed playback and submitted another answer successfully with the server still stopped. Returned through the map to the home screen offline.

The test browser retains a local demonstration result of 4/10. No test progress is seeded into the application source or native installation.

## Remaining limitations

- No connected Android or iOS device was used. Hardware audio output, silent mode, app/audio interruptions, Bluetooth latency, seek precision and actual standalone native offline installation still require device testing. Successful native exports are not claimed as device runtime tests.
- Browser playback flow and offline operation were tested; subjective listening quality on the user's audio hardware was not certified. Representative pitch measurements do not certify every note, every instrument's perceived loudness or the tuning of GM sound effects.
- Difficulty is individually designed and structurally validated, but needs learner playtesting. Recovery levels and editorial difficulty labels are not psychometric guarantees.
- A browser cache can be evicted or blocked by private mode/quota limits. HTTPS or localhost and domain-root hosting are required for this web service worker. First visit must finish caching before offline use; development Expo Go/Metro is not a standalone offline install.
- The sound bank is the official compiled MS Basic distribution with a preserved older MuseScore_General 0.2 license notice, not the preferred source repository's 2.0.0 build. See `THIRD_PARTY_LICENSES.md` for the exact revision/checksum and explanation.
- The SDK-compatible npm dependency tree retains 26 upstream audit findings (7 moderate, 19 high). Suggested forced fixes include incompatible Expo/React Native downgrades; these were not applied.

## Physical-device follow-up

On Android and iOS, install a standalone build, enable airplane mode, complete and replay a level in each playback mode, background/resume during the first melodic note, navigate away during playback, kill/reopen the app and verify best stars/scores and chapter gates. Check comfortable volume, attack/release and simultaneous-note balance on headphones and speakers. Test a second instrument and a high/low/compound lesson after earning the corresponding progression unlocks.

## Localization validation — 26 October 2026

- TypeScript, ESLint (no warnings), all 23 tests, level validation and all audio checksum checks pass.
- Translation validation passes: English/German key and interpolation parity, plural resolution, 100 level titles/instructions, 128 instrument labels, numeric interval names and JSX/accessibility literal scan.
- Android/iOS Hermes and web production exports succeed with both languages bundled; offline cache generated successfully.
- Web UI: first visit detected German; English switching updated immediately and persisted after reload. German exercise, numbered feedback tracker, results, chapter gates and locked-level labels checked. English credits checked; browser reported no warnings/errors. At 320 x 740, German exercise feedback and next-question control remain visible without scrolling.
- Locale-controller tests verify preference override, persistence, failed storage/retry, ordered writes, fallback detection, plurals, and unchanged language-independent question/progress data. Screen state and audio effects have no language-dependent remount keys or playback dependencies. No physical Android/iOS runtime was connected; their layout/audio still need device testing.
- Expo Doctor: 19/20 checks pass; existing SDK 58 packages have available patch updates (expo, expo-asset, expo-audio, expo-constants, expo-linking, expo-router, expo-status-bar). These unrelated patches were not applied as part of localization.
- Original third-party license/attribution notices remain verbatim in English, with translated explanatory text. No application UI or level text is intentionally untranslated; Intervalify and language autonyms retain their names.
- Localized preview is served at http://127.0.0.1:8082 to isolate QA progress from the existing 8081 origin. The preview script accepts an optional third argument for the port.
