# Developing Intervalify

Setup, project structure, audio tooling, validation and deployment instructions for the shared TypeScript, React Native and Expo codebase. For an introduction to the project, see [README.md](README.md).

## Install and run

Use Node.js 24 LTS and npm:

```sh
npm ci
npm start
```

- **Android phone:** install a matching version of Expo Go, connect phone and computer to the same Wi-Fi, then scan the terminal QR code. This is the recommended development setup on an 8 GB PC.
- **Android emulator:** start an Android virtual device, then run `npm run android`. Hardware virtualization and the Windows Hypervisor Platform must be enabled on Windows. Current Studio/emulator combinations recommend at least 16 GB host RAM.
- **iOS:** scan the QR code with the Camera app and open Expo Go. `npm run ios` opens the Simulator on macOS with Xcode; Windows cannot run the iOS Simulator.
- **Web development:** `npm run web`. If browser autoplay is blocked, tap Replay. Use comfortable volume; headphones help distinguish close intervals.

Expo Go serves development assets from Metro and is not the distributable offline application. For native offline use, produce an installed standalone build through EAS. All referenced M4A assets are bundled by Metro. No optional instrument downloads are necessary.

## Commands

| Command | Purpose |
| --- | --- |
| `npm start` | Expo development server |
| `npm run android` / `npm run ios` / `npm run web` | Open a development target |
| `npm run typecheck` | Strict app and test/tool TypeScript checks |
| `npm run lint` | Expo ESLint rules |
| `npm test` | Audio scheduling, question and progression tests |
| `npm run validate:levels` | Validate all 100 levels, randomized questions and exhaustive sample coverage |
| `npm run verify:assets` | Verify every audio file's SHA-256, M4A container and render levels |
| `npm run validate:i18n` | Translation completeness, variables and visible-string checks |
| `npm run i18n:sync-en` | Refresh English level/instrument translations after source edits |
| `npm run check` | All TypeScript, lint, tests, level, asset and localization checks |
| `npm run docs:levels` | Refresh the design reference from the manually authored configurations |
| `npm run export` | Production Android, iOS and web bundles in `dist/`, plus web offline cache |
| `npm run export:web` | Web-only production export in `dist-web/`, plus offline cache |
| `node scripts/serve-web.mjs dist 8084` | Preview production web at http://127.0.0.1:8084 |
| `npm run verify:audio` | Full audio decoding and representative pitch verification (Python tools required) |
| `npx expo-doctor` | Expo dependency/configuration checks |

Exports use two Metro workers to limit peak memory. Exports are JavaScript/Hermes bundles, not native installable binaries. To build native binaries, configure your own Expo/EAS project and identifiers, then use `npx eas-cli@latest build --platform android` or `--platform ios`. Signing and store distribution require your own credentials. No EAS account or credentials are embedded in this project.

## Playing and progress

Choose a level, listen and select an interval whenever you are ready, including during playback. Playback can be ascending, descending or simultaneous. Replay repeats the exact question and answer order without revealing the solution. One answer is accepted per question; feedback reveals the correct interval only after submission. Leaving a screen or backgrounding the app stops playback. An interrupted level restarts at question one; completed results persist.

Stars: **5/10 = one**, **8/10 = two**, **10/10 = three**. Thresholds are configurable in `src/game/progress.ts`. Best scores and stars never decrease. Pack 1 starts open. Packs 2–5 require 30, 60, 90 and 120 total stars across the game. Each pack contains the same 20 consecutive level IDs as before. Its first level opens when the total-star gate is met; later levels open sequentially after one star in the preceding level within that pack.

Progress is stored using AsyncStorage under `intervalify.progress.v1`. The saved record includes best scores/stars, unlocked levels and chapter totals. Derived unlocks are recomputed on load to avoid stale state. Saves are serialized, storage failures are shown with a Retry action, and invalid saves are not silently overwritten. Clearing app/browser data removes progress. Results are local to each device/browser; there is no cloud sync.

