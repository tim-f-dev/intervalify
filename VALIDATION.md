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

## Startup audio seek correction — 27 October 2026

The installed Expo SDK 58 web player resolves `seekTo` immediately after assigning the media element's `currentTime`; it does not await the browser's `seeked` event. Since samples occupy separate positions in a shared bank, the web driver now explicitly waits for metadata, seek completion at the requested offset, and playable data before allowing either voice to start. It uses the same audio banks, offsets, volume and fade behavior. Native playback continues to use expo-audio.

Playback duration now starts after the browser's play promise resolves. Cancelling a pending load/seek removes event listeners and releases its audio element; errors and timeouts fail without starting an unprepared note.

All 30 automated tests, TypeScript, ESLint, translation checks, level validation and asset verification pass. Seven regression cases cover cold loads, delayed seeks/buffering, cached zero-offset samples, cancellation, failures/timeouts, waiting for both notes, and delayed playback start. These simulate browser media events; they do not establish that the user's intermittent audible symptom has been reproduced on their device. A fresh-load listening check remains appropriate after deployment.

Production verification: Android and iOS Hermes bundles and the web bundle exported successfully. The compiled web play route includes the new seek-gated driver, and the offline cache was regenerated.

## Level-pack menus — 27 October 2026

- Home now has one primary Play action leading to `/levels`, plus a smaller Options action. Options contains the persistent English/German selector and credits. Existing privacy/legal links remain at the bottom of home.
- `/levels` shows five numbered packs, containing the unchanged level ranges 1–20, 21–40, 41–60, 61–80 and 81–100. `/packs/[id]` shows exactly four rows of five numbered tiles, with three stars below each number and lock indicators for unavailable levels.
- Pack requirements are 0/30/60/90/120 total best stars. Sequential one-star level unlocks remain within each pack. Tests cover all exact boundaries, global rather than preceding-pack totals, replay deduplication, a complete 100-level run, and v1 save compatibility. Existing best scores/stars remain intact; access is recalculated with the new requirements.
- TypeScript, ESLint, all 32 tests, translation/level/asset validation and Android/iOS/web production exports pass.
- Browser QA: English and German home → Options → Credits → Options, language switching, home → Play → pack selection → pack grid → gameplay → results → pack grid. At 320×740 the grid contains 20 tiles in four rows of five with no horizontal overflow and all rows visible. Home layout also reviewed at 390 px width. No browser console errors observed during this review; physical Android/iOS runtime layout still needs device checks.

## Fitted menus and contained scrolling — 27 October 2026

- Replaced the shared page ScrollView with a bounded flex layout. Home, Options, level grids, Credits, gameplay and Results have no page-level scrollbars. Home and gameplay/results use compact or side-by-side arrangements on short screens.
- Exactly three scrollbar exceptions: Privacy and Legal have internal vertical scroll containers; `/levels` has one horizontal pack carousel. Pack cards are square, requirements use counters such as 5/30 ★, and global star thresholds/level order/saved-progress format are unchanged.
- Level grids adapt to the measured space. Browser checks at 320×568, 740×360 and 1280×800 found all 20 tiles visible, no control outside the viewport and no scroll container on the grid page. Observed arrangements were four columns/five rows, ten columns/two rows and five columns/four rows respectively.
- The same screen-size checks passed for Home, Options, Credits, gameplay and Results. Credits uses readable pages of the original license notice, with word/character preservation verified by tests. Privacy/Legal were scrolled to their final sections while their page controls stayed fixed. The horizontal carousel was verified to scroll using the keyboard; its styled scrollbar track is visible in the final desktop preview.
- TypeScript and ESLint pass. All 36 tests, translations, all 100 levels and audio-asset checks pass. Android/iOS/web production exports and the final web-only export succeed. Native layout is shared but physical-device UI testing remains outstanding.

## First-level tutorial — 27 October 2026

- Removed the listening instructions and volume/headphone tip from Home in both languages. They now appear in a short modal before the first unlocked level entered after an app launch/full web reload.
- The exercise component is not mounted until tutorial preferences are hydrated and the dialog is dismissed, preventing hidden playback. Normal dismissal stays in memory for the app session, including retries and navigation; an explicit opt-out is saved separately under `intervalify.tutorial.hidden.v1`.
- Six regression tests cover hydration before playback, session-only dismissal, persistent opt-out, untouched progress/language data, save failure/retry/continue-without-saving, duplicate submissions and invalid/unreadable preferences. All 42 tests, TypeScript, ESLint, translations, level checks and asset checks pass.
- Browser QA on the existing port 8084: Home has neither removed text; first level opens the tutorial without exercise controls behind it; Start level opens gameplay; restarts and revisits do not repeat the tutorial; a full reload brings it back when not opted out. English and German dialogs fit small phone, landscape and desktop sizes. The native web checkbox toggles with Space and reports its checked state correctly. The preview is left unchecked, without saving an opt-out.
- Android/iOS/web production exports pass. Privacy text documents the new local preference. No new preview ports were opened and no progress storage was cleared; existing offline-cache updates were activated by refreshing/reopening the same preview. Physical-device accessibility testing remains outstanding.

## Progression revision

The opening pack now enforces two-semitone minimum spacing across every eligible interval pair. Until pack three, one-semitone comparisons are limited to intervals 0–5. All first 50 lessons avoid fast playback and six-answer questions. Four final-pack lessons introduce minor/major ninths and tenths using slow, melodic, two-choice comparisons and validated sample ranges.

All 45 tests pass, including curriculum constraints and compound playback/name checks. The level validator covers all 100 levels, 30,000 seeded questions and 9,112 exhaustive instrument/root/interval combinations. English and German level descriptions and compound interval names match. LEVEL_REORDER.md records all old/new positions; saved scores remain attached to existing numbered slots.