## Structure

```text
src/app/                   Expo Router home, map, play/[id], results and credits
src/audio/player.ts        Platform-independent voice scheduling and cancellation
src/audio/service.ts       expo-audio driver and bundled asset preloading
src/audio/assets.ts        Generated static require() asset manifest
src/audio/catalog.json     GM names and supported MIDI ranges
src/components/            Shared responsive controls and web offline status
src/game/levels.ts         100 permanent, individually authored level configurations
src/game/questions.ts      Randomization, range validation, one-answer state
src/game/progress.ts        Stars, chapter/level gates and storage serialization
src/game/context.tsx       React state and AsyncStorage integration
assets/audio/banks/000.m4a  One compressed note bank per zero-based GM program
assets/audio/               Render and verification reports
licenses/                  Preserved SoundFont redistribution notice
scripts/                   Rendering, verification, design docs and web packaging
tests/                     Automated logic tests (run with tsx + node:test)
```

Routes stay in `src/app`; reusable logic stays outside it. Native `android/` and `ios/` directories are generated by Expo. Do not edit generated projects manually. Use `npx expo install <package>` for SDK-compatible dependency versions.

## Audio source, coverage and license

The app includes **128 zero-based General MIDI programs**, **4,760 rendered notes** packed into **128 AAC/M4A banks**, and **48,290,798 bytes (46.05 MiB)** of bundled audio. Per-instrument banks avoid Windows/Metro file-handle exhaustion from thousands of individual assets. The generated manifest supplies static bank references and exact MIDI offsets in fixed 1.6-second slots. Each voice loads and seeks before playback; note duration never reaches a neighboring slot. Normalization targets consistent RMS with a conservative peak ceiling; short fades suppress clicks, and two playback voices retain mixing headroom. Samples use 32 kHz mono AAC at 48 kbit/s. Each note holds up to about 1.5 seconds, with configurable playback durations of 180–1,200 ms. Speed changes melodic spacing, never playback rate or pitch.

The basic register is MIDI 48–84; selected bass/cello instruments extend down to 36, and piano/bells/high winds extend up to 96. Natural register limits are recorded per program. All 128 programs can be selected through the audio API, but some GM programs are unpitched effects; authored interval levels use only pitched instruments. Sound quality and naturalness across all instruments still warrant human listening review.

The preferred Meowchestra MS Basic source repository was investigated, but has no compiled release asset. Audio was rendered from the official MuseScore-distributed compiled `MS Basic.sf3`, pinned by revision and SHA-256. Its matching license identifies the older MuseScore_General 0.2 bank; this is not claimed to be MS Basic 2.0.0. The bank is MIT licensed, allowing commercial redistribution with retained notices. See **THIRD_PARTY_LICENSES.md**, **licenses/MS-Basic.txt**, and the in-app Credits screen for full attribution and exact provenance. The source SoundFont and renderer binaries are build-time tools, not bundled into the application.

### Reproduce the audio (Windows)

Install Python 3.11+ (64-bit). The preparation script downloads the pinned official SoundFont and FluidSynth 2.6.1, installs NumPy 2.3.5 and imageio-ffmpeg 0.6.0 in ignored `.audio-tools/python`, renders notes and verifies them:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/prepare-audio.ps1 -Python python
```

Inspect scripts before running; no administrator privileges are needed. The SoundFont checksum is enforced. To use existing tools:

```sh
python scripts/render-audio.py --soundfont /path/MS-Basic.sf3 --library /path/libfluidsynth
python scripts/verify-audio.py --decode
```

On Linux/macOS, install libfluidsynth with SF3 support and the Python dependencies; pass the actual shared-library path. Rendering uses FluidSynth's sample engine at A=440, disables reverb/chorus, normalizes each note and emits the catalog, static manifest, checksums and render metrics. Existing files are retained for resumability; remove the generated audio files before a full rebuild after changing DSP/encoding parameters. The script removes obsolete generated note files, never unrelated project content.

### Modify levels

Edit a single `L(...)` entry in `src/game/levels.ts`; all 100 entries are explicit. Each entry independently specifies title, interval pool, 2/4/6 choices, GM program pool, playback, speed, lower-root MIDI range, note duration, intended difficulty and design rationale. Ten questions are fixed per level. `LEVEL_DESIGN.md` documents every level and the reviews performed after each group of 20.

Intervals are semitone distances. The lower root plus interval yields the upper note; descending playback reverses those two notes. Every configured instrument must support the entire root range and every allowed interval. Distractors come only from that level's pool. Distractors are randomized, then all choices are sorted from the smallest to largest semitone distance; small interval pools may repeat once without forcing predictable alternation. Compound intervals are supported and introduced explicitly in levels 94 and 96.

After editing: run `npm run docs:levels` and `npm run check`. The validator checks IDs 1–100 exactly once, validity, interval reachability, answer uniqueness, 30,000 reproducible randomized questions and all required instrument/root/interval combinations. Do not add a runtime difficulty generator. Difficulty labels are design intentions and need learner playtesting.

## Offline web deployment

Serve an exported web build at the domain root using HTTPS (or localhost) with SPA navigation fallback to `index.html`. The post-export script builds a versioned service worker that caches app code and every bundled instrument sample, including audio range-request support. Keep the first visit open until **Ready to play offline** appears. The first cache download is about 50 MB; later cached visits do not require a backend or internet. `npm run web` is development mode and does not install this production cache.

Browser storage quotas, private browsing and user/OS eviction can remove cached assets. Progress and cache are origin-specific. Standard browser support for AAC/M4A is required. Hosting under a subdirectory requires adapting the root-relative cache URLs. Web export targets a single-page app; serve deep links with fallback routing. A cached application update waits for existing tabs to close before activating, keeping old sessions and their lazy-loaded routes consistent.

## Validation and remaining device checks

The automated suite covers MIDI math, question diversity/choice counts, one submission, melodic direction, root ranges, asset presence, stars, persistence failures/round trips, exact chapter thresholds, sequential unlocks, replay and audio cancellation. All audio banks and all 4,760 note slots were decoded and checked with FFmpeg. Representative piano, guitar and flute notes were measured against A=440 (14 checks, largest measured offset under 16 cents after AAC encoding). This is a representative pitch check, not a pitch certification of every GM effect or sample.

Native Android/iOS audio output, silent-mode/interruption behavior, Bluetooth latency and a physical-device offline install require hands-on device checks; production exports do not prove those behaviors. No physical phone is assumed authorized or connected automatically. See VALIDATION.md for the actual executed results and limitations.

## Dependency audit

The SDK-compatible dependency tree currently reports 8 npm audit findings (3 moderate, 5 high). npm's suggested fixes include incompatible downgrades to Expo 44 and React Native 0.72, so the compatible versions are retained. Recheck upstream fixes with `npm audit`; do not apply `npm audit fix --force` blindly.


## Languages

The entire interface supports English and German, with automatic first-launch locale detection and a persistent language selector in Options. All 100 level titles/instructions, interval names, instrument names, feedback and accessibility text are localized. Original third-party legal notices remain verbatim. See [LOCALIZATION.md](LOCALIZATION.md) for translation structure, validation and adding more languages.


## Cloudflare Workers deployment

This repository includes `wrangler.jsonc` for the existing `intervalify` Worker. It serves the web export as static assets, with SPA fallback for `/privacy`, `/legal`, `/play/1` and other Expo Router routes. No Worker backend script is needed.

In Cloudflare > Workers & Pages > intervalify > Settings > Builds, use:

- Git repository: `tim-f-dev/intervalify`
- Production branch: `main`
- Disable builds: off
- Build command: `npm run export:web`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`
- Node.js version: `24`

Commit and push the configuration before building. The build command generates `dist-web/`, including the offline service worker; Wrangler uploads that directory. Do not commit generated build files. Existing domain configuration remains managed in Cloudflare.

If a push does not create a build entry, check the GitHub integration's repository access and build trigger events separately. A missing build command causes a build/deploy problem; it does not explain a missing push-triggered build entry.

### Web audio readiness

`src/audio/service.web.ts` uses a browser media-element voice that waits for `seeked` and playable data before playing a note-bank slot. Do not replace that wait with checking `currentTime` or awaiting Expo's web `seekTo`: the requested position is visible before seeking actually completes. Native `service.ts` keeps the expo-audio driver. The shared player awaits actual playback start before timing note duration. Regression tests live in `tests/web-audio.test.ts` and `tests/audio.test.ts`.

## Pack navigation and existing saves

Home → Play → `/levels` lists five numbered packs; `/packs/[id]` adapts the grid to the available space (for example four columns on narrow phones, ten in landscape and five on desktop). Home → Options contains language settings and credits. Gameplay and results return to the current pack. All 100 level configurations and IDs remain unchanged.

Version 1 save records and the storage key stay unchanged. The internal `chapters` field continues to hold pack summaries for compatibility, while unlocks are recomputed using `PACK_STAR_REQUIREMENTS`. Existing scores/stars are retained, even for a pack that falls below its new total-star requirement. Such a pack becomes available again once the required total is reached. Replaying a level never adds duplicate stars.

## Viewport-fitted menus

`Page` uses bounded flex views rather than a page-level ScrollView. Keep `flex: 1` and `minHeight: 0` through expandable content so it can fit phones, landscape windows and desktops. `useAvailableArea` measures the remaining space; `levelGridLayout` chooses square tiles that fit all 20 levels. Resizing changes layout only, not the current question or progress.

Only three screens permit a scrollbar, inside their own containers: Privacy (`privacy-scroll`) and Legal (`legal-scroll`) scroll vertically; the pack carousel on `/levels` (`packs-scroll`) scrolls horizontally. Pack cards stay square and display compact star counters. `ScrollStyles.web.tsx` styles only these exceptions and locks the document viewport; native platforms retain their own indicators. Credits uses bounded pages instead of adding another scroll area; its original notice is retained in full and can be read with Previous/Next controls. Geometry and notice-pagination regression tests are in `tests/layout.test.ts`.

## First-level tutorial

Home no longer displays the listening instructions or headphone/volume tip. Both appear in the localized tutorial shown before the first unlocked level entered in each app session (a fresh app launch or full web reload). The tutorial must be dismissed before the exercise mounts or any audio starts. Later levels, retries, navigation and background/resume in the same session do not show it again.

`TutorialSession` keeps the per-session dismissal flag in memory. Only an explicit “Don't show again” choice is saved through AsyncStorage, under `intervalify.tutorial.hidden.v1`, independently of scores and language. Preference hydration gates the exercise to prevent a cold-load playback race. If saving fails, the dialog stays open for retry or the user can uncheck the box and continue without saving. Native Back and web Escape dismiss the dialog using the current checkbox selection. Session, hydration, persistence and failure handling are covered in `tests/tutorial.test.ts`.

Use the existing port 8084 for local previews. A production service-worker update waits for existing tabs to close before activation; refresh/reopen the preview to activate a new build rather than opening another port or clearing progress.

## Local unlocked test preview

Run `npm run export:test` to create an all-levels-unlocked web preview in `dist`. Reuse the existing localhost preview server on port 8084. The unlock flag exists only for that export command; normal `npm run export` and Cloudflare builds default to normal progression. The web flag additionally requires a loopback hostname, so intervalify.app keeps normal locks even if a test export is uploaded accidentally.

Unlocks are an in-memory access override. No scores or stars are fabricated, and canonical derived unlocks are saved when a test level is completed. Real results earned while testing are saved normally. Run a normal export to return the local preview to normal progression.
